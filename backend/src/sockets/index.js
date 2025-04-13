const chatSocket = require("./chatSocket");
//const reviewSocket = require("./reviewSocket");

const socketManager = (io) => {
  const socketUserMap = {}; // Maintain user mappings for chat

  io.on("connection", (socket) => {
    

    // Initialize each module with the same `io` and `socket`
    chatSocket(io, socket, socketUserMap);
    //reviewSocket(io, socket);

    socket.on("disconnect", () => {
      console.log(`User disconnected: ${socket.id}`);
      for (let userId in socketUserMap) {
        if (socketUserMap[userId] === socket.id) {
          delete socketUserMap[userId];
        }
      }
    });
  });
};

module.exports = socketManager;
