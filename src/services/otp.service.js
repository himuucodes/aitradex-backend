const PhoneOtp = require("../models/PhoneOtp");

// ==========================================================
// Generate OTP
// ==========================================================

const generateOtp = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// ==========================================================
// SEND OTP
// ==========================================================

const sendPhoneOtp = async (phone, purpose = "signup") => {
  phone = phone.trim();

  const otp = generateOtp();

  console.log("=================================");
  console.log("PHONE OTP");
  console.log("Phone :", phone);
  console.log("OTP   :", otp);
  console.log("=================================");

  await PhoneOtp.deleteMany({
    phone,
    purpose,
  });

  const otpDoc = await PhoneOtp.create({
    phone,
    otp,
    purpose,
    verified: false,
    expiresAt: new Date(Date.now() + 5 * 60 * 1000),
  });

  return {
    otp,
    expiresAt: otpDoc.expiresAt,
  };
};

// ==========================================================
// VERIFY OTP
// ==========================================================

const verifyPhoneOtp = async (
  phone,
  otp,
  purpose = "signup"
) => {

  phone = phone.trim();
  otp = otp.trim();

  const otpDoc = await PhoneOtp.findOne({
    phone,
    purpose,
  });

  if (!otpDoc) {
    throw new Error("OTP not found.");
  }

  if (otpDoc.expiresAt < new Date()) {
    await PhoneOtp.deleteOne({
      _id: otpDoc._id,
    });

    throw new Error("OTP has expired.");
  }

  if (otpDoc.otp !== otp) {
    throw new Error("Invalid OTP.");
  }

  otpDoc.verified = true;

  await otpDoc.save();

  return {
    verified: true,
  };
};

module.exports = {
  sendPhoneOtp,
  verifyPhoneOtp,
};