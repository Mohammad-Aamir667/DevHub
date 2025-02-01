const mongoose = require("mongoose");
const conversationSchema = new mongoose.Schema({
    participants:[{type:mongoose.Schema.Types.ObjectId,ref:"User"}],
    conversationName: { type: String, default: null }, 
    lastMessage: { type: mongoose.Schema.Types.ObjectId, ref: "Message" ,default:null },
    conversationType: { 
      type: String, 
      enum: ["user-user", "group"], 
        default: "user-user"
  },
     unreadCount: { type: Number, default: 0 },  
});

conversationSchema.index({ participants: 1 });

module.exports = mongoose.model("Conversation",conversationSchema);

  