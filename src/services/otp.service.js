const PhoneOtp = require("../models/PhoneOtp");

// ==========================================================
// Generate 6 Digit OTP
// ==========================================================

const generateOtp = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// ==========================================================
// SEND OTP (Signup)
// ==========================================================

const sendPhoneOtp = async (phone) => {
  try {
    phone = phone.trim();

    const otp = generateOtp();

    console.log("==================================");
    console.log("SEND SIGNUP OTP");
    console.log("Phone :", phone);
    console.log("OTP   :", otp);
    console.log("==================================");

    // Delete old OTP
    await PhoneOtp.deleteOne({
      phone,
    });

    // Save new OTP
    const otpDoc = await PhoneOtp.create({
      phone,
      otp,
      verified: false,
      expiresAt: new Date(Date.now() + 5 * 60 * 1000),
    });

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

// ==========================================================
// VERIFY OTP (Signup)
// ==========================================================

const verifyPhoneOtp = async (phone, otp) => {
  try {
    phone = phone.trim();
    otp = otp.trim();

    const otpDoc = await PhoneOtp.findOne({
      phone,
    });

    if (!otpDoc) {
      throw new Error("OTP not found.");
    }

    if (otpDoc.expiresAt < new Date()) {
      await PhoneOtp.deleteOne({ _id: otpDoc._id });
      throw new Error("OTP has expired.");
    }

    if (otpDoc.otp !== otp) {
      throw new Error("Invalid OTP.");
    }

    otpDoc.verified = true;
    await otpDoc.save();

    // Remove OTP after successful verification
    await PhoneOtp.deleteOne({ _id: otpDoc._id });

    return {
      verified: true,
      message: "OTP verified successfully.",
    };
  } catch (error) {
    console.error("VERIFY OTP ERROR");
    console.error(error);
    throw error;
  }
};

module.exports = {
  sendPhoneOtp,
  verifyPhoneOtp,
};