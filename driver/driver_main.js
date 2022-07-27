/**
 ******************************************************************************
 * @file    driver_main.js
 * @author  Sathyendran/Author
 * @version 0.1
 * @date    27-07-2022
 * @brief   This file contains following:
 *    Driver Interface Class for 
 *    1)  User Interaction for recieve commands
 *    2)  Machine to Machine interaction to send or receive data
 ******************************************************************************
 */
/******************************************************************************/

const { exit } = require('process');
const readline = require('readline');
var zmq = require("../node_modules/zeromq");
var sock = zmq.socket('pub');
var sub_sock = zmq.socket('sub');
var hasRecieverStarted = false;
var hasListenerStarted = false;
var sendDeviceRequest = false;
let rl = readline.createInterface(process.stdin, process.stdout)

const weight_abbr = { 
    "t": "Tonne", 
    "kg": "Kilogram", 
    "hg": "Hectogram" ,
    "dag": "Decagram" ,
    "g": "Gram" ,
    "dg": "Decigram" ,
    "cg": "Centigram" ,
    "mg": "Milligram", 
    "na": "Not Applicable" 
}; 


function requestTimeout()
{
    setTimeout(function(){
        if(sendDeviceRequest)
        {
            hasListenerStarted = false;
            console.log('Simulator is not online. Please start the simulator.');
            rl.prompt()
        }
   }, 3000);//wait 2 seconds
}

function checkConnectivity()
{
    console.log('Checking the Simulator is online...');
    sock.send(['/devicereq', 'isOnline']);
    sendDeviceRequest = true;
    requestTimeout();
}

function parseWeightMessage(msg)
{
    var weightMsg = JSON.parse(msg);
    
    if(!weightMsg["isexec"])
    {
        console.log("Command not Executable (Balance maybe executing another command)");
    }
    else{
        console.log("Current Stable Net Weight Value is " + weightMsg["curr_weight"] + " " + weight_abbr[weightMsg["weight_unit"]] +" ("+weightMsg["weight_unit"]+") measured at " + new Date(weightMsg["time"]))
        if(weightMsg["curr_weight"]<250)
        {
            console.log("Balance in underload Range");
        }
        else if (weightMsg["curr_weight"]>700)
        {
            console.log("Balance in overload Range");
        }
    }
}

function displayHelpMessage()
{
    console.log(`Supported command:
    Command \t \t Description\t
    -------- \t \t -------------
    device online \t To Check with Device
    help/? \t \t Help Window
    quit/exit/q \t Exit or quit the Driver
    connect simulator \t Connect or reconnect to Simulator
    s/S \t \t Request to send current stable weight
        `);
    rl.prompt()
}

function userinterface() {
  return new Promise(function(resolve, reject) {
    rl.setPrompt('Cmd?> ')
    //rl.prompt();
    rl.on('line', function(line) {
      switch(line)
        {
            case "":
                {
                    rl.prompt();
                }
                break;
            case "device online":
            {
                checkConnectivity();
            }
            break;
            case "connect simulator":
                {
                    if(!hasListenerStarted)
                    {
                        console.log('Creating a new connectivity with Simulator...');
                        listener();
                        setTimeout(checkConnectivity,2000);
                    }
                    else{
                        console.log('Already Connected to Simulator...');
                        rl.prompt();
                    }
                }
                break;
            
            case 's':
            case 'S':
                {
                    console.log('Sending Request to get the Current Weight...');
                    sock.send(['/balancereq', '']);
                }
                break;
            case 'quit':
            case 'exit':
            case 'q':
                {
                    rl.close()
                    return 
                }
                break;
            case 'help':
            case '?':
                {
                    displayHelpMessage();
                }
                break;
            default:
            {
                console.log(`Unknown Command ===>  "` + line + `"`);
                displayHelpMessage();
            }
            break;
        }
    }).on('close',function(){
        console.log('Good Bye!!!')
        exit(0);
    });
  })
}

const listener = async () => {
    try {
        sub_sock.connect('tcp://127.0.0.1:48431');
        sub_sock.subscribe('/deviceresp');
        sub_sock.subscribe('/balanceresp');
        console.log('listener connected to port 48430');
        hasRecieverStarted = true;        
        sub_sock.on('message', function(topic, message) {
            switch(topic.toString())
            {
              case "/deviceresp":
                {
                    sendDeviceRequest = false;
                    console.log("Device Online Response Received... " + message.toString()); 
                }
                break;
              case "/balanceresp":
                {
                    console.log("Current Weight Response Received... "); 
                    parseWeightMessage(message.toString());
                }
                break;
              default:
                {
                    console.log(`Unknown Response Received ===>  "` + topic.toString() + `" message:` + message.toString());
                }
                break;       
            }
            rl.prompt();
          });
      } catch (err) {
        console.error(err);
        process.exit(1);
      }
}

async function __main__() {
  try {
    sock.bindSync('tcp://127.0.0.1:48430');
    hasListenerStarted = true;
    console.log('Started Drive at localhost, port 48430');  
    console.log('Checking Simulator is online...');
    listener();
    setTimeout(checkConnectivity,2000);
    userinterface()
  } catch(e) {
    console.log('failed:', e)
  }
}


__main__()
