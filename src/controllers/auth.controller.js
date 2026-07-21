const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const User = require("../models/User");
const Otp = require("../models/Otp");

const transporter = require("../config/mail");
const generateOtp = require("../utils/generateOtp");

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

exports.sendOtp = async (req, res) => {
  try {
    console.log("========== SEND OTP ==========");

    const { email } = req.body;

    console.log("Email:", email);

    const otp = generateOtp();

    console.log("Generated OTP:", otp);

    console.log("Saving OTP...");

    await Otp.deleteMany({ email });

    await Otp.create({
      email,
      otp,
      expiresAt: new Date(Date.now() + 5 * 60 * 1000),
    });

    console.log("OTP Saved");

    console.log("Before sendMail");

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: "OTP Test",
      text: otp,
    });

    console.log("After sendMail");

    return res.json({
      success: true,
      message: "OTP sent",
    });

  } catch (err) {

    console.error("SEND OTP ERROR");
    console.error(err);

    return res.status(500).json({
      success: false,
      message: err.message,
    });

  }
};

exports.verifyOtp = async (req, res) => {
  try {

    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({
        success: false,
        message: "Email and OTP are required.",
      });
    }

    const otpData = await Otp.findOne({
      email: email.toLowerCase(),
      otp,
    });

    if (!otpData) {
      return res.status(400).json({
        success: false,
        message: "Invalid OTP.",
      });
    }

    if (otpData.expiresAt < new Date()) {

      await Otp.deleteOne({
        _id: otpData._id,
      });

      return res.status(400).json({
        success: false,
        message: "OTP expired.",
      });
    }

    await Otp.deleteOne({
      _id: otpData._id,
    });

    return res.status(200).json({
      success: true,
      message: "OTP verified successfully.",
    });

  } catch (error) {

    console.error(error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });

  }
};

exports.resendOtp = async (req, res) => {

  try {

    const { email } = req.body;

    if (!email) {

      return res.status(400).json({
        success: false,
        message: "Email is required.",
      });

    }

    const otp = generateOtp();

    await Otp.deleteMany({
      email: email.toLowerCase(),
    });

    await Otp.create({
      email: email.toLowerCase(),
      otp,
      expiresAt: new Date(Date.now() + 5 * 60 * 1000),
    });

    console.log("OTP:", otp);

    return res.status(200).json({
      success: true,
      message: "OTP Generated",
      otp: otp,
    });

    return res.status(200).json({
      success: true,
      message: "OTP resent successfully.",
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