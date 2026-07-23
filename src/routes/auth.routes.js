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
      from: `"AiTradeX" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "AiTradeX Email Verification",
      html: `
    <h2>AiTradeX</h2>

    <p>Your OTP is:</p>

    <h1 style="letter-spacing:8px;color:#F92902;">
      ${otp}
    </h1>

    <p>This OTP expires in 5 minutes.</p>
  `,
    });

    console.log("Email Sent Successfully");

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