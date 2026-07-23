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
      to: process.env.EMAIL_USER,
      subject: "AiTradeX SMTP Test",
      html: `
        <h2>SMTP Test</h2>
        <p>Your Gmail SMTP is working successfully.</p>
      `,
    });

    return res.status(200).json({
      success: true,
      message: "SMTP Connected Successfully",
      messageId: info.messageId,
    });

  } catch (err) {
    console.error("SMTP TEST ERROR:", err);

    return res.status(500).json({
      success: false,
      message: err.message,
      code: err.code,
      errno: err.errno,
      syscall: err.syscall,
      address: err.address,
      port: err.port,
    });
  }
});

const generateOtp = require("../utils/generateOtp");

router.get("/otp-test", async (req, res) => {
  try {
    const otp = generateOtp();

    const info = await transporter.sendMail({
      from: `"AiTradeX" <${process.env.EMAIL_USER}>`,
      to: process.env.EMAIL_USER,
      subject: "AiTradeX OTP Test",
      html: `
        <div style="font-family:Arial,sans-serif">
          <h2 style="color:#F92902">AiTradeX</h2>

          <p>Your verification code is:</p>

          <h1 style="
            font-size:40px;
            letter-spacing:8px;
            color:#F92902;
          ">
            ${otp}
          </h1>

          <p>This OTP is valid for 5 minutes.</p>
        </div>
      `,
    });

    return res.status(200).json({
      success: true,
      otp,
      messageId: info.messageId,
      message: "Dynamic OTP email sent successfully.",
    });

  } catch (err) {
    console.error("OTP TEST ERROR:", err);

    return res.status(500).json({
      success: false,
      message: err.message,
      code: err.code,
      errno: err.errno,
      syscall: err.syscall,
      address: err.address,
      port: err.port,
    });
  }
});

module.exports = router;