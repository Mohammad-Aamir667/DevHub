"use client"

import { useEffect, useState } from "react"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faBars, faTimes, faList, faClock, faCheckCircle, faStar, faComment } from "@fortawesome/free-solid-svg-icons"
import { Link, useNavigate } from "react-router-dom"
import { useDispatch, useSelector } from "react-redux"
import AcceptedRequests from "./AcceptedRequests"
import ExpertManageRequests from "./ExpertManageRequests"
import { handleCardClick, handleRequest, handleResolved } from "../utils/store"
import { setExpertInteractions } from "../utils/expertInteractionslice"
import axios from "axios"
import { BASE_URL } from "../utils/constants"

const ExpertDashboard = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const totalRequests = useSelector((store) => store.expertInteractions)
  const pendingRequests = totalRequests?.filter((request) => request.status === "pending") || []
  const acceptedRequests = totalRequests?.filter((request) => request.status === "accepted") || []
  const resolvedRequests = totalRequests?.filter((request) => request.status === "resolved") || []
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const handleExpert = async () => {
    try {
      const expertAllInteractions = await axios.get(BASE_URL + "/expert/all-requests", { withCredentials: true })
      if (expertAllInteractions) {
        dispatch(setExpertInteractions(expertAllInteractions.data))
      }
    } catch (err) {
      console.error("Error fetching interactions:", err)
    }
  }

  const onRequestHandle = (status, requestId) => {
    dispatch(handleRequest(status, requestId))
  }

  const onRequestResolved = (requestId) => {
    dispatch(handleResolved(requestId))
  }

  const onCardClick = (userProfile) => {
    handleCardClick(userProfile, navigate)
  }

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen)
  }

  useEffect(() => {
    if (totalRequests?.length === 0) handleExpert()
  }, [])

  return (
    <div className="min-h-screen flex bg-gray-950 text-gray-100">
      {/* Sidebar */}
      <div
        className={`fixed z-20 inset-y-0 left-0 transform ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        } transition-transform duration-300 ease-in-out bg-gray-900 w-64 shadow-xl border-r border-gray-800 h-screen md:relative md:translate-x-0`}
      >
        <div className="flex items-center justify-between p-6 border-b border-gray-800">
          <h2 className="text-xl font-bold text-blue-500">Expert Dashboard</h2>
          <button onClick={toggleSidebar} className="md:hidden text-gray-400 hover:text-gray-200 focus:outline-none">
            <FontAwesomeIcon icon={faTimes} size="lg" />
          </button>
        </div>
        <nav className="p-6">
          <ul className="space-y-6">
            <li>
              <Link
                to="/expert-dashboard"
                className="flex items-center text-gray-300 hover:text-blue-500 transition duration-150 font-medium"
              >
                <span className="ml-2">Dashboard</span>
              </Link>
            </li>
            <li>
              <Link
                to="/expert-profile"
                className="flex items-center text-gray-300 hover:text-blue-500 transition duration-150 font-medium"
              >
                <span className="ml-2">Profile</span>
              </Link>
            </li>
            <li>
              <Link
                to="/view-requests?role=expert"
                className="flex items-center text-gray-300 hover:text-blue-500 transition duration-150 font-medium"
              >
                <span className="ml-2">View Requests</span>
              </Link>
            </li>
            <li>
              <Link
                to="/chat-list"
                className="flex items-center text-gray-300 hover:text-blue-500 transition duration-150 font-medium"
              >
                <FontAwesomeIcon icon={faComment} className="mr-2" />
                <span>Messages</span>
              </Link>
            </li>
          </ul>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        {/* Header with Toggle Button for Smaller Screens */}
        <header className="bg-gray-900 shadow-md p-4 flex items-center justify-between md:hidden sticky top-0 z-10">
          <h2 className="text-xl font-bold text-blue-500">Dashboard</h2>
          <button onClick={toggleSidebar} className="text-gray-400 hover:text-gray-200 focus:outline-none">
            <FontAwesomeIcon icon={faBars} size="lg" />
          </button>
        </header>

        <div className="p-6 space-y-8">
          {/* Summary Section */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Total Requests */}
            <div className="bg-gray-900 p-6 shadow-lg rounded-xl border border-gray-800 transition-all duration-300 hover:border-blue-900 hover:shadow-blue-900/10">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-medium text-gray-400 mb-1">Total Requests</h3>
                  <p className="text-3xl font-bold text-blue-500">{totalRequests?.length || 0}</p>
                </div>
                <div className="bg-blue-500/10 p-3 rounded-lg">
                  <FontAwesomeIcon icon={faList} className="text-blue-500 text-xl" />
                </div>
              </div>
            </div>

            {/* Pending Requests */}
            <div className="bg-gray-900 p-6 shadow-lg rounded-xl border border-gray-800 transition-all duration-300 hover:border-yellow-900 hover:shadow-yellow-900/10">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-medium text-gray-400 mb-1">Pending Requests</h3>
                  <p className="text-3xl font-bold text-yellow-500">{pendingRequests?.length || 0}</p>
                </div>
                <div className="bg-yellow-500/10 p-3 rounded-lg">
                  <FontAwesomeIcon icon={faClock} className="text-yellow-500 text-xl" />
                </div>
              </div>
            </div>

            {/* Completed Requests */}
            <div className="bg-gray-900 p-6 shadow-lg rounded-xl border border-gray-800 transition-all duration-300 hover:border-green-900 hover:shadow-green-900/10">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-medium text-gray-400 mb-1">Completed Requests</h3>
                  <p className="text-3xl font-bold text-green-500">{resolvedRequests?.length || 0}</p>
                </div>
                <div className="bg-green-500/10 p-3 rounded-lg">
                  <FontAwesomeIcon icon={faCheckCircle} className="text-green-500 text-xl" />
                </div>
              </div>
            </div>

            {/* Reviews */}
            <div className="bg-gray-900 p-6 shadow-lg rounded-xl border border-gray-800 transition-all duration-300 hover:border-purple-900 hover:shadow-purple-900/10">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-medium text-gray-400 mb-1">Reviews</h3>
                  <p className="text-3xl font-bold text-purple-500">4.8/5</p>
                </div>
                <div className="bg-purple-500/10 p-3 rounded-lg">
                  <FontAwesomeIcon icon={faStar} className="text-purple-500 text-xl" />
                </div>
              </div>
            </div>
          </div>

          {/* Main Sections */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Recent Requests */}
            <div className="bg-gray-900 p-6 shadow-lg rounded-xl border border-gray-800">
              <h3 className="text-lg font-bold text-blue-500 mb-6 flex items-center">
                <span>Recent Requests</span>
                {pendingRequests.length > 0 && (
                  <span className="ml-2 bg-blue-500/20 text-blue-500 text-xs px-2 py-1 rounded-full">
                    {pendingRequests.length}
                  </span>
                )}
              </h3>

              {pendingRequests.length > 0 ? (
                <>
                  <ExpertManageRequests pendingRequests={pendingRequests.slice(0, 3)} handleRequest={onRequestHandle} />

                  {pendingRequests.length > 3 && (
                    <div className="mt-4 text-center">
                      <Link
                        to="/view-requests?role=expert"
                        className="inline-block text-sm text-blue-500 hover:text-blue-400 font-medium transition duration-150"
                      >
                        View all requests
                      </Link>
                    </div>
                  )}
                </>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <p>No pending requests at the moment</p>
                </div>
              )}
            </div>

            {/* Schedule Section */}
            <div className="bg-gray-900 p-6 shadow-lg rounded-xl border border-gray-800">
              <h3 className="text-lg font-bold text-blue-500 mb-6">Your Schedule</h3>
              <div className="text-gray-400 bg-gray-800/50 rounded-lg p-4 text-center">
                No scheduled sessions for today.
              </div>
            </div>
          </div>

          {/* Help Users Section */}
          <div className="bg-gray-900 p-6 shadow-lg rounded-xl border border-gray-800">
            <h3 className="text-lg font-bold text-blue-500 mb-6 flex items-center">
              <span>Help Users</span>
              {acceptedRequests.length > 0 && (
                <span className="ml-2 bg-green-500/20 text-green-500 text-xs px-2 py-1 rounded-full">
                  {acceptedRequests.length}
                </span>
              )}
            </h3>

            {acceptedRequests.length > 0 ? (
              <AcceptedRequests
                acceptedRequests={acceptedRequests}
                handleResolved={onRequestResolved}
                handleCardClick={onCardClick}
              />
            ) : (
              <div className="text-center py-8 text-gray-500">
                <p>No accepted requests at the moment</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default ExpertDashboard
