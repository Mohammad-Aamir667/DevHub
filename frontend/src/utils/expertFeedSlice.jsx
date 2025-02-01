import { createSlice } from "@reduxjs/toolkit";

const expertFeedSlice = createSlice({
    name:"expertFeed",
    initialState:null,
    reducers:{
        addExpertFeed :(state,action)=>{
               return action.payload
        },
        removeExpertFeed:(state,action)=>{
            const newArray = state.filter((res)=>res._id !== action.payload);
               return newArray;
     }
    }
})
export const {addExpertFeed,removeExpertFeed} = expertFeedSlice.actions;
export default expertFeedSlice.reducer