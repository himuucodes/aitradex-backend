const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT),
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
  requireTLS: true,
});

transporter.verify((error, success) => {
  if (error) {
    console.error("SMTP Verify Error:");
    console.error(error);
  } else {
    console.log("SMTP Server Ready");
  }
});

module.exports = transporter;