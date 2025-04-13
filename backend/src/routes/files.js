const express = require("express");
const multer = require("multer");
const { uploadToCloudinary } = require("../utils/cloudinaryConfig");
const User = require("../models/user");
const connectionRequest = require("../models/connectionRequest");
const { userAuth } = require("../middlewares/auth");
const Conversation = require("../models/conversation");

const fileRouter = express.Router();
const upload = multer({ dest: "uploads/" });

fileRouter.post("/file-send/:chatId", upload.single("file"), userAuth, async (req, res) => {
  try {
    const fromUserId = req.user._id;
    const chatId = req.params.chatId.trim();
     const conversation = await Conversation.findById(chatId);
     console.log("file",req.file);
     if(conversation){
     
      const fileUrl = await uploadToCloudinary(req.file);
     return res.json({ url: fileUrl });
     }
     const toUserId = chatId;
    const toUser = await User.findById(toUserId);
    if (!toUser) {
      return res.status(400).send("User not found");
    }
    const existingConnection = await connectionRequest.findOne({
      $or: [
        { fromUserId, toUserId },
        { fromUserId: toUserId, toUserId: fromUserId },
      ],
      status: "accepted",
    });

    if (!existingConnection) {
      return res.status(400).send("You are not connected to this user.");
    }
    const fileUrl = await uploadToCloudinary(req.file);
    res.json({ url: fileUrl });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = fileRouter;
