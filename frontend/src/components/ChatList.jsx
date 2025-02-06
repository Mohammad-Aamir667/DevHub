import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchConversations } from "../utils/store";
import { Link, useNavigate } from "react-router-dom";

const ChatList = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const conversations = useSelector((state) => state.conversations);
    const user = useSelector((state) => state.user);
    const loggedInUser = user?._id;

    useEffect(() => {
        dispatch(fetchConversations());
    }, [dispatch]);

    const messageUser = (convo) => {
        const isGroupChat = convo.conversationType === "group";
        navigate("/chat-box", {
            state: {
                chatUser: isGroupChat ? null : convo.participants.find((p) => p._id !== loggedInUser),
                groupChat: isGroupChat ? convo : null,
            },
        });
    };

    return (
        <div className="chat-list p-4 space-y-4 bg-dark-charcoal min-h-screen">
          <h2 className="text-2xl font-bold text-soft-white mb-6">Chats</h2>
          {conversations?.length > 0 ? (
            conversations.map((convo) => {
              const isGroupChat = convo.conversationType === "group"
              const otherParticipant = convo.participants.find((p) => p._id !== loggedInUser)
    
              return (
                <div
                  key={convo._id}
                  onClick={() => messageUser(convo)}
                  className="chat-item flex items-center space-x-4 p-4 bg-gray-800 rounded-lg hover:bg-gray-700 cursor-pointer transition"
                >
                  {!isGroupChat && otherParticipant && (
                    <img
                      src={otherParticipant.photoUrl || "/placeholder-avatar.png"}
                      alt={`${otherParticipant.firstName} ${otherParticipant.lastName} Avatar`}
                      className="w-12 h-12 rounded-full object-cover border-2 border-electric-blue"
                    />
                  )}
                  <div className="flex-1">
                    <h4 className="text-soft-white font-semibold text-lg">
                      {isGroupChat
                        ? convo.conversationName
                        : `${otherParticipant?.firstName} ${otherParticipant?.lastName}`}
                    </h4>
                    <p className="text-gray-400 text-sm truncate">{convo.lastMessage?.messageText || "No messages yet"}</p>
                  </div>
                  <span className="text-gray-500 text-xs">
                    {convo.lastMessage?.timestamp ? new Date(convo.lastMessage.timestamp).toLocaleString() : ""}
                  </span>
                </div>
              )
            })
          ) : (
            <p className="text-gray-500 text-xl font-semibold text-center">No conversations yet.</p>
          )}
    
          <Link
            to="/create-group-chat"
            className="block text-center text-electric-blue hover:text-blue-400 transition mt-6 bg-gray-800 py-3 rounded-lg"
          >
            Create a Group Chat
          </Link>
        </div>
      )
};

export default ChatList;
