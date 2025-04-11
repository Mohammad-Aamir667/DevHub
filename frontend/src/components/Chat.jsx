import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import { io } from 'socket.io-client';
import { BASE_URL } from '../utils/constants';
import axios from 'axios';
import RenderFiles from './RenderFiles';
import { ArrowLeft } from "lucide-react"

const socket = io(BASE_URL);

const Chat = () => {
  const [file, setFile] = useState(null);
  const [messageText, setMessageText] = useState('');
  const [fileUrl, setFileUrl] = useState('');
  const location = useLocation();
  const [chatHistory, setChatHistory] = useState([]);
  const chatContainerRef = React.useRef(null);
  
  const { chatUser, groupChat } = location.state;
  const loggedInUser = useSelector((store) => store.user);
  const fromUserId = loggedInUser?._id;

  const { firstName = "Unknown", lastName = "", photoUrl = "/default-avatar.png", _id: toUserId = null } = chatUser || {};
  const { conversationName = "Private Chat", _id: groupId = null } = groupChat || {};

  const navigate = useNavigate();

  const generateRoomId = (user1, user2) => [user1, user2].sort().join("_");

  useEffect(() => {
    const roomId = groupChat ? groupId : generateRoomId(fromUserId, toUserId);
    socket.emit('joinRoom', roomId);

    return () => {
      socket.emit('leaveRoom', roomId);
      socket.off('receiveMessage');
    };
  }, [groupChat, toUserId, groupId]);

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const chatId = groupChat ? groupId : toUserId;
        const response = await axios.get(`${BASE_URL}/messages/${chatId}`, { withCredentials: true });
        setChatHistory(response.data);
      } catch (err) {
        console.log(err);
      }
    };
    fetchMessages();
  }, []);

  useEffect(() => {
    socket.on('receiveMessage', (message) => {
      setChatHistory((prev) => [...prev, message]);
      scrollToBottom();
    });

    return () => socket.off('receiveMessage');
  }, []);

  const scrollToBottom = () => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [chatHistory]);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleFileUpload = async () => {
    if (!file) return;
    const formData = new FormData();
    formData.append('file', file);

    try {
      const chatId = groupChat ? groupId : toUserId;
      const uploadResponse = await axios.post(`${BASE_URL}/file-send/${chatId}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        withCredentials: true
      });

      const fileUrl = uploadResponse.data.url;
      const newMessage = {
        fromUserId: { _id: fromUserId, firstName: loggedInUser?.firstName, lastName: loggedInUser?.lastName },
        ...(groupChat ? { conversationId: groupId } : { toUserId }),
        messageText: '',
        fileUrl,
        timestamp: Date.now(),
      };

      setChatHistory((prev) => [...prev, newMessage]);
      socket.emit('sendMessage', newMessage);
      setFile(null);
    } catch (err) {
      console.log(err.message);
    }
  };

  const handleSendMessage = () => {
    if (!messageText.trim() && !fileUrl) return;

    const newMessage = {
      fromUserId: { _id: fromUserId, firstName: loggedInUser?.firstName, lastName: loggedInUser?.lastName },
      ...(groupChat ? { conversationId: groupId } : { toUserId }),
      messageText,
      fileUrl,
      timestamp: Date.now(),
    };

    setChatHistory((prev) => [...prev, newMessage]);
    socket.emit('sendMessage', newMessage);

    setMessageText('');
    setFileUrl('');
    setFile(null);
  };

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    });
  };

  return (
    <div className="flex flex-col h-screen w-full bg-dark-charcoal shadow-lg rounded-lg overflow-hidden">
      <div className="flex items-center p-4 bg-gray-800 text-soft-white">
      <button
            onClick={() => navigate(-1)}
            className="text-slate-400 hover:text-slate-100 hover:bg-slate-800 p-2 sm:p-3 rounded-md flex items-center text-sm sm:text-base transition-colors"
          >
            <ArrowLeft className="w-5 h-5 sm:w-6 sm:h-6 mr-2" /> 
          </button>
        <img src={photoUrl || "/placeholder.svg"} alt="user" className="w-10 h-10 rounded-full mr-3" />
        <span className="font-semibold text-lg">{groupChat ? conversationName : `${firstName} ${lastName}`}</span>
      </div>

      <div ref={chatContainerRef} className="flex-grow overflow-y-auto p-4 space-y-4">
        {chatHistory.map((msg, index) => (
          <div key={index} className={`flex ${msg.fromUserId._id === fromUserId ? "justify-end" : "justify-start"}`}>
            <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${msg.fromUserId._id === fromUserId ? "bg-electric-blue text-soft-white" : "bg-gray-700 text-soft-white"}`}>
              {msg.fromUserId._id !== fromUserId && groupChat && (
                <p className="text-xs text-gray-400 mb-1">{msg.fromUserId.firstName}</p>
              )}
              {msg.messageText && <p>{msg.messageText}</p>}
              <RenderFiles fileUrl={msg.fileUrl} />
              <p className="text-xs text-right mt-1 opacity-50">{formatTime(msg.timestamp)}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="p-4 bg-gray-800 border-t border-gray-700 flex items-center space-x-2">
      <label htmlFor="fileInput" className="cursor-pointer text-electric-blue hover:text-cyan-400">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13"
            />
          </svg>
        </label>
        <input type="file" id="fileInput" className="hidden" onChange={handleFileChange} />
        <input
          type="text"
          value={messageText}
          onChange={(e) => setMessageText(e.target.value)}
          placeholder="Type your message..."
          className="flex-grow bg-gray-700 text-soft-white rounded-full py-2 px-4 focus:outline-none focus:ring-2 focus:ring-electric-blue"
          onFocus={scrollToBottom}
        />
        {(messageText.trim() || file) && (
          <button onClick={file ? handleFileUpload : handleSendMessage} className="bg-electric-blue text-soft-white rounded-full p-2 hover:bg-blue-600 transition duration-200">
            ➤
          </button>
        )}
      </div>
    </div>
  );
};

export default Chat;
