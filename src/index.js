var db;

async function main() {
  const express = require("express");
  const bodyParser = require("body-parser");
  var colors = require("colors");

  const Key_File = require("../config/keys");
  const Keys = Object.values(Key_File);

  // load db
  const { loadDB } = require("./db");
  //const db = loadDB("main", "moone", Keys.DB); // TODO maybe some env var stuff to detect whether to load production vs testing. also make password safer
  // db = await loadDB("dev", "moone", Keys.DB);
  console.log("db loaded");

  const app = express();
  const PORT = require("../config/port").PORT;

  app.use(require("./middleware/auth").apiKeyMiddleware);
  app.use(bodyParser.json());

  app.use("/api/ip", require("./routes/user-count/user-count"));

  app.listen(PORT, () => {
    console.log("---   MOONE API   ---".bold);
    console.log(`Server is running on port ${PORT}`.bold);
  });
}

main();
