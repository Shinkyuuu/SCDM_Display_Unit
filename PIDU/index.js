// Imports
const express = require("express"),
    bodyParser = require('body-parser'),
    PORT = process.env.PORT || 3001,
    app = express(),
    http = require("http"),
    server = http.createServer(app),
    cors = require('cors'),
    socket = require("socket.io"),
    io = socket(server, { 
        cors: "http://localhost:3000",
        methods: ["GET", "POST", "DELETE", "PUT"],
        credentials: false
    }),
    { SerialPort } = require('serialport'),
    { ByteLengthParser } = require('@serialport/parser-byte-length'),
    { 
        updatePacketData, 
        getPacketData, 
        parseBytes, 
        getDeviceName, 
        getSongData, 
        calcChecksum, 
        commandPackets 
    } = require("./packetHandling");



// Use cors to allow cross origin resource sharing
app.use(
    cors({
        origin: 'http://localhost:3000',
        credentials: false,
    })
);

// Open and Connect to Serial Port
const port = new SerialPort({ path: '/dev/ttyACM0', baudRate: 115200 }, function (err) {
    if (err) {
        return console.log('Error: ', err.message);
    }
});

// On socket connect, listen for packet requests and play/pause changes
io.on('connection', socket => {
    socket.on("packets_request", () => {
        socket.emit("packets_data", getPacketData());
    });

    socket.on("PP_Change", (isPaused) => {
        socket.emit("PP_Change", isPaused);
    });
});




// Receive commands from client and transmit it to serial port
app.post('/cmd', bodyParser.json(), function (req, res) {
    res.send("Command Ready for Transmission!");
    let encodedPacket = commandPackets[req.body.opCode];

    // If packet is to set volume, change packet parameter to new volume
    if (req.body.opCode === 4 && req.body.parameter != null) {
        encodedPacket[encodedPacket.length - 2] = req.body.parameter;
    }

    // Calculate the packet's checksum
    encodedPacket[encodedPacket.length - 1] = calcChecksum(encodedPacket);

    port.flush(function() {
        port.resume();
    });
    
    // Write packet buffer to Serial Port
    port.write(Buffer.from(encodedPacket, 'hex'), function(err) {
        if (err) {
            return console.log('Error on write: ', err.message)
        }
    });

    updatePacketData('to', encodedPacket.map(byte => byte.toString(16)));
    io.emit("packets_data", getPacketData());
})

// Serial Port Byte Parser
const parser = port.pipe(new ByteLengthParser({ length: 1 }))

// Log Errors
port.on('error', function(err) {console.log('Error: ', err.message)})

// On Serial Port Reception, parse the packet, then send relevent data to client
parser.on('data', (data) => {
    parseBytes(data[0], (packetBuf) => { 
        // If checksum is valid and the packet starts with '0xbb' (The expected start byte), handle packet
        if ((packetBuf[0] == 0xbb) && calcChecksum(packetBuf) == packetBuf[packetBuf.length - 1]) {
            // Convert packet to ASCII string and store it 
            updatePacketData('from', packetBuf.map(byte => byte.toString(16)));
            // Broadcast list of packets (for the clients to use)
            io.emit("packets_data", getPacketData());

            // Handle opcodes accordingly
            switch(packetBuf[4]) {
                // Play Pause has changed
                case 0x1a: 
                    // Notify client that play/pause state has changed (packetBuf[17] = ppstate)
                    io.emit("Play/Pause_Change", packetBuf[17]);
                    break;
                // Device state has changed
                case 0x17:
                    switch(packetBuf[6]) {
                        // Device name has changed
                        case 0x00:
                            // Retrieve new device name and notify client 
                            getDeviceName(packetBuf, (deviceName) => {
                                io.emit("Device_Name_Change", deviceName);
                            });   
                            break;
                        // Device has connected
                        case 0x03:
                            // Notify client that device has changed
                            io.emit("Device_Connected");
                            break;
                        default:
                            break;
                    }
                    break;
                // Volume has changed
                case 0x29:
                    // Notify client of new volume (packetBuf[6] = new volume)
                    io.emit("Volume_Change", packetBuf[6]);
                    break;
                // Song name received
                case 0x44:
                    // If the sub-opcode (packetBuf[10]) is correct, handle packet
                    if (packetBuf[10] == 0x00) {
                        // Retrieve song and artist name and notify client
                        getSongData(packetBuf, (songName, artistName) => {
                            io.emit("Song", {
                                songName : songName, 
                                artistName: artistName
                            });
                        });
                    }
                default:
                    break;
            };    
        } else {
            console.log("Received fallacious packet");
            console.log(packetBuf);
        }
    });
});


// Main Page
app.get("/", (req, res) => {
  res.json({ message: "Hello from server!" });
});

// Connect to port
server.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});