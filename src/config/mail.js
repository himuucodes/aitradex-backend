const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail", // Gmail SMTP
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS, // Gmail App Password
  },
});

transporter.verify((error, success) => {
  if (error) {
    console.error("❌ Gmail SMTP Error:", error);
  } else {
    console.log("✅ Gmail SMTP Connected");
  }
});

module.exports = transporter;