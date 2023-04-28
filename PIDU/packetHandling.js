var length = 3;
var byteCount = 0;
const packetBuf = [];

// Command UART Packets
const commandPackets = [
    [0xbb, 0x00, 0x04, 0x00, 0x04, 0x00, 0x07, 0x00], //"bb 00 04 00 04 00 07" // Play/Pause
    [0xbb, 0x00, 0x04, 0x00, 0x04, 0x00, 0x09, 0x00], //"bb 00 04 00 04 00 09" // Skip Forward
    [0xbb, 0x00, 0x04, 0x00, 0x04, 0x00, 0x0a, 0x00], //"bb 00 04 00 04 00 0a" // Skip backward
    [0xbb, 0x00, 0x04, 0x00, 0x02, 0x00, 0x5d, 0x00], //"bb 00 04 00 02 00 5d" // Pair
    [0xbb, 0x00, 0x06, 0x00, 0x23, 0x00, 0x01, 0x04, 0x00, 0x00], //"bb 00 06 00 23 00 01 04 xx"  // Set Volume [TODO]
    // [0xbb, 0x00, 0x08, 0x00, 0x0b, 0x00, 0x10, 0x00, 0x00, 0x00, 0x00],
    // [0xbb, 0x00, 0x0e, 0x00, 0x41, 0x00, 0x00, 0x03, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00], // Request song name
    [0xbb, 0x00, 0x16, 0x00, 0x41, 0x00, 0x00, 0x03,   0x00, 0x00, 0x00, 0x00,   0x00, 0x00, 0x00, 0x1,   0x02, 0x00, 0x00, 0x00, 0x01, 0x00, 0x00, 0x00, 0x02, 0x00], // Request song name
    [0xbb, 0x00, 0x04, 0x00, 0x16, 0x00, 0x00, 0x00],
    [0xbb, 0x00, 0x04, 0x00, 0x04, 0x00, 0x06, 0x00],
    [0xbb, 0x00, 0x06, 0x00, 0x23, 0x00, 0x01, 0x02, 0x01, 0x00], //"bb 00 06 00 23 00 01 04 xx"  // Set Volume [TODO]

];


var packetData = {
    count: 0,
    toFrom: [],
    packets: [],
};

    // [0xbb, 0x00, 0x05, 0x00, 0x41, 0x01, 0x00, 0x03, 0x00],

//     [0xbb, 0x00, 0x05, 0x00, 0x41, 0x01, 0x00, 0x00, 0x00] // Get folder length

function updatePacketData(toFrom, packet) {
    packetData.count += 1;
    packetData.toFrom.push(toFrom);
    packetData.packets.push(packet);

    if (packetData.count >= 500) {
        packetData.count = 250;
        packetData.toFrom.splice(0, 250);
        packetData.packets.splice(0, 250);
    }
}

function getPacketData() {
    return packetData;
}

// Add packet bytes to a buffer
function parseBytes(byte, callback) {
    packetBuf.push(byte);

    if (packetBuf.length === 1 && packetBuf[0] !== 0xbb) {
        packetBuf.length = 0;
    } 
  
    if (byteCount === 2) {
        length = parseInt(byte) + 1;
    }
  
    length -= 1;
    byteCount += 1;
  
    if (length === -1) {
        callback(packetBuf);
  
        length = 3;
        byteCount = 0;
        packetBuf.length = 0;
    }
}

function getDeviceName(packetBuf, callback) {
     callback(hexToASCII(packetBuf.slice(7, (packetBuf.length - 2))));
}

function getSongData(packetBuf, callback) {
    var currIndex = 33;
    
    var folderNameLen = combine2Bytes(packetBuf[currIndex], packetBuf[currIndex + 1]);

    currIndex += 1;
    currIndex += folderNameLen + 8;

    // console.log("FolderNameLen:" + folderNameLen);

    var songNameLen = combine2Bytes(packetBuf[currIndex], packetBuf[currIndex + 1]);

    currIndex += 1;
    // console.log("SongNameLen:" + songNameLen);

    var songName = packetBuf.slice(currIndex + 1, currIndex + 1 + songNameLen);
    currIndex += songNameLen + 7;

    var artistNameLen = combine2Bytes(packetBuf[currIndex], packetBuf[currIndex + 1]);
    
    currIndex += 1;
    // console.log("ArtistNameLen:" + artistNameLen);

    var artistName = packetBuf.slice(currIndex + 1, currIndex + 1 + artistNameLen);
    currIndex += artistNameLen;

    callback(hexToASCII(songName), hexToASCII(artistName));

    // io.emit("Song", {songName : hexToASCII(songName), artistName: hexToASCII(artistName) });
}

function hexToASCII(byteArray) {
    str = "";

    for (let i = 0; i < byteArray.length; ++i) {
        str += '%' + ('0' + byteArray[i].toString(16)).slice(-2);
    }

    str = decodeURIComponent(str);

    return str;
}

function combine2Bytes(byte1, byte2) {
    combByte = byte1;
    combByte <<= 8;
    combByte ^= byte2;

    return combByte;
}

// calculate packet checksum
function calcChecksum(packet) {
    let checkSum = 0x00;

    for (let i = 1; i < packet.length - 1; ++i) {
        checkSum += packet[i];
        // console.log(checkSum);

    }
    checkSum &= 0xFF;
    checkSum ^= 0xFF;
    return checkSum + 1;
}   



module.exports = { updatePacketData, getPacketData, parseBytes, getDeviceName, getSongData, calcChecksum, commandPackets };