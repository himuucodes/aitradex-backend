const PhoneVerification = require("../models/PhoneVerification");

const {
  sendOtp,
  verifyOtp,
} = require("./messageCentral.service");

// ==========================================================
// SEND PHONE OTP
// ==========================================================

const sendPhoneOtp = async (phone) => {
  try {
    phone = String(phone).trim();

    if (!phone) {
      throw new Error("Phone number is required.");
    }

    console.log("====================================");
    console.log("SEND PHONE OTP");
    console.log("Phone :", phone);

    // Remove previous verification request
    await PhoneVerification.deleteMany({ phone });

    // Send OTP through Message Central
    const response = await sendOtp(phone);

    if (
      !response ||
      response.responseCode !== 200 ||
      !response.data
    ) {
      throw new Error(
        response?.message || "Failed to send OTP."
      );
    }

    const verificationId = String(
      response.data.verificationId
    );

    const timeout = Number(response.data.timeout || 300);

    const expiresAt = new Date(
      Date.now() + timeout * 1000
    );

    await PhoneVerification.create({
      phone,
      verificationId,
      verified: false,
      expiresAt,
    });

    console.log("Verification ID:", verificationId);

    return {
      success: true,
      expiresAt,
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

    console.log("====================================");
    console.log("VERIFY PHONE OTP");
    console.log("Phone :", phone);
    console.log("OTP   :", otp);

    const verification = await PhoneVerification.findOne({
      phone,
      verified: false,
    });

    if (!verification) {
      throw new Error("Verification request not found.");
    }

    if (verification.expiresAt < new Date()) {
      await PhoneVerification.deleteOne({
        _id: verification._id,
      });

      throw new Error("OTP expired.");
    }

    const response = await verifyOtp(
      verification.verificationId,
      otp
    );

    if (
      !response ||
      response.responseCode !== 200
    ) {
      throw new Error(
        response?.message || "OTP verification failed."
      );
    }

    verification.verified = true;

    await verification.save();

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

// ==========================================================
// RESEND OTP
// ==========================================================

const resendPhoneOtp = async (phone) => {
  return sendPhoneOtp(phone);
};

module.exports = {
  sendPhoneOtp,
  verifyPhoneOtp,
  resendPhoneOtp,
};