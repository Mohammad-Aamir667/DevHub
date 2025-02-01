import axios from 'axios';
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { BASE_URL } from '../utils/constants';
import { useNavigate } from 'react-router-dom';
import { addConversation } from '../utils/conversationsSlice';

const CreateGroupChat = () => {
    const [selectedParticipants, setSelectedParticipants] = useState([]);
    const [error, setError] = useState("");
    const dispatch = useDispatch();
    const connections = useSelector((store) => store.connections);
    const [groupName, setGroupName] = useState('');
    const navigate = useNavigate();
    const [showCreateButton, setShowCreateButton] = useState(false);

    const handleSelectParticipants = (connection) => {
        setSelectedParticipants((prev) => {
            const isAlreadySelected = prev.some((p) => p._id === connection._id);
            if (isAlreadySelected) {
                return prev.filter((p) => p._id !== connection._id);
            } else {  
                return [...prev, connection];
            }
        });
    };

    const handleShowGroupNameInput = () => {
        setShowCreateButton(true);
    };

    const handleCreateGroup = async () => {
        try {
            const participantIds = selectedParticipants.map((p) => p._id);
            const res = await axios.post(
                BASE_URL + "/create-group-chat", 
                { participantIds, groupName }, 
                { withCredentials: true }
            );
            console.log(res.data);
            dispatch(addConversation(res.data));
            navigate("/chat-list");
        } catch (err) {
            if (err.response && err.response.data && err.response.data.message) {
                setError(err.response.data.message); // Set error message from API
            } else {
                setError("An unexpected error occurred. Please try again.");
            }
        }
    };

    return (
        <div className="min-h-screen bg-gray-900 text-white p-6">
            <div className="max-w-2xl mx-auto bg-gray-800 p-6 rounded-lg shadow-lg">
                <h1 className="text-2xl font-bold mb-4 text-center">Create Group Chat</h1>

                {/* Group Name Input */}
                {showCreateButton && (
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-300 mb-1">Group Name</label>
                        <input
                            type="text"
                            value={groupName}
                            onChange={(e) => setGroupName(e.target.value)}
                            className="w-full px-4 py-2 bg-gray-700 text-white rounded-lg focus:ring focus:ring-blue-500 outline-none"
                            placeholder="Enter group name"
                        />
                    </div>
                )}

                {/* Participants List */}
                <div className="space-y-3">
                    {connections?.data.map((connection) => {
                        const { _id, firstName, lastName, photoUrl } = connection;
                        const isSelected = selectedParticipants.some((p) => p._id === _id);

                        return (
                            <div
                                key={_id}
                                onClick={() => handleSelectParticipants(connection)}
                                className={`flex items-center p-3 rounded-lg cursor-pointer transition ${isSelected ? "bg-green-600" : "bg-gray-700 hover:bg-gray-600"}`}
                            >
                                <img src={photoUrl} alt="user" className="w-12 h-12 rounded-full mr-4" />
                                <h2 className="text-lg font-semibold">{firstName + " " + lastName}</h2>
                            </div>
                        );
                    })}
                </div>

                {/* Error Message */}
                {error && (
                    <div className="mt-4 text-red-500 text-sm">
                        {error}
                    </div>
                )}

                {/* Buttons */}
                <div className="mt-6 flex justify-center space-x-4">
                    {selectedParticipants?.length > 0 && !showCreateButton && (
                        <button
                            onClick={handleShowGroupNameInput}
                            className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition"
                        >
                            Name Group
                        </button>
                    )}
                    {selectedParticipants?.length > 0 && showCreateButton && (
                        <button
                            onClick={handleCreateGroup}
                            className="px-6 py-2 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg transition"
                        >
                            Create Group
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default CreateGroupChat;
