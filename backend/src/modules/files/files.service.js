const User = require("../../models/user");
const connectionRequest = require("../../models/connectionRequest");
const Conversation = require("../../models/conversation");
const { uploadToCloudinary } = require("../../utils/cloudinaryConfig");

const sendFileService = async (fromUserId, chatId, file) => {
    const conversation = await Conversation.findById(chatId);

    if (conversation) {
        const fileUrl = await uploadToCloudinary(file);
        return { data: { url: fileUrl }, status: 200 };
    }

    const toUserId = chatId;

    const toUser = await User.findById(toUserId);
    if (!toUser) {
        return { error: "User not found", status: 400 };
    }

    const existingConnection = await connectionRequest.findOne({
        $or: [
            { fromUserId, toUserId },
            { fromUserId: toUserId, toUserId: fromUserId },
        ],
        status: "accepted",
    });

    if (!existingConnection) {
        return {
            error: "You are not connected to this user.",
            status: 400
        };
    }

    const fileUrl = await uploadToCloudinary(file);

    return { data: { url: fileUrl }, status: 200 };
};

module.exports = {
    sendFileService
};