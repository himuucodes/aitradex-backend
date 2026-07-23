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

    const info = await transporter.sendMail({
      from: `"AiTradeX" <${process.env.EMAIL_USER}>`,
      to: process.env.EMAIL_USER, // or "yourtest@gmail.com"
      subject: "Render SMTP Test",
      html: `
        <h2>AiTradeX SMTP Test</h2>
        <p>If you received this email, Gmail SMTP is working correctly.</p>
      `,
    });

    return res.status(200).json({
      success: true,
      message: "SMTP Working",
      messageId: info.messageId,
    });

  } catch (err) {
    console.error(err);

    return res.status(500).json({
      success: false,
      message: err.message,
      code: err.code,
      errno: err.errno,
      syscall: err.syscall,
      address: err.address,
      port: err.port,
      response: err.response,
    });
  }
});

router.get("/otp-test", async (req, res) => {
  try {
    const otp = "123456";

    await transporter.sendMail({
      from: `"AiTradeX" <${process.env.EMAIL_USER}>`,
      to: process.env.EMAIL_USER,
      subject: "OTP Test",
      html: `
        <h2>AiTradeX</h2>
        <p>Your OTP is:</p>
        <h1>${otp}</h1>
      `,
    });

    res.json({
      success: true,
      message: "OTP email sent",
    });

  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
      code: err.code,
    });
  }
});

module.exports = router;