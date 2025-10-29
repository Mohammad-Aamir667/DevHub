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
const { Resend } = require("resend");

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
    console.log("📩 /forget-password request:", req.body);

    const { emailId } = req.body;

    if (!emailId || !validator.isEmail(emailId)) {
      return res.status(400).json({ message: "Valid emailId is required" });
    }

    const user = await User.findOne({ emailId });

    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    const otp = crypto.randomInt(100000, 999999);

    user.resetPasswordOTP = otp;
    user.resetPasswordOTPExpires = Date.now() + 10 * 60 * 1000;
    await user.save();

    const resend = new Resend(process.env.RESEND_API_KEY);

    const htmlContent = `
      <h2 style="color:#4f46e5;">Password Reset</h2>
      <p>Your OTP is:</p>
      <h1 style="letter-spacing:4px; font-size:32px;">${otp}</h1>
      <p>Valid for <strong>10 minutes</strong>. Do not share with anyone.</p>
    `;

    console.log("📨 Sending email via Resend...");

    await resend.emails.send({
      from: "DevHub Team <onboarding@resend.dev>", // Works instantly ✅
      to: emailId,
      subject: "Your DevHub Password Reset OTP",
      html: htmlContent,
    });

    console.log("✅ Email sent successfully");

    return res.status(200).json({ success: true, message: "OTP sent successfully" });

  } catch (err) {
    console.log("❌ Error in /forget-password:", err);
    return res.status(500).json({ success: false, message: "Failed to send OTP", error: err.message });
  }
});

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
