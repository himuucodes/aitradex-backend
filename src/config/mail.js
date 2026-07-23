const dns = require("dns");
const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
  family: 4,
  dnsLookup: (hostname, options, callback) => {
    return dns.lookup(hostname, { family: 4 }, callback);
  },
});

module.exports = transporter;