import { useDispatch, useSelector } from "react-redux"
import { Link, useNavigate } from "react-router-dom"
import { BASE_URL } from "../utils/constants"
import { removeUser } from "../utils/userSlice"
import axios from "axios"
import { useState, useEffect, useRef } from "react"
import toast from "react-hot-toast"
import { clearFeed } from "../utils/feedSlice"
import { clearExpertData } from "../utils/expertDetailsSlice"
import { Code, Bell } from "lucide-react"
import { removeExpertInteraction } from "../utils/expertInteractionslice"
import { removeConnections } from "../utils/connectionSlice"
import { removeConversations } from "../utils/conversationsSlice"
import { removeExpertFeed } from "../utils/expertFeedSlice"
import { handleAxiosError } from "../utils/handleAxiosError"

const NavBar = () => {
  const user = useSelector((store) => store.user)
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const expertDetails = useSelector((store) => store.expertDetails);


  const handleLogout = async () => {
    try {
      await axios.post(BASE_URL + "/logout", {}, { withCredentials: true })
      dispatch(removeUser())
      dispatch(clearFeed())
      dispatch(clearExpertData())
      dispatch(removeExpertFeed())
      dispatch(removeExpertInteraction())
      dispatch(removeConnections())
      dispatch(removeConversations())
      navigate("/login")
    } catch (err) {
      handleAxiosError(err);
    }
  }



  return (
    <nav className="fixed top-0 left-0 right-0 z-30 bg-gray-900 text-gray-100 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link
              to={user ? "/" : "/"} // still using "/" because the path is same
              onClick={(e) => {
                if (!user) {
                  // force top-level navigation for unauthenticated users
                  e.preventDefault();
                  navigate("/", { replace: true });
                }
              }}
              className="flex items-center space-x-2"
            >
              <Code className="h-8 w-8 text-blue-500" />
              <span className="text-xl font-bold">DevHub</span>
            </Link>

          </div>
          {user && (
            <div className="flex items-center space-x-4">


              <div className="dropdown dropdown-end">
                <div tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar">
                  <div className="w-10 rounded-full">
                    <img
                      src={user?.photoUrl || "/placeholder.svg"}
                      alt="User Avatar"
                      className="h-8 w-8 rounded-full object-cover border-2 border-blue-500"
                    />
                  </div>
                </div>
                <ul
                  tabIndex={0}
                  className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52"
                >
                  <li>
                    <Link to="/profile" className="justify-between">
                      Profile
                    </Link>
                  </li>
                  <li>
                    <Link to="/requests">Requests</Link>
                  </li>
                  {!expertDetails?.expertId && expertDetails?.status !== "approved" && (
                    <li>
                      <Link to="/expert-application-form">Apply for Expert</Link>
                    </li>
                  )}
                  {expertDetails?.expertId && expertDetails?.status === "pending" && (
                    <li>
                      <Link to="/expert-application-form">Apply for Expert</Link>
                    </li>
                  )}
                  {expertDetails?.expertId && expertDetails?.status === "rejected" && (
                    <li>
                      <Link to="/expert-application-form">Apply for Expert</Link>
                    </li>
                  )}
                  {expertDetails?.expertId && expertDetails?.status === "approved" && (
                    <li>
                      <Link to="/expert-dashboard">Expert Dashboard</Link>
                    </li>
                  )}
                  <li>
                    <button onClick={handleLogout}>Logout</button>
                  </li>
                </ul>
              </div>

            </div>
          )}
        </div>
      </div>


    </nav>
  )
}

export default NavBar
