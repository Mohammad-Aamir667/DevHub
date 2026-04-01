const express = require("express");
const profileRouter = express.Router();

const { userAuth } = require("../../middlewares/auth");

const multer = require("multer");

const upload = multer({ dest: "uploadImage/" });
const upload1 = multer({ dest: "uploadsResume/" });

const {
    getProfile,
    editProfile,
    uploadImage,
    editExpertProfile
} = require("./profile.controller");

profileRouter.get(
    "/profile",
    userAuth,
    getProfile
);

profileRouter.post(
    "/editProfile",
    userAuth,
    editProfile
);

profileRouter.post(
    "/uploadImage",
    userAuth,
    upload.single("file"),
    uploadImage
);

profileRouter.post(
    "/edit-expert-profile",
    upload1.single("resumeUrl"),
    userAuth,
    editExpertProfile
);

module.exports = profileRouter;