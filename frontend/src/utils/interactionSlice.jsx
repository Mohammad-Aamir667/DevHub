import { createSlice } from "@reduxjs/toolkit";

const interactionsSlice = createSlice({
    name: "interactions",
    initialState: [],
    reducers: {
      setInteractions: (state, action) => {
        return action.payload;
       
      },
      addInteraction: (state, action) => {
        state.push(action.payload);
      },
      updateInteraction: (state, action) => {
        const index = state.findIndex((i) => i._id === action.payload._id);
        if (index !== -1) {
          state[index] = action.payload;
        }
      },
      removeInteraction: (state, action) => {
        return state.filter((interaction) => interaction._id !== action.payload);
      },
    },
  });
  export const { setInteractions, addInteraction, updateInteraction, removeInteraction } = interactionsSlice.actions;
  export default interactionsSlice.reducer;
  