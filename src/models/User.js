const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
    // ==========================================================
    // AUTHENTICATION
    // ==========================================================

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
      trim: true,
    },

    countryCode: {
      type: String,
      default: "+91",
    },

    mpin: {
      type: String,
      required: true,
      minlength: 4,
    },

    // ==========================================================
    // PERSONAL DETAILS
    // ==========================================================

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
      trim: true,
    },

    // ==========================================================
    // INVESTMENT PROFILE
    // ==========================================================

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
      trim: true,
    },

    jobTitle: {
      type: String,
      default: "",
      trim: true,
    },

    // ==========================================================
    // KYC
    // ==========================================================

    panNumber: {
      type: String,
      uppercase: true,
      trim: true,
      default: "",
    },

    panImageUrl: {
      type: String,
      default: "",
    },

    aadhaarNumber: {
      type: String,
      trim: true,
      default: "",
    },

    aadhaarFrontUrl: {
      type: String,
      default: "",
    },

    aadhaarBackUrl: {
      type: String,
      default: "",
    },

    selfieUrl: {
      type: String,
      default: "",
    },

    signatureUrl: {
      type: String,
      default: "",
    },

    // ==========================================================
    // ADDRESS
    // ==========================================================

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

    // ==========================================================
    // BANK
    // ==========================================================

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

    accountType: {
      type: String,
      enum: ["Savings", "Current"],
      default: "Savings",
    },

    // ==========================================================
    // NOMINEE
    // ==========================================================

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

    // ==========================================================
    // PROFILE
    // ==========================================================

    profileImage: {
      type: String,
      default: "",
    },

    // ==========================================================
    // ACCOUNT STATUS
    // ==========================================================

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
      enum: ["Pending", "Active", "Rejected", "Blocked"],
      default: "Pending",
    },

    // ==========================================================
    // DEVICE
    // ==========================================================

    fcmToken: {
      type: String,
      default: "",
    },

    deviceType: {
      type: String,
      default: "",
    },

    // ==========================================================
    // LOGIN
    // ==========================================================

    lastLogin: {
      type: Date,
    },

    // ==========================================================
    // REFERRAL
    // ==========================================================

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
    versionKey: false,
  }
);

// ==========================================================
// INDEXES
// ==========================================================

UserSchema.index({ email: 1 });
UserSchema.index({ phone: 1 });
UserSchema.index({ panNumber: 1 });

// ==========================================================

module.exports = mongoose.model("User", UserSchema);