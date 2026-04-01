const express = require("express");
const expertRouter = express.Router();

const { userAuth, isAdmin } = require("../../middlewares/auth");

const multer = require("multer");
const upload = multer({ dest: "uploads/" });

const {
    becomeExpert,
    getExpertList,
    reviewExpert,
    getApprovedExperts,
    getExpertDetails
} = require("./expert.controller");

expertRouter.post(
    "/become-expert",
    upload.single("resume"),
    userAuth,
    becomeExpert
);

expertRouter.get(
    "/expert-list",
    userAuth,
    isAdmin,
    getExpertList
);

expertRouter.post(
    "/expert/review/:status/:expertId",
    userAuth,
    isAdmin,
    reviewExpert
);

expertRouter.get(
    "/expert-list/approved",
    userAuth,
    getApprovedExperts
);

expertRouter.get(
    "/expert-details",
    userAuth,
    getExpertDetails
);

module.exports = expertRouter;