/**
 ******************************************************************************
 * @file    simulator.js
 * @author  Sathyendran/Author
 * @version 0.1
 * @date    27-07-2022
 * @brief   This file contains following:
 *    Simulator Interface Class for 
 *    1)  Response for Weight random generation
 *    2)  Acknowledge Request
 ******************************************************************************
 */
/******************************************************************************/

var zmq = require("../node_modules/zeromq");
var sock = zmq.socket('pub');
var sub_sock = zmq.socket('sub');


const listener = async () => {
    try {
        sub_sock.connect('tcp://127.0.0.1:48430');
        sub_sock.subscribe('/devicereq');
        sub_sock.subscribe('/balancereq');
        console.log('listener connected to port 48430');
        sub_sock.on('message', function(topic, message) {
            console.log("----------------------------------------------------------------------------");
          switch(topic.toString())
          {
            case "/devicereq":
                {
                    console.log("Received Request to check Simulator Online?. Sending response now...");
                    sock.send(['/deviceresp', 'Simulator is online!!!']);
                }
                break;
            case "/balancereq":
                {
                    console.log("Received Request for Sending Current Stable Weight");
                    var dataRead = {};
                    dataRead["isexec"] = Math.random() < 0.5;
                    if(dataRead["isexec"])
                    {
                        console.log("Generating random weight value...")
                        dataRead["curr_weight"] = Math.floor(100 + Math.random()*(1000 - 100 + 1))
                        var weight_unit = ["t","kg","hg","dag","g","dg", "cg", "mg"];
                        dataRead["weight_unit"] = weight_unit[Math.floor(Math.random() * weight_unit.length)];
                    }
                    else{
                        dataRead["curr_weight"] =0;
                        dataRead["weight_unit"] = "na";
                    }
                    const now = new Date()
                    const secondsSinceEpoch = Math.round(now.getTime() / 1000)
                    dataRead["time"] = secondsSinceEpoch;
                    var value = JSON.stringify(dataRead);
                    console.log("Sending... \nCurrent Weight: "+ dataRead["curr_weight"] + "\nWeight unit: " + dataRead["weight_unit"]);
                    sock.send(['/balanceresp', value.toString("utf-8")]);
                }
                break;
            default:
                {
                    console.log(`Unknown Request ===>  "` + topic.toString() + `" message:` + message.toString());
                }
                break;       
          }
        });
      } catch (err) {
        console.error(err);
        process.exit(1);
      }
}


const main = async () => {
  try {
    sock.bindSync('tcp://127.0.0.1:48431');
    console.log('Simulator Started at localhost, port 48430');
    listener();
    // setInterval(function(){
    //     console.log('sending a multipart message envelope');
    //     sock.send(['kitty cats', 'meow!']);
    //   }, 5000);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};
main();




