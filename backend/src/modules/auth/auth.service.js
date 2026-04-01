// auth.service.js
const bcrypt = require("bcrypt");
const User = require("../../models/user");
const { signupEmailTemplate, forgetPasswordEmailTemplate } = require("../../utils/emailTemplates");
const { generateOtp } = require("../../utils/generateOtp");
const sendMail = require("../../utils/sendMail");
const { validateSignUpData } = require("../../validation/auth.validation");

exports.signup = async (data) => {

    const validation = validateSignUpData(data);
    if (!validation.isValid) {
        return {
            statusCode: 400,
            response: { message: validation.message },
        };
    }

    let { firstName, lastName, emailId, password } = data;
    emailId = emailId.toLowerCase();

    const existingUser = await User.findOne({ emailId });

    const otp = generateOtp();
    const expiry = Date.now() + 10 * 60 * 1000;

    if (existingUser && existingUser.isVerified) {
        return {
            statusCode: 409,
            response: {
                status: "verified",
                message: "Email already registered",
            },
        };
    }

    if (existingUser && !existingUser.isVerified) {
        existingUser.signupOTP = otp;
        existingUser.signupOTPExpires = expiry;
        await existingUser.save();
        const mailResponse = await sendMail(emailId, "Verify Email", signupEmailTemplate(otp));
        if (!mailResponse.success) {
            return {
                statusCode: 200,
                response: {
                    status: "mail-failed",
                    message: "Verification mail may be delayed. Please try resending the OTP later.",

                },
            };
        }
        return {
            statusCode: 200,
            response: {
                status: "not-verified",
                message: "Account exists but not verified. OTP resent successfully.",

            },
        };
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const newUser = new User({
        firstName,
        lastName,
        emailId,
        password: passwordHash,
        isVerified: false,
        signupOTP: otp,
        signupOTPExpires: expiry,
    });
    await newUser.save();

    const mailResponse = await sendMail(emailId, "Verify Email", signupEmailTemplate(otp));

    if (!mailResponse.success) {
        return {
            statusCode: 201,
            response: {
                status: "mail-failed",
                message: "Account created, but verification mail may be delayed. Please try again later.",
            },
        };
    }
    return {
        statusCode: 201,
        response: {
            status: "new-user",
            message: "Account created. Verification OTP sent successfully.",

        },
    };
}
exports.verifyEmail = async (data) => {

    let { emailId, otp } = data;
    emailId = emailId.toLowerCase();

    const user = await User.findOne({ emailId });

    if (!user || user.signupOTP !== parseInt(otp)) {
        return {
            statusCode: 400,
            response: {
                message: "Verification failed. Please check your email and OTP.",
            },
        };
    }

    if (Date.now() > user.signupOTPExpires) {
        return {
            statusCode: 400,
            response: {
                message: "OTP expired. Please request a new one.",
            },
        };
    }

    user.signupOTP = null;
    user.signupOTPExpires = null;
    user.isVerified = true;

    await user.save();

    const token = await user.getJWT();

    const userData = user.toObject();
    delete userData.password;

    return {
        statusCode: 200,
        response: userData,
        cookie: {
            token,
        },
    };
};
exports.login = async (data) => {

    let { emailId, password } = data;

    if (!emailId || !password) {
        return {
            statusCode: 400,
            response: {
                message: "emailId and password are required",
            },
        };
    }

    emailId = emailId.toLowerCase();

    const user = await User.findOne({ emailId });

    if (!user || !user.isVerified) {
        return {
            statusCode: 401,
            response: {
                message: "Invalid credentials",
            },
        };
    }

    const isPasswordValid = await user.validatePassword(password);

    if (!isPasswordValid) {
        return {
            statusCode: 401,
            response: {
                message: "Invalid credentials",
            },
        };
    }

    const token = await user.getJWT();

    const userData = user.toObject();
    delete userData.password;

    return {
        statusCode: 200,
        response: userData,
        cookie: {
            token,
        },
    };
};
exports.logout = async () => {
    return {
        statusCode: 200,
        response: {
            message: "Logout successful",
        },
    };
};
exports.forgetPassword = async (data) => {
    const { emailId } = data;

    if (!emailId || !validator.isEmail(emailId)) {
        return {
            statusCode: 400,
            response: { message: "Please enter a valid email address." },
        };
    }

    const user = await User.findOne({ emailId });

    const genericResponse = {
        success: true,
        message: "If this email is registered, an OTP has been sent to your inbox.",
    };

    if (!user || !user.isVerified) {
        return {
            statusCode: 200,
            response: genericResponse,
        };
    }



    const otp = generateOtp();
    user.resetPasswordOTP = otp;
    user.resetPasswordOTPExpires = Date.now() + 10 * 60 * 1000;
    await user.save();

    const htmlContent = forgetPasswordEmailTemplate(otp);

    const mailResponse = await sendMail(emailId, "Password Reset OTP", htmlContent);

    if (!mailResponse.success) {
        return {
            statusCode: 200,
            response: genericResponse,
        };
    }

    return {
        statusCode: 200,
        response: genericResponse,
    };
};
exports.resetPassword = async (data) => {
    const { emailId, otp, newPassword } = data;

    if (!emailId || !validator.isEmail(emailId)) {
        return {
            statusCode: 400,
            response: { message: "Please enter a valid email address." },
        };
    }

    const user = await User.findOne({ emailId });

    const genericError = { message: "Invalid or expired OTP. Please try again." };

    if (!user || !user.resetPasswordOTP) {
        return {
            statusCode: 400,
            response: genericError,
        };
    }

    if (user.resetPasswordOTP !== parseInt(otp)) {
        return {
            statusCode: 400,
            response: genericError,
        };
    }

    if (Date.now() > user.resetPasswordOTPExpires) {
        return {
            statusCode: 400,
            response: { message: "Your OTP has expired. Please request a new one." },
        };
    }

    if (!validator.isStrongPassword(newPassword)) {
        return {
            statusCode: 400,
            response: { message: "Please enter a strong password." },
        };
    }

    const newPasswordHash = await bcrypt.hash(newPassword, 10);

    user.password = newPasswordHash;
    user.resetPasswordOTP = null;
    user.resetPasswordOTPExpires = null;

    await user.save();

    return {
        statusCode: 200,
        response: {
            success: true,
            message: "Password reset successfully. You can now log in with your new password.",
        },
    };
};