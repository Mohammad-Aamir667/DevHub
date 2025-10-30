import { BrowserRouter, Route, Routes } from "react-router-dom"
import Body from "./components/Body"
import Login from "./components/userAuth/Login"
import { Provider } from "react-redux"
import appStore from "./utils/appStore"
import Profile from "./components/profile/userProfile/Profile"
import Feed from "./components/feed/userFeed/Feed"
import EditProfile from "./components/profile/userProfile/EditProfile"
import Connections from "./components/Connections"
import Requests from "./components/Requests"
import UserProfilePublicView from "./components/profile/public/UserProfilePublicView"
import Chat from "./components/chat/Chat"
import ChatList from "./components/chat/ChatList"
import ForgotPassword from "./components/userAuth/ForgotPassword"
import ResetPassword from "./components/userAuth/ResetPassword"
import Dashboard from "./components/Dashboard"
import ApplyForExpert from "./components/ExpertApplicationForm"
import AdminDashboard from "./components/AdminDashboard"
import ExpertFeed from "./components/feed/expertFeed/ExpertFeed"
import EditExpertProfile from "./components/profile/expertProfile/EditExpertProfile"
import ExpertDashboard from "./components/ExpertDashboard"
import ExpertProfile from "./components/profile/expertProfile/ExpertProfile"
import ViewRequests from "./components/ViewRequests"
import Notifications from "./components/Notifications"
import CreateGroupChat from "./components/chat/CreateGroupChat"
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ExpertProfilePublicView from "./components/profile/public/ExpertProfilePublicView"
import VerifyEmail from "./components/userAuth/VerifyEmail"

function App() {

  return (
    <>
      <div className="min-h-screen">
        <ToastContainer />
        <Provider store={appStore}>

          <BrowserRouter basename="/">
            <Routes>


              <Route path="/" element={<Body />}>
                <Route path="/login" element={<Login />}></Route>
                <Route path="/" element={<Feed />}></Route>

                <Route path="/profile" element={<Profile />}></Route>
                <Route path="/editProfile" element={<EditProfile />}></Route>
                <Route path="/connections" element={<Connections />}></Route>
                <Route path="/requests" element={<Requests />}></Route>
                <Route path="/view-profile" element={<UserProfilePublicView />}></Route>
                <Route path="/chat-list" element={<ChatList />}></Route>
                <Route path="/chat-box" element={<Chat />}></Route>
                <Route path="/forgot-password" element={<ForgotPassword />}></Route>
                <Route path="/reset-password" element={<ResetPassword />}></Route>
                <Route path="/admin/dashboard" element={<Dashboard />}></Route>
                <Route path="/expert/dashboard" element={<AdminDashboard />}></Route>
                <Route path="/expert-application-form" element={<ApplyForExpert />}></Route>
                <Route path="/experts" element={<ExpertFeed />}></Route>
                <Route path="/edit-expert-profile" element={<EditExpertProfile />}></Route>
                <Route path="/expert-dashboard" element={<ExpertDashboard />}></Route>
                <Route path="/expert-profile" element={<ExpertProfile />}></Route>
                <Route path="/view-requests" element={<ViewRequests />}></Route>
                <Route path="/expert/:expertId" element={<ExpertProfilePublicView />}></Route>
                <Route path="/notifications" element={<Notifications />}></Route>
                <Route path="/create-group-chat" element={<CreateGroupChat />}></Route>
                <Route path="/verify-email" element={<VerifyEmail />}></Route>
              </Route>
            </Routes>
          </BrowserRouter>
        </Provider>

      </div>

    </>
  )
}

export default App
