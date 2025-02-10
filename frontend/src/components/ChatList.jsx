import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchConversations } from "../utils/store";
import { Link, useNavigate } from "react-router-dom";
import { FiUsers } from "react-icons/fi";
import { PlusCircle } from "lucide-react";

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
        <div className="chat-list p-6 space-y-4 bg-gray-900  min-h-screen">
            <h2 className="text-2xl font-bold text-soft-white mb-4">Chats</h2>
            
            {/* Create Group Chat Button */}
          <Link
            to="/create-group-chat"
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-all"
          >
            <PlusCircle size={20} />
            <span>Create Group</span>
          </Link>
            
            {conversations?.length > 0 ? (
                conversations.map((convo) => {
                    const isGroupChat = convo.conversationType === "group";
                    const otherParticipant = convo.participants.find((p) => p._id !== loggedInUser);

                    return (
                        <div
                            key={convo._id}
                            onClick={() => messageUser(convo)}
                            className="chat-item flex items-center space-x-4 p-4 bg-gray-800 rounded-lg hover:bg-gray-700 cursor-pointer transition shadow-md"
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
                                <p className="text-gray-400 text-sm truncate">
                                    {convo.lastMessage?.messageText || "No messages yet"}
                                </p>
                            </div>
                            <span className="text-gray-500 text-xs">
                                {convo.lastMessage?.timestamp ? new Date(convo.lastMessage.timestamp).toLocaleString() : ""}
                            </span>
                        </div>
                    );
                })
            ) : (
                <p className="text-gray-500 text-xl font-semibold text-center">No conversations yet.</p>
            )}
        </div>
    );
};

export default ChatList;
