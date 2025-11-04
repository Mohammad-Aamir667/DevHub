require("dotenv").config()

const nodemailer = require("nodemailer");

export const brevoTransporter = nodemailer.createTransport({
    host: process.env.BREVO_HOST,
    port: process.env.BREVO_PORT,
    secure: false, // port 587 uses STARTTLS
    auth: {
        user: process.env.BREVO_USER,
        pass: process.env.BREVO_PASS,
    },
});