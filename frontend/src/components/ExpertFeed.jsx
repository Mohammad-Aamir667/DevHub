import React, { useEffect, useState } from "react";
import { BASE_URL } from "../utils/constants";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import ExpertFeedCard from "./ExpertFeedCard";
import { addExpertFeed } from "../utils/expertFeedSlice";
import { Link } from "react-router-dom";

const ExpertFeed = () => {
  const dispatch = useDispatch();
  const expertFeed = useSelector((store) => store.expertFeed);
  const [loading, setLoading] = useState(true);

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

  return (
    <div className="min-h-screen bg-dark-charcoal p-6">
      {/* Header Section */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-soft-white">
          Expert Listings
        </h2>
        <Link
          to="/view-requests?role=user"
          className="bg-purple-600 hover:bg-purple-700 text-soft-white px-4 py-2 rounded-lg text-sm transition-all"
        >
          View Requests
        </Link>
      </div>

      {/* Loading State */}
      {loading ? (
        <p className="text-center text-light-gray text-lg">Loading experts...</p>
      ) : expertFeed.length === 0 ? (
        <p className="text-center text-light-gray text-lg">
          No experts available at the moment.
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
          {expertFeed.map((expertDetails) => (
            <ExpertFeedCard key={expertDetails._id} expertDetails={expertDetails} />
          ))}
        </div>
      )}
    </div>
  );
};

export default ExpertFeed;
