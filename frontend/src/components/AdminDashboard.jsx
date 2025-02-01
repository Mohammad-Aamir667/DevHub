import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { BASE_URL } from "../utils/constants";
import ExpertDetail from "./ExpertDetail";
import { setExperts } from "../utils/expertSlice";
import { useNavigate } from "react-router-dom";
import ExpertCardList from "./ExpertCardList";

const AdminDashboard = () => {
  const dispatch = useDispatch();
  const experts = useSelector((state) => state.experts);
  const [currentStatus, setCurrentStatus] = useState("pending");
  const [selectedExpert, setSelectedExpert] = useState(null);
  const navigate = useNavigate();
  useEffect(() => {
    const fetchExperts = async () => {
      try {
        const response = await axios.get(BASE_URL+"/expert-list", {
          withCredentials: true,
        });
        const allExperts = response.data;
        dispatch(
          setExperts({
            pending: allExperts.filter((e) => e.status === "pending"),
            approved: allExperts.filter((e) => e.status === "approved"),
            rejected: allExperts.filter((e) => e.status === "rejected"),
          })
         
        );
      } catch (error) {
        console.error("Error fetching experts:", error);
      }
    };
    console.log(experts)
    fetchExperts();
  }, [dispatch]);

  const handleStatusChange = (status) => {
    setCurrentStatus(status);
    setSelectedExpert(null);
  };
  return (
    <div className="min-h-screen bg-gray-100 p-6">
              <button onClick = {()=>{navigate(-1)}} className="flex items-center text-darkPurple hover:text-electricBlue  rounded-lg focus:outline-none transition duration-200">
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
      <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">
        Admin Dashboard
      </h1>
      <div className="flex justify-center space-x-4 mb-6">
        {["pending", "approved", "rejected"].map((status) => (
          <button
            key={status}
            onClick={() => handleStatusChange(status)}
            className={`px-4 py-2 rounded-lg font-medium transition duration-200 ${
              currentStatus === status
                ? "bg-blue-600 text-white"
                : "bg-gray-300 text-gray-700 hover:bg-gray-400"
            }`}
          >
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </button>
        ))}
      </div>
      <div className="bg-white shadow-md rounded-lg p-6">
        {experts ? (
          selectedExpert ? (
            <ExpertDetail
              expert={selectedExpert}
              onBack={() => setSelectedExpert(null)}
            />
          ) : (
            <ExpertCardList experts = {experts[currentStatus]} onExpertClick={setSelectedExpert}/>
          )
        ) : (
          <p className="text-center text-gray-500">Loading experts...</p>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
