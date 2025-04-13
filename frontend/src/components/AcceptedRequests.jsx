"use client"

import { MessageSquare, CheckCircle } from "lucide-react"

const AcceptedRequests = ({ acceptedRequests, handleCardClick, handleResolved }) => {
  return (
    <div className="space-y-4">
      {acceptedRequests?.length > 0 ? (
        acceptedRequests.map((request) => {
          const { _id, issueDescription } = request
          const { firstName, lastName, photoUrl } = request?.userId

          return (
            <div
              key={_id}
              className="bg-gray-800 rounded-lg border border-gray-700 overflow-hidden transition-all duration-300 hover:border-gray-600"
            >
              <div className="p-4">
                <div className="flex items-center mb-3">
                  {photoUrl ? (
                    <img
                      src={photoUrl || "/placeholder.svg"}
                      alt={`${firstName} ${lastName}`}
                      className="w-10 h-10 rounded-full object-cover border border-gray-600 mr-3"
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-blue-500/20 text-blue-500 flex items-center justify-center font-medium mr-3">
                      {firstName.charAt(0)}
                      {lastName.charAt(0)}
                    </div>
                  )}
                  <div>
                    <h4 className="font-medium text-gray-200">
                      {firstName} {lastName}
                    </h4>
                    <p className="text-xs text-gray-400">User</p>
                  </div>
                </div>

                <p className="text-sm text-gray-400 mb-4 line-clamp-2">{issueDescription}</p>

                <div className="flex space-x-3 mt-2">
                  <button
                    onClick={() => handleCardClick(request?.userId)}
                    className="flex-1 bg-blue-500/10 hover:bg-blue-500/20 text-blue-500 border border-blue-500/20 px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 flex items-center justify-center"
                  >
                    <MessageSquare className="w-4 h-4 mr-2" />
                    Chat
                  </button>
                  <button
                    onClick={() => handleResolved(_id)}
                    className="flex-1 bg-green-500/10 hover:bg-green-500/20 text-green-500 border border-green-500/20 px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 flex items-center justify-center"
                  >
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Resolved
                  </button>
                </div>
              </div>
            </div>
          )
        })
      ) : (
        <div className="text-center py-8 text-gray-500">
          <p>No accepted requests available.</p>
        </div>
      )}
    </div>
  )
}

export default AcceptedRequests
