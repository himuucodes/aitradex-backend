const axios = require("axios");

// ==========================================================
// Message Central Client
// ==========================================================

const messageCentral = axios.create({
    baseURL: "https://cpaas.messagecentral.com",
    timeout: 30000,
    headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
    },
});

// ==========================================================
// Generate Message Central Auth Token
// ==========================================================

const generateAuthToken = async () => {
    try {
        if (!process.env.MESSAGE_CENTRAL_CUSTOMER_ID) {
            throw new Error("MESSAGE_CENTRAL_CUSTOMER_ID is missing.");
        }

        if (!process.env.MESSAGE_CENTRAL_EMAIL) {
            throw new Error("MESSAGE_CENTRAL_EMAIL is missing.");
        }

        if (!process.env.MESSAGE_CENTRAL_PASSWORD) {
            throw new Error("MESSAGE_CENTRAL_PASSWORD is missing.");
        }

        const base64Key = Buffer.from(
            process.env.MESSAGE_CENTRAL_PASSWORD,
            "utf8"
        ).toString("base64");

        console.log("====================================");
        console.log("MESSAGE CENTRAL AUTH REQUEST");
        console.log("Customer :", process.env.MESSAGE_CENTRAL_CUSTOMER_ID);
        console.log("Email    :", process.env.MESSAGE_CENTRAL_EMAIL);
        console.log("Country  :", process.env.MESSAGE_CENTRAL_COUNTRY);

        const response = await messageCentral.get(
            "/auth/v1/authentication/token",
            {
                params: {
                    customerId: process.env.MESSAGE_CENTRAL_CUSTOMER_ID,
                    key: base64Key,
                    country: process.env.MESSAGE_CENTRAL_COUNTRY || "91",
                    email: process.env.MESSAGE_CENTRAL_EMAIL,
                    scope: "NEW",
                },
            }
        );

        console.log("====================================");
        console.log("MESSAGE CENTRAL AUTH RESPONSE");
        console.log(JSON.stringify(response.data, null, 2));

        // Support different response structures
        const authToken =
            response.data?.token ||
            response.data?.authToken ||
            response.data?.data?.token ||
            response.data?.data?.authToken;

        if (!authToken) {
            throw new Error("Auth token not found in Message Central response.");
        }

        console.log("Auth Token Generated Successfully");

        return authToken;

    } catch (error) {
        console.error("====================================");
        console.error("MESSAGE CENTRAL AUTH ERROR");

        if (error.response) {
            console.error("Status :", error.response.status);
            console.error(
                "Response:",
                JSON.stringify(error.response.data, null, 2)
            );
        } else {
            console.error(error.message);
        }

        throw new Error(
            error.response?.data?.message ||
            "Message Central authentication failed."
        );
    }
};

// ==========================================================
// Send OTP
// ==========================================================

const sendOtp = async (phone) => {
    try {
        const authToken = await generateAuthToken();

        const mobile = phone.replace("+91", "").trim();

        const response = await messageCentral.post(
            "/verification/v3/send",
            null,
            {
                headers: {
                    authToken,
                },
                params: {
                    customerId: process.env.MESSAGE_CENTRAL_CUSTOMER_ID,
                    countryCode: process.env.MESSAGE_CENTRAL_COUNTRY,
                    flowType: "SMS",
                    mobileNumber: mobile,
                    otpLength: 6,
                },
            }
        );

        console.log("SEND OTP RESPONSE");
        console.log(JSON.stringify(response.data, null, 2));

        return response.data;

    } catch (error) {
        console.error("========== MESSAGE CENTRAL SEND OTP ERROR ==========");

        if (error.response) {
            console.error("Status :", error.response.status);
            console.error("Data :", JSON.stringify(error.response.data, null, 2));
        } else {
            console.error(error.message);
        }

        throw new Error("Failed to send OTP.");
    }
};

// ==========================================================
// Verify OTP
// ==========================================================

const verifyOtp = async (verificationId, otp) => {
  try {
    const authToken = await generateAuthToken();

    console.log("====================================");
    console.log("VERIFY OTP REQUEST");
    console.log("Verification ID :", verificationId);
    console.log("OTP             :", otp);

    const response = await messageCentral.post(
      "/verification/v3/validateOtp",
      null,
      {
        headers: {
          authToken,
        },
        params: {
          customerId: process.env.MESSAGE_CENTRAL_CUSTOMER_ID, // <-- was missing, causes 401
          verificationId: String(verificationId),
          code: String(otp),
          flowType: "SMS",
          langid: "en",
        },
        validateStatus: () => true,
      }
    );

    console.log("====================================");
    console.log("VERIFY STATUS :", response.status);
    console.log("VERIFY DATA");
    console.log(JSON.stringify(response.data, null, 2));

    if (response.status === 200) {
      return response.data;
    }

    throw new Error(
      response.data?.message ||
      response.data?.error ||
      `HTTP ${response.status}`
    );

  } catch (error) {
    console.log("====================================");
    console.log("VERIFY OTP ERROR");

    if (error.response) {
      console.log("Status :", error.response.status);
      console.log("Headers :", error.response.headers);
      console.log("Body :", error.response.data);
    } else {
      console.log(error.message);
    }

    throw error;
  }
};

module.exports = {
    generateAuthToken,
    sendOtp,
    verifyOtp,
};