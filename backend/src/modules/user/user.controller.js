const {
    getReceivedRequestsService,
    getConnectionsService,
    getFeedService
} = require("./user.service");

const getReceivedRequests = async (req, res) => {
    try {
        const data = await getReceivedRequestsService(req.user._id);

        res.json({ connectionRequests: data });
    } catch (err) {
        console.error(err);
        res.status(500).send("Server error");
    }
};

const getConnections = async (req, res) => {
    try {
        const data = await getConnectionsService(req.user._id);

        res.json({ data });
    } catch (err) {
        console.error(err);
        res.status(500).send("Server error");
    }
};

const getFeed = async (req, res) => {
    try {
        console.log(req.query);

        const page = parseInt(req.query.page) || 1;

        let limit = parseInt(req.query.limit) || 10;
        limit = limit > 10 ? 10 : limit;

        const users = await getFeedService(req.user._id, page, limit);

        res.json(users);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

module.exports = {
    getReceivedRequests,
    getConnections,
    getFeed
};