import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { fetchConversations } from "../../utils/store"
import { useNavigate } from "react-router-dom"
import { PlusCircle, MessageCircle, Users, ArrowLeft } from 'lucide-react'
import { addConnections } from "../../utils/connectionSlice"
import axios from "axios"
import { BASE_URL } from "../../utils/constants"
import { handleAxiosError } from "../../utils/handleAxiosError"

const ChatList = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const conversations = useSelector((state) => state.conversations);
  const user = useSelector((state) => state.user)
  const loggedInUser = user?._id
  const connections = useSelector((state) => state.connections)
  const [error, setError] = useState(false)
  useEffect(() => {
    if (!conversations || conversations.length === 0)
      dispatch(fetchConversations())
  }, [dispatch])

  const messageUser = (convo) => {
    const isGroupChat = convo.conversationType === "group"
    navigate("/chat-box", {
      state: {
        chatUser: isGroupChat ? null : convo.participants.find((p) => p._id !== loggedInUser),
        groupChat: isGroupChat ? convo : null,
      },
    })
  }

  const getConnections = async () => {
    try {
      setError(false)
      const res = await axios.get(BASE_URL + "/user/connection", {
        withCredentials: true,
      })
      dispatch(addConnections(res?.data))
    } catch (err) {
      console.log(err.message);
      setError(true)
      handleAxiosError(err, {}, [], "connection-error-toast");
    }
  }

  useEffect(() => {
    if (!connections) getConnections()
  }, [connections])
  const sortedConversations = [...conversations].sort((a, b) => {
    const timeA = new Date(a.lastMessage?.timestamp || 0).getTime();
    const timeB = new Date(b.lastMessage?.timestamp || 0).getTime();
    return timeB - timeA; // Newest first
  });

  // Format timestamp to a more readable format
  const formatTimestamp = (timestamp) => {
    if (!timestamp) return ""

    const date = new Date(timestamp)
    const now = new Date()
    const isToday = date.toDateString() === now.toDateString()

    if (isToday) {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    } else {
      return date.toLocaleDateString([], { month: 'short', day: 'numeric' })
    }
  }
  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-950 to-slate-900 flex items-center justify-center px-4">
        <div className="bg-slate-800 border border-slate-700 p-8 rounded-xl text-center max-w-md w-full">
          <h2 className="text-xl font-semibold text-red-400 mb-2">Failed to load Messages</h2>
          <p className="text-slate-400 mb-4">Something went wrong while fetching your Messages. Please try again.</p>
          <button
            onClick={getConnections}
            className="bg-gradient-to-r from-cyan-500 to-blue-600 text-white px-4 py-2 rounded-md font-medium hover:opacity-90 transition"
          >
            Retry
          </button>
        </div>
      </div>
    )
  }
  return (
    <div className="min-h-screen bg-gradient-to-b -mt-10 from-slate-950 to-slate-900 pt-16 px-4 sm:px-6 py-8">
      <div className="max-w-3xl mx-auto">
        {/* Header with back button */}
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={() => navigate(-1)}
            className="text-slate-400 hover:text-slate-100 hover:bg-slate-800 p-2 sm:p-3 rounded-md flex items-center text-sm sm:text-base transition-colors"
          >
            <ArrowLeft className="w-5 h-5 sm:w-6 sm:h-6 mr-2" />
          </button>
          <h2 className="text-2xl font-bold text-slate-100">Messages</h2>
          <div className="w-20"></div> {/* Spacer for alignment */}
        </div>

        {/* Chat List */}
        <div className="space-y-3">
          {sortedConversations?.length > 0 ? (
            sortedConversations.map((convo) => {

              const isGroupChat = convo.conversationType === "group"
              const otherParticipant = convo.participants.find((p) => p._id !== loggedInUser)
              return (
                <div
                  key={convo._id}
                  onClick={() => messageUser(convo)}
                  className="flex items-center gap-4 p-4 bg-slate-800 border border-slate-700 rounded-xl hover:bg-slate-700 cursor-pointer transition-all shadow-md hover:shadow-lg"
                >
                  <div className="relative flex-shrink-0">
                    {!isGroupChat && otherParticipant ? (
                      <img
                        src={otherParticipant.photoUrl || "/placeholder.svg"}
                        alt={`${otherParticipant.firstName} ${otherParticipant.lastName}`}
                        className="w-12 h-12 rounded-full object-cover border-2 border-slate-700"
                      />
                    ) : (
                      <div className="w-12 h-12 rounded-full bg-gradient-to-r from-cyan-500 to-blue-600 flex items-center justify-center">
                        <Users className="w-6 h-6 text-white" />
                      </div>
                    )}
                  </div>


                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start">
                      <h4 className="text-base font-semibold text-slate-100 truncate">
                        {isGroupChat
                          ? convo.conversationName
                          : `${otherParticipant?.firstName} ${otherParticipant?.lastName}`}
                      </h4>
                      <span className="text-xs text-slate-400 whitespace-nowrap ml-2">
                        {formatTimestamp(convo.lastMessage?.timestamp)}
                      </span>
                    </div>
                    <p className="text-slate-400 text-sm truncate mt-1">
                      {convo.lastMessage?.messageText ||
                        (convo.lastMessage?.fileUrl ? "Sent an attachment" : "No messages yet")
                      }
                    </p>
                  </div>
                </div>
              )
            })
          ) : (
            <div className="bg-slate-800 border border-slate-700 rounded-xl p-10 text-center">
              <div className="flex justify-center mb-4">
                <MessageCircle className="h-16 w-16 text-slate-600" />
              </div>
              <h3 className="text-xl font-semibold text-slate-300 mb-2">No Conversations Yet</h3>
              <p className="text-slate-400 mb-6 max-w-md mx-auto">
                Start connecting with other developers to begin messaging.
              </p>
            </div>
          )}
        </div>

        {/* Floating "Create Group" Button */}
        {connections && connections?.data?.length > 0 && (
          <button
            onClick={() => navigate("/create-group-chat")}
            className="fixed bottom-6 mb-14 right-6 flex items-center gap-2 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white px-4 py-3 rounded-full shadow-lg transition-all text-sm font-medium"
          >
            <PlusCircle size={20} />
            <span>Create Group</span>
          </button>
        )}
      </div>
    </div>
  )
}

export default ChatList
