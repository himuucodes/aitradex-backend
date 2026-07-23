const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  family: 4, // Force IPv4
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
  connectionTimeout: 30000,
  greetingTimeout: 30000,
  socketTimeout: 30000,
});

transporter.verify((err) => {
  if (err) {
    console.error("SMTP Error:", err);
  } else {
    console.log("✅ Gmail SMTP Connected");
  }
});

module.exports = transporter;