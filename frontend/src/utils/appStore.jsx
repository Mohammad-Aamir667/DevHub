import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./userSlice";
import feedReducer from "./feedSlice";
import connectionReducer from "./connectionSlice";
import requestReducer from "./requestSlice";
import conversationsReducer from "./conversationsSlice";
import expertReducer from "./expertSlice";
import expertDetailsReducer from "./expertDetailsSlice";
import expertFeedReducer from "./expertFeedSlice";
import userInteractionsReducer from "./interactionSlice";
import expertInteractionsReducer from "./expertInteractionslice"
import notificationsReducer from "./notificationsSlice";
const appStore = configureStore({
  reducer:{
        user:userReducer,
        feed:feedReducer,
        connections:connectionReducer,
        requests:requestReducer,
        conversations:conversationsReducer,
        experts:expertReducer,
        expertDetails:expertDetailsReducer,
        expertFeed:expertFeedReducer,
        userInteractions:userInteractionsReducer,
        expertInteractions:expertInteractionsReducer,
        notifications:notificationsReducer,
  },
});
export default appStore; 