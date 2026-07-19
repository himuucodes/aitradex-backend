const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
    // ==========================================
    // AUTHENTICATION
    // ==========================================

    fullName: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    phone: {
      type: String,
      required: true,
      unique: true,
    },

    countryCode: {
      type: String,
      default: "+91",
    },

    mpin: {
      type: String,
      required: true,
    },

    // ==========================================
    // PERSONAL DETAILS
    // ==========================================

    gender: {
      type: String,
      enum: ["Male", "Female", "Other"],
      default: "",
    },

    dob: {
      type: Date,
    },

    birthPlace: {
      type: String,
      default: "",
    },

    // ==========================================
    // INVESTMENT PROFILE
    // ==========================================

    investmentGoal: {
      type: String,
      default: "",
    },

    investmentExperience: {
      type: String,
      default: "",
    },

    occupation: {
      type: String,
      default: "",
    },

    monthlyIncome: {
      type: String,
      default: "",
    },

    companyName: {
      type: String,
      default: "",
    },

    jobTitle: {
      type: String,
      default: "",
    },

    // ==========================================
    // KYC
    // ==========================================

    panNumber: {
      type: String,
      uppercase: true,
      trim: true,
    },

    aadhaarNumber: {
      type: String,
      trim: true,
    },

    panImage: {
      type: String,
      default: "",
    },

    aadhaarFrontImage: {
      type: String,
      default: "",
    },

    aadhaarBackImage: {
      type: String,
      default: "",
    },

    selfieImage: {
      type: String,
      default: "",
    },

    signatureImage: {
      type: String,
      default: "",
    },

    // ==========================================
    // ADDRESS
    // ==========================================

    address: {
      type: String,
      default: "",
    },

    city: {
      type: String,
      default: "",
    },

    state: {
      type: String,
      default: "",
    },

    pincode: {
      type: String,
      default: "",
    },

    // ==========================================
    // BANK
    // ==========================================

    bankName: {
      type: String,
      default: "",
    },

    accountHolderName: {
      type: String,
      default: "",
    },

    accountNumber: {
      type: String,
      default: "",
    },

    ifscCode: {
      type: String,
      default: "",
    },

    // ==========================================
    // NOMINEE
    // ==========================================

    nomineeName: {
      type: String,
      default: "",
    },

    nomineeDob: {
      type: Date,
    },

    nomineeRelation: {
      type: String,
      default: "",
    },

    // ==========================================
    // PROFILE
    // ==========================================

    profileImage: {
      type: String,
      default: "",
    },

    // ==========================================
    // ACCOUNT STATUS
    // ==========================================

    kycVerified: {
      type: Boolean,
      default: false,
    },

    emailVerified: {
      type: Boolean,
      default: false,
    },

    phoneVerified: {
      type: Boolean,
      default: false,
    },

    accountStatus: {
      type: String,
      enum: [
        "Pending",
        "Active",
        "Rejected",
        "Blocked",
      ],
      default: "Pending",
    },

    // ==========================================
    // DEVICE
    // ==========================================

    fcmToken: {
      type: String,
      default: "",
    },

    deviceType: {
      type: String,
      default: "",
    },

    // ==========================================
    // LOGIN
    // ==========================================

    lastLogin: {
      type: Date,
    },

    // ==========================================
    // REFERRAL
    // ==========================================

    referralCode: {
      type: String,
      default: "",
    },

    referredBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("User", UserSchema);