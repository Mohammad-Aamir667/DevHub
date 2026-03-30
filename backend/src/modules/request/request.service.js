const User = require("../../models/user");
const connectionRequest = require("../../models/connectionRequest");

const sendConnectionRequestService = async (fromUserId, toUserId, status) => {
    const allowedStatus = ["ignored", "interested"];

    if (!allowedStatus.includes(status)) {
        throw new Error("Invalid status type " + status);
    }

    const toUser = await User.findById(toUserId);
    if (!toUser) {
        throw new Error("User not found");
    }

    if (fromUserId.toString() === toUserId) {
        throw new Error("You cannot send a request to yourself.");
    }

    const existingConnectionRequest = await connectionRequest.findOne({
        $or: [
            { fromUserId, toUserId },
            { fromUserId: toUserId, toUserId: fromUserId }
        ],
    });

    if (existingConnectionRequest) {
        throw new Error("connection request already exists!!!");
    }

    const newConnectionRequest = new connectionRequest({
        fromUserId,
        toUserId,
        status,
    });

    await newConnectionRequest.save();

    return "Connection Request sent successfully";
};

const reviewConnectionRequestService = async (loggedInUserId, requestId, status) => {
    const allowedStatus = ["accepted", "rejected"];

    if (!allowedStatus.includes(status)) {
        throw new Error("invalid status type " + status);
    }

    const existingConnectionRequest = await connectionRequest.findOne({
        _id: requestId,
        toUserId: loggedInUserId,
        status: "interested"
    });

    if (!existingConnectionRequest) {
        throw new Error("connection request not found");
    }

    existingConnectionRequest.status = status;
    await existingConnectionRequest.save();

    return "save successfully";
};

module.exports = {
    sendConnectionRequestService,
    reviewConnectionRequestService
};