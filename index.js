const WebSocket = require("ws");
const url = "ws://sim.smogon.com:8000/showdown/websocket";

const ws = new WebSocket(url, {
  perMessageDeflate: false
  // headers: {
  //   Authorization: `Basic ${encodedToken}`,
  // },
});

const nameMyself = name => `|\\updateuser ${name}`;
const callYourMom = text => `|\\pm melissasage, ${text}`;

ws.on("open", function open() {
  console.log("Connection has been established.");
  ws.send(nameMyself("porygonbot1809"));
});

ws.on("message", function incoming(message) {
  console.log(`>> ${message}`);
});

ws.on("close", function close() {
  console.log("Connection closed.");
});

// console.log("Attempting to name myself...");
// console.log("Name set!");
// console.log("Sending a ping to Melissa on the server...");
// ws.send(callYourMom("hi mom!"));
// console.log("Said hi to mom.");
