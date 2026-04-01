const {
    requestHelpService,
    reviewRequestService,
    getUserInteractionsService,
    getExpertPendingService,
    getExpertAcceptedService,
    getExpertAllService,
    resolveRequestService,
    getResolvedRequestsService
} = require("./interaction.service");

const requestHelp = async (req, res) => {
    try {
        const userId = req.user._id;
        const expertId = req.params.expertId.trim();
        const { issueDescription, codeSnippet } = req.body;

        const result = await requestHelpService(
            userId,
            expertId,
            issueDescription,
            codeSnippet
        );

        if (result?.error) {
            return res.status(result.status).json({ error: result.error });
        }

        res.status(result.status).json(result.data);
    } catch (err) {
        console.error("Error creating interaction:", err);
        res.status(500).json({ err: "Internal Server Error" });
    }
};

const reviewRequest = async (req, res) => {
    try {
        const expertId = req.user._id;
        const { status } = req.params;
        const requestId = req.params.requestId.trim();

        const result = await reviewRequestService(
            expertId,
            requestId,
            status
        );

        if (result?.error) {
            return res.status(result.status).send(result.error);
        }

        res.status(result.status).json(result.data);
    } catch (err) {
        console.error("Error reviewing request:", err);
        res.status(500).json(err);
    }
};

const getUserInteractions = async (req, res) => {
    try {
        const data = await getUserInteractionsService(req.user._id);
        res.status(200).json(data);
    } catch (err) {
        console.error("Error fetching all interactions:", err);
        res.status(500).json(err);
    }
};

const getExpertPending = async (req, res) => {
    try {
        const data = await getExpertPendingService(req.user._id);
        return res.status(200).json(data);
    } catch (err) {
        console.error("Error fetching pending interactions:", err);
        res.status(500).json({ err: "Internal Server Error" });
    }
};

const getExpertAccepted = async (req, res) => {
    try {
        const data = await getExpertAcceptedService(req.user._id);
        return res.status(200).json(data);
    } catch (err) {
        console.error("Error fetching accepted interactions:", err);
        res.status(500).json({ err: "Internal Server Error" });
    }
};

const getExpertAll = async (req, res) => {
    try {
        const data = await getExpertAllService(req.user._id);
        return res.status(200).json(data);
    } catch (err) {
        console.error("Error fetching all interactions:", err);
        res.status(500).json({ err: "Internal Server Error" });
    }
};

const resolveRequest = async (req, res) => {
    try {
        const expertId = req.user._id;
        const requestId = req.params.requestId.trim();

        const result = await resolveRequestService(expertId, requestId);

        if (result?.error) {
            return res.status(result.status).json({ message: result.error });
        }

        res.status(result.status).json(result.data);
    } catch (err) {
        console.error("Error resolving request:", err);
        res.status(500).json(err);
    }
};

const getResolvedRequests = async (req, res) => {
    try {
        const data = await getResolvedRequestsService(req.user._id);
        return res.status(200).json(data);
    } catch (err) {
        console.error("Error fetching resolved interactions:", err);
        res.status(500).json({ err: "Internal Server Error" });
    }
};

module.exports = {
    requestHelp,
    reviewRequest,
    getUserInteractions,
    getExpertPending,
    getExpertAccepted,
    getExpertAll,
    resolveRequest,
    getResolvedRequests
};