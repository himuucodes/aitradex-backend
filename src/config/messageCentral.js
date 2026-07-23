const axios = require("axios");

const messageCentral = axios.create({
  baseURL: "https://cpaas.messagecentral.com",
  timeout: 30000,
});

module.exports = messageCentral;