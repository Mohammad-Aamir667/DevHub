import React, { useState } from "react";
import { useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import HelpRequests from "./ExpertManageRequests";
import AcceptedRequests from "./AcceptedRequests";

const ViewRequests = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const {handleRequest,handleCardClick }= location?.state||{};
   console.log(location.state)
  const params = new URLSearchParams(location.search);
  const role = params.get("role") || "user"; 

  const [selectedCategory, setSelectedCategory] = useState("pending");

  const expertInteractions = useSelector((store) => store.expertInteractions);
  const userInteractions = useSelector((store) => store.userInteractions);

  
  const interactions =
    role === "expert"
      ? expertInteractions?.[`${selectedCategory}Requests`] || []
      : userInteractions?.filter(
          (request) => request.status === selectedCategory
        ) || [];

  const handleChat = (request) => {
    const expert = request.expertId.firstName;
    const user = request.userId.firstName;
    console.log(expert, user);
    if (request.status === "accepted") {
      if (expert) {
        navigate("/chat-box", { state: { chatUser: request.expertId } });
      } else {
        navigate("/chat-box", { state: { chatUser: request.userId } });
      }
    }
  };

  return (
    <div className="p-4 sm:p-6 bg-gray-100 min-h-screen">
      <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-4 sm:mb-6 text-center">
        My {role === "expert" ? "Expert" : "User"} Requests
      </h1>

      {/* Category Buttons */}
      <div className="flex flex-wrap justify-center gap-2 sm:gap-4 mb-6">
        {["pending", "accepted", "declined", "resolved"].map((category) => (
          <button
            key={category}
            className={`px-4 sm:px-6 py-2 rounded-lg text-white font-medium transition ${
              selectedCategory === category
                ? "bg-blue-600"
                : "bg-gray-400 hover:bg-gray-500"
            }`}
            onClick={() => setSelectedCategory(category)}
          >
            {category.charAt(0).toUpperCase() + category.slice(1)}
          </button>
        ))}
      </div>

      {/* For Expert role, show HelpRequests when selectedCategory is "pending" */}
      {role === "expert" && selectedCategory === "pending" && (
        <HelpRequests
          pendingRequests={interactions}
          handleRequest={handleRequest} // Handle Accept/Decline actions
         // handleResolve={(id) => console.log("Resolved:", id)} // Handle Resolve action
        />
      )}
         {/* For Expert role, show HelpRequests when selectedCategory is "pending" */}
         {role === "expert" && selectedCategory === "accepted" && (
        <AcceptedRequests
        acceptedRequests={interactions} handleCardClick={handleCardClick}
           // Handle Accept/Decline actions
         // handleResolve={(id) => console.log("Resolved:", id)} // Handle Resolve action
        />
      )}

      {/* For Expert role, show request cards when selectedCategory is not "pending" */}
      {role === "expert" && (selectedCategory !== "pending" && selectedCategory !== "accepted") && (
        <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {interactions?.map((request) => (
            <div
              key={request._id}
              className={`p-4 border rounded-lg shadow-md cursor-pointer hover:shadow-lg transition-transform transform hover:-translate-y-1 ${
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
                  className="w-16 h-16 sm:w-20 sm:h-20 rounded-full object-cover mb-3"
                />
                <h2 className="text-lg font-semibold text-center text-gray-800">
                  {(request.expertId.firstName || request.userId.firstName) +
                    " " +
                    (request.expertId.lastName || request.userId.lastName)}
                </h2>
                <p className="text-sm text-center text-gray-600 mt-2">
                  {request.issueDescription}
                </p>
                <p className="text-sm text-center text-gray-400 mt-1">
                  Requested on: {new Date(request.createdAt).toLocaleDateString()}
                </p>
                <p
                  className={`text-center font-medium mt-3 ${
                    request.status === "accepted"
                      ? "text-green-600"
                      : request.status === "pending"
                      ? "text-yellow-600"
                      : "text-red-600"
                  }`}
                >
                  {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* For User role, show all categories (pending and non-pending) */}
      {role === "user" && (
        <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {interactions?.map((request) => (
            <div
              key={request._id}
              className={`p-4 border rounded-lg shadow-md cursor-pointer hover:shadow-lg transition-transform transform hover:-translate-y-1 ${
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
                  className="w-16 h-16 sm:w-20 sm:h-20 rounded-full object-cover mb-3"
                />
                <h2 className="text-lg font-semibold text-center text-gray-800">
                  {(request.expertId.firstName || request.userId.firstName) +
                    " " +
                    (request.expertId.lastName || request.userId.lastName)}
                </h2>
                <p className="text-sm text-center text-gray-600 mt-2">
                  {request.issueDescription}
                </p>
                <p className="text-sm text-center text-gray-400 mt-1">
                  Requested on: {new Date(request.createdAt).toLocaleDateString()}
                </p>
                <p
                  className={`text-center font-medium mt-3 ${
                    request.status === "accepted"
                      ? "text-green-600"
                      : request.status === "pending"
                      ? "text-yellow-600"
                      : "text-red-600"
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
        <p className="text-center text-gray-500 mt-6">No requests in this category.</p>
      )}
    </div>
  );
};

export default ViewRequests;
