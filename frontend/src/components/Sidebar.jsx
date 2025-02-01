import React from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faComment } from "@fortawesome/free-solid-svg-icons";

const Sidebar = ({ isSidebarOpen, toggleSidebar }) => {
  return (
    <div
      className={`fixed z-20 inset-y-0 left-0 transform ${
        isSidebarOpen ? "translate-x-0" : "-translate-x-full"
      } transition-transform duration-300 ease-in-out bg-white w-64 shadow-md h-screen p-6 md:relative md:translate-x-0`}
    >
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-gray-700">Expert Dashboard</h2>
        <button
          onClick={toggleSidebar}
          className="md:hidden text-gray-700 focus:outline-none"
        >
          ✖
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
          <Link to="/requests" className="block text-gray-700 hover:text-blue-500">
            Requests
          </Link>
        </li>
        <li>
          <Link to="/settings" className="block text-gray-700 hover:text-blue-500">
            Settings
          </Link>
        </li>
        <li>
          <Link to="/chat-list" className="block text-gray-700 hover:text-blue-500  items-center">
            <FontAwesomeIcon icon={faComment} className="mr-2" />
            Messages
          </Link>
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;
