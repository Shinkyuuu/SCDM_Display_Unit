const express = require("express");
const bodyParser = require('body-parser');
const PORT = process.env.PORT || 3001;
const app = express();
const http = require("http");
const server = http.createServer(app);
const cors = require('cors');
const { SerialPort } = require('serialport');
const { ReadlineParser } = require('@serialport/parser-readline');
const { ByteLengthParser } = require('@serialport/parser-byte-length');
const { calcChecksum } = require("./packetDecoder");

const socket = require("socket.io");
const io = socket(server, { 
    cors: "http://localhost:3000",
    methods: ["GET", "POST", "DELETE", "PUT"],
    credentials: false
})

// Command UART Packets
const commandPackets = [
  [0xbb, 0x00, 0x04, 0x00, 0x04, 0x00, 0x07, 0x00], //"bb 00 04 00 04 00 07" // Play/Pause
  [0xbb, 0x00, 0x04, 0x00, 0x04, 0x00, 0x09, 0x00], //"bb 00 04 00 04 00 09" // Skip Forward
  [0xbb, 0x00, 0x04, 0x00, 0x04, 0x00, 0x0a, 0x00], //"bb 00 04 00 04 00 0a" // Skip backward
  [0xbb, 0x00, 0x04, 0x00, 0x02, 0x00, 0x5d, 0x00], //"bb 00 04 00 02 00 5d" // Pair
  [0xbb, 0x00, 0x06, 0x00, 0x04, 0x00, 0x01, 0x04, 0x00, 0x00], //"bb 00 06 00 23 00 01 04 xx"  // Set Volume [TODO]
]; 

// Use cors to allow cross origin resource sharing
app.use(
  cors({
    origin: 'http://localhost:3000',
    credentials: false,
  })
);


io.on('connection', socket => {
  socket.on("start", () => {
      socket.emit("data!", {
        myData: "Hello!!"
      });
  });
});


// Open and Connect to Serial Port
const port = new SerialPort({ path: '/dev/ttyACM0', baudRate: 115200 }, function (err) {
  if (err) {
    return console.log('Error: ', err.message);
  }
});

port.on('error', function(err) {console.log('Error: ', err.message)})
// Log Errors

// Read ASCII data from the serial port
// const parser = port.pipe(new ReadlineParser({ delimiter: '\r\n' }))
// parser.on('data', 	console.log);

const parser = port.pipe(new ByteLengthParser({ length: 1 }))

parser.on('data', (data) => {
  console.log("Received Data:");
  console.log(data);
  // switch(data[4]) {
  //   case 0x23:
  //     break;
    
  //   case 0x24:
  //     io.socket.emit("Volume Change", data[6]);
  //     break;
    
  //   case 0x04:
  //     console.log("HOHOHO");
  //     io.emit("test", 0x1f);
  //     break;

  //   default:
  //     break;
  // }
});

// Bluetooth Command reception Page
app.post('/cmd', bodyParser.json(), function (req, res) {
  res.send("Command Well Received!");
  let encodedPacket = commandPackets[req.body.opCode];

  // If packet is to set volume, change packet parameter to new volume
  if (req.body.opCode === 4 && req.body.parameter != null) {
    encodedPacket[encodedPacket.length - 2] = req.body.parameter;
  }

  encodedPacket[encodedPacket.length - 1] = calcChecksum(encodedPacket);

  // Transmit formatted packet to the SCDM
  port.flush(function() {
    // console.log(err);
    // console.log('ERROR: resume...');
    port.resume();
  });
  
  port.write(Buffer.from(encodedPacket, 'hex'), function(err) {
    if (err) {
      return console.log('Error on write: ', err.message)
    }
    console.log('message written');
  });
})

// Main Page
app.get("/", (req, res) => {
  res.json({ message: "Hello from server!" });
});

server.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});