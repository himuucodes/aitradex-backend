const Otp = require("../models/Otp");
const transporter = require("../config/mail");
const generateOtp = require("../utils/generateOtp");

const sendOtp = async (email) => {
  const otp = generateOtp();

  // Remove old OTP
  await Otp.deleteMany({ email });

  // Save new OTP
  await Otp.create({
    email,
    otp,
    expiresAt: new Date(Date.now() + 5 * 60 * 1000),
  });

  // Send email
  await transporter.sendMail({
    from: `"AiTradeX" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: "AiTradeX Email Verification",
    html: `
      <h2>Email Verification</h2>
      <p>Your OTP is:</p>
      <h1 style="letter-spacing:5px;">${otp}</h1>
      <p>This OTP expires in 5 minutes.</p>
    `,
  });

  return true;
};

module.exports = {
  sendOtp,
};