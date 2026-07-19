const express = require("express");

const router = express.Router();

const authMiddleware = require("../middleware/auth.middleware");

const {
  getProfile,
  updateProfile,

  updateBankDetails,
  updateNominee,
  updateFcmToken,

  updateKyc,
  uploadPan,
  uploadAadhaar,
  uploadSelfie,
  uploadSignature,

  changeMpin,
  deleteAccount,

  getDashboard,
  getAccountStatus,
} = require("../controllers/user.controller");

// ==========================================================
// ALL USER ROUTES REQUIRE AUTHENTICATION
// ==========================================================

router.use(authMiddleware);

// ==========================================================
// PROFILE
// ==========================================================

// Get User Profile
router.get("/profile", getProfile);

// Update Profile
router.put("/profile", updateProfile);

// ==========================================================
// DASHBOARD
// ==========================================================

// Dashboard Summary
router.get("/dashboard", getDashboard);

// Account Status
router.get("/account-status", getAccountStatus);

// ==========================================================
// KYC
// ==========================================================

// Update PAN & Aadhaar Numbers
router.put("/kyc", updateKyc);

// Upload PAN
router.put("/upload-pan", uploadPan);

// Upload Aadhaar
router.put("/upload-aadhaar", uploadAadhaar);

// Upload Selfie
router.put("/upload-selfie", uploadSelfie);

// Upload Signature
router.put("/upload-signature", uploadSignature);

// ==========================================================
// BANK
// ==========================================================

// Update Bank Details
router.put("/bank", updateBankDetails);

// ==========================================================
// NOMINEE
// ==========================================================

// Update Nominee
router.put("/nominee", updateNominee);

// ==========================================================
// DEVICE
// ==========================================================

// Update FCM Token
router.put("/fcm-token", updateFcmToken);

// ==========================================================
// SECURITY
// ==========================================================

// Change MPIN
router.put("/change-mpin", changeMpin);

// Delete Account
router.delete("/delete", deleteAccount);

// ==========================================================

module.exports = router;