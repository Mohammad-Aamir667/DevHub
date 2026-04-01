const {
    becomeExpertService,
    getExpertListService,
    reviewExpertService,
    getApprovedExpertsService,
    getExpertDetailsService
} = require("./expert.service");

const becomeExpert = async (req, res) => {
    try {
        const expertId = req.user._id;

        const result = await becomeExpertService(
            expertId,
            req.file,
            req.body
        );

        if (result?.error) {
            return res.status(result.status).json(result.error);
        }

        return res.status(result.status).json(result.data);
    } catch (err) {
        res.status(500).json(err);
    }
};

const getExpertList = async (req, res) => {
    try {
        const data = await getExpertListService();
        res.status(200).json(data);
    } catch (error) {
        res.status(500).json({
            message: "Failed to fetch users.",
            error: error.message
        });
    }
};

const reviewExpert = async (req, res) => {
    try {
        const { status } = req.params;
        const expertId = req.params.expertId.trim();

        const result = await reviewExpertService(expertId, status);

        if (result?.error) {
            return res.status(result.status).send(result.error);
        }

        res.status(result.status).json(result.data);
    } catch (error) {
        res.status(500).json({
            message: "Failed to fetch users.",
            error: error.message
        });
    }
};

const getApprovedExperts = async (req, res) => {
    try {
        const data = await getApprovedExpertsService(req.user._id);
        res.status(200).json(data);
    } catch (error) {
        res.status(500).json({
            message: "Failed to fetch users.",
            error: error.message
        });
    }
};

const getExpertDetails = async (req, res) => {
    try {
        const result = await getExpertDetailsService(req.user._id);
        return res.status(result.status).json(result.data);
    } catch (error) {
        res.status(500).json({
            message: "Failed to fetch user details.",
            error: error.message
        });
    }
};

module.exports = {
    becomeExpert,
    getExpertList,
    reviewExpert,
    getApprovedExperts,
    getExpertDetails
};