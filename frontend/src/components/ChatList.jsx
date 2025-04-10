import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchConversations } from "../utils/store";
import { useNavigate } from "react-router-dom";
import { PlusCircle } from "lucide-react";

const ChatList = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const conversations = useSelector((state) => state.conversations);
    const user = useSelector((state) => state.user);
    const loggedInUser = user?._id;
    const connections = useSelector((state) => state.connections);
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
        <div className="relative min-h-screen bg-gray-900 p-6">
            {/* Page Title */}
            <h2 className="text-3xl font-semibold text-white mb-6">Chats</h2>

            {/* Chat List */}
            <div className="space-y-4">
                {conversations?.length > 0 ? (
                    conversations.map((convo) => {
                        const isGroupChat = convo.conversationType === "group";
                        const otherParticipant = convo.participants.find((p) => p._id !== loggedInUser);

                        return (
                            <div
                                key={convo._id}
                                onClick={() => messageUser(convo)}
                                className="flex items-center gap-4 p-4 bg-gray-800 rounded-xl hover:bg-gray-700 cursor-pointer transition-all shadow-md border border-gray-700"
                            >
                                {/* Avatar */}
                                {!isGroupChat && otherParticipant && (
                                    <img
                                        src={otherParticipant.photoUrl || "/placeholder-avatar.png"}
                                        alt={`${otherParticipant.firstName} ${otherParticipant.lastName}`}
                                        className="w-12 h-12 rounded-full object-cover border-2 border-blue-500"
                                    />
                                )}

                                {/* Chat Details */}
                                <div className="flex-1">
                                    <h4 className="text-lg font-semibold text-white">
                                        {isGroupChat
                                            ? convo.conversationName
                                            : `${otherParticipant?.firstName} ${otherParticipant?.lastName}`}
                                    </h4>
                                    <p className="text-gray-400 text-sm truncate">
                                        {convo.lastMessage?.messageText || "No messages yet"}
                                    </p>
                                </div>

                                {/* Timestamp */}
                                <span className="text-gray-500 text-xs">
                                    {convo.lastMessage?.timestamp
                                        ? new Date(convo.lastMessage.timestamp).toLocaleString()
                                        : ""}
                                </span>
                            </div>
                        );
                    })
                ) : (
                    <p className="text-gray-500 text-center text-lg font-medium mt-10">No conversations yet.</p>
                )}
            </div>

            {/* Floating "Create Group" Button */}
            {connections && connections?.length>0 && <button
                onClick={() => navigate("/create-group-chat")}
                className="fixed bottom-6 right-6 flex items-center mb-14 gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-3 rounded-full shadow-lg transition-all text-sm font-medium"
            >
                <PlusCircle size={22} />
                Create Group
            </button>}
        </div>
    );
};

export default ChatList;
