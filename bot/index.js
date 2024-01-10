const SteamUser = require("steam-user");
const config = require('../config/bot')
const username = config.USERNAME;
const password = config.PASSWORD;

const client = new SteamUser();

client.on("loggedOn", () => {
  console.log("Logged into Steam as " + client.steamID.getSteam3RenderedID());
});

client.on("error", (err) => {
  console.error("Steam client error:", err);
});

client.logOn({
  accountName: username,
  password: password,
});

client.on("disconnected", (eresult, msg) => {
  console.log("Logged off from Steam:", SteamUser.EResult[eresult], msg);
  process.exit();
});
