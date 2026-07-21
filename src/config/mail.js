const nodemailer = require("nodemailer");

console.log("========== SMTP CONFIG ==========");
console.log("Host:", process.env.SMTP_HOST);
console.log("Port:", process.env.SMTP_PORT);
console.log("User:", process.env.SMTP_USER);
console.log("Pass Exists:", !!process.env.SMTP_PASS);
console.log("=================================");

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT),
  secure: false,

  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },

  tls: {
    rejectUnauthorized: false,
  },

  connectionTimeout: 10000,
  greetingTimeout: 10000,
  socketTimeout: 10000,
});

transporter.verify((error, success) => {
  if (error) {
    console.error("❌ SMTP VERIFY FAILED");
    console.error(error);
  } else {
    console.log("✅ SMTP VERIFIED");
  }
});

module.exports = transporter;