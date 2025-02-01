import { createSlice } from "@reduxjs/toolkit";

const feedSlice = createSlice({
    name:"feed",
    initialState:[],
    reducers:{
        addFeed :(state,action)=>{
               return action.payload
        },
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