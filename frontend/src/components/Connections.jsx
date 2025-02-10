import axios from "axios";
import React, { useEffect } from "react";
import { BASE_URL } from "../utils/constants";
import { useDispatch, useSelector } from "react-redux";
import { addConnections } from "../utils/connectionSlice";
import { useNavigate } from "react-router-dom";

const Connections = () => {
  const connections = useSelector((store) => store.connections);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const viewProfile = (connection) => {
    navigate(`/view-profile`, { state: { userProfile: connection } });
  };

  const getConnections = async () => {
    try {
      const res = await axios.get(BASE_URL + "/user/connection", {
        withCredentials: true,
      });
      dispatch(addConnections(res?.data));
    } catch (err) {
      console.log(err.message);
    }
  };

  useEffect(() => {
    getConnections();
  }, []);

  if (!connections) return null;
  if (connections?.length === 0)
    return (
      <div className="text-center text-light-gray text-lg mt-10">
        No Connection found!
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-900  p-6 flex flex-col items-center">
      {/* Back Button */}
      <div className="w-full max-w-3xl flex items-center mb-6">
        <button
          onClick={() => navigate(-1)}
          className="text-electric-blue hover:text-cyan-400 transition duration-200 flex items-center space-x-2"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
            className="w-5 h-5"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
          <span>Back</span>
        </button>
      </div>

      {/* Header */}
      <h1 className="text-2xl font-semibold text-soft-white mb-6">Connections</h1>

      {/* Connection Cards */}
      <div className="w-full max-w-4xl grid grid-cols-1 sm:grid-cols-2 gap-6">
        {connections.data.map((connection) => {
          const { firstName, lastName, about, photoUrl, _id } = connection;
          return (
            <div
              key={_id}
              className="bg-gray-800 shadow-lg rounded-xl p-5 flex items-center space-x-4 transition-all duration-300 hover:shadow-xl hover:scale-[1.02]"
            >
              {/* Profile Image */}
              <img
                src={photoUrl}
                alt={firstName}
                className="w-16 h-16 rounded-full border-2 border-electric-blue object-cover"
              />

              {/* User Info */}
              <div className="flex-1">
                <h2 className="text-lg font-semibold text-soft-white">
                  {firstName} {lastName}
                </h2>
                <p className="text-sm text-gray-400">{about}</p>
              </div>

              {/* View Profile Button */}
              <button
                onClick={() => viewProfile(connection)}
                className="bg-cyan-600 hover:bg-cyan-700 text-soft-white px-4 py-2 rounded-lg text-sm font-medium transition-all"
              >
                View Profile
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Connections;
