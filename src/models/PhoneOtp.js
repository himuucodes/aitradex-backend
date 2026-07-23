const mongoose = require("mongoose");

const phoneOtpSchema = new mongoose.Schema(
  {
    phone: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },

    countryCode: {
      type: String,
      default: "+91",
      trim: true,
    },

    verificationId: {
      type: String,
      required: true,
      trim: true,
    },

    purpose: {
      type: String,
      enum: ["signup", "signin"],
      default: "signup",
      required: true,
    },

    verified: {
      type: Boolean,
      default: false,
    },

    expiresAt: {
      type: Date,
      required: true,
      index: {
        expires: 0, // MongoDB TTL index
      },
    },

    lastAttemptAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

// Compound index
phoneOtpSchema.index({
  phone: 1,
  purpose: 1,
});

module.exports = mongoose.model("PhoneOtp", phoneOtpSchema);