const jwt = require("jsonwebtoken");

const cookieParser = require("cookie");

const socketAuth = (socket, next) => {
    try {
        const cookies = cookieParser.parse(socket.handshake.headers.cookie || "");
        const token = cookies.token; // your cookie name

        if (!token) return next(new Error("No token"));

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        socket.user = decoded;
        next();
    } catch (err) {
        next(new Error("Authentication error"));
    }
};


module.exports = socketAuth;
