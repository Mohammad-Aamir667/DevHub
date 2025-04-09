import { useDispatch, useSelector } from "react-redux"
import { Link, useNavigate } from "react-router-dom"
import { BASE_URL } from "../utils/constants"
import { removeUser } from "../utils/userSlice"
import axios from "axios"

import { clearFeed } from "../utils/feedSlice"
import { clearExpertData } from "../utils/expertDetailsSlice"
import { Code, Bell } from "lucide-react"
import { removeExpertInteraction } from "../utils/expertInteractionslice"

const NavBar = () => {
  const user = useSelector((store) => store.user)
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const expertDetails = useSelector((store) => store.expertDetails)
  const notifications = useSelector((store) => store.notifications || [])
  const unreadCount = notifications.filter((n) => !n.read).length

  const handleLogout = async () => {
    try {
      await axios.post(BASE_URL + "/logout", {}, { withCredentials: true })
      dispatch(removeUser())
      dispatch(clearFeed())
      dispatch(clearExpertData());
      removeExpertInteraction();
      return navigate("/login")
    } catch (err) {
      console.error(err)
      alert("Something went wrong")
    }
  }
   
  return (
    <nav className="fixed top-0 left-0 right-0 z-30 bg-gray-900 text-gray-100 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2">
              <Code className="h-8 w-8 text-blue-500" />
              <span className="text-xl font-bold">DevHub</span>
            </Link>
          </div>
          {user && (
            <div className="flex items-center space-x-4">
              <Link to="/notifications" className="relative p-1 rounded-full hover:bg-gray-800 transition-colors">
                <Bell className="h-6 w-6" />
                {unreadCount > 0 && (
                  <span className="absolute top-0 right-0 inline-flex items-center justify-center w-4 h-4 text-xs font-bold text-white bg-red-500 rounded-full">
                    {unreadCount}
                  </span>
                )}
              </Link>
              <div className="relative group">
                <button className="flex items-center space-x-2 focus:outline-none">
                  <img
                    src={user?.photoUrl || "/placeholder.svg"}
                    alt="User Avatar"
                    className="h-8 w-8 rounded-full object-cover border-2 border-blue-500"
                  />
                  <span className="hidden md:inline-block">{user?.name}</span>
                </button>
                <div className="absolute right-0 mt-2 w-48 bg-gray-800 rounded-md overflow-hidden shadow-xl z-10 hidden group-hover:block">
                  <Link to="/profile" className="block px-4 py-2 text-sm hover:bg-gray-700 transition-colors">
                    Profile
                  </Link>
                  <Link to="/requests" className="block px-4 py-2 text-sm hover:bg-gray-700 transition-colors">
                    Requests
                  </Link>
                  {!expertDetails?.expertId && expertDetails?.status !== "approved" && (
                    <Link
                      to="/expert-application-form"
                      className="block px-4 py-2 text-sm hover:bg-gray-700 transition-colors"
                    >
                      Apply for Expert
                    </Link>
                  )}
                  {expertDetails?.expertId && expertDetails?.status === "approved" && (
                    <Link
                      to="/expert-dashboard"
                      className="block px-4 py-2 text-sm hover:bg-gray-700 transition-colors"
                    >
                      Expert Dashboard
                    </Link>
                  )}
                  <button
                    onClick={handleLogout}
                    className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-700 transition-colors"
                  >
                    Logout
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </nav>
  )
}

export default NavBar

