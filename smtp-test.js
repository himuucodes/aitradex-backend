require("dotenv").config();
const nodemailer = require("nodemailer");

async function test() {
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT),
    secure: false,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  try {
    await transporter.verify();
    console.log("✅ SMTP Connected");

    await transporter.sendMail({
      from: process.env.SMTP_USER,
      to: "thunderxgod06@gmail.com", // Replace with your own email
      subject: "SMTP Test",
      text: "Hello from Node.js",
    });

    console.log("✅ Email Sent Successfully");
  } catch (error) {
    console.error("❌ SMTP Error:");
    console.error(error);
  }
}

test();