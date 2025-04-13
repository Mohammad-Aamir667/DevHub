"use client"

const ExpertManageRequests = ({ pendingRequests, handleRequest }) => {
  return (
    <div className="space-y-4">
      {pendingRequests?.length > 0 ? (
        pendingRequests.map((request) => {
          const { _id, issueDescription, userId } = request
          const { firstName, lastName } = userId

          return (
            <div
              key={_id}
              className="bg-gray-800 rounded-lg border border-gray-700 overflow-hidden transition-all duration-300 hover:border-gray-600"
            >
              <div className="p-4">
                <div className="flex items-center mb-2">
                  <div className="w-8 h-8 rounded-full bg-blue-500/20 text-blue-500 flex items-center justify-center font-medium mr-3">
                    {firstName.charAt(0)}
                    {lastName.charAt(0)}
                  </div>
                  <h4 className="font-medium text-gray-200">
                    {firstName} {lastName}
                  </h4>
                </div>

                <p className="text-sm text-gray-400 mb-4 line-clamp-2">{issueDescription}</p>

                <div className="flex space-x-3 mt-2">
                  <button
                    onClick={() => handleRequest("accepted", _id)}
                    className="flex-1 bg-green-500/10 hover:bg-green-500/20 text-green-500 border border-green-500/20 px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200"
                  >
                    Accept
                  </button>
                  <button
                    onClick={() => handleRequest("declined", _id)}
                    className="flex-1 bg-red-500/10 hover:bg-red-500/20 text-red-500 border border-red-500/20 px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200"
                  >
                    Decline
                  </button>
                </div>
              </div>
            </div>
          )
        })
      ) : (
        <div className="text-center py-6 text-gray-500">
          <p>No pending requests</p>
        </div>
      )}
    </div>
  )
}

export default ExpertManageRequests
