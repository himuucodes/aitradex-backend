const axios = require("axios");
const PhoneOtp = require("../models/PhoneOtp");

const sendPhoneOtp = async (phone, purpose = "signup") => {
  try {
    phone = phone.trim();

    // 1. Authenticate with Message Central
    // 2. Send OTP using Message Central
    // 3. Receive verificationId
    // 4. Save verificationId in MongoDB
    // 5. Return success
  } catch (error) {
    console.error(error);
    throw error;
  }
};

module.exports = {
  sendPhoneOtp,
};