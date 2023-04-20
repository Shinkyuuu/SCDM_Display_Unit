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
    { ReadlineParser } = require('@serialport/parser-readline'),
    { ByteLengthParser } = require('@serialport/parser-byte-length'),
    { parseBytes, calcChecksum, commandPackets } = require("./packetHandling");


// Use cors to allow cross origin resource sharing
app.use(
    cors({
        origin: 'http://localhost:3000',
        credentials: false,
    })
);

// io.on('connection', socket => {
//     socket.on("start", () => {
//         socket.emit("ACK");
//     });
// });

// Open and Connect to Serial Port
const port = new SerialPort({ path: '/dev/ttyACM0', baudRate: 115200 }, function (err) {
    if (err) {
        return console.log('Error: ', err.message);
    }
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

        console.log('Packet Transmitted:');
        console.log(encodedPacket);
    });
})

// Serial Port Byte Parser
const parser = port.pipe(new ByteLengthParser({ length: 1 }))

// Log Errors
port.on('error', function(err) {console.log('Error: ', err.message)})

// On Serial Port Reception, parse the packet, then send relevent data to client
parser.on('data', (data) => {
    parseBytes(data[0], (packetBuf) => {
        console.log(packetBuf[4]);
        switch(packetBuf[4]) /* OPCODE */ {
            case 0x1a: //TODO: Change to 0x1b
                io.emit("Play/Pause_Change", packetBuf[17]);
                // io.emit("Song", {songName : "HOHOHO", artistName: "bobo"});

                break;
            
            case 0x29: //TODO: Change to 0x29
                io.emit("Volume_Change", packetBuf[6]);
                break;
            case 0x44:
                io.emit("Song", {songName : songName, artistName: artistName});

                var currIndex = 33;
                var songName;
                var artistName;
                var folderNameLen = packetBuf[currIndex]; 

                currIndex += 1;
                folderNameLen <<= 8;
                folderNameLen ^= packetBuf[currIndex];
                currIndex += folderNameLen + 8;
                console.log("FolderNameLen:" + folderNameLen);

                var songNameLen = packetBuf[currIndex];
                currIndex += 1;
                songNameLen <<= 8;
                songNameLen ^= packetBuf[currIndex];
                console.log("SongNameLen:" + songNameLen);

                songName = packetBuf.slice(currIndex + 1, currIndex + 1 + songNameLen);

                currIndex += songNameLen + 7;
                var artistNameLen = packetBuf[currIndex];
                currIndex += 1;
                artistNameLen <<= 8;
                artistNameLen ^= packetBuf[currIndex];
                console.log("ArtistNameLen:" + artistNameLen);

                artistName = packetBuf.slice(currIndex + 1, currIndex + 1 + artistNameLen);
                currIndex += artistNameLen;

                // console.log("HJ(EFSUHOUFESOIEFSHO");
                io.emit("Song", {songName : hexToASCII(songName), artistName: hexToASCII(artistName) });

                console.log("songName: " + hexToASCII(songName));  
                console.log("artistName: " + hexToASCII(artistName));
            default:
                break;
        };
    });
});

function hexToASCII(byteArray) {
    str = "";

    for (let i = 0; i < byteArray.length; ++i) {
        str += '%' + ('0' + byteArray[i].toString(16)).slice(-2);
    }

    str = decodeURIComponent(str);

    return str;
}

// Main Page
app.get("/", (req, res) => {
  res.json({ message: "Hello from server!" });
});

// Connect to port
server.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});