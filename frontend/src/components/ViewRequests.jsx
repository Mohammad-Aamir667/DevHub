"use client"

import { useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useLocation, useNavigate } from "react-router-dom"
import AcceptedRequests from "./AcceptedRequests"
import ExpertManageRequests from "./ExpertManageRequests"
import { handleCardClick, handleRequest, handleResolved } from "../utils/store"

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
      ? expertInteractions?.[`${selectedCategory}Requests`] || []
      : userInteractions?.filter((request) => request.status === selectedCategory) || []
  const onCardClick = (userProfile) => {
    handleCardClick(userProfile, navigate)
  }
  const onRequestHandle = (status, requestId) => {
    dispatch(handleRequest(status, requestId))
  }
  const onRequestResolved = (requestId) => {
    dispatch(handleResolved(requestId))
  }
  const handleChat = (request) => {
    const expert = request.expertId.firstName
    if (request.status === "accepted") {
      if (expert) {
        navigate("/chat-box", { state: { chatUser: request.expertId } })
      } else {
        navigate("/chat-box", { state: { chatUser: request.userId } })
      }
    } else {
      return
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b mt-9 from-gray-100 to-gray-200 p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-8 text-center">
          My {role === "expert" ? "Expert" : "User"} Requests
        </h1>
        <div className="flex flex-wrap justify-center gap-4 mb-8">
          {["pending", "accepted", "declined", "resolved"].map((category) => (
            <button
              key={category}
              className={`px-6 py-3 rounded-lg text-white font-medium transition-all shadow-md ${
                selectedCategory === category ? "bg-blue-600 hover:bg-blue-700" : "bg-gray-500 hover:bg-gray-600"
              }`}
              onClick={() => setSelectedCategory(category)}
            >
              {category.charAt(0).toUpperCase() + category.slice(1)}
            </button>
          ))}
        </div>

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
        {role === "expert" && selectedCategory !== "pending" && selectedCategory !== "accepted" && (
          <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            {interactions?.map((request) => (
              <div
                key={request._id}
                className={`p-6 border rounded-lg shadow-lg cursor-pointer hover:shadow-xl transition-all ${
                  request.status === "accepted"
                    ? "border-green-500 bg-green-50"
                    : request.status === "pending"
                      ? "border-yellow-500 bg-yellow-50"
                      : "border-red-500 bg-red-50"
                }`}
                onClick={() => handleChat(request)}
              >
                <div className="flex flex-col items-center">
                  <img
                    src={request.expertId.photoUrl || request.userId.photoUrl}
                    alt={request.expertId.firstName || request.userId.firstName}
                    className="w-24 h-24 rounded-full object-cover mb-4 border-4 border-white shadow-md"
                  />
                  <h2 className="text-xl font-semibold text-center text-gray-800">
                    {(request.expertId.firstName || request.userId.firstName) +
                      " " +
                      (request.expertId.lastName || request.userId.lastName)}
                  </h2>
                  <p className="text-sm text-center text-gray-600 mt-2">{request.issueDescription}</p>
                  <p className="text-sm text-center text-gray-400 mt-2">
                    Requested on: {new Date(request.createdAt).toLocaleDateString()}
                  </p>
                  <p
                    className={`text-center font-medium mt-4 px-4 py-2 rounded-full ${
                      request.status === "accepted"
                        ? "text-green-800 bg-green-200"
                        : request.status === "pending"
                          ? "text-yellow-800 bg-yellow-200"
                          : "text-red-800 bg-red-200"
                    }`}
                  >
                    {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}

        {role === "user" && (
          <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            {interactions?.map((request) => (
              <div
                key={request._id}
                className={`p-6 border rounded-lg shadow-lg cursor-pointer hover:shadow-xl transition-all ${
                  request.status === "accepted"
                    ? "border-green-500 bg-green-50"
                    : request.status === "pending"
                      ? "border-yellow-500 bg-yellow-50"
                      : "border-red-500 bg-red-50"
                }`}
                onClick={() => handleChat(request)}
              >
                <div className="flex flex-col items-center">
                  <img
                    src={request.expertId.photoUrl || request.userId.photoUrl}
                    alt={request.expertId.firstName || request.userId.firstName}
                    className="w-24 h-24 rounded-full object-cover mb-4 border-4 border-white shadow-md"
                  />
                  <h2 className="text-xl font-semibold text-center text-gray-800">
                    {(request.expertId.firstName || request.userId.firstName) +
                      " " +
                      (request.expertId.lastName || request.userId.lastName)}
                  </h2>
                  <p className="text-sm text-center text-gray-600 mt-2">{request.issueDescription}</p>
                  <p className="text-sm text-center text-gray-400 mt-2">
                    Requested on: {new Date(request.createdAt).toLocaleDateString()}
                  </p>
                  <p
                    className={`text-center font-medium mt-4 px-4 py-2 rounded-full ${
                      request.status === "accepted"
                        ? "text-green-800 bg-green-200"
                        : request.status === "pending"
                          ? "text-yellow-800 bg-yellow-200"
                          : "text-red-800 bg-red-200"
                    }`}
                  >
                    {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* No Requests Message */}
        {interactions?.length === 0 && (
          <p className="text-center text-gray-500 mt-8 p-4 bg-white rounded-lg shadow-md">
            No requests in this category.
          </p>
        )}
      </div>
    </div>
  )
}

export default ViewRequests

