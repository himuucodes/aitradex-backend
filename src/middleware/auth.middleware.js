const jwt = require("jsonwebtoken");
const User = require("../models/User");

// ==========================================================
// AUTH MIDDLEWARE
// ==========================================================

const authMiddleware = async (req, res, next) => {
  try {
    let token = null;

    // ==========================================
    // Authorization: Bearer <token>
    // ==========================================

    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer ")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }

    // ==========================================
    // No Token
    // ==========================================

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Access denied. Token not provided.",
      });
    }

    // ==========================================
    // Verify JWT
    // ==========================================

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // ==========================================
    // Find User
    // ==========================================

    const user = await User.findById(decoded.id).select("-mpin");

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User not found.",
      });
    }

    // ==========================================
    // Attach User
    // ==========================================

    req.user = user;

    next();
  } catch (error) {
    console.error("JWT Error:", error.message);

    if (error.name === "TokenExpiredError") {
      return res.status(401).json({
        success: false,
        message: "Token has expired.",
      });
    }

    if (error.name === "JsonWebTokenError") {
      return res.status(401).json({
        success: false,
        message: "Invalid token.",
      });
    }

    return res.status(500).json({
      success: false,
      message: "Authentication failed.",
    });
  }
};

module.exports = authMiddleware;