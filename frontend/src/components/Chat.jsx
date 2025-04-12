"use client"

import { useEffect, useState, useRef } from "react"
import { useSelector } from "react-redux"
import { useLocation, useNavigate } from "react-router-dom"
import { io } from "socket.io-client"
import { BASE_URL } from "../utils/constants"
import axios from "axios"
import RenderFiles from "./RenderFiles"
import { ArrowLeft, Paperclip, Send, User, Loader2 } from "lucide-react"

const socket = io(BASE_URL)

const Chat = () => {
  const [file, setFile] = useState(null)
  const [messageText, setMessageText] = useState("")
  const [fileUrl, setFileUrl] = useState("")
  const location = useLocation()
  const [chatHistory, setChatHistory] = useState([]);
  const [isSendingFile, setIsSendingFile] = useState(false);
  const chatContainerRef = useRef(null)
  const inputRef = useRef(null)

  const { chatUser, groupChat } = location.state
  const loggedInUser = useSelector((store) => store.user)
  const fromUserId = loggedInUser?._id

  const { firstName = "Unknown", lastName = "", photoUrl = "/placeholder.svg", _id: toUserId = null } = chatUser || {}
  const { conversationName = "Private Chat", _id: groupId = null } = groupChat || {}

  const navigate = useNavigate()

  const generateRoomId = (user1, user2) => [user1, user2].sort().join("_")

  useEffect(() => {
    const roomId = groupChat ? groupId : generateRoomId(fromUserId, toUserId)
    socket.emit("joinRoom", roomId)

    return () => {
      socket.emit("leaveRoom", roomId)
      socket.off("receiveMessage")
    }
  }, [groupChat, toUserId, groupId, fromUserId])

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const chatId = groupChat ? groupId : toUserId
        const response = await axios.get(`${BASE_URL}/messages/${chatId}`, { withCredentials: true })
        setChatHistory(response.data)
      } catch (err) {
        console.log(err)
      }
    }
    fetchMessages()
  }, [groupChat, groupId, toUserId])

  useEffect(() => {
    socket.on("receiveMessage", (message) => {
      setChatHistory((prev) => [...prev, message])
      scrollToBottom()
    })

    return () => socket.off("receiveMessage")
  }, [])

  const scrollToBottom = () => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight
    }
  }

  useEffect(() => {
    scrollToBottom()
  }, [chatHistory])

  const handleFileChange = (e) => {
    setFile(e.target.files[0])
  }

  const handleFileUpload = async () => {
    if (!file) return
    setIsSendingFile(true);
    const formData = new FormData()
    formData.append("file", file)

    try {
      const chatId = groupChat ? groupId : toUserId
      const uploadResponse = await axios.post(`${BASE_URL}/file-send/${chatId}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
        withCredentials: true,
      })

      const fileUrl = uploadResponse.data.url
      const newMessage = {
        fromUserId: { _id: fromUserId, firstName: loggedInUser?.firstName, lastName: loggedInUser?.lastName },
        ...(groupChat ? { conversationId: groupId } : { toUserId }),
        messageText: "",
        fileUrl,
        timestamp: Date.now(),
      }

      setChatHistory((prev) => [...prev, newMessage])
      socket.emit("sendMessage", newMessage)
      setFile(null)
    } catch (err) {
      console.log(err.message)
    }
    finally{
      setIsSendingFile(false);
      setFileUrl("");
      setFile(null);
    }
  }

  const handleSendMessage = () => {
    if (!messageText.trim() && !fileUrl) return

    const newMessage = {
      fromUserId: { _id: fromUserId, firstName: loggedInUser?.firstName, lastName: loggedInUser?.lastName },
      ...(groupChat ? { conversationId: groupId } : { toUserId }),
      messageText,
      fileUrl,
      timestamp: Date.now(),
    }

    setChatHistory((prev) => [...prev, newMessage])
    socket.emit("sendMessage", newMessage)

    setMessageText("")
    setFileUrl("")
    setFile(null)
  }

  const formatTime = (timestamp) => {
    const date = new Date(timestamp)
    return date.toLocaleString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    })
  }

  const formatDate = (timestamp) => {
    const date = new Date(timestamp)
    const today = new Date()
    const yesterday = new Date(today)
    yesterday.setDate(yesterday.getDate() - 1)

    if (date.toDateString() === today.toDateString()) {
      return "Today"
    } else if (date.toDateString() === yesterday.toDateString()) {
      return "Yesterday"
    } else {
      return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: date.getFullYear() !== today.getFullYear() ? "numeric" : undefined,
      })
    }
  }

  const groupMessagesByDate = () => {
    const groups = {}

    chatHistory.forEach((msg) => {
      const date = formatDate(msg.timestamp)
      if (!groups[date]) {
        groups[date] = []
      }
      groups[date].push(msg)
    })

    return groups
  }

  const messageGroups = groupMessagesByDate()

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      if (file) {
        handleFileUpload()
      } else {
        handleSendMessage()
      }
    }
  }

  return (
    <div className="flex flex-col h-screen bg-gradient-to-b from-slate-950 to-slate-900">
      {/* Chat Header */}
      <div className="flex items-center p-4 bg-slate-800 border-b border-slate-700 shadow-md">
        <button
          onClick={() => navigate(-1)}
          className="text-slate-400 hover:text-slate-100 hover:bg-slate-700 p-2 rounded-md flex items-center text-sm transition-colors mr-2"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>

        <div className="relative flex-shrink-0">
          {chatUser ? (
            <img
              src={photoUrl || "/placeholder.svg"}
              alt={`${firstName} ${lastName}`}
              className="w-10 h-10 rounded-full border-2 border-slate-700 object-cover"
            />
          ) : (
            <div className="w-10 h-10 rounded-full bg-gradient-to-r from-cyan-500 to-blue-600 flex items-center justify-center">
              <User className="w-5 h-5 text-white" />
            </div>
          )}
        </div>

        <div className="ml-3 flex-1">
          <h3 className="font-semibold text-slate-100">{groupChat ? conversationName : `${firstName} ${lastName}`}</h3>
        </div>
      </div>

      {/* Chat Messages */}
      <div
        ref={chatContainerRef}
        className="flex-grow overflow-y-auto p-4 space-y-6"
        style={{ paddingBottom: "80px" }}
      >
        {Object.entries(messageGroups).map(([date, messages]) => (
          <div key={date} className="space-y-3">
            <div className="flex justify-center">
              <span className="text-xs bg-slate-800 text-slate-400 px-3 py-1 rounded-full">{date}</span>
            </div>

            {messages.map((msg, index) => {
              const isSender = msg.fromUserId._id === fromUserId

              return (
                <div key={index} className={`flex ${isSender ? "justify-end" : "justify-start"}`}>
                  {!isSender && groupChat && (
                    <div className="flex-shrink-0 mr-2">
                      <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center text-slate-300 text-xs font-bold">
                        {msg.fromUserId.firstName?.charAt(0)}
                      </div>
                    </div>
                  )}

                  <div
                    className={`max-w-[75%] rounded-2xl px-4 py-2 ${
                      isSender
                        ? "bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-tr-none"
                        : "bg-slate-800 border border-slate-700/50 text-slate-200 rounded-tl-none"
                    }`}
                  >
                    {!isSender && groupChat && (
                      <p className="text-xs font-medium mb-1 text-cyan-300">
                        {msg.fromUserId.firstName} {msg.fromUserId.lastName}
                      </p>
                    )}

                    {msg.messageText && <p className="whitespace-pre-wrap break-words">{msg.messageText}</p>}

                    {msg.fileUrl && (
                      <div className="mt-1 mb-1">
                        <RenderFiles fileUrl={msg.fileUrl} />
                      </div>
                    )}

                    <p className={`text-xs ${isSender ? "text-blue-100" : "text-slate-400"} text-right mt-1`}>
                      {formatTime(msg.timestamp)}
                    </p>
                  </div>
                </div>
              )
            })}
          </div>
        ))}
      </div>

      {/* Chat Input */}
      <div className="p-3 bg-slate-800 border-t border-slate-700 sticky bottom-0 left-0 right-0">
        <div className="flex items-center gap-2 max-w-4xl mx-auto">
          <label
            htmlFor="fileInput"
            className="p-2 text-slate-400 hover:text-cyan-400 hover:bg-slate-700 rounded-full cursor-pointer transition-colors flex-shrink-0"
          >
            <Paperclip className="w-5 h-5" />
          </label>
          <input type="file" id="fileInput" className="hidden" onChange={handleFileChange} />

          {file && (
            <div className="flex items-center gap-2 overflow-hidden">
              <div className="bg-slate-700 text-slate-300 text-xs px-2 py-1 rounded-md flex items-center max-w-[120px] sm:max-w-[200px] truncate">
                {file.name}
                <button 
                  onClick={() => setFile(null)} 
                  className="ml-1 text-slate-400 hover:text-slate-200 flex-shrink-0"
                >
                  ✕
                </button>
              </div>
            </div>
          )}

         {!file && <input
            ref={inputRef}
            type="text"
            value={messageText}
            disabled = {file}
            onChange={(e) => setMessageText(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type your message..."
            className="flex-grow bg-slate-700 text-slate-200 rounded-full py-2 px-4 focus:outline-none focus:ring-2 focus:ring-cyan-500 min-w-0"
          />}

          {(messageText.trim() || file) && (
            <button
              onClick={file ? handleFileUpload : handleSendMessage}
              disabled={isSendingFile}
              className="p-2 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white rounded-full transition-colors flex-shrink-0 disabled:opacity-70"
            >
              {isSendingFile ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <Send className="w-5 h-5" />
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

export default Chat