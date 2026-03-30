const {
    promoteToAdminService,
    getAllUsersService
} = require("./superadmin.service");

const promoteToAdmin = async (req, res) => {
    try {
        const userId = req.params.userId;

        const result = await promoteToAdminService(userId);

        if (result.error) {
            return res.status(result.status).json({ message: result.error });
        }

        res.status(result.status).json({ message: result.message });
    } catch (error) {
        res.status(500).json({
            message: "An error occurred.",
            error: error.message
        });
    }
};

const getAllUsers = async (req, res) => {
    try {
        const users = await getAllUsersService();
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({
            message: "Failed to fetch users.",
            error: error.message
        });
    }
};

module.exports = {
    promoteToAdmin,
    getAllUsers
};