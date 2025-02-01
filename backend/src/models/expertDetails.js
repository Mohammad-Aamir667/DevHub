const mongoose = require("mongoose");
const validator = require("validator");

const expertDetailsSchema = new mongoose.Schema(
  {
    expertId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    expertise: {
      type: [String],
      required: true,
      validate(value) {
        if (value.length === 0) {
          throw new Error("Expertise must include at least one field");
        }
      },
    },
    experienceYears: {
      type: Number,
      required: true,
      min: 0,
    },
    description: {
      type: String,
      default: "",
      maxLength: 300,
    },
    certifications: {
      type: [String],
    },
    linkedInProfile: {
      type: String,
      required: true,
      validate(value) {
        if (!validator.isURL(value)) {
          throw new Error("Invalid URL");
        }
      },
    },
    githubProfile: {
      type: String,
      required: true,
      validate(value) {
        if (!validator.isURL(value)) {
          throw new Error("Invalid URL");
        }
      },
    },
    portfolioUrl: {
      type: String,
      validate(value) {
        if (value && !validator.isURL(value)) {
          throw new Error("Invalid URL");
        }
      },
    },
    resumeUrl: {
      type: String,
      required: true,
      validate(value) {
        if (!validator.isURL(value)) {
          throw new Error("Invalid URL");
        }
      },
    },
    status: {
      type: String,
      default: "pending",
      enum: ["pending", "approved", "rejected"],
    },
    appliedAt: {
      type: Date,
      default: Date.now,
    },
    reviewedAt: {
      type: Date,
    },
    reviewedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    // Additional fields
    languages: {
      type: [String],
      default: [],
    },
    timezone: {
      type: String,
      default: "UTC",
    },
    schedule: {
      availableDays: {
        type: [String],
        default: [], // e.g., ["Monday", "Wednesday"]
      },
      timeSlots: {
        type: [
          {
            day: { type: String, required: true }, // e.g., "Monday"
            slots: { type: [String], required: true }, // e.g., ["10 AM - 12 PM", "2 PM - 4 PM"]
          },
        ],
        default: [],
      },
    },
    reviews: {
      type: [
        {
          reviewer: { type: String, required: true },
          rating: { type: Number, required: true, min: 0, max: 5 },
          comment: { type: String, maxLength: 500 },
          date: { type: Date, default: Date.now },
        },
      ],
      default: [],
    },
    rating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("ExpertDetails", expertDetailsSchema);
