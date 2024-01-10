const SteamUser = require("steam-user");
const colors = require("colors");
const config = require("../config/bot");
const username = config.USERNAME;
const password = config.PASSWORD;

const client = new SteamUser();

client.on("loggedOn", () => {
  console.log(
    colors.bold.gray("[BOT]") +
      " Logged into Steam as " +
      client.steamID.getSteam3RenderedID()
  );

  client.setPersona(SteamUser.EPersonaState.Online);
});

client.on("error", (err) => {
  console.error("Steam client error:", err);
});

client.logOn({
  accountName: username,
  password: password,
});

client.on("disconnected", (eresult, msg) => {
  console.log(
    colors.bold.gray("[BOT]") + " Logged off from Steam:",
    SteamUser.EResult[eresult],
    msg
  );
});
