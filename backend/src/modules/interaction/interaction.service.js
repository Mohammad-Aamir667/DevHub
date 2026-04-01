const ExpertDetails = require("../../models/expertDetails");
const Interaction = require("../../models/interaction");

const USER_SAFE_DATA = "firstName lastName age photoUrl";

const requestHelpService = async (userId, expertId, issueDescription, codeSnippet) => {
    if (!issueDescription) {
        return { error: "Missing required fields", status: 400 };
    }

    if (userId.toString() === expertId.toString()) {
        return { error: "You cannot send a request to yourself.", status: 400 };
    }

    const expert = await ExpertDetails.findOne({ expertId });
    if (!expert) {
        return { error: "Expert not found", status: 400 };
    }

    const existingHelpRequest = await Interaction.findOne({
        userId,
        expertId,
        status: "pending",
    });

    if (existingHelpRequest) {
        return {
            error: "Request help already exists!!!",
            status: 400,
        };
    }

    const newInteraction = new Interaction({
        userId,
        expertId,
        issueDescription,
        codeSnippet,
        status: "pending",
        expertDetailsId: expert._id,
    });

    await newInteraction.save();

    const data = await Interaction.findById(newInteraction._id)
        .populate("expertId", "firstName lastName photoUrl");

    return { data, status: 201 };
};

const reviewRequestService = async (expertId, requestId, status) => {
    const allowedStatus = ["accepted", "declined"];

    if (!allowedStatus.includes(status)) {
        return { error: "invalid status type " + status, status: 400 };
    }

    const existingHelpRequest = await Interaction.findOne({
        _id: requestId,
        expertId,
        status: "pending"
    }).populate("userId", USER_SAFE_DATA);

    if (!existingHelpRequest) {
        return { error: "connection request not found", status: 400 };
    }

    existingHelpRequest.status = status;
    const data = await existingHelpRequest.save();

    return { data, status: 200 };
};

const getUserInteractionsService = async (userId) => {
    return await Interaction.find({ userId })
        .populate("expertId", "firstName lastName photoUrl ");
};

const getExpertPendingService = async (expertId) => {
    return await Interaction.find({ expertId, status: "pending" })
        .populate("userId", USER_SAFE_DATA);
};

const getExpertAcceptedService = async (expertId) => {
    return await Interaction.find({ expertId, status: "accepted" })
        .populate("userId", USER_SAFE_DATA);
};

const getExpertAllService = async (expertId) => {
    return await Interaction.find({ expertId })
        .populate("userId", USER_SAFE_DATA);
};

const resolveRequestService = async (expertId, requestId) => {
    const existingHelpAccepted = await Interaction.findOne({
        _id: requestId,
        expertId,
        status: "accepted"
    }).populate("userId", USER_SAFE_DATA);

    if (!existingHelpAccepted) {
        return { error: "Help request not found", status: 400 };
    }

    existingHelpAccepted.status = "resolved";
    const data = await existingHelpAccepted.save();

    return { data, status: 200 };
};

const getResolvedRequestsService = async (expertId) => {
    return await Interaction.find({ expertId, status: "resolved" })
        .populate("userId", USER_SAFE_DATA);
};

module.exports = {
    requestHelpService,
    reviewRequestService,
    getUserInteractionsService,
    getExpertPendingService,
    getExpertAcceptedService,
    getExpertAllService,
    resolveRequestService,
    getResolvedRequestsService
};