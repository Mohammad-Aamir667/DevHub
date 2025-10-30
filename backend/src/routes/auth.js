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

    let { firstName, lastName, emailId, password } = req.body;
    emailId = emailId.toLowerCase();

    const existingUser = await User.findOne({ emailId });

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

    const resend = new Resend(process.env.RESEND_API_KEY);
    if (existingUser) {
      if (existingUser.isVerified === true) {
        return res.status(200).json({
          status: "verified",
          message: "Email already registered and verified.",
        });
      }
    }

    if (existingUser && !existingUser.isVerified) {
      const { otp, htmlContent } = generateOtpAndTemplate();
      existingUser.signupOTP = otp;
      existingUser.signupOTPExpires = Date.now() + 10 * 60 * 1000;
      await existingUser.save();

      await resend.emails.send({
        from: "DevHub Team <onboarding@resend.dev>",
        to: emailId,
        subject: "Verify Your DevHub Email",
        html: htmlContent,
      });

      return res.status(200).json({
        status: "not-verified",
        message: "Email already registered but not verified. OTP resent.",

      });
    }

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

    await resend.emails.send({
      from: "DevHub Team <onboarding@resend.dev>",
      to: emailId,
      subject: "Verify Your DevHub Email",
      html: htmlContent,
    });

    return res.status(201).json({
      status: "new-user",
      message: "Account created. OTP sent for verification."
    });

  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error", error: err.message });
  }
});

authRouter.post("/verify-email", async (req, res) => {
  try {
    const { emailId, otp } = req.body;
    const user = await User.findOne({ emailId });
    if (!user) {
      return res.status(400).json({
        message: 'user not found'
      });
    }
    if (user.signupOTP !== parseInt(otp)) {
      return res.status(400).json({
        message: "invalid OTP"
      })
    }
    if (Date.now() > user.signupOTPExpires) {
      return res.status(400).json({
        message: "OTP expired"
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
    res.status(400).json({ message: "something went wrong " + err.message, })
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
      return res.status(400).json({ message: "Valid emailId is required" });
    }

    const user = await User.findOne({ emailId });

    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }
    if (!user.isVerified) {
      return res.status(400).json({ message: "Email not verified" });
    }
    const otp = crypto.randomInt(100000, 999999);

    user.resetPasswordOTP = otp;
    user.resetPasswordOTPExpires = Date.now() + 10 * 60 * 1000;
    await user.save();

    const resend = new Resend(process.env.RESEND_API_KEY);

    const htmlContent = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8" />
  <title>Password Reset OTP</title>
</head>
<body style="margin:0; padding:0; background:#f4f4f7; font-family:Arial, sans-serif;">
  <table role="presentation" style="width:100%; border-collapse:collapse;">
    <tr>
      <td align="center" style="padding:40px 0;">
        <table role="presentation" style="width:480px; background:#ffffff; border-radius:8px; padding:30px; box-shadow:0 2px 6px rgba(0,0,0,0.1); text-align:left;">
          
          <!-- Header -->
          <tr>
            <td style="text-align:center; padding-bottom:20px;">
              <h1 style="margin:0; font-size:24px; color:#4f46e5;">DevHub Password Reset</h1>
            </td>
          </tr>
          
          <!-- Body -->
          <tr>
            <td style="font-size:15px; color:#333; line-height:1.6;">
              <p>Hello,</p>
              <p>We received a request to reset your password. Please use the OTP below to continue:</p>
            </td>
          </tr>

          <!-- OTP Box -->
          <tr>
            <td align="center" style="padding:25px 0;">
              <div style="font-size:32px; font-weight:bold; color:#4f46e5; border:2px dashed #4f46e5; padding:14px 26px; border-radius:6px;">
                ${otp}
              </div>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="font-size:14px; color:#555; line-height:1.6;">
              <p>This OTP is valid for <strong>10 minutes</strong>. Do not share it with anyone.</p>
              <p>If you did not request this, you can safely ignore this email.</p>
              <br/>
              <p style="text-align:center; color:#999; font-size:12px;">© ${new Date().getFullYear()} DevHub. All Rights Reserved.</p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
`;



    await resend.emails.send({
      from: "DevHub Team <onboarding@resend.dev>", // Works instantly ✅
      to: emailId,
      subject: "Your DevHub Password Reset OTP",
      html: htmlContent,
    });


    return res.status(200).json({ success: true, message: "OTP sent successfully" });

  } catch (err) {
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
