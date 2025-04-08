import { createSlice } from "@reduxjs/toolkit";

const expertSlice = createSlice({
  name: "expert",
  initialState: [],
  reducers: {
    setExpertInteractions: (state, action) => {
      return action.payload;
    },
    updateRequestStatus: (state, action) => {
      const { requestId, newStatus } = action.payload;
      const request = state.find((req) => req._id === requestId);
      if (request) {
        request.status = newStatus; 
      }
    },
  },
});

export const { setExpertInteractions, updateRequestStatus } = expertSlice.actions;
export default expertSlice.reducer;
