"use client"

import axios from "axios"
import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { BASE_URL } from "../utils/constants"
import { useNavigate } from "react-router-dom"
import { addConversation } from "../utils/conversationsSlice"
import { addConnections } from "../utils/connectionSlice"
import { ArrowLeft, Users, Check, X, UserPlus } from 'lucide-react'
import { handleAxiosError } from "../utils/handleAxiosError"

const CreateGroupChat = () => {
  const [selectedParticipants, setSelectedParticipants] = useState([])
  const [error, setError] = useState("")
  const dispatch = useDispatch()
  const connections = useSelector((store) => store.connections)
  const [groupName, setGroupName] = useState("")
  const navigate = useNavigate()
  const [showCreateButton, setShowCreateButton] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")

  const handleSelectParticipants = (connection) => {
    setSelectedParticipants((prev) => {
      const isAlreadySelected = prev.some((p) => p._id === connection._id)
      return isAlreadySelected ? prev.filter((p) => p._id !== connection._id) : [...prev, connection]
    })
  }
  const getConnections = async () => {
    try {
      const res = await axios.get(BASE_URL + "/user/connection", { withCredentials: true })
      dispatch(addConnections(res?.data))
    } catch (err) {
      console.log(err.message)
    }
  }

  useEffect(() => {
    if (!connections) getConnections()
  }, [connections])

  const handleCreateGroup = async () => {
    if (!groupName.trim()) {
      setError("Please enter a group name")
      return
    }

    try {
      const participantIds = selectedParticipants.map((p) => p._id)
      console.log(participantIds);
      const res = await axios.post(
        BASE_URL + "/create-group-chat",
        { participantIds, groupName },
        { withCredentials: true }
      )
      dispatch(addConversation(res.data))
      navigate("/chat-list")
    } catch (err) {
      if(err.response?.status === 400) 
      setError(err.response?.data?.message || "An unexpected error occurred. Please try again.")
      handleAxiosError(err, {}, [400], "group-chat-error-toast")

    }

  }

  // Filter connections based on search term
  const filteredConnections = connections?.data?.filter((connection) => {
    const fullName = `${connection.firstName} ${connection.lastName}`.toLowerCase()
    return fullName.includes(searchTerm.toLowerCase())
  })

  return (
    <div className={`min-h-screen bg-gradient-to-b mt-6 from-slate-950 to-slate-900 pt-16 px-4 sm:px-6 py-12 flex justify-center `}>
      {connections && connections?.data?.length > 0 ? (
        <div className="max-w-2xl w-full bg-slate-800 border border-slate-700 rounded-xl shadow-xl overflow-hidden">
          <div className="h-2 bg-gradient-to-r from-cyan-500 to-blue-600"></div>

          <div className="p-6">
            {/* Header with back button */}
            <div className="flex items-center mb-6">
            <button
                  onClick={() => navigate(-1)}
                  className="text-slate-400 hover:text-slate-100 hover:bg-slate-800 p-2 sm:p-3 rounded-md flex items-center text-sm sm:text-base transition-colors"
                >
                  <ArrowLeft className="w-5 h-5 sm:w-6 sm:h-6 mr-2" /> 
                </button>
              <h1 className="text-xl font-bold text-slate-100 ml-4 flex items-center">
                <Users className="w-5 h-5 mr-2 text-cyan-400" /> Create Group Chat
              </h1>
            </div>

            {/* Group Name Input (conditionally shown) */}
            {showCreateButton && (
              <div className="mb-6 bg-slate-700 p-4 rounded-lg border border-slate-600">
                <label className="block text-sm font-medium text-slate-300 mb-2">Group Name</label>
                <input
                  type="text"
                  value={groupName}
                  onChange={(e) => setGroupName(e.target.value)}
                  className="w-full px-4 py-2 bg-slate-800 text-slate-200 rounded-lg border border-slate-600 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                  placeholder="Enter group name"
                />
              </div>
            )}

            {/* Selected Participants */}
            {selectedParticipants.length > 0 && (
              <div className="mb-4">
                <h2 className="text-sm font-medium text-slate-300 mb-2">Selected ({selectedParticipants.length})</h2>
                <div className="flex flex-wrap gap-2">
                  {selectedParticipants.map((participant) => (
                    <div
                      key={participant._id}
                      className="flex items-center bg-slate-700 text-slate-200 px-2 py-1 rounded-full text-sm"
                    >
                      <img
                        src={participant.photoUrl || "/placeholder.svg"}
                        alt={participant.firstName}
                        className="w-5 h-5 rounded-full mr-1"
                      />
                      <span className="truncate max-w-[100px]">
                        {participant.firstName} {participant.lastName}
                      </span>
                      <button
                        onClick={() => handleSelectParticipants(participant)}
                        className="ml-1 text-slate-400 hover:text-slate-200"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Search Input */}
            <div className="mb-4 relative">
              <input
                type="text"
                placeholder="Search connections..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-2 pl-10 bg-slate-700 text-slate-200 rounded-lg border border-slate-600 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
              />
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg
                  className="h-5 w-5 text-slate-400"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path
                    fillRule="evenodd"
                    d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
            </div>

            {/* Participant List */}
            <div className="space-y-2 max-h-64 overflow-y-auto pr-1 mb-6">
              {filteredConnections?.map(({ _id, firstName, lastName, photoUrl }) => {
                const isSelected = selectedParticipants.some((p) => p._id === _id)
                return (
                  <div
                    key={_id}
                    onClick={() => handleSelectParticipants({ _id, firstName, lastName, photoUrl })}
                    className={`flex items-center p-3 rounded-lg cursor-pointer transition border ${
                      isSelected
                        ? "bg-slate-700 border-cyan-500 border-opacity-50"
                        : "border-slate-700 bg-slate-800 hover:bg-slate-700"
                    }`}
                  >
                    <div className="relative">
                      <img
                        src={photoUrl || "/placeholder.svg"}
                        alt={`${firstName} ${lastName}`}
                        className="w-10 h-10 rounded-full object-cover border border-slate-600"
                      />
                      {isSelected && (
                        <div className="absolute -bottom-1 -right-1 bg-cyan-500 rounded-full p-0.5">
                          <Check className="w-3 h-3 text-white" />
                        </div>
                      )}
                    </div>
                    <div className="ml-3 flex-1">
                      <h2 className="text-slate-200 font-medium">{firstName + " " + lastName}</h2>
                    </div>
                    <button
                      className={`p-1 rounded-full ${
                        isSelected
                          ? "bg-slate-600 text-slate-300"
                          : "bg-slate-700 text-slate-400 hover:bg-cyan-500 hover:text-white"
                      }`}
                    >
                      {isSelected ? <Check className="w-4 h-4" /> : <UserPlus className="w-4 h-4" />}
                    </button>
                  </div>
                )
              })}
            </div>

            {error && (
              <div className="mb-4 p-3 bg-red-900 bg-opacity-30 border border-red-800 text-red-200 rounded-lg text-sm">
                {error}
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex justify-center space-x-4">
              {selectedParticipants.length > 0 && !showCreateButton && (
                <button
                  onClick={() => setShowCreateButton(true)}
                  className="px-6 py-2 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white font-medium rounded-lg transition-colors shadow-md flex items-center"
                >
                  <Users className="w-4 h-4 mr-2" /> Name Group
                </button>
              )}
              {selectedParticipants.length > 0 && showCreateButton && (
                <button
                  onClick={handleCreateGroup}
                  className="px-6 py-2 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white font-medium rounded-lg transition-colors shadow-md flex items-center"
                >
                  <Check className="w-4 h-4 mr-2" /> Create Group
                </button>
              )}
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-slate-800 border border-slate-700 rounded-xl p-8 text-center max-w-md">
          <Users className="w-16 h-16 text-slate-600 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-slate-300 mb-2">No Connections Found</h3>
          <p className="text-slate-400 mb-6">You need to connect with other developers before creating a group chat.</p>
          <button
            onClick={() => navigate(-1)}
            className="px-6 py-2 bg-slate-700 hover:bg-slate-600 text-slate-200 font-medium rounded-lg transition-colors shadow-md flex items-center mx-auto"
          >
            <ArrowLeft className="w-4 h-4 mr-2" /> Go Back
          </button>
        </div>
      )}
    </div>
  )
}

export default CreateGroupChat

