const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const User = require("../models/User");

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

    if (!fullName || !email || !phone || !mpin) {
      return res.status(400).json({
        success: false,
        message: "Full Name, Email, Phone and MPIN are required.",
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

    const hashedMpin = await bcrypt.hash(mpin, 10);

    // =============================
    // Create User
    // =============================

    const user = await User.create({
      fullName,
      email,
      phone,
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
    });

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