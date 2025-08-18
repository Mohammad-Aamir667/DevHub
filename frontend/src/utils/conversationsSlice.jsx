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

      
  let index = -1

    index = state.findIndex((convo) => convo._id === id)
   if(index === -1){
    index = state.findIndex(
      (convo) =>
        convo.conversationType === "user-user" &&
        convo.participants.some((p) => p._id === id)
    )
}
  if (index !== -1) {
    state[index].lastMessage.messageText = lastMessage || state[index].lastMessage || ""
    state[index].lastMessage.timestamp = timestamp || state[index].timestamp || null
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
