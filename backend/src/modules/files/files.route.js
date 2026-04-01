const express = require("express");
const fileRouter = express.Router();

const multer = require("multer");
const upload = multer({ dest: "uploads/" });

const { userAuth } = require("../../middlewares/auth");

const { sendFile } = require("./file.controller");

fileRouter.post(
    "/file-send/:chatId",
    upload.single("file"),
    userAuth,
    sendFile
);

module.exports = fileRouter;