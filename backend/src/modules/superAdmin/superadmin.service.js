const User = require("../../models/user");

const promoteToAdminService = async (userId) => {
    const user = await User.findById(userId);

    if (!user) {
        return { error: "User not found", status: 404 };
    }

    user.role = "admin";
    await user.save();

    return {
        message: `${user.firstName} is now an admin.`,
        status: 200
    };
};

const getAllUsersService = async () => {
    const users = await User.find({}, "firstName lastName emailId role");
    return users;
};

module.exports = {
    promoteToAdminService,
    getAllUsersService
};