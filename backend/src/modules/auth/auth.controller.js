// auth.controller.js
const authService = require("./auth.service");

exports.signup = async (req, res) => {
    try {
        const result = await authService.signup(req.body);
        return res.status(result.statusCode).json(result.response);
    } catch (err) {
        console.error("Signup error:", err);
        return res.status(500).json({
            message: "Internal server error",
        });
    }
};
exports.verifyEmail = async (req, res) => {
    try {
        const result = await authService.verifyEmail(req.body);

        if (result.cookie) {
            res.cookie("token", result.cookie.token, {
                httpOnly: true,
                secure: true,
                sameSite: "none",
            });
        }

        return res.status(result.statusCode).json(result.response);

    } catch (err) {
        console.error("Verify email error:", err);

        return res.status(500).json({
            message: "Something went wrong. Please try again later.",
        });
    }
};
exports.login = async (req, res) => {
    try {
        const result = await authService.login(req.body);

        if (result.cookie) {
            res.cookie("token", result.cookie.token, {
                httpOnly: true,
                secure: true,
                sameSite: "none",
            });
        }

        return res.status(result.statusCode).json(result.response);

    } catch (err) {
        console.error("Login error:", err);

        return res.status(500).json({
            message: "Server error",
        });
    }
};
exports.logout = async (req, res) => {
    try {
        const result = await authService.logout();

        res.cookie("token", "", {
            httpOnly: true,
            secure: true,
            sameSite: "None",
            expires: new Date(0),
            path: "/",
        });

        return res.status(result.statusCode).json(result.response);

    } catch (err) {
        console.error("Logout error:", err);

        return res.status(500).json({
            message: "Logout failed",
        });
    }
};
exports.forgetPassword = async (req, res) => {
    try {
        const result = await authService.forgetPassword(req.body);
        return res.status(result.statusCode).json(result.response);
    } catch (err) {
        console.error("Forget password error:", err);
        return res.status(500).json({
            message: "Something went wrong while processing your request. Please try again later.",
        });
    }
};

exports.resetPassword = async (req, res) => {
    try {
        const result = await authService.resetPassword(req.body);
        return res.status(result.statusCode).json(result.response);
    } catch (err) {
        console.error("Reset password error:", err);
        return res.status(500).json({
            message: "Something went wrong while resetting your password. Please try again later.",
        });
    }
};