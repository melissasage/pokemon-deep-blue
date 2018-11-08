const WebSocket = require("ws");
const url = "ws://sim.smogon.com:8000/showdown/websocket";

const webSocket = new WebSocket(url, {
  perMessageDeflate: false
  // headers: {
  //   Authorization: `Basic ${encodedToken}`,
  // },
});

webSocket.on("open", function open() {
  console.log("Connection has been established.");
});

webSocket.on("close", function close() {
  console.log("Connection closed.");
});
