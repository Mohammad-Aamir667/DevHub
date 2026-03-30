const {
    getMessagesService,
    getConversationsService,
    createGroupChatService
} = require("./message.service");

const getMessages = async (req, res) => {
    const fromUserId = req.user._id;
    const chatId = req.params.chatId.trim();

    try {
        const result = await getMessagesService(fromUserId, chatId);

        if (result?.error) {
            return res.status(result.status).json(result.error);
        }

        res.json(result);
    } catch (err) {
        res.status(500).send(err);
    }
};

const getConversations = async (req, res) => {
    try {
        const fromUserId = req.user._id;

        const conversations = await getConversationsService(fromUserId);

        res.status(200).json(conversations);
    } catch (error) {
        res.status(500).json({ message: "Failed to fetch conversations", error });
    }
};

const createGroupChat = async (req, res) => {
    try {
        const { groupName, participantIds } = req.body;
        const fromUserId = req.user.id;

        const result = await createGroupChatService(
            fromUserId,
            groupName,
            participantIds
        );

        if (result?.error) {
            return res.status(result.status).json({ message: result.error });
        }

        res.status(result.status).json(result.data);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

module.exports = {
    getMessages,
    getConversations,
    createGroupChat
};