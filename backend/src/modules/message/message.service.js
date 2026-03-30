const Message = require("../../models/message");
const User = require("../../models/user");
const Conversation = require("../../models/conversation");
const connectionRequest = require("../../models/connectionRequest");

const getMessagesService = async (fromUserId, chatId) => {
    const conversation = await Conversation.findById(chatId);

    if (conversation) {
        const messages = await Message.find({ conversation: conversation._id })
            .populate("fromUserId", "firstName lastName")
            .sort({ timestamp: 1 });

        return messages;
    }

    const toUserId = chatId;
    const toUser = await User.findById(toUserId);

    if (!toUser) {
        return { error: "User not found", status: 404 };
    }

    const conversation1 = await Conversation.findOne({
        participants: { $all: [fromUserId, toUserId] },
    });

    const messages = await Message.find({ conversation: conversation1._id })
        .populate("fromUserId", "firstName lastName")
        .sort({ timestamp: 1 });

    return messages;
};

const getConversationsService = async (fromUserId) => {
    const conversations = await Conversation.find({
        participants: fromUserId
    })
        .populate("participants", "firstName photoUrl lastName")
        .populate("lastMessage", "messageText timestamp fileUrl");

    return conversations;
};

const createGroupChatService = async (fromUserId, groupName, participantIds) => {
    if (participantIds.length < 1) {
        return { error: "A group must have at least 2 participants.", status: 400 };
    }

    const existingParticipantsConnections = await Promise.all(
        participantIds.map(async (participantId) => {
            const toUserId = participantId;
            return await connectionRequest.findOne({
                $or: [
                    { fromUserId, toUserId },
                    { fromUserId: toUserId, toUserId: fromUserId }
                ],
                status: "accepted"
            });
        })
    );

    const allConnected = existingParticipantsConnections.every(connection => connection !== null);

    if (!allConnected) {
        return { error: "Some participants are not connected or accepted.", status: 400 };
    }

    const existingGroup = await Conversation.findOne({
        participants: [fromUserId, ...participantIds].sort(),
        conversationType: "group",
        conversationName: groupName,
    });

    if (existingGroup) {
        return {
            error: `${groupName} group already exists! Choose another group name.`,
            status: 400
        };
    }

    const newGroup = new Conversation({
        participants: [fromUserId, ...participantIds].sort(),
        conversationType: "group",
        conversationName: groupName,
    });

    await newGroup.save();

    return { data: newGroup, status: 201 };
};

module.exports = {
    getMessagesService,
    getConversationsService,
    createGroupChatService
};