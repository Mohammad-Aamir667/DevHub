"use client"

import { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { fetchConversations } from "../utils/store"
import { Link, useNavigate } from "react-router-dom"
import { Users, MessageSquare, PlusCircle } from "lucide-react"

const ChatList = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const conversations = useSelector((state) => state.conversations)
  const user = useSelector((state) => state.user)
  const loggedInUser = user?._id

  useEffect(() => {
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

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 p-6">
      <div className="max-w-3xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold text-gray-800 dark:text-white">Chats</h2>
          <Link
            to="/create-group-chat"
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-all"
          >
            <PlusCircle size={20} />
            <span>Create Group</span>
          </Link>
        </div>

        {conversations?.length > 0 ? (
          <div className="space-y-4">
            {conversations.map((convo) => {
              const isGroupChat = convo.conversationType === "group"
              const otherParticipant = convo.participants.find((p) => p._id !== loggedInUser)

              return (
                <div
                  key={convo._id}
                  onClick={() => messageUser(convo)}
                  className="flex items-center space-x-4 p-4 bg-white dark:bg-gray-800 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer transition shadow-md"
                >
                  {isGroupChat ? (
                    <div className="w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
                      <Users size={24} className="text-blue-600 dark:text-blue-400" />
                    </div>
                  ) : (
                    <img
                      src={otherParticipant?.photoUrl || "/placeholder.svg"}
                      alt={`${otherParticipant?.firstName} ${otherParticipant?.lastName}`}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                  )}
                  <div className="flex-1 min-w-0">
                    <h4 className="text-lg font-semibold text-gray-800 dark:text-white truncate">
                      {isGroupChat
                        ? convo.conversationName
                        : `${otherParticipant?.firstName} ${otherParticipant?.lastName}`}
                    </h4>
                    <p className="text-sm text-gray-600 dark:text-gray-300 truncate">
                      {convo.lastMessage?.messageText || "No messages yet"}
                    </p>
                  </div>
                  <span className="text-xs text-gray-500 dark:text-gray-400 whitespace-nowrap">
                    {convo.lastMessage?.timestamp ? new Date(convo.lastMessage.timestamp).toLocaleString() : ""}
                  </span>
                </div>
              )
            })}
          </div>
        ) : (
          <div className="text-center p-8 bg-white dark:bg-gray-800 rounded-lg shadow-xl">
            <MessageSquare size={48} className="mx-auto text-gray-400 dark:text-gray-600 mb-4" />
            <p className="text-xl font-semibold text-gray-700 dark:text-gray-300">No conversations yet</p>
            <p className="mt-2 text-gray-500 dark:text-gray-400">Start chatting with your connections!</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default ChatList

