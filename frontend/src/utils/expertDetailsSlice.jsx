import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  expertId: null,
  status: "pending",    
  expertise: null,      
  experienceYears: null,
  description: null,
  certifications: null,
  linkedInProfile: null,
  githubProfile: null,
  portfolioUrl: null,
  resumeUrl: null,
  message: null,
  profileUpdated: false,
  // New fields
  languages: [],
  timezone: null,
  schedule: {
    availableDays: [],
    timeSlots: [], // Example: [{ day: "Monday", slots: ["10 AM - 12 PM", "2 PM - 4 PM"] }]
  },
  reviews: [], // Example: [{ reviewer: "John Doe", rating: 4, comment: "Great expert!", date: "2025-01-20" }]
  rating: 0, // Average rating based on reviews
};

const expertDetailsSlice = createSlice({
  name: "expert",
  initialState,
  reducers: {
    updateExpertStatus(state, action) {
      const {
        expertId,
        status,
        expertise,
        experienceYears,
        description,
        certifications,
        linkedInProfile,
        githubProfile,
        portfolioUrl,
        resumeUrl,
        message,
        profileUpdated,
        languages,
        timezone,
        schedule,
        reviews,
        rating,
      } = action.payload;

      state.expertId = expertId;
      state.status = status;
      state.expertise = expertise;
      state.experienceYears = experienceYears;
      state.description = description;
      state.certifications = certifications;
      state.linkedInProfile = linkedInProfile;
      state.githubProfile = githubProfile;
      state.portfolioUrl = portfolioUrl;
      state.resumeUrl = resumeUrl;
      state.message = message;
      state.profileUpdated = profileUpdated;
      state.languages = languages || [];
      state.timezone = timezone || null;
      state.schedule = schedule || { availableDays: [], timeSlots: [] };
      state.reviews = reviews || [];
      state.rating = rating || 0;
    },

    // Update only specific fields
    updateExpertField(state, action) {
      const { field, value } = action.payload;
      state[field] = value;
    },

    // Add a new review
    addReview(state, action) {
      const { reviewer, rating, comment, date } = action.payload;
      state.reviews.push({ reviewer, rating, comment, date });
      // Recalculate average rating
      const totalRatings = state.reviews.reduce((sum, review) => sum + review.rating, 0);
      state.rating = (totalRatings / state.reviews.length).toFixed(1);
    },

    
    clearExpertData() {
      return initialState;
    },
  },
});

export const { updateExpertStatus, updateExpertField, addReview, clearExpertData } = expertDetailsSlice.actions;

export default expertDetailsSlice.reducer;
