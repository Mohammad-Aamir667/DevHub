import React from 'react';

const AcceptedRequests = ({ acceptedRequests, handleCardClick, handleResolved }) => {
  return (
    <div className="space-y-4">
      {acceptedRequests?.length > 0 ? (
        acceptedRequests.map((request) => {
          const { _id, issueDescription } = request;
          const { firstName, lastName, about, photoUrl } = request?.userId;
          return (
            <div
              key={_id}
              className="p-6 bg-gray-800 rounded-lg shadow-md flex justify-between items-center border border-blue-700 hover:shadow-lg transition-all"
            >
              <div className="flex items-center space-x-4">
                <img
                  src={photoUrl || '/default-avatar.png'}
                  alt={`${firstName} ${lastName}`}
                  className="w-16 h-16 rounded-full object-cover border-2 border-gray-600"
                />
                <div>
                  <h4 className="text-lg font-semibold text-white">
                    {firstName} {lastName}
                  </h4>
                  <p className="text-sm text-gray-300 truncate max-w-xs">{issueDescription}</p>
                </div>
              </div>
              <div className="flex space-x-3">
                <button
                  onClick={() => handleCardClick(request?.userId)}
                  className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-all"
                >
                  Chat
                </button>
                <button
                  onClick={() => handleResolved(_id)}
                  className="bg-blue-400 hover:bg-blue-500 text-white px-4 py-2 rounded-lg text-sm font-medium transition-all"
                >
                  Resolved
                </button>
              </div>
            </div>
          );
        })
      ) : (
        <p className="text-center text-gray-400 mt-6">No accepted requests available.</p>
      )}
    </div>
  );
};

export default AcceptedRequests;