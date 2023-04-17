

function calcChecksum(packet) {
    let checkSum = 0x00;

    for (let i = 1; i < packet.length - 1; ++i) {
        checkSum += packet[i];
    }

    checkSum ^= 0xFF;

    return checkSum + 1;
}   

module.exports = { calcChecksum };