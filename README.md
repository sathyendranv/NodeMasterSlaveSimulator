# NodeJS Master-Slave Simulator

IoT Drivers applications is build based on nodejs which use ZeroMQ as messaging queue using broker-less architecture and pub-sub model. Driver is user interactable (command-line tool), based on the command provided by user driver initiates the requests to simulator. If there is no response from the Simulator, timeout occurs after 3 secs for each request. 

## Repo Clone
 Clone the code from below git
```
git clone https://github.com/sathyendranv/NodeMasterSlaveSimulator.git
```

## Prerequisite

Nodejs (Version 12.22.12) - Tested with this version.

[Install Nodejs for Windows](https://phoenixnap.com/kb/install-node-js-npm-on-windows)


## Installation

Following node modules needs to be installed using the package manager npm.

1. [ZeroMQ](https://www.npmjs.com/package/zeromq)

   ZeroMQ used as broker-less architecture to communicate between the driver and Simulator on Socket ports using pub-sub model. 

   #### Usage
   ```
   > cd NodeMasterSlaveSimulator
   NodeMasterSlaveSimulator> npm install zeromq
   ```
## Running Driver
   ```
   > cd NodeMasterSlaveSimulator
   NodeMasterSlaveSimulator> cd driver
   NodeMasterSlaveSimulator/driver>  node driver_main.js
   ```
## Driver Supported Commands
   ```
   NodeMasterSlaveSimulator/driver>  node driver_main.js
   Cmd?> ?
   Supported command:
    Command              Description
    --------             -------------
    device online        To Check whether the Device is online(connected)
    help/?               Show Help Window
    quit/exit/q          Exit or Quit the Driver
    connect simulator    Connect or reconnect to Simulator
    s/S                  Request to send current stable weight from Simulator
   ```
## Sample Weight Balance Simulation Response
   ```
Cmd?> s
Sending Request to get the Current Weight...
Current Weight Response Received...
Current Stable Net Weight Value is 909 Kilogram (kg) measured at Thu Jul 28 2022 00:36:01 GMT+0530 (India Standard Time)
Balance in overload Range
Cmd?> s
Sending Request to get the Current Weight...
Current Weight Response Received...
Current Stable Net Weight Value is 118 Tonne (t) measured at Thu Jul 28 2022 00:36:08 GMT+0530 (India Standard Time)
Balance in underload Range
Cmd?> s
Sending Request to get the Current Weight...
Current Weight Response Received...
Current Stable Net Weight Value is 387 Decagram (dag) measured at Thu Jul 28 2022 00:36:10 GMT+0530 (India Standard Time)
   ```

## Check Simulator is online from driver
   ```
   NodeMasterSlaveSimulator/driver>  node driver_main.js
   Cmd?> device online
   Checking the Simulator is online...
   Simulator is not online. Please start the simulator.
   Cmd?> 
   ```
## Running Simulator
   ```
   > cd NodeMasterSlaveSimulator
   NodeMasterSlaveSimulator> cd simulator
   NodeMasterSlaveSimulator/simulator> node simulator.js
   ```

## Simulator Logs
  Every request and response, received or sent are logged to console.
```
Received Request to check Simulator Online?. Sending response now...
----------------------------------------------------------------------------
Received Request for Sending Current Stable Weight
Sending...
Current Weight: 0
Weight unit: na
----------------------------------------------------------------------------
Received Request for Sending Current Stable Weight
Generating random weight value...
Sending...
Current Weight: 454
Weight unit: g
   ```
## Contributing
Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.


## License
[MIT](https://github.com/sathyendranv/NodeMasterSlaveSimulator/blob/main/LICENSE.md)