import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import AcceptedRequests from "./AcceptedRequests";
import ExpertManageRequests from "./ExpertManageRequests";
import { handleCardClick, handleRequest, handleResolved } from "../utils/store";
import { setInteractions } from "../utils/interactionSlice";
import axios from "axios";
import { BASE_URL } from "../utils/constants";
import { setExpertInteractions } from "../utils/expertInteractionslice";

const ViewRequests = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const role = params.get("role") || "user";
  const [selectedCategory, setSelectedCategory] = useState("pending");
  const expertInteractions = useSelector((store) => store.expertInteractions);
  const userInteractions = useSelector((store) => store.userInteractions);
  const interactions =
    role === "expert"
      ? expertInteractions?.filter((request) => request.status === selectedCategory) || []
      : userInteractions?.filter((request) => request.status === selectedCategory) || [];

  const onCardClick = (userProfile) => handleCardClick(userProfile, navigate);
  const onRequestHandle = (status, requestId) => dispatch(handleRequest(status, requestId));
  const onRequestResolved = (requestId) => dispatch(handleResolved(requestId));

  const handleChat = (request) => {
    if (request.status === "accepted") {
      navigate("/chat-box", { state: { chatUser: request.expertId || request.userId } });
    }
  };

  const fetchUserInteractions = async () => {
    try {
      const { data } = await axios.get(BASE_URL + "/user-interactions", { withCredentials: true });
      dispatch(setInteractions(data));
    } catch (err) {
      console.error("Error fetching interactions:", err);
    }
  };

  const handleExpert = async () => {
    try {
      const { data } = await axios.get(BASE_URL + "/expert/all-requests", { withCredentials: true });
      dispatch(setExpertInteractions(data));
    } catch (err) {
      console.error("Error fetching interactions:", err);
    }
  };

  useEffect(() => {
    if (!userInteractions.length) fetchUserInteractions();
    if (!expertInteractions?.length) handleExpert();
  }, []);

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-white mb-8 text-center">
          My {role === "expert" ? "Expert" : "User"} Requests
        </h1>
        <div className="flex flex-wrap justify-center gap-4 mb-8">
          {["pending", "accepted", "declined", "resolved"].map((category) => (
            <button
              key={category}
              className={`px-6 py-3 rounded-lg font-medium transition-all shadow-md text-white ${
                selectedCategory === category ? "bg-blue-600 hover:bg-blue-700" : "bg-gray-700 hover:bg-gray-600"
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
          <AcceptedRequests acceptedRequests={interactions} handleResolved={onRequestResolved} handleCardClick={onCardClick} />
        )}
        {(role === "expert" && selectedCategory !== "pending" && selectedCategory !== "accepted") || role === "user" ? (
          <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            {interactions?.map((request) => (
              <div
                key={request._id}
                className={`p-4 bg-gray-800 rounded-lg shadow-lg flex justify-between items-center border-2 ${
                  request.status === "accepted"
                    ? "border-blue-700"
                    : request.status === "pending"
                    ? "border-yellow-500"
                    : request.status === "declined"
                    ? "border-gray-600"
                    : "border-teal-600"
                }`}
                onClick={() => handleChat(request)}
              >
                <div className="flex items-center gap-4">
                  <img
                    src={request.expertId.photoUrl || request.userId.photoUrl}
                    alt={request.expertId.firstName || request.userId.firstName}
                    className="w-16 h-16 rounded-full object-cover border-2 border-gray-700"
                  />
                  <div>
                    <h2 className="text-lg font-semibold text-white">
                      {(request.expertId.firstName || request.userId.firstName) +
                        " " +
                        (request.expertId.lastName || request.userId.lastName)}
                    </h2>
                    <p className="text-sm text-gray-300">{request.issueDescription}</p>
                    <p className="text-xs text-gray-400 mt-1">
                      Requested on: {new Date(request.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <span
                  className={`px-3 py-1 text-sm font-medium rounded-lg text-white ${
                    request.status === "accepted"
                      ? "bg-green-700"
                      : request.status === "pending"
                      ? "bg-yellow-700"
                      : request.status === "declined"
                      ? "bg-gray-700"
                      : "bg-teal-700"
                  }`}
                >
                  {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                </span>
              </div>
            ))}
          </div>
        ) : null}

        {interactions?.length === 0 && (
          <p className="text-center text-gray-400 mt-8 p-4 bg-gray-800 rounded-lg shadow-md">
            No requests in this category.
          </p>
        )}
      </div>
    </div>
  );
};

export default ViewRequests;
