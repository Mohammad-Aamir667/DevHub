import React from 'react';

const AcceptedRequests = ({ acceptedRequests, handleCardClick, handleResolved }) => {
  return (
    <div>
      <div >
        {acceptedRequests?.map((request) => {
          const { _id, issueDescription } = request;
          const { firstName, lastName, about, photoUrl } = request?.userId;
          return (
            <div className="space-y-4" key={_id}>
              <div className="p-4 bg-gray-50 rounded-lg flex justify-between items-center">
                <div>
                  <h4 className="text-sm font-medium text-gray-800">
                    {firstName + " " + lastName}
                  </h4>
                  <p className="text-xs text-gray-600">{issueDescription}</p>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleCardClick(request?.userId)}
                    className="bg-green-500 text-white px-3 py-1 rounded-lg text-sm"
                  >
                    Chat
                  </button>
                  <button
                    onClick={() => handleResolved(_id)} // handleResolved function will be passed from the parent component
                    className="bg-blue-500 text-white px-3 py-1 rounded-lg text-sm"
                  >
                    Resolved
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default AcceptedRequests;
