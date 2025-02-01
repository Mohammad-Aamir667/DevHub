
import axios from "axios";
import { setConversations } from "./conversationsSlice";
import { BASE_URL } from "./constants";
export const fetchConversations = () => async (dispatch) => {
    try {
        const res = await axios.get(BASE_URL+"/conversations",{withCredentials:true});
        dispatch(setConversations(res.data));
    } catch (error) {
        console.error("Failed to fetch conversations:", error);
    }
};
