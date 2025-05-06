const express = require("express");
const {userAuth} = require("../middlewares/auth");
const Message = require("../models/message");
const messageRouter = express.Router();
const User = require("../models/user")
const Conversation = require("../models/conversation");
const connectionRequest = require("../models/connectionRequest");
messageRouter.get('/messages/:chatId',userAuth, async (req, res) => {
    const fromUserId = req.user._id;
    const chatId = req.params.chatId.trim();
    try{ 
        const conversation = await Conversation.findById(chatId);
        if (conversation) {
          // If it's a valid conversationId, fetch messages for this conversation
          const messages = await Message.find({ conversation: conversation._id }).populate("fromUserId","firstName lastName").sort({ timestamp: 1 });
          return res.json(messages);
        }
        const toUserId = chatId;
        const toUser = await User.findById(toUserId);
             if(!toUser){
        return res.status(404).json("User not found");
        }
    // const existingConnection = await connectionRequest.findOne({
    //                        $or: [
    //                          { fromUserId: fromUserId, toUserId: toUserId },
    //                          { fromUserId: toUserId, toUserId: fromUserId },
    //                        ],
    //                        status: "accepted", 
    //                      });
    //                      if(!existingConnection){
    //                       return res.status(400).send("errorMessage", "You are not connected to this user.");  
         //                }
                         const conversation1 = await Conversation.findOne({
                            participants: { $all: [fromUserId, toUserId] },
                          });
                      
                        //   if (!conversation) {
                        //     return res.status(404).send("No conversation found");
                        //  }
        const messages = await Message.find({ conversation: conversation1._id }).populate("fromUserId","firstName lastName").sort({
                  timestamp: 1,
                });    

    res.json(messages);
}
   catch(err){
    res.status(500).send(err);
   }
});
messageRouter.get('/conversations',userAuth,async (req,res)=>{
  try {
    
    const fromUserId = req.user._id; 
    const conversations = await Conversation.find({ 
        participants: fromUserId 
    }).populate("participants", "firstName photoUrl lastName").populate( "lastMessage","messageText timestamp fileUrl"); 
    
    res.status(200).json(conversations);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch conversations", error });
  }
});
messageRouter.post('/create-group-chat', userAuth, async (req, res) => {
  try {
      const { groupName, participantIds } = req.body;
      const fromUserId = req.user.id;
            if (participantIds.length < 1) {
          return res.status(400).json({ message: "A group must have at least 2 participants." });
      }
      const existingParticipantsConnections = await Promise.all(
        participantIds.map(async (participantId) => {
          const toUserId = participantId;
            return await connectionRequest.findOne({ 
              $or:[
                {fromUserId,toUserId},
                {fromUserId:toUserId,toUserId:fromUserId}
                   ],
                status: "accepted"
            });
        })
    );

     const allConnected = existingParticipantsConnections.every(connection => connection !== null);

    if (!allConnected) {
        return res.status(400).json({ message: "Some participants are not connected or accepted." });
    }
    const existingGroup = await Conversation.findOne({
      participants: [fromUserId, ...participantIds].sort(), // ✅ Add all participants including the creator
      conversationType: "group",   
      conversationName: groupName,
    });

    if(existingGroup) {
        return res.status(400).json({ message: `${groupName} group already exists! Choose another group name.` });
    }

    // Create the conversation with the logged-in user + selected participants
    const newGroup = new Conversation({
      participants: [fromUserId, ...participantIds].sort(), // ✅ Add all participants including the creator
      conversationType: "group",
      conversationName: groupName,
    });

    await newGroup.save();

    return res.status(201).json(newGroup);
  } catch (err) {
      res.status(500).json({ message: err.message });
  }
});



module.exports = messageRouter;
