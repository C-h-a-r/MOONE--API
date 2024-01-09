console.log("---   MOONE API   ---".bold);

// Packages
const express = require("express");
const bodyParser = require("body-parser");
var colors = require("colors");
const rateLimit = require("express-rate-limit");

// Config
const rateLimitConfig = require("../../config/ratelimit");
const PORT = require("../../config/port").PORT;
const Key_File = require("../../config/keys");

// Server
const app = express();

// Rate Limiter
const limiter = rateLimit({
  windowMs: rateLimitConfig.TIME * 60 * 1000,
  max: rateLimitConfig.AMOUNT,
  handler: (req, res) => {
    console.log(`[${req.ip}]`.gray + " Rate-limit exceeded");
    res
      .status(429)
      .json({ error: "Too many requests, please try again later." });
  },
});
app.use((req, res, next) => {
  if (!req.isDevKey) {
    limiter(req, res, next);
  } else {
    next();
  }
});
// API Key
app.use(require("../middleware/auth").apiKeyMiddleware);
// Body Parser
app.use(bodyParser.json());

// Routes
app.get("/protected", (req, res) => {
  res.json({ message: "This is a protected resource" });
});

// Startup
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`.bold);
});
