const WebSocket = require("ws");
const axios = require("axios");
const secrets = require("./secrets");
const pickAction = require("./strategy/random");

const url = "ws://sim.smogon.com:8000/showdown/websocket";
const ws = new WebSocket(url);
const username = "porygon1809";
let loggedIn = false;
let battleId = "";
let status = "";
const getChallstr = str => {
  const findChallStr = /^|challstr|([\S*])$/;
  return findChallStr.test(str);
};

const startBattle = () => {
  ws.send("|/challenge melissasage, gen1randombattle");
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
});

ws.on("message", async function incoming(message) {
  console.log(`>> ${message}`);
  if (getChallstr(message) && loggedIn == false) {
    loggedIn = true;
    const assertion = await login(RegExp.$1);
    ws.send(`|/trn ${username},0,${assertion}`);
    startBattle();
  } else if (/(battle\-[\w\d]+\-[\d]+)/.test(message)) {
    if (!battleId) battleId = RegExp.$1;
    console.log("battleId:", battleId);
    const request = /(\|request\|)(.*$)/.test(message);
    if (request) {
      status = RegExp.$2;
    } else if (status && /\|turn\|\d/.test(message)) {
      const action = pickAction(status, battleId);
      ws.send(action);
    }
  }
});

ws.on("send", function incoming(message) {
  console.log(`<< ${message}`);
});

ws.on("close", function close() {
  console.log("Connection closed.");
});
