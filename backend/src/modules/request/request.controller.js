const {
    sendConnectionRequestService,
    reviewConnectionRequestService
} = require("./request.service");

const sendConnectionRequest = async (req, res) => {
    try {
        const fromUserId = req.user._id;
        const toUserId = req.params.toUserId.trim();
        const status = req.params.status;

        const message = await sendConnectionRequestService(
            fromUserId,
            toUserId,
            status
        );

        res.send(message);
    } catch (err) {
        if (err.message.includes("Invalid") || err.message.includes("not") || err.message.includes("exists")) {
            return res.status(400).send(err.message);
        }
        res.status(500).send("Server error");
    }
};

const reviewConnectionRequest = async (req, res) => {
    try {
        const loggedInUserId = req.user._id;
        const requestId = req.params.requestId.trim();
        const { status } = req.params;

        const message = await reviewConnectionRequestService(
            loggedInUserId,
            requestId,
            status
        );

        res.send(message);
    } catch (err) {
        if (err.message.includes("invalid") || err.message.includes("not")) {
            return res.status(400).json({ message: err.message });
        }
        console.error("Error reviewing request:", err);
        res.status(500).json({ err: " Server Error" });
    }
};

module.exports = {
    sendConnectionRequest,
    reviewConnectionRequest
};