import React from 'react';
import { Link } from 'react-router-dom';
import { FiHome, FiMessageSquare, FiUsers, FiBriefcase, FiSettings } from 'react-icons/fi'; // Icons from react-icons
import { useSelector } from 'react-redux';


const BottomNavigation = () => {
  const user = useSelector((store) => store.user);

  if (!user) return null;
  return (
    <div className="fixed z-30 bottom-0 left-0 w-full bg-gray-800 border-t border-gray-700 shadow-lg">
      <div className="flex justify-around items-center py-2 max-w-md mx-auto">
        <Link
          to="/"
          className="flex flex-col items-center text-soft-white hover:text-electric-blue transition duration-200"
        >
          <FiHome className="text-2xl mb-1" />
          <span className="text-xs">Feed</span>
        </Link>
        <Link
          to="/chat-list"
          className="flex flex-col items-center text-soft-white hover:text-electric-blue transition duration-200"
        >
          <FiMessageSquare className="text-2xl mb-1" />
          <span className="text-xs">Chats</span>
        </Link>
        <Link
          to="/connections"
          className="flex flex-col items-center text-soft-white hover:text-electric-blue transition duration-200"
        >
          <FiUsers className="text-2xl mb-1" />
          <span className="text-xs">Connections</span>
        </Link>
        <Link
          to="/experts"
          className="flex flex-col items-center text-soft-white hover:text-electric-blue transition duration-200"
        >
          <FiBriefcase className="text-2xl mb-1" />
          <span className="text-xs">Experts</span>
        </Link>
        {(user.role === "super-admin" || user.role === "admin") && (
          <Link
            to={user.role === "super-admin" ? "/admin/dashboard" : "/expert/dashboard"}
            className="flex flex-col items-center text-soft-white hover:text-electric-blue transition duration-200"
          >
            <FiSettings className="text-2xl mb-1" />
            <span className="text-xs">Dashboard</span>
          </Link>
        )}
      </div>
    </div>
  )
}

export default BottomNavigation