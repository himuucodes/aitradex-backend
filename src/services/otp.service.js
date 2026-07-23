const Otp = require("../models/Otp");
const resend = require("../config/mail");
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
      expiresAt: new Date(Date.now() + 5 * 60 * 1000), // 5 minutes
    });

    // Send email using Resend
    const response = await resend.emails.send({
      from: process.env.EMAIL_FROM,
      to: email,
      subject: "AiTradeX Email Verification",
      html: `
        <div style="font-family: Arial, sans-serif; max-width:600px; margin:auto; padding:20px;">
          <h2 style="color:#F92902;">AiTradeX</h2>

          <p>Hello,</p>

          <p>Your email verification code is:</p>

          <div style="
            background:#f5f5f5;
            padding:20px;
            text-align:center;
            border-radius:8px;
            margin:20px 0;
          ">
            <h1 style="
              margin:0;
              color:#F92902;
              font-size:40px;
              letter-spacing:10px;
            ">
              ${otp}
            </h1>
          </div>

          <p>This OTP is valid for <strong>5 minutes</strong>.</p>

          <p>If you didn't request this code, you can safely ignore this email.</p>

          <br>

          <p>Thanks,</p>
          <p><strong>AiTradeX Team</strong></p>
        </div>
      `,
    });

    console.log("Resend Response:", response);

    return {
      success: true,
      otpId: response?.id,
    };

  } catch (error) {
    console.error("Resend Error:", error);
    throw error;
  }
};

module.exports = {
  sendOtp,
};