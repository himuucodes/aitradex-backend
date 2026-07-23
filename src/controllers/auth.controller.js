const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const User = require("../models/User");
const Otp = require("../models/Otp");

const otpService = require("../services/otp.service");
const { verifyTurnstile } = require("../services/turnstile.service");

// ==========================================================
// Generate JWT Token
// ==========================================================

const generateToken = (userId) => {
  return jwt.sign(
    { id: userId },
    process.env.JWT_SECRET,
    {
      expiresIn: process.env.JWT_EXPIRES_IN || "30d",
    }
  );
};

// ==========================================================
// SIGNUP
// POST /api/auth/signup
// ==========================================================

exports.signup = async (req, res) => {
  console.log("====================================");
  console.log("SIGNUP REQUEST RECEIVED");
  console.log(JSON.stringify(req.body, null, 2));
  console.log("====================================");
  try {
    const {
      fullName,
      email,
      phone,
      countryCode,
      mpin,

      gender,
      dob,
      birthPlace,

      investmentGoal,
      investmentExperience,

      occupation,
      monthlyIncome,
      companyName,
      jobTitle,

      panNumber,
      panImageUrl,

      aadhaarNumber,
      aadhaarFrontUrl,
      aadhaarBackUrl,

      selfieUrl,
      signatureUrl,

      address,
      city,
      state,
      pincode,

      bankName,
      accountHolderName,
      accountNumber,
      ifscCode,
      accountType,

      nomineeName,
      nomineeDob,
      nomineeRelation,
    } = req.body;

    // =============================
    // Required Fields
    // =============================

    if (!fullName || !email || !phone) {
      return res.status(400).json({
        success: false,
        message: "Full Name, Email and Phone are required.",
      });
    }

    // =============================
    // Email Exists
    // =============================

    const emailExists = await User.findOne({ email });

    if (emailExists) {
      return res.status(409).json({
        success: false,
        message: "Email already registered.",
      });
    }

    // =============================
    // Phone Exists
    // =============================

    const phoneExists = await User.findOne({ phone });

    if (phoneExists) {
      return res.status(409).json({
        success: false,
        message: "Phone number already registered.",
      });
    }

    // =============================
    // Hash MPIN
    // =============================

    let hashedMpin = "";

    if (mpin && mpin.trim() !== "") {
      hashedMpin = await bcrypt.hash(mpin, 10);
    }

    // =============================
    // Create User
    // =============================

    const userData = {
      fullName: fullName?.trim(),
      email: email?.trim().toLowerCase(),
      phone: phone?.trim(),
      countryCode,

      mpin: hashedMpin,

      gender,
      dob,
      birthPlace,

      investmentGoal,
      investmentExperience,

      occupation,
      monthlyIncome,
      companyName,
      jobTitle,

      panNumber,
      panImageUrl,

      aadhaarNumber,
      aadhaarFrontUrl,
      aadhaarBackUrl,

      selfieUrl,
      signatureUrl,

      address,
      city,
      state,
      pincode,

      bankName,
      accountHolderName,
      accountNumber,
      ifscCode,
      accountType,

      nomineeName,
      nomineeDob,
      nomineeRelation,
    };

    console.log("========== USER DATA ==========");
    console.log(JSON.stringify(userData, null, 2));

    const user = await User.create(userData);

    console.log("========== USER SAVED ==========");
    console.log(user);

    // =============================
    // JWT
    // =============================

    const token = generateToken(user._id);

    // Hide MPIN
    user.mpin = undefined;

    return res.status(201).json({
      success: true,
      message: "Signup successful.",
      token,
      user,
    });

  } catch (error) {

    console.error("========== SIGNUP ERROR ==========");
    console.error(error);

    if (error.name === "ValidationError") {
      console.error("Validation Errors:");
      console.error(error.errors);
    }

    if (error.code === 11000) {
      console.error("Duplicate Key:", error.keyValue);
    }

    return res.status(500).json({
      success: false,
      message: error.message,
      error: process.env.NODE_ENV === "development" ? error : undefined,
    });

  }
};

exports.sendPhoneOtp = async (req, res) => {
  try {
    const { phone, purpose = "signup" } = req.body;

    if (!phone) {
      return res.status(400).json({
        success: false,
        message: "Phone number is required.",
      });
    }

    const result = await otpService.sendPhoneOtp(phone, purpose);

    return res.status(200).json({
      success: true,
      message: "OTP sent successfully.",
      data: result,
    });

  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.verifyPhoneOtp = async (req, res) => {
  try {
    const { phone, otp, purpose = "signup" } = req.body;

    if (!phone || !otp) {
      return res.status(400).json({
        success: false,
        message: "Phone number and OTP are required.",
      });
    }

    const result = await otpService.verifyPhoneOtp(
      phone,
      otp,
      purpose
    );

    return res.status(200).json({
      success: true,
      message: "OTP verified successfully.",
      data: result,
    });

  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.resendPhoneOtp = async (req, res) => {
  try {
    const { phone, purpose = "signup" } = req.body;

    if (!phone) {
      return res.status(400).json({
        success: false,
        message: "Phone number is required.",
      });
    }

    const result = await otpService.resendPhoneOtp(
      phone,
      purpose
    );

    return res.status(200).json({
      success: true,
      message: "OTP resent successfully.",
      data: result,
    });

  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
exports.verifyTurnstile = async (req, res) => {
  try {
    const { email, token } = req.body;

    if (!email || !token) {
      return res.status(400).json({
        success: false,
        message: "Email and token are required.",
      });
    }

    const result = await verifyTurnstile(token);

    if (!result.success) {
      return res.status(400).json({
        success: false,
        message: "Captcha verification failed.",
      });
    }

    return res.json({
      success: true,
      message: "Captcha verified successfully.",
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Internal server error.",
    });
  }
};
// ==========================================================
// LOGIN
// POST /api/auth/login
// ==========================================================

exports.login = async (req, res) => {

  try {

    const { email, mpin } = req.body;

    if (!email || !mpin) {

      return res.status(400).json({
        success: false,
        message: "Email and MPIN are required.",
      });

    }

    const user = await User.findOne({ email });

    if (!user) {

      return res.status(404).json({
        success: false,
        message: "User not found.",
      });

    }

    const isMatch = await bcrypt.compare(
      mpin,
      user.mpin
    );

    if (!isMatch) {

      return res.status(401).json({
        success: false,
        message: "Invalid MPIN.",
      });

    }

    user.lastLogin = new Date();

    await user.save();

    const token = generateToken(user._id);

    user.mpin = undefined;

    return res.status(200).json({

      success: true,
      message: "Login successful.",
      token,
      user,

    });

  } catch (error) {

    console.error(error);

    return res.status(500).json({

      success: false,
      message: error.message,

    });

  }

};

// ==========================================================
// PROFILE
// GET /api/auth/profile
// ==========================================================

exports.getProfile = async (req, res) => {

  try {

    const user = await User.findById(req.user.id).select("-mpin");

    if (!user) {

      return res.status(404).json({

        success: false,
        message: "User not found.",

      });

    }

    return res.status(200).json({

      success: true,
      user,

    });

  } catch (error) {

    console.error(error);

    return res.status(500).json({

      success: false,
      message: error.message,

    });

  }

};