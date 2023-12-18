//const net = require('net')
//const jsonfile = require('jsonfile')
//const serialport = require('serialport')
const winston = require('./config/winston.js')
//const parsers = serialport.parsers
const cbusServer = require('./cbusServer')
const jsonServer = require('./jsonServer')
const socketServer = require('./socketServer')
const canUSB = require('./canUSB')
const {SerialPort} = require("serialport");

//const config = jsonfile.readFileSync('./config/config.json')

const USB_PORT = "/dev/tty.usbmodem213301"
const NET_PORT = 5550
const NET_ADDRESS = "localhost"
const JSON_PORT = 5551
const SERVER_PORT=5552
const LAYOUT_NAME="Default"

var ports = []
run_main()

async function run_main(){

  await checkSerialPort()
//  await sleep(1000)

  // use command line to suppress starting cbusServer, so network port can be used
  // command line arguments will be 'node' <javascript file started> '--' <arguments starting at index 3>
  if ( process.argv[3] != 'network') {
    cbusServer.cbusServer(USB_PORT, NET_PORT, NET_ADDRESS)  //USB_PORT not used
    console.log('\nStarting cbusServer...\n');
  } else { console.log('\nUsing network...\n'); }

  jsonServer.jsonServer(NET_PORT, JSON_PORT, NET_ADDRESS)
  socketServer.socketServer(NET_ADDRESS, LAYOUT_NAME,JSON_PORT, SERVER_PORT)
}

SerialPort.list().then(ports => {

    ports.forEach(function(port) {
        if (port.vendorId != undefined && port.vendorId.toString().toUpperCase() == '04D8' && port.productId.toString().toUpperCase() == 'F80C') {
            canUSB.canUSB(port.path, NET_PORT, NET_ADDRESS)
        }
    })
})



async function checkSerialPort(serialPort_info) {
	return new Promise(function (resolve, reject) {
//    winston.info({message: 'check serial port'})
    var portIndex = 0;
    SerialPort.list().then(ports => {
      ports.forEach(function(port) {
//        winston.debug({message: 'serial port found: ' + JSON.stringify(port)});
//        winston.info({message: 'serial port found: ' + JSON.stringify(port.path)});
        ports[portIndex] = port.path
        console.log( 'serial port ' + portIndex + ': ' + ports[portIndex]);
        if (serialPort_info != undefined) {
          winston.debug({message: 'checkSerialPort: ' + serialPort_info.path});
          if (serialPort_info.path == port.path) {
            winston.info({message: 'Port match ' + port.path});
            serialPort_info["valid"] = true
          }
        }
        portIndex++
        resolve();
      })
//      winston.info({message: 'serial port count: ' + portIndex + '\n'});
    })
  })
}

function sleep(timeout) {
	return new Promise(function (resolve, reject) {
		//here our function should be implemented 
		setTimeout(()=>{
			resolve();
			;} , timeout
		);
	});
};
