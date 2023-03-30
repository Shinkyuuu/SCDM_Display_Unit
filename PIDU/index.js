const express = require("express");
const bodyParser = require('body-parser');
const PORT = process.env.PORT || 3001;
const app = express();
const cors = require('cors');
const { SerialPort } = require('serialport');
const { ReadlineParser } = require('@serialport/parser-readline')

// Use cors to allow cross origin resource sharing
app.use(
  cors({
    origin: 'http://localhost:3000',
    credentials: true,
  })
);

// To parse JSON body data from http requests
var jsonParser = bodyParser.json();


// Command UART Packets
const commandPackets = ["bb000400040007f1", "bb000400040009ef", "bb00040004000aee", "bb00040002005d9d", "", ""]; 

// Open and Connect to Serial Port
const port = new SerialPort({ path: '/dev/ttyACM0', baudRate: 115200 }, function (err) {
  if (err) {
    return console.log('Error: ', err.message);
  }
});

// Log Errors
port.on('error', function(err) {console.log('Error: ', err.message)})

// Read ASCII data from the serial port
const parser = port.pipe(new ReadlineParser({ delimiter: '\r\n' }))
parser.on('data', 	console.log);

// Main Page
app.get("/", (req, res) => {
  res.json({ message: "Hello from server!" });
});

// Bluetooth Command reception Page
app.post('/cmd', jsonParser, function (req, res) {
  res.send("Command Well Received!");

  packet = Buffer.from(commandPackets[req.body.opCode], 'hex');
  // Transmit formatted packet to the SCDM
  port.flush(function(err) {
    console.log(err);
    console.log('resume...');
    port.resume();
  });

  
  port.write(packet, function(err) {
    

    if (err) {
      return console.log('Error on write: ', err.message)
    }
    console.log('message written');
  });
})

app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});