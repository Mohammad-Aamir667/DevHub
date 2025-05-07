"use client"

import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { BASE_URL } from '../utils/constants';
import { useDispatch, useSelector } from 'react-redux';
import { addRequest, removeRequest } from '../utils/requestSlice';
import { ArrowLeft, UserCircle, ExternalLink } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { handleAxiosError } from '../utils/handleAxiosError';

const Requests = () => {
  const dispatch = useDispatch();
  const requests = useSelector((store) => store.requests);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const [error, setError] = useState(false);
  const handleReviewRequest = async (status, _id, e) => {
    e.stopPropagation(); // Prevent triggering the parent onClick
    try {
      await axios.post(`${BASE_URL}/request/review/${status}/${_id}`, {}, {
        withCredentials: true,
      });
      dispatch(removeRequest(_id));

    } catch (err) {
      handleAxiosError(err, {}, [], "request-error")
    }
  };

  const viewProfile = (fromUser) => {
    navigate(`/view-profile`, { state: { userProfile: fromUser } });
  };

  const getRequests = async () => {
    setIsLoading(true);
    try {
      setError(false) 
      const res = await axios.get(`${BASE_URL}/user/requests/received`, {
        withCredentials: true,
      });
      dispatch(addRequest(res.data?.connectionRequests));
    } catch (err) {
      setError(true) 
      handleAxiosError(err,{},[],"request-error")
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
  // if (!requests)
  {
    getRequests();
   
    }
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b mt-14 from-slate-950 to-slate-900 pt-5 px-6 py-12 flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-cyan-500"></div>
      </div>
    );
  }
  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-950 to-slate-900 flex items-center justify-center px-4">
        <div className="bg-slate-800 border border-slate-700 p-8 rounded-xl text-center max-w-md w-full">
          <h2 className="text-xl font-semibold text-red-400 mb-2">Failed to load connection requests</h2>
          <p className="text-slate-400 mb-4">Something went wrong while fetching your connection requests. Please try again.</p>
          <button
            onClick={getRequests}
            className="bg-gradient-to-r from-cyan-500 to-blue-600 text-white px-4 py-2 rounded-md font-medium hover:opacity-90 transition"
          >
            Retry
          </button>
        </div>
      </div>
    )
  }
  return (
    <div className="min-h-screen bg-gradient-to-b mt-14 from-slate-950 to-slate-900 pt-5 px-6 py-12">
      <div className="max-w-4xl mx-auto">
        {/* Header with Back Button */}
        <div className="mb-8 flex items-center justify-between">
          <button
            onClick={() => navigate(-1)}
            className="text-slate-400 hover:text-slate-100 hover:bg-slate-800 p-2 sm:p-3 rounded-md flex items-center text-sm sm:text-base transition-colors"
          >
            <ArrowLeft className="w-5 h-5 sm:w-6 sm:h-6 mr-2" /> 
          </button>

          <div className="text-center flex-1">
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-100">Connection Requests</h1>
            <p className="text-slate-400">Manage your network connection requests</p>
          </div>
        </div>

        {/* Empty State */}
        {(!requests || requests.length === 0) && (
          <div className="bg-slate-800 border border-slate-700 rounded-xl p-10 text-center">
            <div className="flex justify-center mb-4">
              <UserCircle className="h-16 w-16 text-slate-600" />
            </div>
            <h3 className="text-xl font-semibold text-slate-300 mb-2">No Requests Found</h3>
            <p className="text-slate-400 mb-6 max-w-md mx-auto">
              You don't have any pending connection requests at the moment.
            </p>
          </div>
        )}

        {/* Request Cards */}
        {requests && requests.length > 0 && (
          <div className="grid grid-cols-1 gap-6">
            {requests.map((request) => {
              const { _id } = request;
              const { firstName, lastName, about, photoUrl, skills } = request.fromUserId;
              const skillsArray = Array.isArray(skills) ? skills.slice(0, 2) : [];
              
              return (
                <div
                  key={_id}
                  className="bg-slate-800 border border-slate-700 rounded-xl overflow-hidden transition-all duration-300 hover:shadow-lg hover:border-slate-600 group"
                >
                  <div className="h-2 bg-gradient-to-r from-cyan-500 to-blue-600"></div>
                  <div className="p-5">
                    <div className="flex items-start gap-4">
                      {/* Profile Image */}
                      <div className="relative">
                        <div className="absolute inset-0 rounded-full bg-gradient-to-r from-cyan-500 to-blue-600 opacity-70 animate-pulse"></div>
                        <img
                          src={photoUrl || "/placeholder.svg"}
                          alt={`${firstName} ${lastName}`}
                          className="w-16 h-16 rounded-full border-2 border-slate-700 object-cover relative z-10"
                        />
                      </div>

                      {/* User Info */}
                      <div className="flex-1">
                        <h2 className="text-lg font-semibold text-slate-100">
                          {firstName} {lastName}
                        </h2>
                        
                        {skillsArray && skillsArray.length > 0 && (
                          <div className="flex flex-wrap gap-2 mt-1 mb-2 max-w-full">
                            {skillsArray.map((skill, index) => (
                              <span
                                key={index}
                                className="bg-slate-700 text-cyan-300 px-2 py-0.5 rounded-md text-xs sm:text-sm font-medium truncate max-w-[120px] sm:max-w-[150px]"
                              >
                                {skill}
                              </span>
                            ))}
                            {skills?.length > 2 && (
                              <span className="text-slate-400 text-xs sm:text-sm">+more</span>
                            )}
                          </div>
                        )}

                        {/* About */}
                        <p className="text-xs sm:text-sm text-slate-400 break-words max-w-full">
                          {about?.length > 50
                            ? about.slice(0, 50) + "..."
                            : about || "No bio available"}
                        </p>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="mt-4 flex justify-between items-center">
                      <button
                        onClick={() => viewProfile(request.fromUserId)}
                        className="bg-slate-700 hover:bg-slate-600 text-slate-200 px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center"
                      >
                        View Profile <ExternalLink className="w-3.5 h-3.5 ml-2" />
                      </button>
                      
                      <div className="flex gap-3">
                        <button 
                          onClick={(e) => handleReviewRequest("rejected", _id, e)} 
                          className="px-4 py-2 rounded-lg bg-slate-700 text-slate-200 hover:bg-slate-600 transition-colors focus:outline-none focus:ring-2 focus:ring-slate-600 focus:ring-offset-2 focus:ring-offset-slate-800 text-sm font-medium"
                        >
                          Decline
                        </button>
                        <button 
                          onClick={(e) => handleReviewRequest("accepted", _id, e)} 
                          className="px-4 py-2 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600 text-white hover:from-cyan-600 hover:to-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2 focus:ring-offset-slate-800 text-sm font-medium"
                        >
                          Accept
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default Requests;