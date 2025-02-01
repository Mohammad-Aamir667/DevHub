import React from 'react';
import { Link } from 'react-router-dom';
import { FiHome, FiMessageSquare, FiUsers, FiBriefcase, FiSettings } from 'react-icons/fi'; // Icons from react-icons
import { useSelector } from 'react-redux';

const BottomNavigation = () => {
  const user = useSelector((store) => store.user);

  if (!user) return null; 

  return (
    <div className="fixed z-30 bottom-0 left-0 w-full bg-vibrantClay text-softWhite border-t border-gray-700 shadow-lg">
      <div className="flex justify-around items-center py-3">
        <Link to="/" className="flex flex-col items-center text-black hover:text-lightGray">
          <FiHome className="text-2xl" />
          <span className="text-sm">Feed</span>
        </Link>
        <Link to="/chat-list" className="flex flex-col items-center text-black hover:text-lightGray">
          <FiMessageSquare className="text-2xl" />
          <span className="text-sm">Chat</span>
        </Link>
        <Link to="/connections" className="flex flex-col items-center text-black hover:text-lightGray">
          <FiUsers className="text-2xl" />
          <span className="text-sm">Connections</span>
        </Link>
        <Link to="/experts" className="flex flex-col items-center text-black hover:text-lightGray">
          <FiBriefcase className="text-2xl" />
          <span className="text-sm">Experts</span>
        </Link>
        {( user.role === 'super-admin') && (
          <Link to="/admin/dashboard" className="flex flex-col items-center text-black hover:text-lightGray">
            <FiSettings className="text-2xl" />
            <span className="text-sm">Dashboard</span>
          </Link>
        )}
           {( user.role === 'admin') && (
          <Link to="/expert/dashboard" className="flex flex-col items-center text-black hover:text-lightGray">
            <FiSettings className="text-2xl" />
            <span className="text-sm">Dashboard</span>
          </Link>
        )}
      </div>
    </div>
  );
};

export default BottomNavigation;
