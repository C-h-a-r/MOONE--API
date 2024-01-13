const express = require("express");
const router = express.Router();

router.use(express.json());

const {
  registerNewUser,
  deleteUser,
  giveCredits,
  takeCredits,
  registerGame,
  finishGame,
  rollbackGames,
  registerTransaction,
  getTransactions,
  buyItem,
  sellItem,
} = require("../../db");

const { db } = require("../../index");

router.post("/create", (req, res) => {
  const { steamID } = req.body;
  if (!steamID) {
    return res.status(400).json({ error: "steamID address is required" });
  }

  // check if users with steam id already exists
  registerNewUser(steamID, db);
  res.status(200).json({ success: "user added to database"})
});

router.delete("/delete", (req, res) => {
  const { steamID } = req.body;
  if (!steamID) {
    return res.status(400).json({ error: "steamID address is required" });
  }
  // check if user is in db, if not return error

  deleteUser(steamID, db);
  res.status(200).json({ success: "user removed to database"})
});

module.exports = router;
