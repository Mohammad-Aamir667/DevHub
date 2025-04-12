"use client"

import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useLocation, useNavigate } from "react-router-dom"
import AcceptedRequests from "./AcceptedRequests"
import ExpertManageRequests from "./ExpertManageRequests"
import { handleCardClick, handleRequest, handleResolved } from "../utils/store"
import { setInteractions } from "../utils/interactionSlice"
import axios from "axios"
import { BASE_URL } from "../utils/constants"
import { setExpertInteractions } from "../utils/expertInteractionslice"
import { ArrowLeft, Clock, CheckCircle, XCircle, CheckSquare, MessageSquare } from "lucide-react"

const ViewRequests = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const location = useLocation()
  const params = new URLSearchParams(location.search)
  const role = params.get("role") || "user"
  const [selectedCategory, setSelectedCategory] = useState("pending")
  const expertInteractions = useSelector((store) => store.expertInteractions)
  const userInteractions = useSelector((store) => store.userInteractions)
  const interactions =
    role === "expert"
      ? expertInteractions?.filter((request) => request.status === selectedCategory) || []
      : userInteractions?.filter((request) => request.status === selectedCategory) || []

  const onCardClick = (userProfile) => handleCardClick(userProfile, navigate)
  const onRequestHandle = (status, requestId) => dispatch(handleRequest(status, requestId))
  const onRequestResolved = (requestId) => dispatch(handleResolved(requestId))

  const handleChat = (request) => {
    if (request.status === "accepted") {
      navigate("/chat-box", { state: { chatUser: request.expertId || request.userId } })
    }
  }

  const fetchUserInteractions = async () => {
    try {
      const { data } = await axios.get(BASE_URL + "/user-interactions", { withCredentials: true })
      dispatch(setInteractions(data))
    } catch (err) {
      console.error("Error fetching interactions:", err)
    }
  }

  const handleExpert = async () => {
    try {
      const { data } = await axios.get(BASE_URL + "/expert/all-requests", { withCredentials: true })
      dispatch(setExpertInteractions(data))
    } catch (err) {
      console.error("Error fetching interactions:", err)
    }
  }

  useEffect(() => {
    if (!userInteractions.length) fetchUserInteractions()
    if (!expertInteractions?.length) handleExpert()
  }, [])

  // Get status icon based on request status
  const getStatusIcon = (status) => {
    switch (status) {
      case "pending":
        return <Clock className="w-4 h-4 mr-1" />
      case "accepted":
        return <CheckCircle className="w-4 h-4 mr-1" />
      case "declined":
        return <XCircle className="w-4 h-4 mr-1" />
      case "resolved":
        return <CheckSquare className="w-4 h-4 mr-1" />
      default:
        return null
    }
  }

  // Get status color based on request status
  const getStatusColor = (status) => {
    switch (status) {
      case "pending":
        return "bg-amber-600 border-amber-500"
      case "accepted":
        return "bg-cyan-600 border-cyan-500"
      case "declined":
        return "bg-slate-600 border-slate-500"
      case "resolved":
        return "bg-emerald-600 border-emerald-500"
      default:
        return "bg-slate-600 border-slate-500"
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 to-slate-900 pt-16 px-4 sm:px-6 py-12">
      <div className="max-w-7xl mx-auto">
        {/* Header with back button */}
        <div className="flex items-center justify-between mb-8">
        <button
                  onClick={() => navigate(-1)}
                  className="text-slate-400 hover:text-slate-100 hover:bg-slate-800 p-2 sm:p-3 rounded-md flex items-center text-sm sm:text-base transition-colors"
                >
                  <ArrowLeft className="w-5 h-5 sm:w-6 sm:h-6 mr-2" /> 
                </button>
          <h1 className="text-2xl font-bold text-slate-100">{role === "expert" ? "Expert Requests" : "My Requests"}</h1>
          <div className="w-20"></div> {/* Spacer for alignment */}
        </div>

        {/* Category Tabs */}
        <div className="flex flex-wrap justify-center gap-2 mb-8 bg-slate-800 p-2 rounded-lg border border-slate-700">
          {["pending", "accepted", "declined", "resolved"].map((category) => (
            <button
              key={category}
              className={`px-4 py-2 rounded-lg font-medium transition-all text-sm ${
                selectedCategory === category
                  ? "bg-gradient-to-r from-cyan-500 to-blue-600 text-white"
                  : "bg-slate-700 text-slate-300 hover:bg-slate-600"
              }`}
              onClick={() => setSelectedCategory(category)}
            >
              {getStatusIcon(category)}
              <span>{category.charAt(0).toUpperCase() + category.slice(1)}</span>
            </button>
          ))}
        </div>

        {/* Expert-specific components */}
        {role === "expert" && selectedCategory === "pending" && (
          <ExpertManageRequests pendingRequests={interactions} handleRequest={onRequestHandle} />
        )}
        {role === "expert" && selectedCategory === "accepted" && (
          <AcceptedRequests
            acceptedRequests={interactions}
            handleResolved={onRequestResolved}
            handleCardClick={onCardClick}
          />
        )}

        {/* Request Cards */}
        {(role === "expert" && selectedCategory !== "pending" && selectedCategory !== "accepted") || role === "user" ? (
          <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            {interactions?.map((request) => {
              const statusColor = getStatusColor(request.status)
              const isAccepted = request.status === "accepted"

              return (
                <div
                  key={request._id}
                  className={`bg-slate-800 border border-slate-700 rounded-xl overflow-hidden transition-all duration-300 hover:shadow-lg ${
                    isAccepted ? "hover:border-cyan-500 cursor-pointer" : ""
                  }`}
                  onClick={() => isAccepted && handleChat(request)}
                >
                  <div className={`h-1.5 ${statusColor.split(" ")[0]}`}></div>
                  <div className="p-4">
                    <div className="flex items-start gap-4">
                      <img
                        src={request.expertId?.photoUrl || request.userId?.photoUrl || "/placeholder.svg"}
                        alt={request.expertId?.firstName || request.userId?.firstName}
                        className="w-12 h-12 rounded-full object-cover border-2 border-slate-700"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-start">
                          <h2 className="text-base font-semibold text-slate-100 truncate">
                            {(request.expertId?.firstName || request.userId?.firstName) +
                              " " +
                              (request.expertId?.lastName || request.userId?.lastName)}
                          </h2>
                          <span
                            className={`ml-2 px-2 py-0.5 text-xs font-medium rounded-full text-white flex items-center whitespace-nowrap ${
                              statusColor.split(" ")[0]
                            }`}
                          >
                            {getStatusIcon(request.status)}
                            {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                          </span>
                        </div>
                        <p className="text-sm text-slate-300 mt-1 line-clamp-2">{request.issueDescription}</p>
                        <p className="text-xs text-slate-400 mt-2">
                          {new Date(request.createdAt).toLocaleDateString(undefined, {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                          })}
                        </p>
                      </div>
                    </div>

                    {isAccepted && (
                      <div className="mt-3 pt-3 border-t border-slate-700">
                        <button className="w-full bg-slate-700 hover:bg-slate-600 text-slate-200 px-3 py-1.5 rounded text-sm font-medium transition-colors flex items-center justify-center">
                          <MessageSquare className="w-4 h-4 mr-2" /> Chat Now
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        ) : null}

        {/* Empty State */}
        {interactions?.length === 0 && (
          <div className="bg-slate-800 border border-slate-700 rounded-xl p-8 text-center">
            <div className="flex justify-center mb-4">{getStatusIcon(selectedCategory)}</div>
            <h3 className="text-xl font-semibold text-slate-300 mb-2">No {selectedCategory} requests</h3>
            <p className="text-slate-400 max-w-md mx-auto">
              {selectedCategory === "pending"
                ? "You don't have any pending requests at the moment."
                : selectedCategory === "accepted"
                  ? "You don't have any accepted requests yet."
                  : selectedCategory === "declined"
                    ? "You don't have any declined requests."
                    : "You don't have any resolved requests."}
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

export default ViewRequests
