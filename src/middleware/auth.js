const Key_File = require("../../config/keys");
const Keys = Object.values(Key_File);

var colors = require("colors");

const apiKeyMiddleware = (req, res, next) => {
  const apiKey = req.headers["api-key"];
  if (apiKey && Keys.includes(apiKey)) {
    console.log(
      colors.bold.gray("[" + apiKey + "]") +
        " Request to " +
        colors.italic(req.originalUrl)
    );
    next();
  } else {
    res.status(401).json({ error: "Unauthorized: Invalid API key" });
  }
};

module.exports = {
  apiKeyMiddleware,
};
