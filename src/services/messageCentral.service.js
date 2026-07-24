const axios = require("axios");

const getAuthToken = async () => {
  const base64Key = Buffer.from(
    process.env.MESSAGE_CENTRAL_PASSWORD
  ).toString("base64");

  const response = await axios.get(
    "https://cpaas.messagecentral.com/auth/v1/authentication/token",
    {
      params: {
        customerId: process.env.MESSAGE_CENTRAL_CUSTOMER_ID,
        email: process.env.MESSAGE_CENTRAL_EMAIL,
        key: base64Key,
        country: process.env.MESSAGE_CENTRAL_COUNTRY,
        scope: "NEW",
      },
    }
  );

  return response.data.token;
};

module.exports = {
  getAuthToken,
};