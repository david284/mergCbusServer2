//const net = require('net')
//const jsonfile = require('jsonfile')
//const serialport = require('serialport')
//const winston = require('./config/winston.js')
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

cbusServer.cbusServer(USB_PORT, NET_PORT, NET_ADDRESS)
jsonServer.jsonServer(NET_PORT, JSON_PORT, NET_ADDRESS)
socketServer.socketServer(NET_ADDRESS, LAYOUT_NAME,JSON_PORT, SERVER_PORT)

SerialPort.list().then(ports => {

    ports.forEach(function(port) {
        const vendorId = toString(port.vendorId)
        const productId = toString(port.productId)
        if (vendorId.toUpperCase() == '04D8' && productId.toUpperCase() == 'F80C') {
            canUSB.canUSB(port.path, NET_PORT, NET_ADDRESS)
        }
    })
})

