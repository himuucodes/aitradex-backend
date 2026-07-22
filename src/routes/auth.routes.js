const express = require("express");

const router = express.Router();

const transporter = require("../config/mail");
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

router.get("/smtp-test", async (req, res) => {
  try {
    await transporter.verify();

    await transporter.sendMail({
      from: process.env.SMTP_USER,
      to: "thunderxgod06@gmail.com", // Replace with your Gmail
      subject: "Render SMTP Test",
      text: "Hello from Render!",
    });

    return res.json({
      success: true,
      message: "SMTP Working",
    });

  } catch (err) {

    console.error(err);

    return res.status(500).json({
      success: false,
      error: err.message,
      code: err.code,
      response: err.response,
    });

  }
});

module.exports = router;