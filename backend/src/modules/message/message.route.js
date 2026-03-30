const express = require("express");
const messageRouter = express.Router();

const { userAuth } = require("../../middlewares/auth");

const {
    getMessages,
    getConversations,
    createGroupChat
} = require("./message.controller");

messageRouter.get(
    "/messages/:chatId",
    userAuth,
    getMessages
);

messageRouter.get(
    "/conversations",
    userAuth,
    getConversations
);

messageRouter.post(
    "/create-group-chat",
    userAuth,
    createGroupChat
);

module.exports = messageRouter;