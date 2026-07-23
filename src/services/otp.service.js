const Otp = require("../models/Otp");
const transporter = require("../config/mail");
const generateOtp = require("../utils/generateOtp");

const sendOtp = async (email) => {
  try {
    email = email.trim().toLowerCase();

    const otp = generateOtp();

    // Remove previous OTP
    await Otp.deleteMany({ email });

    // Save new OTP
    await Otp.create({
      email,
      otp,
      expiresAt: new Date(Date.now() + 5 * 60 * 1000),
    });

    // Send OTP Email
    const info = await transporter.sendMail({
      from: `"AiTradeX" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "AiTradeX Email Verification",
      html: `
        <div style="font-family:Arial,sans-serif;padding:20px">
          <h2 style="color:#F92902;">AiTradeX</h2>

          <p>Your One-Time Password (OTP) is:</p>

          <h1 style="
            letter-spacing:8px;
            color:#F92902;
            text-align:center;
          ">
            ${otp}
          </h1>

          <p>This OTP expires in <b>5 minutes</b>.</p>

          <p>If you didn't request this OTP, please ignore this email.</p>
        </div>
      `,
    });

    console.log("✅ Email sent:", info.messageId);

    return {
      success: true,
      otp,
    };

  } catch (error) {
    console.error("❌ Send OTP Error:", error);
    throw error;
  }
};

module.exports = {
  sendOtp,
};