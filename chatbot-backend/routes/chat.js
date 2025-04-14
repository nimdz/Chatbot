const express = require("express");
const router = express.Router();

router.post("/", async (req, res) => {
  const { message } = req.body;

  console.log("💬 Received body:", req.body);

  if (!message || typeof message !== "string") {
    return res.status(400).json({ reply: "No message provided" });
  }

  const simulatedResponse = `You asked: "${message}". This is a simulated response.`;
  res.json({ reply: simulatedResponse });
});

module.exports = router;
