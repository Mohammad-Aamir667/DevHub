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

authRouter.post("/login",async (req,res)=>{
    try{ 
         const {emailId,password} = req.body;
      const user = await User.findOne({emailId});
      if(!user){
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
              sameSite: "none",  // ✅ Allow cross-origin cookies
            });
        res.cookie("token",token);
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

authRouter.post("/forget-password",async(req,res)=>{
     try{
       const {emailId} = req.body;
      const user = await User.findOne({emailId});
      if(!user){
        return res.status(400).json({message:"user not found"});
      }
      const otp = crypto.randomInt(100000,999999);
      const otpExpireTime = 10*60*1000;
      user.otp = otp;
      user.otpExpires = Date.now() +  otpExpireTime;
      await user.save();
      const transporter = nodemailer.createTransport({
        service: 'Gmail', 
        auth: {
          user: 'aamireverlasting786@gmail.com',  
          pass: 'mafg qzfv vave hixh',
        },
      });
      await transporter.sendMail({
          to:emailId,
          subject:"password reset otp",
          text:`Your OTP is ${otp}`
      });
     return res.json({
        message:"Otp sent to your email",
      })
      }
      catch(err){
        res.status(400).json({message:err.message});
      }


})
authRouter.post("/reset-password",async(req,res)=>{
       try{ 
        const {emailId,otp,newPassword} = req.body;
       
         const user = await User.findOne({emailId});
         if(!user){
          return res.status(400).json({
            message:'user not found'});
         }
          if(user.otp !== parseInt(otp)){
                return res.status(400).json({
                  message:"invalid OTP"
                 })            
          }
          if(Date.now()>user.otpExpires){
           return res.status(400).json({
              message:"OTP expired"
            })
       }
       if(!validator.isStrongPassword(newPassword)){
      return res.status(400).json({
               message:"enter a strong password!"
        })
       }
       const newPasswordHash = await bcrypt.hash(newPassword,10);
       user.password = newPasswordHash;
       user.otp = null;
       user.otpExpires = null;
       await user.save();
     return  res.json({
        message:"password reset successfully"
       })
}
catch(err){
  res.status(400).json({ 
    message:"something went wrong " + err.message,
  }
  )
}
})
module.exports = authRouter;
