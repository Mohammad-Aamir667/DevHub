const express = require("express");
const superAdminRouter = express.Router();

const { userAuth, isSuperAdmin } = require("../../middlewares/auth");

const {
    promoteToAdmin,
    getAllUsers
} = require("./superadmin.controller");

superAdminRouter.put(
    "/promote-to-admin/:userId",
    userAuth,
    isSuperAdmin,
    promoteToAdmin
);

superAdminRouter.get(
    "/admin/users",
    userAuth,
    isSuperAdmin,
    getAllUsers
);

module.exports = superAdminRouter;