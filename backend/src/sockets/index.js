const { createClient } = require("redis");
const { createAdapter } = require("@socket.io/redis-adapter");
const chatSocket = require("./chatSocket");

const socketManager = async (io) => {
  const socketUserMap = {};

  if (process.env.REDIS_URL) {
    try {
      const pubClient = createClient({
        url: process.env.REDIS_URL,
      });

      const subClient = pubClient.duplicate();

      await pubClient.connect();
      await subClient.connect();

      io.adapter(createAdapter(pubClient, subClient));
      console.log("Redis adapter enabled for Socket.IO");
    } catch (err) {
      console.error("Redis connection failed, falling back to single-instance mode");
      console.error(err.message);
    }
  } else {
    console.log("Redis adapter not enabled (single-instance mode)");
  }

  io.on("connection", (socket) => {
    chatSocket(io, socket, socketUserMap);

    socket.on("disconnect", () => {
      for (let userId in socketUserMap) {
        if (socketUserMap[userId] === socket.id) {
          delete socketUserMap[userId];
        }
      }
    });
  });
};

module.exports = socketManager;
