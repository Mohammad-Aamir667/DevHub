import { createSlice } from "@reduxjs/toolkit";

const expertSlice = createSlice({
  name: "experts",
  initialState: {
    pending: [],
    approved: [],
    rejected: [],
  },
  reducers: {
    setExperts: (state, action) => {
      const { pending, approved, rejected } = action.payload;
      state.pending = pending;
      state.approved = approved;
      state.rejected = rejected;
    },
  
  },

});
export const { setExperts } = expertSlice.actions;
export default expertSlice.reducer;