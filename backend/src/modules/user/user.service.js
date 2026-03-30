const connectionRequest = require("../../models/connectionRequest");
const User = require("../../models/user");

const USER_SAFE_DATA = "firstName lastName age gender about skills photoUrl";

const getReceivedRequestsService = async (loggedInUserId) => {
    return await connectionRequest.find({
        toUserId: loggedInUserId,
        status: "interested"
    })
        .populate("fromUserId", USER_SAFE_DATA)
        .populate("toUserId", USER_SAFE_DATA);
};

const getConnectionsService = async (loggedInUserId) => {
    const connectionRequests = await connectionRequest.find({
        $or: [
            { toUserId: loggedInUserId, status: "accepted" },
            { fromUserId: loggedInUserId, status: "accepted" },
        ]
    })
        .populate("fromUserId", USER_SAFE_DATA)
        .populate("toUserId", USER_SAFE_DATA);

    return connectionRequests.map((row) => {
        if (row.fromUserId._id.toString() === loggedInUserId.toString()) {
            return row.toUserId;
        }
        return row.fromUserId;
    });
};

const getFeedService = async (loggedInUser, page, limit) => {
    const connectionRequests = await connectionRequest.find({
        $or: [
            { fromUserId: loggedInUser },
            { toUserId: loggedInUser }
        ]
    }).select("fromUserId toUserId");

    const hideUsersFromFeed = new Set();

    connectionRequests.forEach((req) => {
        hideUsersFromFeed.add(req.fromUserId.toString());
        hideUsersFromFeed.add(req.toUserId.toString());
    });

    const skip = (page - 1) * limit;

    return await User.find({
        $and: [
            { _id: { $nin: Array.from(hideUsersFromFeed) } },
            { _id: { $ne: loggedInUser._id } }
        ]
    })
        .select(USER_SAFE_DATA)
        .skip(skip)
        .limit(limit);
};

module.exports = {
    getReceivedRequestsService,
    getConnectionsService,
    getFeedService
};