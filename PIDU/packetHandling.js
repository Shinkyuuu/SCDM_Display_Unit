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
    // [0xbb, 0x00, 0x05, 0x00, 0x41, 0x01, 0x00, 0x03, 0x00],
    [0xbb, 0x00, 0x08, 0x00, 0x0b, 0x00, 0x10, 0x00, 0x00, 0x00, 0x00],
    [0xbb, 0x00, 0x0e, 0x00, 0x41, 0x00, 0x00, 0x03, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00], // Request song name
    [0xbb, 0x00, 0x16, 0x00, 0x41, 0x00, 0x00, 0x03,   0x00, 0x00, 0x00, 0x00,   0x00, 0x00, 0x00, 0x1,   0x02, 0x00, 0x00, 0x00, 0x01, 0x00, 0x00, 0x00, 0x02, 0x00] // Request song name
]; 

//     [0xbb, 0x00, 0x05, 0x00, 0x41, 0x01, 0x00, 0x00, 0x00] // Get folder length

// Add packet bytes to a buffer
function parseBytes(byte, callback) {
    packetBuf.push(byte);
  
    if (byteCount === 2) {
      length = parseInt(byte) + 1;
    }
  
    length -= 1;
    byteCount += 1;
  
    if (length === -1) {
        // console.log("Received Packet:");
        // console.log(packetBuf);
        callback(packetBuf);
  
        length = 3;
        byteCount = 0;
        packetBuf.length = 0;
    }
}

// calculate packet checksum
function calcChecksum(packet) {
    let checkSum = 0x00;

    for (let i = 1; i < packet.length - 1; ++i) {
        checkSum += packet[i];
    }

    checkSum ^= 0xFF;

    return checkSum + 1;
}   



module.exports = { parseBytes, calcChecksum, commandPackets };