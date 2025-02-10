'use client';

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
    dispatch(handleResolved(requestId));
  };

  const onCardClick = (userProfile) => {
    handleCardClick(userProfile, navigate);
  };
  
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="min-h-screen flex mt-16 bg-gray-900 text-gray-100">
      {/* Sidebar */}
      <div
        className={`fixed z-20 inset-y-0 left-0 transform ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        } transition-transform duration-300 ease-in-out bg-gray-800 w-64 shadow-lg h-screen p-6 md:relative md:translate-x-0`}
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-blue-400">Expert Dashboard</h2>
          <button
            onClick={toggleSidebar}
            className="md:hidden text-gray-400 hover:text-gray-200 focus:outline-none"
          >
            <FontAwesomeIcon icon={faTimes} size="lg" />
          </button>
        </div>
        <ul className="space-y-4">
          <li>
            <Link to="/expert-dashboard" className="block text-gray-300 hover:text-blue-400 transition duration-150">
              Dashboard
            </Link>
          </li>
          <li>
            <Link to="/expert-profile" className="block text-gray-300 hover:text-blue-400 transition duration-150">
              Profile
            </Link>
          </li>
          <li>
            <Link
              to="/view-requests?role=expert"
              className="block text-gray-300 hover:text-blue-400 transition duration-150"
            >
              View Requests
            </Link>
          </li>
          <li>
            <Link to="/settings" className="block text-gray-300 hover:text-blue-400 transition duration-150">
              Settings
            </Link>
          </li>
          <li>
            <Link to="/chat-list" className="flex items-center text-gray-300 hover:text-blue-400 transition duration-150">
              <FontAwesomeIcon icon={faComment} size="lg" className="mr-2" />
              Messages
            </Link>
          </li>
        </ul>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-6">
        {/* Header with Toggle Button for Smaller Screens */}
        <header className="bg-gray-800 shadow p-4 flex items-center justify-between md:hidden mb-6 rounded-lg">
          <h2 className="text-xl font-bold text-blue-400">Dashboard</h2>
          <button
            onClick={toggleSidebar}
            className="text-gray-400 hover:text-gray-200 focus:outline-none"
          >
            <FontAwesomeIcon icon={faBars} size="lg" />
          </button>
        </header>

        {/* Summary Section */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          {/* Total Requests */}
          <div className="bg-gray-800 p-4 shadow rounded-lg flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-400">Total Requests</h3>
              <p className="text-2xl font-bold text-blue-400">{totalRequests?.interactions?.length}</p>
            </div>
            <div className="text-blue-500">
              <FontAwesomeIcon icon={faList} size="2x" />
            </div>
          </div>

          {/* Pending Requests */}
          <div className="bg-gray-800 p-4 shadow rounded-lg flex items-center justify-between">
            <div onClick={() => {}}>
              <h3 className="text-lg font-semibold text-gray-400">Pending Requests</h3>
              <p className="text-2xl font-bold text-yellow-400">{pendingRequests?.length}</p>
            </div>
            <div className="text-yellow-500">
              <FontAwesomeIcon icon={faClock} size="2x" />
            </div>
          </div>

          {/* Completed Requests */}
          <div className="bg-gray-800 p-4 shadow rounded-lg flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-400">Completed Requests</h3>
              <p className="text-2xl font-bold text-green-400">{resolvedRequests?.length}</p>
            </div>
            <div className="text-green-500">
              <FontAwesomeIcon icon={faCheckCircle} size="2x" />
            </div>
          </div>

          {/* Reviews */}
          <div className="bg-gray-800 p-4 shadow rounded-lg flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-400">Reviews</h3>
              <p className="text-2xl font-bold text-purple-400">4.8/5</p>
            </div>
            <div className="text-purple-500">
              <FontAwesomeIcon icon={faStar} size="2x" />
            </div>
          </div>
        </div>

        {/* Main Sections */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Recent Requests */}
          <div className="bg-gray-800 p-6 shadow rounded-lg">
            <h3 className="text-lg font-bold text-blue-400 mb-4">Recent Requests</h3>
            <ExpertManageRequests pendingRequests={pendingRequests} handleRequest={onRequestHandle} />
          </div>
          {/* Schedule Section */}
          <div className="bg-gray-800 p-6 shadow rounded-lg">
            <h3 className="text-lg font-bold text-blue-400 mb-4">Your Schedule</h3>
            <div className="text-sm text-gray-400">No scheduled sessions for today.</div>
          </div>
        </div>
        <div className="bg-gray-800 p-6 shadow rounded-lg mt-6">
          <h3 className="text-lg font-bold text-blue-400 mb-4">Help Users</h3>
          <AcceptedRequests acceptedRequests={acceptedRequests} handleResolved={onRequestResolved} handleCardClick={onCardClick} />
        </div>
      </div>
    </div>
  );
};

export default ExpertDashboard;
