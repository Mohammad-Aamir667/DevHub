import { createSlice } from "@reduxjs/toolkit";

const notificationsSlice = createSlice({
    name:"notifications",
    initialState:[],
    reducers:{
          setNotifications:(state,action)=>{
            return action.payload 
          },
          addNotifications: (state, action) => {
            state.push(action.payload);
          },
        
    }
})
  export const { setNotifications, addNotifications } = notificationsSlice.actions;
  export default notificationsSlice.reducer;