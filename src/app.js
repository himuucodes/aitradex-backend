const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

dotenv.config();

const connectDB = require("./config/db");

const app = express();

// Connect MongoDB
connectDB();

// Middlewares
app.use(cors());

app.use(express.json());

app.use(express.urlencoded({ extended: true }));

// Test Route
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "🚀 Welcome to AiTradeX Backend API",
  });
});

// Routes
// app.use("/api/auth", require("./routes/auth.routes"));

module.exports = app;