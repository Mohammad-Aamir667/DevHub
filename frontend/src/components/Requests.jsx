import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { BASE_URL } from '../utils/constants';
import { useDispatch, useSelector } from 'react-redux';
import { addRequest, removeRequest } from '../utils/requestSlice';
import { UserIcon } from 'lucide-react';

const Requests = () => {
  const dispatch = useDispatch();
  const requests = useSelector((store) => store.requests);
  const [isLoading, setIsLoading] = useState(true);
  const reqLen = requests?.length || 0;

  const handleReviewRequest = async (status, _id) => {
    try {
      await axios.post(`${BASE_URL}/request/review/${status}/${_id}`, {}, {
        withCredentials: true,
      });
      dispatch(removeRequest(_id));
    } catch (err) {
      console.error("Error updating request:", err);
    }
  };

  const getRequests = async () => {
    setIsLoading(true);
    try {
      const res = await axios.get(`${BASE_URL}/user/requests/received`, {
        withCredentials: true,
      });
      dispatch(addRequest(res.data?.connectionRequests));
    } catch (err) {
      console.error("Error fetching requests:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getRequests();
  }, []);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!requests || requests.length === 0) {
    return (
      <div className="flex justify-center items-center mt-10 bg-gray-900 rounded-lg p-8 shadow-lg">
        <h1 className="text-xl font-semibold text-gray-200">No requests found</h1>
      </div>
    );
  }

  return (
    <div className="flex justify-center items-center flex-col mt-10 space-y-6 w-full max-w-4xl mx-auto px-4">
      <h1 className="text-2xl font-bold text-white">
        Connection Requests <span className="text-blue-500">({reqLen})</span>
      </h1>

      <div className="w-full space-y-4">
        {requests.map((request) => {
          const { _id } = request;
          const { firstName, lastName, about, photoUrl } = request.fromUserId;
          
          return (
            <div key={_id} className="w-full">
              <div className="bg-gray-900 rounded-lg shadow-lg overflow-hidden border border-gray-800 hover:border-blue-600 transition-all">
                <div className="flex flex-col md:flex-row p-4 gap-4">
                  <div className="flex-shrink-0 flex justify-center">
                    {photoUrl ? (
                      <img 
                        src={photoUrl || "/placeholder.svg"} 
                        alt={`${firstName}'s profile`} 
                        className="w-20 h-20 rounded-full object-cover border-2 border-blue-600" 
                      />
                    ) : (
                      <div className="w-20 h-20 rounded-full bg-gradient-to-r from-gray-800 to-blue-600 flex items-center justify-center">
                        <UserIcon className="w-10 h-10 text-white" />
                      </div>
                    )}
                  </div>
                  
                  <div className="flex-1 flex flex-col">
                    <h2 className="text-xl font-semibold text-white">{firstName} {lastName}</h2>
                    <p className="text-gray-400 my-2 line-clamp-2">{about || "No information provided"}</p>
                    
                    <div className="flex justify-end gap-3 mt-auto">
                      <button 
                        onClick={() => handleReviewRequest("rejected", _id)} 
                        className="px-4 py-2 rounded-md bg-gray-800 text-gray-200 hover:bg-gray-700 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-700 focus:ring-offset-2 focus:ring-offset-gray-900"
                      >
                        Decline
                      </button>
                      <button 
                        onClick={() => handleReviewRequest("accepted", _id)} 
                        className="px-4 py-2 rounded-md bg-gradient-to-r from-blue-700 to-blue-600 text-white hover:from-blue-800 hover:to-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2 focus:ring-offset-gray-900"
                      >
                        Accept
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Requests;