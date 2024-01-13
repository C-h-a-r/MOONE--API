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
  const { steamID, type, amount, method } = req.body;
  if (!steamID) {
    return res.status(400).json({ error: "steamID is required" });
  }

  if (!type) {
    return res.status(400).json({ error: "transaction type is required" });
  }

  if (!amount) {
    return res.status(400).json({ error: "transaction amount is required" });
  }

  if (!method) {
    return res.status(400).json({ error: "transaction method is required" });
  }

  let transaction = {
    type: type,
    amount: amount,
    method: method,
  };

  if (type === "add") {
    giveCredits(steamID, amount, db);
  } else if (type === "remove") {
    takeCredits(steamID, amount, db);
  }
  // push to users transactions array
  res.status(200).json({ success: "created transaction" });
  
});

router.get("/fetch", (req, res) => {
  const { steamID } = req.body;

  if (!steamID) {
    return res.status(400).json({ error: "steamID is required" });
  }

  //fetch users transactions and return
});

module.exports = router;
