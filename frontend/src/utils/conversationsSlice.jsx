import { createSlice } from "@reduxjs/toolkit";


const conversationsSlice = createSlice({
    name:"conversations",
    initialState:[],
    reducers:{
        setConversations:(state,action)=>{
           return action.payload;
    },
     updateConversations: (state, action) => {
  const { id, lastMessage, timestamp } = action.payload
  const index = state.findIndex((convo) => convo._id === id)
  if (index !== -1) {
    state[index].lastMessage = lastMessage || state[index].lastMessage || ""
    state[index].timestamp = timestamp || state[index].timestamp || null
  }
},

        addConversation:(state,action)=>{
            state.push(action.payload);
        },
        removeConversations:()=>[],
    }
});
export const {setConversations,updateConversations,addConversation,removeConversations} = conversationsSlice.actions;
export default conversationsSlice.reducer;
