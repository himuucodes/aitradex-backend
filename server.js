require("dotenv").config();

const connectDB = require("./src/config/db");
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");

// ===============================
// Route Imports
// ===============================

const authRoutes = require("./src/routes/auth.routes");
const userRoutes = require("./src/routes/user.routes");

// ===============================
// App
// ===============================

const app = express();

// ===============================
// Middleware
// ===============================

app.use(
  cors({
    origin: "*",
    credentials: true,
  })
);

app.use(helmet());
app.use(morgan("dev"));
app.use(cookieParser());
app.use(express.json({ limit: "20mb" }));
app.use(express.urlencoded({ extended: true }));

// ===============================
// MongoDB Connection Database
// ===============================
connectDB();

// ===============================
// Health Check
// ===============================

app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    app: "AiTradeX Backend API",
    version: "1.0.0",
    message: "Server is running successfully 🚀",
  });
});

// ===============================
// API Routes
// ===============================

app.use("/api/auth", authRoutes);

app.use("/api/user", userRoutes);

// ===============================
// 404 Handler
// ===============================

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
  });
});

// ===============================
// Global Error Handler
// ===============================

app.use((err, req, res, next) => {
  console.error(err);

  res.status(err.status || 500).json({
    success: false,
    message: err.message || "Internal Server Error",
  });
});

// ===============================
// Start Server
// ===============================

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log("========================================");
  console.log(`🚀 AiTradeX Server Running`);
  console.log(`🌐 http://localhost:${PORT}`);
  console.log(`📦 Environment : ${process.env.NODE_ENV}`);
  console.log("========================================");
});