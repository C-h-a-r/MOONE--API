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

  registerNewUser(steamID, db);
});



module.exports = router;
