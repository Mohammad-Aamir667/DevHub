const express = require("express");
require("dotenv").config()
const crypto = require("crypto");
const validator = require("validator");
const { validateSignUpData } = require("../utils/validation");
const authRouter = express.Router();
const bcrypt = require("bcrypt");
const User = require("../models/user");
const sendMail = require("../utils/sendMail");
authRouter.post("/signup", async (req, res) => {
  try {
    // ✅ 1. Validate input
    const validation = validateSignUpData(req);
    if (!validation.isValid) {
      return res.status(400).json({ message: validation.message });
    }

    let { firstName, lastName, emailId, password } = req.body;
    emailId = emailId.toLowerCase();

    // ✅ 2. Check if user already exists
    const existingUser = await User.findOne({ emailId });

    // ✅ 3. Generate OTP + HTML Template
    const generateOtpAndTemplate = () => {
      const otp = crypto.randomInt(100000, 999999);
      const htmlContent = `
        <!DOCTYPE html>
        <html>
        <body style="font-family: Arial; background:#f4f4f7; padding:40px;">
          <div style="max-width:480px; background:#fff; padding:30px; border-radius:8px; margin:auto;">
            <h1 style="text-align:center; font-size:24px; color:#4f46e5;">Verify Your DevHub Account</h1>
            <p style="font-size:15px; color:#333;">Enter the OTP below to verify your email:</p>
            <div style="text-align:center; margin:25px 0;">
              <span style="font-size:32px; font-weight:600; padding:10px 20px; border:2px dashed #4f46e5; color:#4f46e5;">
                ${otp}
              </span>
            </div>
            <p style="font-size:14px; color:#555;">Valid for 10 minutes. Do not share with anyone.</p>
            <p style="text-align:center; color:#999; font-size:12px;">© ${new Date().getFullYear()} DevHub.</p>
          </div>
        </body>
        </html>
      `;
      return { otp, htmlContent };
    };

    // ✅ 4. Handle verified existing user
    if (existingUser && existingUser.isVerified) {
      return res.status(409).json({
        status: "verified",
        message: "This email is already registered. Please log in instead.",
      });
    }

    // ✅ 5. Handle existing but unverified user (resend OTP)
    if (existingUser && !existingUser.isVerified) {
      const { otp, htmlContent } = generateOtpAndTemplate();
      existingUser.signupOTP = otp;
      existingUser.signupOTPExpires = Date.now() + 10 * 60 * 1000;
      await existingUser.save();

      const mailResponse = await sendMail(emailId, "Verify Your DevHub Email", htmlContent);

      if (!mailResponse.success) {
        // ⚠️ Don’t break UX — still respond gracefully
        return res.status(200).json({
          status: "mail-failed",
          message: "Verification mail may be delayed. Please try resending the OTP later.",
        });
      }

      return res.status(200).json({
        status: "not-verified",
        message: "Account exists but not verified. OTP resent successfully.",
      });
    }

    // ✅ 6. Handle new user registration
    const passwordHash = await bcrypt.hash(password, 10);
    const newUser = new User({
      firstName,
      lastName,
      emailId,
      password: passwordHash,
      isVerified: false,
    });

    const { otp, htmlContent } = generateOtpAndTemplate();
    newUser.signupOTP = otp;
    newUser.signupOTPExpires = Date.now() + 10 * 60 * 1000;
    await newUser.save();

    const mailResponse = await sendMail(emailId, "Verify Your DevHub Email", htmlContent);

    if (!mailResponse.success) {
      // ⚠️ Keep the account created — let the user resend OTP later
      return res.status(201).json({
        status: "mail-failed",
        message: "Account created, but verification mail may be delayed. Please try again later.",
      });
    }

    // ✅ 7. Success — mail sent
    return res.status(201).json({
      status: "new-user",
      message: "Account created. Verification OTP sent successfully.",
    });

  } catch (err) {
    console.error("Signup error:", err);
    return res.status(500).json({
      success: false,
      message: "Something went wrong while creating your account. Please try again later.",
    });
  }
});
authRouter.post("/verify-email", async (req, res) => {
  try {
    const { emailId, otp } = req.body;
    const user = await User.findOne({ emailId });
    if (!user || user.signupOTP !== parseInt(otp)) {
      return res.status(400).json({
        message: "Verification failed. Please check your email and OTP.",
      });
    }
    if (Date.now() > user.signupOTPExpires) {
      return res.status(400).json({
        message: "OTP expired. Please request a new one.",
      })
    }
    user.signupOTP = null;
    user.signupOTPExpires = null;
    user.isVerified = true;
    await user.save();

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
    res.status(500).json({
      message: "Something went wrong. Please try again later.",
    });
  }
});
authRouter.post("/login", async (req, res) => {
  try {
    const { emailId, password } = req.body;
    if (!emailId || !password) {
      return res.status(400).send("emailId and password are required");
    }
    const user = await User.findOne({ emailId });
    if (!user || !user.isVerified) {
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
    const { emailId } = req.body;

    if (!emailId || !validator.isEmail(emailId)) {
      return res.status(400).json({ message: "Please enter a valid email address." });
    }

    const user = await User.findOne({ emailId });

    // ⚠️ Generic response (prevents email existence exposure)
    const genericResponse = {
      success: true,
      message: "If this email is registered, an OTP has been sent to your inbox.",
    };

    // If user doesn’t exist or is unverified → always return generic response
    if (!user || !user.isVerified) {
      console.log(`⚠️ Password reset requested for invalid/unverified email: ${emailId}`);
      return res.status(200).json(genericResponse);
    }

    // Generate OTP and update user
    const otp = crypto.randomInt(100000, 999999);
    user.resetPasswordOTP = otp;
    user.resetPasswordOTPExpires = Date.now() + 10 * 60 * 1000;
    await user.save();

    // Build email template
    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <body style="font-family: Arial; background:#f4f4f7; padding:40px;">
        <div style="max-width:480px; background:#fff; padding:30px; border-radius:8px; margin:auto;">
          <h1 style="text-align:center; font-size:24px; color:#4f46e5;">DevHub Password Reset</h1>
          <p style="font-size:15px; color:#333;">We received a password reset request for your DevHub account.</p>
          <p style="text-align:center; margin:25px 0;">
            <span style="font-size:32px; font-weight:bold; border:2px dashed #4f46e5; color:#4f46e5; padding:12px 24px;">
              ${otp}
            </span>
          </p>
          <p style="font-size:14px; color:#555;">This OTP is valid for <strong>10 minutes</strong>. Do not share it with anyone.</p>
          <p style="text-align:center; color:#999; font-size:12px;">© ${new Date().getFullYear()} DevHub. All Rights Reserved.</p>
        </div>
      </body>
      </html>
    `;

    // Send mail
    const mailResponse = await sendMail(emailId, "DevHub Password Reset OTP", htmlContent);

    // If email sending fails → don’t reveal info, respond safely
    if (!mailResponse.success) {
      console.error(`❌ Failed to send password reset OTP to ${emailId}`);
      return res.status(200).json({
        ...genericResponse,
        message: "If this email is registered, you may receive the OTP shortly. Please check again later.",
      });
    }

    // ✅ Always return generic success (even for valid users)
    return res.status(200).json(genericResponse);

  } catch (err) {
    console.error("❌ Forgot Password Error:", err);
    return res.status(500).json({
      success: false,
      message: "Something went wrong while processing your request. Please try again later.",
    });
  }
});
authRouter.post("/reset-password", async (req, res) => {
  try {
    const { emailId, otp, newPassword } = req.body;

    if (!emailId || !validator.isEmail(emailId)) {
      return res.status(400).json({ message: "Please enter a valid email address." });
    }

    const user = await User.findOne({ emailId });

    // Always use generic error to avoid email guessing
    const genericError = { message: "Invalid or expired OTP. Please try again." };

    if (!user || !user.resetPasswordOTP) {
      console.log(`⚠️ Password reset attempt for unknown user: ${emailId}`);
      return res.status(400).json(genericError);
    }

    // Verify OTP
    if (user.resetPasswordOTP !== parseInt(otp)) {
      return res.status(400).json(genericError);
    }

    // Check OTP expiry
    if (Date.now() > user.resetPasswordOTPExpires) {
      return res.status(400).json({ message: "Your OTP has expired. Please request a new one." });
    }

    // Check password strength
    if (!validator.isStrongPassword(newPassword)) {
      return res.status(400).json({ message: "Please enter a strong password." });
    }

    // Update password securely
    const newPasswordHash = await bcrypt.hash(newPassword, 10);
    user.password = newPasswordHash;
    user.resetPasswordOTP = null;
    user.resetPasswordOTPExpires = null;
    await user.save();

    return res.status(200).json({
      success: true,
      message: "Password reset successfully. You can now log in with your new password.",
    });

  } catch (err) {
    console.error("❌ Reset Password Error:", err);
    return res.status(500).json({
      success: false,
      message: "Something went wrong while resetting your password. Please try again later.",
    });
  }
});


module.exports = authRouter;
