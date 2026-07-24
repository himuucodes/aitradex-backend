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
    phone = String(phone).trim();

    if (!phone) {
      throw new Error("Phone number is required.");
    }

    console.log("================================");
    console.log("SEND PHONE OTP");
    console.log("Phone   :", phone);
    console.log("Purpose :", purpose);

    // Remove previous OTPs
    await PhoneOtp.deleteMany({ phone });

    const otp = generateOtp();

    const expiresAt = new Date(Date.now() + 5 * 60 * 1000);

    const otpDoc = await PhoneOtp.create({
      phone,
      otp,
      verified: false,
      expiresAt,
    });

    console.log("OTP Saved Successfully");
    console.log("OTP :", otp);

    // ======================================================
    // TODO:
    // Send OTP using Message Central API here.
    // ======================================================

    return {
      success: true,
      message: "OTP sent successfully.",
      otp,
      expiresAt: otpDoc.expiresAt,
    };
  } catch (error) {
    console.error("SEND PHONE OTP ERROR");
    console.error(error);
    throw error;
  }
};

// ==========================================================
// VERIFY PHONE OTP
// ==========================================================

const verifyPhoneOtp = async (phone, otp) => {
  try {
    phone = String(phone).trim();
    otp = String(otp).trim();

    console.log("================================");
    console.log("VERIFY PHONE OTP");
    console.log("Phone :", phone);
    console.log("OTP   :", otp);

    const otpDoc = await PhoneOtp.findOne({
      phone,
      verified: false,
    }).sort({ createdAt: -1 });

    console.log("Mongo Result:", otpDoc);

    if (!otpDoc) {
      throw new Error("OTP not found.");
    }

    if (new Date() > otpDoc.expiresAt) {
      await PhoneOtp.deleteOne({
        _id: otpDoc._id,
      });

      throw new Error("OTP expired.");
    }

    if (String(otpDoc.otp) !== otp) {
      throw new Error("Invalid OTP.");
    }

    otpDoc.verified = true;

    await otpDoc.save();

    // Delete after verification
    await PhoneOtp.deleteOne({
      _id: otpDoc._id,
    });

    return {
      success: true,
      verified: true,
      message: "Phone verified successfully.",
    };
  } catch (error) {
    console.error("VERIFY PHONE OTP ERROR");
    console.error(error);
    throw error;
  }
};

module.exports = {
  sendPhoneOtp,
  verifyPhoneOtp,
};