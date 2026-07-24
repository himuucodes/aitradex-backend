const PhoneVerification = require("../models/PhoneVerification");
const {
  sendOtp,
  verifyOtp,
} = require("./messageCentral.service");

// ==========================================================
// SEND PHONE OTP
// ==========================================================

const sendPhoneOtp = async (phone) => {
  phone = String(phone).trim();

  if (!phone) {
    throw new Error("Phone number is required.");
  }

  console.log("====================================");
  console.log("SEND PHONE OTP");
  console.log("Phone :", phone);

  // Remove previous verification
  await PhoneVerification.deleteMany({ phone });

  // Send OTP through Message Central
  const response = await sendOtp(phone);

  console.log("========== SEND OTP RESPONSE ==========");
  console.log(JSON.stringify(response, null, 2));

  if (!response) {
    throw new Error("Message Central did not return any response.");
  }

  // Support different response formats
  const verificationId =
    response?.data?.verificationId ||
    response?.verificationId;

  const timeout =
    Number(response?.data?.timeout) ||
    Number(response?.timeout) ||
    300;

  if (!verificationId) {
    throw new Error("Verification ID not found in Message Central response.");
  }

  const expiresAt = new Date(Date.now() + timeout * 1000);

  await PhoneVerification.create({
    phone,
    verificationId,
    verified: false,
    expiresAt,
  });

  console.log("Verification ID :", verificationId);

  return {
    success: true,
    message: "OTP sent successfully.",
    expiresAt,
  };
};

// ==========================================================
// VERIFY PHONE OTP
// ==========================================================

const verifyPhoneOtp = async (phone, otp) => {
  phone = String(phone).trim();
  otp = String(otp).trim();

  if (!phone || !otp) {
    throw new Error("Phone and OTP are required.");
  }

  console.log("====================================");
  console.log("VERIFY PHONE OTP");
  console.log("Phone :", phone);
  console.log("OTP   :", otp);

  const verification = await PhoneVerification.findOne({
    phone,
    verified: false,
  });

  console.log("Mongo Verification");
  console.log(verification);

  if (!verification) {
    throw new Error("Verification request not found.");
  }

  if (verification.expiresAt < new Date()) {
    await PhoneVerification.deleteOne({
      _id: verification._id,
    });

    throw new Error("OTP expired.");
  }

  console.log("Verification ID :", verification.verificationId);

  const response = await verifyOtp(
    verification.verificationId,
    otp
  );

  console.log("========== VERIFY OTP RESPONSE ==========");
  console.log(JSON.stringify(response, null, 2));

  if (!response) {
    throw new Error("Message Central returned an empty response.");
  }

  // Accept common success formats
  const verified =
    response?.verified === true ||
    response?.success === true ||
    response?.status === 200 ||
    response?.responseCode === 200;

  if (!verified) {
    throw new Error(
      response?.message ||
      response?.error ||
      "OTP verification failed."
    );
  }

  verification.verified = true;
  await verification.save();

  // Optional: remove verification after success
  await PhoneVerification.deleteOne({
    _id: verification._id,
  });

  return {
    success: true,
    verified: true,
    message: "Phone verified successfully.",
  };
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