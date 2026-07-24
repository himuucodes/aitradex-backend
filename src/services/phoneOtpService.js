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

    console.log("\n====================================");
    console.log("SEND PHONE OTP");
    console.log("Phone :", phone);

    // Remove previous verification
    await PhoneVerification.deleteMany({ phone });

    console.log("Old verification removed.");

    // Send OTP using Message Central
    const response = await sendOtp(phone);

    console.log("\n========== MESSAGE CENTRAL RESPONSE ==========");
    console.log(JSON.stringify(response, null, 2));

    if (!response) {
      throw new Error("Empty response received from Message Central.");
    }

    const verificationId =
      response?.data?.verificationId ||
      response?.verificationId;

    const timeout =
      Number(response?.data?.timeout) ||
      Number(response?.timeout) ||
      300;

    if (!verificationId) {
      throw new Error(
        "Verification ID not found in Message Central response."
      );
    }

    const expiresAt = new Date(
      Date.now() + timeout * 1000
    );

    console.log("\n====================================");
    console.log("Saving PhoneVerification");

    const verification = new PhoneVerification({
      phone,
      verificationId: String(verificationId),
      verified: false,
      flowType: "SMS",
      expiresAt,
    });

    console.log("Document:");
    console.log(verification);

    await verification.save();

    console.log("PhoneVerification Saved Successfully");

    const saved = await PhoneVerification.findOne({
      phone,
      verificationId,
    });

    console.log("Saved Mongo Document:");
    console.log(saved);

    return {
      success: true,
      message: "OTP sent successfully.",
      verificationId,
      expiresAt,
    };

  } catch (error) {

    console.error("\n====================================");
    console.error("SEND PHONE OTP ERROR");

    if (error.response) {
      console.error("Status :", error.response.status);
      console.error(
        JSON.stringify(error.response.data, null, 2)
      );
    } else {
      console.error(error.message);
    }

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

    if (!phone || !otp) {
      throw new Error("Phone number and OTP are required.");
    }

    console.log("\n====================================");
    console.log("VERIFY PHONE OTP");
    console.log("Phone :", phone);
    console.log("OTP   :", otp);

    const verification =
      await PhoneVerification.findOne({
        phone,
        verified: false,
      });

    console.log("\nMongo Document:");
    console.log(verification);

    if (!verification) {
      throw new Error(
        "Verification request not found."
      );
    }

    if (verification.expiresAt < new Date()) {

      await PhoneVerification.deleteOne({
        _id: verification._id,
      });

      throw new Error("OTP expired.");
    }

    console.log("\nCalling Message Central...");
    console.log(
      "Verification ID:",
      verification.verificationId
    );

    const response = await verifyOtp(
      verification.verificationId,
      otp
    );

    console.log("\n========== VERIFY RESPONSE ==========");
    console.log(JSON.stringify(response, null, 2));

    if (!response) {
      throw new Error(
        "Message Central returned empty response."
      );
    }

    const verified =
      response?.verified === true ||
      response?.success === true ||
      response?.status === 200 ||
      Number(response?.responseCode) === 200;

    if (!verified) {
      throw new Error(
        response?.message ||
        response?.error ||
        "OTP verification failed."
      );
    }

    verification.verified = true;

    await verification.save();

    console.log("Verification Updated.");

    await PhoneVerification.deleteOne({
      _id: verification._id,
    });

    console.log("Verification Removed.");

    return {
      success: true,
      verified: true,
      message: "Phone verified successfully.",
    };

  } catch (error) {

    console.error("\n====================================");
    console.error("VERIFY PHONE OTP ERROR");

    if (error.response) {
      console.error("Status :", error.response.status);
      console.error(
        JSON.stringify(error.response.data, null, 2)
      );
    } else {
      console.error(error.message);
    }

    throw error;
  }
};

// ==========================================================
// RESEND OTP
// ==========================================================

const resendPhoneOtp = async (phone) => {
  return sendPhoneOtp(phone);
};

// ==========================================================

module.exports = {
  sendPhoneOtp,
  verifyPhoneOtp,
  resendPhoneOtp,
};