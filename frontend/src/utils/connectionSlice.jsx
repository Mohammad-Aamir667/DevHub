import { createSlice } from "@reduxjs/toolkit";

const connectionSilce = createSlice({
    name:"connection",
    initialState:null,
    reducers:{
        addConnections:(state,action) => action.payload,
        removeConnections:()=> null,
    }
    
})
export const {addConnections,removeConnections} =connectionSilce.actions;
export default connectionSilce.reducer;