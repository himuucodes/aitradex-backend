const Otp = require("../models/Otp");
const transporter = require("../config/mail");
const generateOtp = require("../utils/generateOtp");

const sendOtp = async (email) => {
  email = email.trim().toLowerCase();

  const otp = generateOtp();

  await Otp.deleteMany({ email });

  await Otp.create({
    email,
    otp,
    expiresAt: new Date(Date.now() + 5 * 60 * 1000),
  });

  await transporter.sendMail({
    from: `"AiTradeX" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: "AiTradeX Email Verification",
    html: `
      <h2>AiTradeX</h2>

      <p>Your verification code is</p>

      <h1 style="letter-spacing:10px;color:#F92902">
        ${otp}
      </h1>

      <p>This OTP expires in 5 minutes.</p>
    `,
  });

  return true;
};

module.exports = {
  sendOtp,
};