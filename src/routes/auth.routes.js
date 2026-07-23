const express = require("express");
const router = express.Router();

console.log("Auth routes loaded...");

const authController = require("../controllers/auth.controller");
const authMiddleware = require("../middleware/auth.middleware");

// ==========================================================
// PHONE OTP ROUTES
// ==========================================================

// Send Phone OTP
router.post("/send-phone-otp", authController.sendPhoneOtp);

// Verify Phone OTP
router.post("/verify-phone-otp", authController.verifyPhoneOtp);

// Resend Phone OTP
router.post("/resend-phone-otp", authController.resendPhoneOtp);

// ==========================================================
// AUTH ROUTES
// ==========================================================

// Signup
router.post("/signup", authController.signup);

// Login
router.post("/login", authController.login);

// User Profile
router.get(
  "/profile",
  authMiddleware,
  authController.getProfile
);

// ==========================================================
// CLOUDFLARE TURNSTILE
// ==========================================================

router.post(
  "/verify-turnstile",
  authController.verifyTurnstile
);

module.exports = router;