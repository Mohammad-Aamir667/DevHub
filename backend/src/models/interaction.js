const mongoose = require("mongoose");

const interactionSchema = new mongoose.Schema(
  {
    userId: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: "User",
      required: true,
    },
    expertId: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: "User", 
      required: true,
    },
    expertDetailsId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ExpertDetails", 
      required:true,
    },
    type: {
      type: String,
      enum: ["inquiry", "consultation", "feedback", "message", "review", "seek_help"], // Added 'seek_help' type
      default: "review", // Default to 'review' but 'seek_help' will be used for help requests
    },
    issueDescription: { 
      type: String, 
      required: true,//later make it conditonal true
      maxLength:300
    },
    codeSnippet: { 
      type: String, // Optional for live interactions or chat-based help
    },
    status: { 
      type: String, 
      enum: ["pending", "accepted", "resolved","declined"], 
      default: "pending",
    },
    message: {
      type: String, // Message or details for other types of interaction
      trim: true,
    },
    timestamp: { 
      type: Date, 
      default: Date.now, 
    },
    review: {
      rating: {
        type: Number, // Rating out of 5
        min: 1,
        max: 5,
      },
      comment: {
        type: String, // Review comment
        trim: true,
      },
    },
    paymentDetails: {
      amount: {
        type: Number, // Payment amount if applicable
      },
      paymentStatus: {
        type: String,
        enum: ["pending", "completed", "failed"], // Payment status
        default: "pending",
      },
    },
  },
  { timestamps: true } // Automatically add createdAt and updatedAt fields
);

module.exports = mongoose.model("Interaction", interactionSchema);
