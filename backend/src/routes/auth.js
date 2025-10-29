const express = require("express");
require("dotenv").config()
const crypto = require("crypto");
const validator = require("validator");
const { validateSignUpData } = require("../utils/validation");
const nodemailer = require("nodemailer");
const authRouter = express.Router();
const bcrypt = require("bcrypt");
const User = require("../models/user");
const { userAuth } = require("../middlewares/auth");

authRouter.post("/signup", async (req, res) => {
  try {
    validateSignUpData(req);

    const { firstName, lastName, emailId, password } = req.body;
    const existingUser = await User.findOne({ emailId });

    if (existingUser) {
      return res.status(400).json("Email is already registered");
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const user = new User({
      firstName,
      lastName,
      emailId,
      password: passwordHash,
    });

    await user.save();

    const token = await user.getJWT();
    const userData = user.toObject();
    delete userData.password;

    res.cookie("token", token, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
    });

    res.json(userData);
  } catch (err) {
    if (err.statusCode === 400) {
      return res.status(400).json(err.message);
    }

    console.error(err);
    res.status(500).send("Server error");
  }
});

authRouter.post("/login", async (req, res) => {
  try {
    const { emailId, password } = req.body;
    if (!emailId || !password) {
      return res.status(400).send("emailId and password are required");
    }
    const user = await User.findOne({ emailId });
    if (!user) {
      return res.status(401).send("Invalid credentials");
    }
    const isPasswordValid = await user.validatePassword(password)
    if (!isPasswordValid) {
      return res.status(401).send("Invalid credentials");
    }
    const token = await user.getJWT();
    const userData = user.toObject();
    delete userData.password;
    res.cookie("token", token, {
      httpOnly: true,
      secure: true,  // ✅ Required for HTTPS (Render & Vercel)
      sameSite: "none",
    });
    res.json(userData);
  }
  catch (err) {
    res.status(500).send("Server error");
  }
})
authRouter.post("/logout", async (req, res) => {
  try {
    res.cookie("token", "", {
      httpOnly: true,
      secure: true,
      sameSite: "None",
      expires: new Date(0),
      path: "/"
    });
    return res.status(200).json({ message: "Logout successful" });
  } catch (err) {
    console.error("Logout error:", err);
    return res.status(500).json({ message: "Logout failed", error: err.message });
  }
});

authRouter.post("/forget-password", async (req, res) => {
  try {
    console.log("ENV LOADED:", {
      GMAIL_USER: process.env.GMAIL_USER_KEY,
      PASS_EXISTS: !!process.env.GMAIL_PASS_KEY,
      MONGO: process.env.MONGO_URI ? "YES" : "NO",
    });

    console.log("Received /forget-password request with body:", req.body);
    const { emailId } = req.body;
    if (!emailId || !validator.isEmail(emailId)) {
      return res.status(400).json({ message: "Valid emailId is required" })
    };
    const user = await User.findOne({ emailId });
    if (!user) {
      return res.status(400).json({ message: "user not found" });
    }
    const otp = crypto.randomInt(100000, 999999);
    console.log("Generated OTP:", otp);
    const otpExpireTime = 10 * 60 * 1000;
    user.resetPasswordOTP = otp;
    user.resetPasswordOTPExpires = Date.now() + otpExpireTime;
    await user.save();
    const htmlContent = `
  <!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
    <title>Password Reset OTP</title>
  </head>
  <body style="font-family: Arial, sans-serif; background-color: #f4f4f7; margin: 0; padding: 0;">
    <table role="presentation" style="max-width: 600px; margin: 30px auto; background: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 6px rgba(0,0,0,0.1);">
      <tr>
        <td style="background: #4f46e5; padding: 20px; text-align: center;">
          <h1 style="color: #ffffff; margin: 0;">Password Reset</h1>
        </td>
      </tr>
      <tr>
        <td style="padding: 20px; color: #333333;">
          <p>Hello,</p>
          <p>You requested to reset your password. Use the OTP below to proceed:</p>
          <div style="text-align: center; margin: 30px 0;">
            <span style="font-size: 28px; font-weight: bold; color: #4f46e5; letter-spacing: 3px; border: 2px dashed #4f46e5; padding: 12px 24px; border-radius: 6px; display: inline-block;">
              ${otp}
            </span>
          </div>
          <p>This OTP is valid for <strong>10 minutes</strong>. Please do not share it with anyone.</p>
          <p>If you did not request this, you can safely ignore this email.</p>
          <p style="margin-top: 40px;">Thanks,<br/>The Support Team</p>
        </td>
      </tr>
      <tr>
        <td style="background: #f9fafb; padding: 15px; text-align: center; font-size: 12px; color: #999999;">
          © ${new Date().getFullYear()} DevHub. All rights reserved.
        </td>
      </tr>
    </table>
  </body>
  </html>
`
    console.log("MAIL USER:", process.env.GMAIL_USER_KEY);
    console.log("MAIL PASS EXISTS:", !!process.env.GMAIL_PASS_KEY);


    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: {
        user: process.env.GMAIL_USER_KEY,
        pass: process.env.GMAIL_PASS_KEY,
      },
    });

    console.log("MAIL USER:", process.env.GMAIL_USER_KEY);
    console.log("MAIL PASS EXISTS:", !!process.env.GMAIL_PASS_KEY);

    // await transporter.sendMail({
    //   to: emailId,
    //   subject: "Password reset OTP",
    //   html: htmlContent
    // });
    return res.json({
      message: "Otp sent to your email",
    })
  }
  catch (err) {
    console.log("Error in /forget-password:", err);
    res.status(400).json({ message: err.message });
  }


})
authRouter.post("/reset-password", async (req, res) => {
  try {
    const { emailId, otp, newPassword } = req.body;

    const user = await User.findOne({ emailId });
    if (!user) {
      return res.status(400).json({
        message: 'user not found'
      });
    }
    if (user.resetPasswordOTP !== parseInt(otp)) {
      return res.status(400).json({
        message: "invalid OTP"
      })
    }
    if (Date.now() > user.resetPasswordOTPExpires) {
      return res.status(400).json({
        message: "OTP expired"
      })
    }
    if (!validator.isStrongPassword(newPassword)) {
      return res.status(400).json({
        message: "enter a strong password!"
      })
    }
    const newPasswordHash = await bcrypt.hash(newPassword, 10);
    user.password = newPasswordHash;
    user.resetPasswordOTP = null;
    user.resetPasswordOTPExpires = null;
    await user.save();
    return res.json({
      message: "password reset successfully"
    })
  }
  catch (err) {
    res.status(400).json({
      message: "something went wrong " + err.message,
    }
    )
  }
})
module.exports = authRouter;
