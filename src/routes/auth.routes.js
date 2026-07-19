const express = require("express");

const router = express.Router();

const {
  signup,
  login,
  getProfile,
} = require("../controllers/auth.controller");

const authMiddleware = require("../middleware/auth.middleware");

// ==========================================================
// AUTH ROUTES
// ==========================================================

// User Signup
router.post("/signup", signup);

// User Login
router.post("/login", login);

// Get Logged In User Profile
router.get("/profile", authMiddleware, getProfile);

module.exports = router;