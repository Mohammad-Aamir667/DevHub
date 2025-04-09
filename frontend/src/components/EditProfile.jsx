import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { BASE_URL } from "../utils/constants";
import axios from "axios";
import { addUser } from "../utils/userSlice";
import ProfilePictureUpload from "./ProfilePictureUpload";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

const EditProfile = () => {
  const user = useSelector((store) => store.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [firstName, setFirstName] = useState(user?.firstName || "");
  const [lastName, setLastName] = useState(user?.lastName || "");
  const [gender, setGender] = useState(user?.gender || "");
  const [age, setAge] = useState(user?.age || "");
  const [skills, setSkills] = useState(user?.skills || "");
  const [about, setAbout] = useState(user?.about || "");
  const [photoUrl, setPhotoUrl] = useState(user?.photoUrl || "");
  const [error, setError] = useState("");
  const [showToast, setShowToast] = useState(false);

  const saveProfile = async () => {
    setError("");
    try {
      const res = await axios.post(
        `${BASE_URL}/editProfile`,
        { firstName, lastName, age, gender, about, skills, photoUrl },
        { withCredentials: true }
      );
      dispatch(addUser(res.data));
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen mt-16 bg-gray-900 px-4">
      <div className="bg-gray-800 p-6 rounded-xl shadow-lg w-full max-w-md text-gray-200">
      <button
            onClick={() => navigate(-1)}
            className="absolute top-4 left-4 flex items-center text-blue-400 hover:text-blue-300 font-semibold transition duration-200"
          >
            <ArrowLeft className="w-5 h-5 mr-2" /> 
          </button>
        <h2 className="text-2xl font-semibold text-center mb-6">Edit Profile</h2>

        <ProfilePictureUpload photoUrl={photoUrl} setPhotoUrl={setPhotoUrl} />

        <div className="space-y-4">
          <input
            type="text"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            placeholder="First Name"
            className="input w-full bg-gray-700 text-white"
          />
          <input
            type="text"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            placeholder="Last Name"
            className="input w-full bg-gray-700 text-white"
          />
          <select
            value={gender}
            onChange={(e) => setGender(e.target.value)}
            className="input w-full bg-gray-700 text-white"
          >
            <option value="">Select Gender</option>
            <option>Male</option>
            <option>Female</option>
            <option>Other</option>
          </select>
          <input
            type="number"
            value={age}
            onChange={(e) => setAge(e.target.value)}
            placeholder="Age"
            className="input w-full bg-gray-700 text-white"
          />
          <textarea
            value={about}
            onChange={(e) => setAbout(e.target.value)}
            placeholder="About You"
            className="input w-full bg-gray-700 text-white h-24"
          />
          <textarea
            value={skills}
            onChange={(e) => setSkills(e.target.value)}
            placeholder="Skills (comma separated)"
            className="input w-full bg-gray-700 text-white h-24"
          />
        </div>

        {error && <p className="text-red-500 text-center mt-2">{error}</p>}

        <button
          onClick={saveProfile}
          className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 rounded-lg mt-4"
        >
          Save Profile
        </button>

        {showToast && (
          <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 bg-green-500 text-white py-2 px-4 rounded-lg">
            Profile updated successfully!
          </div>
        )}
      </div>
    </div>
  );
};

export default EditProfile;
