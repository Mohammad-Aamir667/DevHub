const connectionRequest = require("../models/connectionRequest");
const Conversation = require("../models/conversation");
const Message = require("../models/message");
const User = require("../models/user");

const chatSocket = (io, socket, socketUserMap) => {
  socket.on("joinRoom", (roomId) => {
    socket.join(roomId);
  });
  socket.on("leaveRoom", (roomId) => {
    socket.leave(roomId);
  });
  socket.on("sendMessage", async (data) => {
  try{

    if(data.conversationId){
      const conversation = await Conversation.findById(data.conversationId);
    if (!conversation) return;
        const { fromUserId, conversationId, messageText, file, fileUrl, timestamp } = data;

     const isParticipant = conversation.participants.some(
        (id) => id.toString() === fromUserId.toString()
      );

      if (!isParticipant) {
        console.warn("Unauthorized message attempt by:", fromUserId);
        return; 
      }
    const message = new Message({
      fromUserId,
      messageText,
      conversation: conversationId,
      file,
      fileUrl,
      timestamp: new Date(),
    });
    await message.save();
    conversation.unreadCount += 1;
    conversation.lastMessage = message._id;
    await conversation.save();
    socket.broadcast.to(conversationId).emit('receiveMessage', { messageText, fromUserId, file, fileUrl, timestamp });
  }

    else{
       const generateRoomId = (fromUserId, toUserId) => {
    return [fromUserId, toUserId].sort().join("_");
  };
      const { fromUserId, toUserId, messageText, file, fileUrl, timestamp } = data;
      const message = new Message({
        fromUserId,
        messageText,
        conversation: null,
        file,
        fileUrl,
        timestamp: new Date(),
      });
      await message.save();
      let conversation = await Conversation.findOne({ participants: { $all: [fromUserId, toUserId] } });

      if (!conversation) {
        conversation = new Conversation({
          participants: [fromUserId, toUserId].sort(),
          lastMessage: message._id,
          unreadCount: 1,
        });
        await conversation.save();
      } else {
        conversation.unreadCount += 1;
        conversation.lastMessage = message._id;
        await conversation.save();
      }
    
      message.conversation = conversation._id;
      await message.save();
       const roomId = generateRoomId(fromUserId._id,toUserId) 
    
      socket.broadcast.to(roomId).emit('receiveMessage', { messageText, fromUserId, file, fileUrl, timestamp });
    }

  

}catch(err){
  console.error("Error handling message:", err);
}
  });
};

module.exports = chatSocket;

