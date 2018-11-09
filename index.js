const WebSocket = require("ws");
const axios = require("axios");
const secrets = require("./secrets");
const url = "ws://sim.smogon.com:8000/showdown/websocket";

const ws = new WebSocket(url);
f
const username = "porygon1809";

const callYourMom = text => `|/pm melissasage, ${text}`;
// const nameMyself = name => `|updateuser `;
const helloWorld = () => {
  ws.send(callYourMom("hi mom!"));
};

const login = async challstr => {
  try {
    const res = await axios.post(`http://play.pokemonshowdown.com/action.php`, {
      act: "login",
      name: username,
      pass: process.env.PASSWORD,
      challstr
    });
    const assertion = JSON.parse(res.data.slice(1)).assertion;
    return assertion;
  } catch (error) {
    console.error(error);
  }
};

ws.on("open", function open() {
  console.log("Connection has been established.");

  ws.on("message", function incoming(message) {
    console.log(`>> ${message}`);
    if (getChallstr(message)) {
      const assertion = await login(RegExp.$1);
      ws.send(`|/trn ${username},0,${assertion}`);
      helloWorld();
    }
  });
});

ws.on("send", function incoming(message) {
  console.log(`<< ${message}`);
});

ws.on("close", function close() {
  console.log("Connection closed.");
});
