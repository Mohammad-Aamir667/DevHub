import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";  
import axios from "axios";
import { BASE_URL } from "../utils/constants";
import ConfirmModal from "./common/ConfirmModal";

const Dashboard = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setModalOpen] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState(null);

  const navigate = useNavigate();  

  const fetchUsers = async () => {
    try {
      const res = await axios.get(BASE_URL+"/admin/users", { withCredentials: true });
      setUsers(res.data);
    } catch (err) {
      console.error("Error fetching users:", err.response?.data || err.message);
    }
  };

  const handlePromoteClick = (userId) => {
    setSelectedUserId(userId);
    setModalOpen(true);
  };

  const promoteToAdmin = async () => {
    try {
      setLoading(true);
      const res = await axios.put(BASE_URL+"/promote-to-admin/"+selectedUserId, {}, { withCredentials: true });
      fetchUsers(); 
    } catch (err) {
      alert(err.response?.data?.message || "An error occurred while promoting the user.");
    } finally {
      setLoading(false);
      setModalOpen(false);
      setSelectedUserId(null);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <div className="p-6 bg-gray-100 min-h-screen relative">
      <button 
        onClick={() => navigate(-1)} 
        className="absolute top-4 left-4 flex items-center text-darkPurple hover:text-electricBlue font-semibold px-4 py-2 rounded-lg focus:outline-none transition duration-200 z-10"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={2}
          stroke="currentColor"
          className="w-5 h-5 mr-2"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M15 19l-7-7 7-7"
          />
        </svg>
       
      </button>
      <h1 className="text-3xl font-bold mb-6 text-gray-800 mt-8">Admin Dashboard</h1>
      <div className="overflow-x-auto">
        <table className="table-auto w-full bg-white shadow-lg rounded-lg">
          <thead>
            <tr className="bg-gray-800 text-white">
              <th className="px-6 py-3 text-left text-sm font-medium uppercase tracking-wider">Name</th>
              <th className="px-6 py-3 text-left text-sm font-medium uppercase tracking-wider">Email</th>
              <th className="px-6 py-3 text-left text-sm font-medium uppercase tracking-wider">Role</th>
              <th className="px-6 py-3 text-left text-sm font-medium uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.length > 0 ? (
              users.map((user, index) => (
                <tr
                  key={user._id}
                  className={`${
                    index % 2 === 0 ? "bg-gray-50" : "bg-white"
                  } hover:bg-gray-100`}
                >
                  <td className="px-6 py-4 whitespace-nowrap text-gray-700">{user.firstName} {user.lastName}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-700">{user.emailId}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-700 capitalize">{user.role}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {user.role !== "admin" && (
                      <button
                        onClick={() => handlePromoteClick(user._id)}
                        className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400 disabled:opacity-50"
                        disabled={loading}
                      >
                        Promote to Admin
                      </button>
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan="4"
                  className="px-6 py-4 text-center text-gray-500"
                >
                  No users found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <ConfirmModal
        isOpen={isModalOpen}
        message="Are you sure you want to promote this user to admin?"
        onConfirm={promoteToAdmin}
        onCancel={() => setModalOpen(false)}
      />
    </div>
  );
};

export default Dashboard;
