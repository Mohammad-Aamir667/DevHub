
import axios from "axios";
import { setConversations } from "./conversationsSlice";
import { BASE_URL } from "./constants";

import { removeAcceptedRequest, removePendingRequest, setAcceptedRequests, setDeclinedRequests, setExpertInteractions, setResolvedRequests } from "./expertInteractionslice";
export const fetchConversations = () => async (dispatch) => {
    try {
        const res = await axios.get(BASE_URL+"/conversations",{withCredentials:true});
        dispatch(setConversations(res.data));
    } catch (error) {
        console.error("Failed to fetch conversations:", error);
    }
};


export const handleRequest = (status, requestId) => async (dispatch) => {
    try {
        const res = await axios.post(`${BASE_URL}/request-review/${status}/${requestId}`, {}, { withCredentials: true });
        dispatch(removePendingRequest(requestId));

        if (status === "accepted") {
            dispatch(setExpertInteractions(res.data));
            dispatch(setAcceptedRequests(res.data));
        }
        if (status === "declined") {
            dispatch(setExpertInteractions(res.data));
            dispatch(setDeclinedRequests(res.data));
        }
    } catch (err) {
        console.log("Error handling request:", err);
    }
};
export const handleCardClick = (userProfile, navigate) => {
  navigate("/chat-box", { state: { chatUser: userProfile } });
};
export const handleResolved = ( requestId) => async (dispatch) => {
    try {
      const res = await axios.post(BASE_URL + "/request-resolved/" + requestId, {}, { withCredentials: true })
      dispatch(setResolvedRequests(res.data));
      dispatch(setExpertInteractions(res.data));
      dispatch(removeAcceptedRequest(requestId));
    }
    catch (err) {
      console.log(err);
    }
  }
 ;
