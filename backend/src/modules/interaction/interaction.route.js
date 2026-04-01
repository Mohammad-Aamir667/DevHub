const express = require("express");
const interactionRouter = express.Router();

const { userAuth } = require("../../middlewares/auth");

const {
    requestHelp,
    reviewRequest,
    getUserInteractions,
    getExpertPending,
    getExpertAccepted,
    getExpertAll,
    resolveRequest,
    getResolvedRequests
} = require("./interaction.controller");

interactionRouter.post(
    "/request-help/:expertId",
    userAuth,
    requestHelp
);

interactionRouter.post(
    "/request-review/:status/:requestId",
    userAuth,
    reviewRequest
);

interactionRouter.get(
    "/user-interactions",
    userAuth,
    getUserInteractions
);

interactionRouter.get(
    "/expert/pending-requests",
    userAuth,
    getExpertPending
);

interactionRouter.get(
    "/expert/accepted-requests",
    userAuth,
    getExpertAccepted
);

interactionRouter.get(
    "/expert/all-requests",
    userAuth,
    getExpertAll
);

interactionRouter.post(
    "/request-resolved/:requestId",
    userAuth,
    resolveRequest
);

interactionRouter.get(
    "/expert/resolved-requests",
    userAuth,
    getResolvedRequests
);

module.exports = interactionRouter;