import React, { useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { BASE_URL } from "../utils/constants";

const EditExpertProfile = () => {
  const expert = useSelector((state) => state.expertDetails);
  const user = useSelector((state) => state.user);
  const navigate = useNavigate();

  const [profileData, setProfileData] = useState({
    expertise: expert.expertise || "",
    experienceYears: expert.experienceYears || "",
    description: expert.description || "",
    certifications: expert.certifications?.join(", ") || "",
    linkedInProfile: expert.linkedInProfile || "",
    githubProfile: expert.githubProfile || "",
    languages: expert.languages?.join(", ") || "",
    country: expert.country || "",
    city: expert.city || "",
    postalCode: expert.postalCode || "",
    taxId: expert.taxId || "",
    timezone: expert.timezone || "",
    availableDays: expert.schedule?.availableDays?.join(", ") || "",
    timeSlots: expert.schedule?.timeSlots
      ?.map((slot) => `${slot.day}: ${slot.slots.join(", ")}`)
      .join("; ") || "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfileData({ ...profileData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${BASE_URL}/edit-expert-profile`, profileData, {
        withCredentials: true,
      });
      alert("Profile updated successfully!");
      navigate("/expert-profile");
    } catch (error) {
      console.error(error);
      alert("Failed to update profile. Please try again.");
    }
  };

  return (
    <div className="bg-gray-100 min-h-screen flex justify-center items-center p-4">
      <div className="bg-white shadow-lg rounded-lg w-full max-w-4xl p-6 sm:p-8">
        {/* Header */}
        <h1 className="text-2xl font-bold mb-6 text-center sm:text-left">Edit Profile</h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Info */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Basic Information</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-gray-700">
              <input
                type="text"
                name="expertise"
                value={profileData.expertise}
                onChange={handleChange}
                placeholder="Expertise"
                className="p-3 border rounded"
              />
              <input
                type="number"
                name="experienceYears"
                value={profileData.experienceYears}
                onChange={handleChange}
                placeholder="Experience (Years)"
                className="p-3 border rounded"
              />
              <textarea
                name="description"
                value={profileData.description}
                onChange={handleChange}
                placeholder="Description"
                className="p-3 border rounded col-span-2"
                rows="3"
              />
            </div>
          </div>

          {/* Certifications and Links */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Certifications and Links</h3>
            <input
              type="text"
              name="certifications"
              value={profileData.certifications}
              onChange={handleChange}
              placeholder="Certifications (comma-separated)"
              className="p-3 border rounded w-full"
            />
            <input
              type="url"
              name="linkedInProfile"
              value={profileData.linkedInProfile}
              onChange={handleChange}
              placeholder="LinkedIn Profile"
              className="p-3 border rounded w-full"
            />
            <input
              type="url"
              name="githubProfile"
              value={profileData.githubProfile}
              onChange={handleChange}
              placeholder="GitHub Profile"
              className="p-3 border rounded w-full"
            />
          </div>

          {/* Schedule and Availability */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Schedule and Availability</h3>
            <input
              type="text"
              name="availableDays"
              value={profileData.availableDays}
              onChange={handleChange}
              placeholder="Available Days (comma-separated)"
              className="p-3 border rounded w-full"
            />
            <textarea
              name="timeSlots"
              value={profileData.timeSlots}
              onChange={handleChange}
              placeholder="Time Slots (e.g., Mon: 10 AM - 2 PM)"
              className="p-3 border rounded w-full"
              rows="3"
            />
            <input
              type="text"
              name="timezone"
              value={profileData.timezone}
              onChange={handleChange}
              placeholder="Timezone"
              className="p-3 border rounded w-full"
            />
          </div>

          {/* Address */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Address</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-gray-700">
              <input
                type="text"
                name="country"
                value={profileData.country}
                onChange={handleChange}
                placeholder="Country"
                className="p-3 border rounded"
              />
              <input
                type="text"
                name="city"
                value={profileData.city}
                onChange={handleChange}
                placeholder="City/State"
                className="p-3 border rounded"
              />
              <input
                type="text"
                name="postalCode"
                value={profileData.postalCode}
                onChange={handleChange}
                placeholder="Postal Code"
                className="p-3 border rounded"
              />
              <input
                type="text"
                name="taxId"
                value={profileData.taxId}
                onChange={handleChange}
                placeholder="Tax ID"
                className="p-3 border rounded"
              />
            </div>
          </div>

          {/* Submit Button */}
          <div className="mt-6 flex justify-center sm:justify-end">
            <button
              type="submit"
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditExpertProfile;
