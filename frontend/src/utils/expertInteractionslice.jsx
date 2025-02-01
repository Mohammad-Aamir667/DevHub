import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  interactions: [],
  pendingRequests: [],
  acceptedRequests: [],
  declinedRequests:[],
  resolvedRequests:[],
};

const expertInteractionsSlice = createSlice({
  name: 'expertInteractions',
  initialState,
  reducers: {
    setExpertInteractions: (state, action) => {
      state.interactions = action.payload;
    },
    setPendingRequests: (state, action) => {
      state.pendingRequests = action.payload;
    },
    setAcceptedRequests: (state, action) => {
     
      if (Array.isArray(action.payload)) {
        state.acceptedRequests.push(...action.payload); // Spread array to add multiple requests
      } else {
        state.acceptedRequests.push(action.payload); // If it's a single object, just push it
     }
    },
    
    addInteraction: (state, action) => {
      state.interactions.push(action.payload);
    },
    removePendingRequest: (state, action) => {
      state.pendingRequests = state.pendingRequests.filter(
        (request) => request._id !== action.payload
      );
    },
    removeAcceptedRequest: (state, action) => {
      console.log(action.payload)
      state.acceptedRequests = state.acceptedRequests.filter(
        (request) => request._id !== action.payload
      );
    },
    setDeclinedRequests:(state,action)=>{
      if (Array.isArray(action.payload)) {
        state.declinedRequests.push(...action.payload); // Spread array to add multiple requests
      } else {
        state.declinedRequests.push(action.payload); // If it's a single object, just push it
     }
    },
    setResolvedRequests:(state,action)=>{
      if (Array.isArray(action.payload)) {
        state.resolvedRequests.push(...action.payload); // Spread array to add multiple requests
      } else {
        state.resolvedRequests.push(action.payload); // If it's a single object, just push it
     }
    },
    removerExpertInteractions: () => initialState,
  },
});

export const { setExpertInteractions, setPendingRequests, setAcceptedRequests, addInteraction,removePendingRequest,setDeclinedRequests,setResolvedRequests, removerExpertInteractions,removeAcceptedRequest} = expertInteractionsSlice.actions;

export default expertInteractionsSlice.reducer;
removerExpertInteractions