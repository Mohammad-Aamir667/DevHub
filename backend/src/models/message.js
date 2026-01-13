const mongoose = require("mongoose");
const messageSchema = new mongoose.Schema({
  fromUserId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User',
  },
  conversation: { type: mongoose.Schema.Types.ObjectId, ref: 'Conversation' },
  messageText: {
    type: String,
  },
  file: {
    type: String,

  },
  fileName: {
    type: String,
    default: '',
  },
  fileType: {
    type: String,
    // enum: ['image', 'audio', 'pdf', 'video', 'text'],
    // default: 'text',
  },
  fileUrl: {
    type: String,
    default: '',
  },
  seenBy: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  timestamp: {
    type: Date,
    default: Date.now,
  },
});
messageSchema.index({ conversation: 1, timestamp: -1 });


module.exports = mongoose.model("Message", messageSchema);