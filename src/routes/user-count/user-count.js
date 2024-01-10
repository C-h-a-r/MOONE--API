const express = require("express");
const router = express.Router();

const ipHashSet = new Set();

router.use(express.json());

router.post("/append-ip", (req, res) => {
  const { ip } = req.body;

  if (!ip) {
    return res.status(400).json({ error: "IP address is required" });
  }

  ipHashSet.add(ip);
  res.json({ message: `IP ${ip} added to the HashSet` });
});

router.post("/remove-ip", (req, res) => {
  const { ip } = req.body;

  if (!ip) {
    return res.status(400).json({ error: "IP address is required" });
  }

  if (ipHashSet.has(ip)) {
    ipHashSet.delete(ip);
    res.json({ message: `IP ${ip} removed from the HashSet` });
  } else {
    res.status(404).json({ error: `IP ${ip} not found in the HashSet` });
  }
});

router.get("/get-ip-list", (req, res) => {
  const ipList = Array.from(ipHashSet);
  res.json({ ipList });
});

router.get("/get-ip-count", (req, res) => {
  const ipCount = ipHashSet.size;
  res.json({ ipCount });
});

module.exports = router;
