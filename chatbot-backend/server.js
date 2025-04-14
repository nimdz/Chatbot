const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

dotenv.config();

const app = express();
const port = process.env.PORT || 5001;

app.use(
  cors({
    origin: "http://localhost:3000",
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

app.use(express.json());

const chatRoute = require("./routes/chat");
app.use("/api/chat", chatRoute);

app.get("/", (req, res) => {
  res.send("Chatbot backend is live!");
});

app.listen(port, () => {
  console.log(`✅ Server is running on port ${port}`);
});
