const express = require("express");

const router = express.Router();

const authController = require("../controllers/auth.controller");
const authMiddleware = require("../middleware/auth.middleware");

// ==========================================================
// OTP ROUTES
// ==========================================================

// Send OTP
router.post("/send-otp", authController.sendOtp);

// Verify OTP
router.post("/verify-otp", authController.verifyOtp);

// Resend OTP
router.post("/resend-otp", authController.resendOtp);

// ==========================================================
// AUTH ROUTES
// ==========================================================

// Signup
router.post("/signup", authController.signup);

// Login
router.post("/login", authController.login);

// Profile
router.get(
  "/profile",
  authMiddleware,
  authController.getProfile
);

module.exports = router;