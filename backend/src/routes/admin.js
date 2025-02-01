const express = require("express");
const { userAuth, isSuperAdmin } = require("../middlewares/auth");
const User = require("../models/user");
const adminRouter = express.Router();

adminRouter.put("/promote-to-admin/:userId", userAuth, isSuperAdmin, async (req, res) => {
    try {
        const userId = req.params.userId;
        const user = await User.findById(userId);

        if (!user) return res.status(404).json({ message: "User not found" });
        user.role = "admin"; 
        await user.save();
        res.status(200).json({ message: `${user.firstName} is now an admin.` });
    } catch (error) {
        res.status(500).json({ message: "An error occurred.", error: error.message });
    }
});
adminRouter.get("/admin/users", userAuth, isSuperAdmin, async (req, res) => {
    try {
        const users = await User.find({}, "firstName lastName emailId role"); 
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ message: "Failed to fetch users.", error: error.message });
    }
});


module.exports = adminRouter;
