const WebSocket = require('ws');
const fs = require('fs');

// Node.js WebSocket client

let totalDataTransferred = 0;

const ws = new WebSocket('ws://localhost:8765');
seconds = 0;
ws.on('open', function open() {
    setInterval(() => {
        const image = fs.readFileSync("./drivetest.jpg", "utf8");
        totalDataTransferred += image.length;
        seconds += 1;
        ws.send(image);
    }, 1200);
});

ws.on('message', function incoming(data) {
    //console.log(data.toString());
});

setInterval(() => {
    console.log(`Total data transferred in ${seconds} sec: ${totalDataTransferred / (1024 * 1024)} MB`);
}, 1000); // Log every minute