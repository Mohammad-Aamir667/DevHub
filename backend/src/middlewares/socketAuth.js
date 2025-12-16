const jwt = require("jsonwebtoken");

const socketAuth = (socket, next) => {
    try {
        // Get token from client (via handshake)
        const token =
            socket.handshake.auth?.token ||
            socket.handshake.headers?.authorization?.split(" ")[1];

        if (!token) {
            console.log("❌ No token provided for socket connection");
            return next(new Error("Authentication error"));
        }

        // Verify JWT token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Attach user info to socket for future use
        socket.user = decoded;

        console.log("✅ Socket authenticated:", decoded.id);
        next(); // Proceed to connection
    } catch (error) {
        console.log(" Socket authentication failed:", error.message);
        next(new Error("Authentication error"));
    }
};

module.exports = socketAuth;
