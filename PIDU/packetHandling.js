var length = 3; // Initial packet length
var byteCount = 0; // Number of bytes received (per packet)
const packetBuf = []; // Stores the newly received packet

// Command UART Packets [The last byte is to be filled with a checksum (calculated before transmission)]
const commandPackets = [
    [0xbb, 0x00, 0x04, 0x00, 0x04, 0x00, 0x07, 0x00], // Play/Pause
    [0xbb, 0x00, 0x04, 0x00, 0x02, 0x00, 0x5d, 0x00], // Pair
    [0xbb, 0x00, 0x04, 0x00, 0x04, 0x00, 0x09, 0x00], // Skip Forward
    [0xbb, 0x00, 0x04, 0x00, 0x04, 0x00, 0x0a, 0x00], // Skip backward
    [0xbb, 0x00, 0x06, 0x00, 0x23, 0x00, 0x01, 0x04, 0x00, 0x00], // Set Volume
    [0xbb, 0x00, 0x16, 0x00, 0x41, 0x00, 0x00, 0x03, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x1, 0x02, 0x00, 0x00, 0x00, 0x01, 0x00, 0x00, 0x00, 0x02, 0x00], // Request song name
    [0xbb, 0x00, 0x04, 0x00, 0x16, 0x00, 0x00, 0x00], // Get device name
    [0xbb, 0x00, 0x04, 0x00, 0x04, 0x00, 0x06, 0x00], // Pause 
    [0xbb, 0x00, 0x06, 0x00, 0x23, 0x00, 0x01, 0x02, 0x01, 0x00], // Lower volume (by one degree)
];

// Logs each packet
var packetData = {
    count: 0, // Number of packets 
    toFrom: [], // Responses or commands
    packets: [], // Packets
};


// Update the pakcetData struct
function updatePacketData(toFrom, packet) {
    packetData.count += 1;
    packetData.toFrom.push(toFrom);
    packetData.packets.push(packet);

    // To prevent from too much data, keep recoded packets < 500
    if (packetData.count >= 500) {
        packetData.count = 250;
        packetData.toFrom.splice(0, 250);
        packetData.packets.splice(0, 250);
    }
}

// packetData getter
function getPacketData() {
    return packetData;
}

// Add packet bytes to a buffer
function parseBytes(byte, callback) {
    packetBuf.push(byte);

    // Check for correct start byte (0xbb) and reset packet
    if (packetBuf.length === 1 && packetBuf[0] !== 0xbb) {
        packetBuf.length = 0;
    } 
  
    // Retrieve length (Length incorrectly calculated, adjust to append byte 2 and 3 together to get length))
    if (byteCount === 2) {
        // Try to implement the combine2Bytes function here
        length = parseInt(byte) + 1;
    }
  
    length -= 1;
    byteCount += 1;
  
    // If packet is ended, give it to callback and reset
    if (length === -1) {
        callback(packetBuf);
  
        length = 3;
        byteCount = 0;
        packetBuf.length = 0;
    }
}

// Retrieve device name
function getDeviceName(packetBuf, callback) {
     callback(hexToASCII(packetBuf.slice(7, (packetBuf.length - 2))));
}

// Retrieve song and artist name
function getSongData(packetBuf, callback) {
    var currIndex = 33;
    
    var folderNameLen = combine2Bytes(packetBuf[currIndex], packetBuf[currIndex + 1]);

    currIndex += 1;
    currIndex += folderNameLen + 8;

    var songNameLen = combine2Bytes(packetBuf[currIndex], packetBuf[currIndex + 1]);

    currIndex += 1;
    var songName = packetBuf.slice(currIndex + 1, currIndex + 1 + songNameLen);
    currIndex += songNameLen + 7;

    var artistNameLen = combine2Bytes(packetBuf[currIndex], packetBuf[currIndex + 1]);
    
    currIndex += 1;
    var artistName = packetBuf.slice(currIndex + 1, currIndex + 1 + artistNameLen);
    currIndex += artistNameLen;

    callback(hexToASCII(songName), hexToASCII(artistName));
}

// Convert hex array to ascii string
function hexToASCII(byteArray) {
    str = "";

    for (let i = 0; i < byteArray.length; ++i) {
        str += '%' + ('0' + byteArray[i].toString(16)).slice(-2);
    }

    str = decodeURIComponent(str);

    return str;
}

// Combine two bytes together [0x01, 0x23] == 0x0123 
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
    }

    checkSum &= 0xFF;
    checkSum ^= 0xFF;

    return checkSum + 1;
}   


module.exports = { 
    updatePacketData, 
    getPacketData, 
    parseBytes, 
    getDeviceName, 
    getSongData, 
    calcChecksum, 
    commandPackets 
};