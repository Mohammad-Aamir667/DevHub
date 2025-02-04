
import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars, faTimes, faList, faClock, faCheckCircle, faStar, faComment } from "@fortawesome/free-solid-svg-icons";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import AcceptedRequests from "./AcceptedRequests";
import ExpertManageRequests from "./ExpertManageRequests";
import { handleCardClick, handleRequest, handleResolved } from "../utils/store";

const ExpertDashboard = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const totalRequests = useSelector((store) => store.expertInteractions);
  const pendingRequests = totalRequests?.pendingRequests;
  const acceptedRequests = totalRequests?.acceptedRequests;
  const resolvedRequests = totalRequests?.resolvedRequests;
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const onRequestHandle = (status, requestId) => {
    dispatch(handleRequest(status, requestId));
};
   const onRequestResolved = (requestId) => {
       dispatch(handleResolved( requestId));
   };

  const onCardClick = (userProfile) => {
      handleCardClick(userProfile, navigate);
  };
  
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };


  return (
    <div className="min-h-screen flex bg-gray-100">
      <div
        className={`fixed z-20 inset-y-0 left-0 transform ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"
          } transition-transform duration-300 ease-in-out bg-white w-64 shadow-md h-screen p-6 md:relative md:translate-x-0`}
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-700">Expert Dashboard</h2>
          {/* Close Button for Smaller Screens */}
          <button
            onClick={toggleSidebar}
            className="md:hidden text-gray-700 focus:outline-none"
          >
            <FontAwesomeIcon icon={faTimes} size="lg" />
          </button>
        </div>
        <ul className="space-y-4">
          <li>
            <Link to="/expert-dashboard" className="block text-gray-700 hover:text-blue-500">
              Dashboard
            </Link>
          </li>
          <li>
            <Link to="/expert-profile" className="block text-gray-700 hover:text-blue-500">
              Profile
            </Link>
          </li>
          <li>
            <li>
              <li>
                <Link
                  to={{
                    pathname: "/view-requests",
                    search: "?role=expert",
                  
                  }}
                >
                  View Requests (Expert)
                </Link>
              </li>
            </li>
          </li>
          <li>
            <a href="/settings" className="block text-gray-700 hover:text-blue-500">
              Settings
            </a>
          </li>
          <li>
            <Link to="/chat-list" className="block text-gray-700 hover:text-blue-500  items-center">
              <FontAwesomeIcon icon={faComment} size="lg" className="mr-2" />
              Messages
            </Link>
          </li>

        </ul>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-6">
        {/* Header with Toggle Button for Smaller Screens */}
        <header className="bg-white shadow p-4 flex items-center justify-between md:hidden">
          <h2 className="text-xl font-bold text-gray-700">Dashboard</h2>
          <button
            onClick={toggleSidebar}
            className="text-gray-700 focus:outline-none"
          >
            <FontAwesomeIcon icon={faBars} size="lg" />
          </button>
        </header>

        {/* Summary Section */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          {/* Total Requests */}
          <div className="bg-white p-4 shadow rounded-lg flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-600">Total Requests</h3>
              <p className="text-2xl font-bold text-gray-800">{totalRequests?.interactions?.length}</p>
            </div>
            <div className="text-blue-500">
              <FontAwesomeIcon icon={faList} size="2x" />
            </div>
          </div>

          {/* Pending Requests */}
          <div className="bg-white p-4 shadow rounded-lg flex items-center justify-between">
            <div onClick={() => { }}>
              <h3 className="text-lg font-semibold text-gray-600">Pending Requests</h3>
              <p className="text-2xl font-bold text-gray-800">{pendingRequests?.length}</p>
            </div>
            <div className="text-yellow-500">
              <FontAwesomeIcon icon={faClock} size="2x" />
            </div>
          </div>

          {/* Completed Requests */}
          <div className="bg-white p-4 shadow rounded-lg flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-600">Completed Requests</h3>
              <p className="text-2xl font-bold text-gray-800">{resolvedRequests?.length}</p>
            </div>
            <div className="text-green-500">
              <FontAwesomeIcon icon={faCheckCircle} size="2x" />
            </div>
          </div>

          {/* Reviews */}
          <div className="bg-white p-4 shadow rounded-lg flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-600">Reviews</h3>
              <p className="text-2xl font-bold text-gray-800">4.8/5</p>
            </div>
            <div className="text-purple-500">
              <FontAwesomeIcon icon={faStar} size="2x" />
            </div>
          </div>
        </div>

        {/* Main Sections */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Recent Requests */}
          <div className="bg-white p-6 shadow rounded-lg">
            <h3 className="text-lg font-bold text-gray-700 mb-4">Recent Requests</h3>
            <ExpertManageRequests pendingRequests={pendingRequests} handleRequest={onRequestHandle} />
          </div>
          {/* Schedule Section */}
          <div className="bg-white p-6 shadow rounded-lg">
            <h3 className="text-lg font-bold text-gray-700 mb-4">Your Schedule</h3>
            <div className="text-sm text-gray-600">No scheduled sessions for today.</div>
          </div>
        </div>
        <div className="bg-white p-6 shadow rounded-lg">
          <h3 className="text-lg font-bold text-gray-700 mb-4">Help Users</h3>
          <AcceptedRequests acceptedRequests={acceptedRequests} handleResolved={onRequestResolved} handleCardClick={onCardClick} />
        </div>
      </div>
    </div>
  );
};
export default ExpertDashboard;
