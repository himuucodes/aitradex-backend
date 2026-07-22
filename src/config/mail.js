const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS, // Google App Password
  },
});

transporter.verify((err, success) => {
  if (err) {
    console.error("SMTP VERIFY ERROR:");
    console.error(err);
  } else {
    console.log("SMTP CONNECTED");
  }
});

module.exports = transporter;