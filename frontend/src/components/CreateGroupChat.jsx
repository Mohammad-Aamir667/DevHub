import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { BASE_URL } from '../utils/constants';
import { useNavigate } from 'react-router-dom';
import { addConversation } from '../utils/conversationsSlice';
import { addConnections } from '../utils/connectionSlice';
import { ArrowLeft } from 'lucide-react';

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
            return isAlreadySelected ? prev.filter((p) => p._id !== connection._id) : [...prev, connection];
        });
    };

    const getConnections = async () => {
        try {
            const res = await axios.get(BASE_URL + "/user/connection", { withCredentials: true });
            dispatch(addConnections(res?.data));
        } catch (err) {
            console.log(err.message);
        }
    };

    useEffect(() => {
        if (!connections) getConnections();
    }, [connections]);

    const handleCreateGroup = async () => {
        try {
            const participantIds = selectedParticipants.map((p) => p._id);
            const res = await axios.post(BASE_URL + "/create-group-chat", { participantIds, groupName }, { withCredentials: true });
            dispatch(addConversation(res.data));
            navigate("/chat-list");
        } catch (err) {
            setError(err.response?.data?.message || "An unexpected error occurred. Please try again.");
        }
    };

    return (
        <div className="min-h-screen flex items-center -mt-10 justify-center bg-gray-900 text-white p-6">
            <div className="max-w-3xl w-full bg-gray-800 p-6 rounded-xl shadow-lg relative">
                {/* Back Button */}
                <button onClick={() => navigate(-1)} className="absolute top-4 left-4 text-gray-400 hover:text-white transition">
                    <ArrowLeft size={24} />
                </button>

                <h1 className="text-2xl font-bold text-center mb-6 border-b border-gray-700 pb-3">Create Group Chat</h1>
                
                {showCreateButton && (
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-400 mb-1">Group Name</label>
                        <input
                            type="text"
                            value={groupName}
                            onChange={(e) => setGroupName(e.target.value)}
                            className="w-full px-4 py-2 bg-gray-700 text-white rounded-lg border border-gray-600 focus:ring focus:ring-blue-500 outline-none"
                            placeholder="Enter group name"
                        />
                    </div>
                )}
                
                {/* Participant List */}
                <div className="space-y-3 max-h-64 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-gray-800 p-2 rounded-lg border border-gray-700">
                    {connections?.data.map(({ _id, firstName, lastName, photoUrl }) => {
                        const isSelected = selectedParticipants.some((p) => p._id === _id);
                        return (
                            <div
                                key={_id}
                                onClick={() => handleSelectParticipants({ _id, firstName, lastName, photoUrl })}
                                className={`flex items-center p-3 rounded-lg cursor-pointer transition border ${isSelected ? "bg-indigo-800 border-indigo-500" : "border-gray-600 bg-gray-700 hover:bg-gray-600"}`}
                            >
                                <img src={photoUrl} alt="user" className="w-12 h-12 rounded-full mr-4 border border-gray-500" />
                                <h2 className="text-lg font-semibold">{firstName + " " + lastName}</h2>
                            </div>
                        );
                    })}
                </div>

                {error && <div className="mt-4 text-red-500 text-sm text-center">{error}</div>}
                
                {/* Action Buttons */}
                <div className="mt-6 flex justify-center space-x-4">
                    {selectedParticipants.length > 0 && !showCreateButton && (
                        <button
                            onClick={() => setShowCreateButton(true)}
                            className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition shadow-md"
                        >
                            Name Group
                        </button>
                    )}
                    {selectedParticipants.length > 0 && showCreateButton && (
                        <button
                            onClick={handleCreateGroup}
                            className="px-6 py-2 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg transition shadow-md"
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