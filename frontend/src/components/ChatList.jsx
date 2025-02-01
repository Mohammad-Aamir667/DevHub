import React, { useEffect } from 'react';
import { useDispatch, useSelector } from "react-redux";
import { fetchConversations } from '../utils/store';
import { Link, useLocation, useNavigate } from 'react-router-dom';


const ChatList = () => {
    const conversations = useSelector((state) => state.conversations);
    console.log(conversations)
    const user = useSelector((state) => state.user);;
    const navigate = useNavigate();
    const loggedInUser = user?._id;
    const dispatch = useDispatch();
    const messageUser = (convo) => {
        const isGroupChat = convo.conversationType === "group";
        navigate("/chat-box", {
            state: {
                chatUser: isGroupChat ? null : convo.participants.find(p => p._id !== loggedInUser),
                groupChat: isGroupChat ? convo : null,
            },
        });
    };
    
    useEffect(() => {
        dispatch(fetchConversations());
    }, []);

    return (

        <div className="chat-list p-4 space-y-4">
         {conversations?.length > 0 ? (
             conversations.map((convo) => {
        const isGroupChat = convo.conversationType === "group";
        const otherParticipant = convo.participants.find(p => p._id !== loggedInUser);

        return (
            <div 
                key={convo._id} 
                onClick={() => messageUser(convo)}
                className="chat-item flex items-center space-x-4 p-3 bg-black rounded-lg hover:bg-gray-700 cursor-pointer"
            >
                {!isGroupChat && (
                    <img
                        src={otherParticipant?.photoUrl || "/placeholder-avatar.png"}
                        alt={`${otherParticipant?.firstName} ${otherParticipant?.lastName} Avatar`}
                        className="w-12 h-12 rounded-full object-cover"
                    />
                )}
                <div className="flex-1">
                    <h4 className="text-white font-semibold text-lg">
                        {isGroupChat ? convo?.conversationName : `${otherParticipant?.firstName} ${otherParticipant?.lastName}`}
                    </h4>
                    <p className="text-gray-400 text-sm truncate">
                        {convo.lastMessage?.messageText}
                    </p>
                </div>
                <span className="text-gray-500 text-xs">
                    {convo.lastMessage?.timestamp
                        ? new Date(convo.lastMessage.timestamp).toLocaleString()
                        : ""}
                </span>
            </div>
        );
    })
) : (
    <p className="text-gray-500 text-xl font-semibold text-center">No conversations yet.</p>
)}

           <Link to = "/create-group-chat">create a group</Link>
        </div>
    );
};

export default ChatList;
