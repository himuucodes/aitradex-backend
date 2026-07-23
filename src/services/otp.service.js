const PhoneOtp = require("../models/PhoneOtp");

// ==========================================================
// Generate 6 Digit OTP
// ==========================================================

const generateOtp = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// ==========================================================
// SEND PHONE OTP
// ==========================================================

const sendPhoneOtp = async (phone, purpose = "signup") => {
  try {
    phone = phone.trim();

    // Generate OTP
    const otp = generateOtp();

    console.log("==================================");
    console.log("PHONE OTP");
    console.log("Phone :", phone);
    console.log("OTP   :", otp);
    console.log("==================================");

    // Remove old OTP
    await PhoneOtp.deleteMany({
      phone,
      purpose,
    });

    // Save new OTP
    const otpDoc = await PhoneOtp.create({
      phone,
      otp,
      purpose,
      verified: false,
      expiresAt: new Date(Date.now() + 5 * 60 * 1000),
    });

    console.log("OTP Saved:", otpDoc._id);

    return {
      otp,
      expiresAt: otpDoc.expiresAt,
    };

  } catch (error) {
    console.error("SEND OTP ERROR");
    console.error(error);

    throw error;
  }
};

module.exports = {
  sendPhoneOtp,
};