const { sendFileService } = require("./files.service");

const sendFile = async (req, res) => {
    try {
        const fromUserId = req.user._id;
        const chatId = req.params.chatId.trim();

        console.log("file", req.file);

        const result = await sendFileService(
            fromUserId,
            chatId,
            req.file
        );

        if (result?.error) {
            return res.status(result.status).send(result.error);
        }

        res.json(result.data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = {
    sendFile
};