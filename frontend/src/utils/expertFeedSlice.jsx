import { createSlice } from "@reduxjs/toolkit";

const expertFeedSlice = createSlice({
    name:"expertFeed",
    initialState:null,
    reducers:{
        addExpertFeed :(state,action)=>{
               return action.payload
        },
        removeExpertFeed:()=>{
            return null;
     }
    }
})
export const {addExpertFeed,removeExpertFeed} = expertFeedSlice.actions;
export default expertFeedSlice.reducer