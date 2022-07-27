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
let rl = readline.createInterface(process.stdin, process.stdout)
function userinterface() {
  return new Promise(function(resolve, reject) {
    rl.setPrompt('Cmd?> ')
    rl.prompt();
    rl.on('line', function(line) {
      switch(line)
        {
            case "device online":
            {
                console.log('Querying the Device?');
                sock.send(['/devicereq', 'isOnline']);
            }
            break;
            case "":break;
            case 'hello':
                {
                    
                }
                break;
            case 'quit':
            case 'exit':
            case 'q':
                {
                    console.log('Good Bye!!!')
                    rl.close()
                    return 
                }
                break;
            case 'help':
            case '?':
            default:
            {
                if(line != 'help' || line != '?')
                {
                    console.log(`Unknown Command ===>  "` + line + `"`);
                }
                console.log(`Below are Supported command 
                Command \t \t Descr\t
                device online \t \t To Check with Device
                quit or exit or q \t Exit or quit the Driver
                    `);
            }
            break;
        }
      rl.prompt()

    }).on('close',function(){
        exit(0);
    });
  })
}

const listener = async () => {
    try {
        sub_sock.connect('tcp://127.0.0.1:48431');
        sub_sock.subscribe('kitty cats');
        sub_sock.subscribe('/deviceresp');
        console.log('listener connected to port 48430');
        hasRecieverStarted = true;        
        sub_sock.on('message', function(topic, message) {
            switch(topic.toString())
            {
              case "/deviceresp":
                {
                    console.log("Response Received... " + message.toString()); 
                }
                break;
              default:
                {
                    console.log(`Unknown Request ===>  "` + topic.toString() + `" message:` + message.toString());
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
    userinterface()
  } catch(e) {
    console.log('failed:', e)
  }
}


__main__()
