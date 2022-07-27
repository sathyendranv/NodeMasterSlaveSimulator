var zmq = require("../node_modules/zeromq");
var sock = zmq.socket('pub');
var sub_sock = zmq.socket('sub');


const listener = async () => {
    try {
        sub_sock.connect('tcp://127.0.0.1:48430');
        sub_sock.subscribe('kitty cats');
        sub_sock.subscribe('/devicereq');
        console.log('listener connected to port 48430');
        
        sub_sock.on('message', function(topic, message) {
          switch(topic.toString())
          {
            case "/devicereq":
                {
                    console.log("Received Request to check Simulator Online?. Sending response now...");
                    sock.send(['/deviceresp', 'Simulator is online!!!']);
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




