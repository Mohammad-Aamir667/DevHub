import React from 'react';

const ExpertManageRequests = ({ pendingRequests, handleRequest }) => {
  return (
    <div>
      {pendingRequests?.map((request) => {
        const { _id, issueDescription, userId } = request;
        const { firstName, lastName } = userId;

        return (
          <div key={_id} className="space-y-4">
            <div className="p-4 bg-gray-50 rounded-lg flex justify-between items-center">
              <div>
                <h4 className="text-sm font-medium text-gray-800">{firstName + " " + lastName}</h4>
                <p className="text-xs text-gray-600">{issueDescription}</p>
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => handleRequest("accepted", _id)}
                  className="bg-green-500 text-white px-3 py-1 rounded-lg text-sm"
                >
                  Accept
                </button>
                <button
                  onClick={() => handleRequest("declined", _id)}
                  className="bg-red-500 text-white px-3 py-1 rounded-lg text-sm"
                >
                  Decline
                </button>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default ExpertManageRequests;
