const express = require("express");
const axios = require("axios");
const router = express.Router();

require("dotenv").config();
const WOLFRAM_APP_ID = process.env.WOLFRAM_APP_ID;

router.post("/", async (req, res) => {
  const { message } = req.body;

  if (!message) {
    return res.status(400).json({ reply: "No message provided" });
  }

  try {
    // 1. DuckDuckGo
    const duck = await axios.get("https://api.duckduckgo.com/", {
      params: {
        q: message,
        format: "json",
        no_html: 1,
        skip_disambig: 1,
      },
    });

    const duckAnswer = duck.data.AbstractText || duck.data.Answer;
    if (duckAnswer) {
      return res.json({ reply: `🦆 ${duckAnswer}` });
    }

    // 2. Wikipedia
    try {
      const wiki = await axios.get(
        `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(
          message
        )}`
      );
      if (wiki.data.extract) {
        return res.json({ reply: `📘 ${wiki.data.extract}` });
      }
    } catch (wikiErr) {
      console.log("Wikipedia fallback skipped");
    }

    // 3. WolframAlpha
    if (WOLFRAM_APP_ID) {
      try {
        const wolfram = await axios.get(
          "https://api.wolframalpha.com/v1/result",
          {
            params: {
              i: message,
              appid: WOLFRAM_APP_ID,
            },
          }
        );

        if (wolfram.data) {
          return res.json({ reply: `🧠 ${wolfram.data}` });
        }
      } catch (wolframErr) {
        console.log("Wolfram fallback skipped");
      }
    }

    // Final fallback
    res.json({
      reply: `❓ Sorry, I couldn’t find an answer to: "${message}"`,
    });
  } catch (err) {
    console.error("Error in chatbot route:", err.message);
    res.status(500).json({ reply: "⚠️ Server error. Please try again later." });
  }
});

module.exports = router;
