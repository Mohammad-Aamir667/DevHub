'use client';

import React, { useEffect, useState } from "react";
import { BASE_URL } from "../utils/constants";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import ExpertFeedCard from "./ExpertFeedCard";
import { addExpertFeed } from "../utils/expertFeedSlice";
import { Link } from "react-router-dom";
import { Search } from 'lucide-react';
import { setInteractions } from "../utils/interactionSlice";

const ExpertFeed = () => {
  const dispatch = useDispatch();
  const expertFeed = useSelector((store) => store.expertFeed);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const getExperts = async () => {
      try {
        const res = await axios.get(`${BASE_URL}/expert-list/approved`, {
          withCredentials: true,
        });
        dispatch(addExpertFeed(res?.data));
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    getExperts();
  }, [dispatch]);
  
  const fetchUserInteractions = async () => {
    try {
      const userInteractions = await axios.get(
        BASE_URL + "/user-interactions",
        { withCredentials: true }
      );
      dispatch(setInteractions(userInteractions.data));
    } catch (err) {
      console.error("Error fetching interactions:", err);
    }
  };

  useEffect(() => {
    fetchUserInteractions();
  }, []);

  const filteredFeed = expertFeed?.filter((expert) => {
    const lowerSearch = searchTerm.toLowerCase();
    return (
      expert.expertId.firstName?.toLowerCase().includes(lowerSearch) ||
      expert.expertId.lastName?.toLowerCase().includes(lowerSearch) ||
      expert.expertise.some((exp) => exp.toLowerCase().includes(lowerSearch)) ||
      expert?.skills?.some((skill) => skill.toLowerCase().includes(lowerSearch))
    );
  });

  return (
    <div className="min-h-screen bg-gradient-to-b from-dark-charcoal mt-9 py-8 bg-gray-900  p-6">
      <div className="max-w-7xl mx-auto">
        
        <div className="fixed top-16 left-0 w-full z-10  bg-gray-800 shadow-md py-2 px-6 flex justify-between items-center rounded-lg">
          <div className="relative w-1/2">
            <input
              type="text"
              placeholder="Search Experts..."
              className="w-full p-4 pl-12 bg-gray-800 text-white border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
          </div>

          
          <Link
            to="/view-requests?role=user"
            className="bg-blue-400 hover:bg-blue-500 text-soft-white px-6 py-3 rounded-lg text-sm font-medium transition-all shadow-lg hover:shadow-xl"
          >
            View Requests
          </Link>
        </div>

        {/* Loading State */}
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : expertFeed.length === 0 ? (
          <p className="text-center text-light-gray text-lg bg-gray-800 rounded-lg p-4 shadow-md">
            No experts available at the moment.
          </p>
        ) : (
          <div className="mt-24">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredFeed?.map((expertDetails) => (
                <ExpertFeedCard key={expertDetails._id} expertDetails={expertDetails} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ExpertFeed;
