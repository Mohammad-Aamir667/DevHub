const express = require("express");
const router = express.Router();
const authController = require("./auth.controller");

router.post("/signup", authController.signup);
router.post("/verify-email", authController.verifyEmail);
router.post("/login", authController.login);
router.post("/logout", authController.logout);
router.post("/forget-password", authController.forgetPassword);
router.post("/reset-password", authController.resetPassword);
module.exports = router;
