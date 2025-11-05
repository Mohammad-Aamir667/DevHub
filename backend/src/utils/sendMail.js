const axios = require("axios");
require("dotenv").config()

const sendMail = async (to, subject, html) => {
    try {
        const response = await axios.post(
            "https://api.brevo.com/v3/smtp/email",
            {
                sender: {
                    name: process.env.FROM_NAME || "DevHub Team",
                    email: process.env.FROM_EMAIL, // temporary sender (works fine)
                },
                to: [{ email: to }],
                subject,
                htmlContent: html,
            },
            {
                headers: {
                    accept: "application/json",
                    "api-key": process.env.BREVO_API_KEY,
                    "content-type": "application/json",
                },
            }
        );

        console.log(`✅ Email sent successfully to ${to}`);
        return { success: true };
    }
    catch (error) {
        const errMsg =
            error.response?.data?.message || error.response?.data || error.message;

        console.error(`❌ Email send error to ${to}:`, errMsg);
        return { success: false, error: errMsg };
    }
};

module.exports = sendMail;
