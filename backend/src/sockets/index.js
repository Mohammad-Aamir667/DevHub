const { createClient } = require("redis");
const { createAdapter } = require("@socket.io/redis-adapter");
const chatSocket = require("./chatSocket");

const socketManager = async (io) => {
  const socketUserMap = {};

  const pubClient = createClient({
    url: process.env.REDIS_URL || "redis://localhost:6379",
  });

  const subClient = pubClient.duplicate();

  await pubClient.connect();
  await subClient.connect();

  io.adapter(createAdapter(pubClient, subClient));

  console.log("Redis adapter connected for Socket.IO");

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
