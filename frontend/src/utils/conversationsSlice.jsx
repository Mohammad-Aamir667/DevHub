import { createSlice } from "@reduxjs/toolkit";


const conversationsSlice = createSlice({
    name:"conversations",
    initialState:[],
    reducers:{
        setConversations:(state,action)=>{
           return action.payload;
    },
        updateConversations:(state,action)=>{
            const {id,lastMessage,timestamp} = action.payload;
            const index = state.findIndex((convo)=>convo._id === id);
            if(index !== -1){
                state[index].lastMessage = lastMessage;
                state[index].timestamp = timestamp;
      }
        },
        addConversation:(state,action)=>{
            state.push(action.payload);
        }
    }
});
export const {setConversations,updateConversations,addConversation} = conversationsSlice.actions;
export default conversationsSlice.reducer;
