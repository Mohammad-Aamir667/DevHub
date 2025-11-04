require("dotenv").config();
const nodemailer = require("nodemailer");

const brevoTransporter = nodemailer.createTransport({
    host: process.env.BREVO_HOST,
    port: process.env.BREVO_PORT,
    secure: false, // Use true for port 465
    auth: {
        user: process.env.BREVO_USER,
        pass: process.env.BREVO_PASS,
    },
});

// Optional verification to debug on Render
brevoTransporter.verify((error, success) => {
    if (error) {
        console.error("❌ SMTP connection failed:", error);
    } else {
        console.log("✅ SMTP transporter ready to send emails");
    }
});

module.exports = brevoTransporter;
