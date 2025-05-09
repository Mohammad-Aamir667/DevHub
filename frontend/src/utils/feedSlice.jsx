import { createSlice } from "@reduxjs/toolkit";

const feedSlice = createSlice({
    name:"feed",
    initialState:[],
    reducers:{
      addFeed: (state, action) => {
        const existingIds = new Set(state.map(item => item._id))
        const uniqueNew = action.payload.filter(item => !existingIds.has(item._id))
        return [...state, ...uniqueNew]
      }
      ,
        removeFeed:(state,action)=>{
            const newArray = state.filter((res)=>res._id !== action.payload);
               return newArray;
     },
     clearFeed:()=>{
       return [];
     }
    }
})
export const {addFeed,removeFeed,clearFeed} = feedSlice.actions;
export default feedSlice.reducer