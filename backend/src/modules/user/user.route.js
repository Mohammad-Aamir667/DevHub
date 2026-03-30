const express = require("express");
const userRouter = express.Router();

const { userAuth } = require("../../middlewares/auth");

const {
    getReceivedRequests,
    getConnections,
    getFeed
} = require("./user.controller");

userRouter.get("/user/requests/received", userAuth, getReceivedRequests);

userRouter.get("/user/connection", userAuth, getConnections);

userRouter.get("/feed", userAuth, getFeed);

module.exports = userRouter;