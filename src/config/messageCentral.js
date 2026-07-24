// src/config/messageCentral.js

const axios = require("axios");

const messageCentral = axios.create({
  baseURL: "https://cpaas.messagecentral.com",
  timeout: 30000,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

module.exports = messageCentral;