import React from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const ExpertProfile = () => {
  const expert = useSelector((state) => state.expertDetails);
  const user = useSelector((state) => state.user);
  const navigate = useNavigate();
  const handleEditExpertProfile = ()=>{  
    return  navigate("/edit-expert-profile")
   }
  return (
    <div className="bg-gray-100 min-h-screen flex justify-center items-center p-4">
      <div className="bg-white shadow-lg rounded-lg w-full max-w-4xl p-6 sm:p-8">
        {/* Header */}
        <h1 className="text-2xl font-bold mb-6 text-center sm:text-left">My Profile</h1>

        {/* Profile Card */}
        <div className="bg-gray-50 rounded-lg p-4 sm:p-6 space-y-6">
          {/* Basic Info */}
          <div className="flex flex-col sm:flex-row items-center gap-4">
            <img
              src={user.photoUrl || "/default-avatar.jpg"} // Replace with the expert's profile photo URL
              alt="Profile"
              className="w-20 h-20 rounded-full"
            />
            <div className="text-center sm:text-left">
              <h2 className="text-xl font-semibold">
                {`${user.firstName || "First Name"} ${user.lastName || "Last Name"}`}
              </h2>
            </div>
          </div>

          {/* Personal Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Personal Information</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-gray-700">
              <div>
                <p>
                  <span className="font-medium">Expertise:</span> {expert.expertise || "N/A"}
                </p>
                <p>
                  <span className="font-medium">Experience:</span>{" "}
                  {expert.experienceYears ? `${expert.experienceYears} years` : "N/A"}
                </p>
                <p>
                  <span className="font-medium">Description:</span>{" "}
                  {expert.description || "No description provided"}
                </p>
              </div>
              <div>
                <p>
                  <span className="font-medium">Certifications:</span>{" "}
                  {expert.certifications?.join(", ") || "No certifications added"}
                </p>
                <p>
                  <span className="font-medium">LinkedIn:</span>{" "}
                  <a
                    href={expert.linkedInProfile || "#"}
                    className="text-blue-600 hover:underline break-all"
                  >
                    {expert.linkedInProfile || "No profile added"}
                  </a>
                </p>
                <p>
                  <span className="font-medium">GitHub:</span>{" "}
                  <a
                    href={expert.githubProfile || "#"}
                    className="text-blue-600 hover:underline break-all"
                  >
                    {expert.githubProfile || "No profile added"}
                  </a>
                </p>
              </div>
            </div>
          </div>

          {/* Schedule Availability */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Schedule Availability</h3>
            <div className="text-gray-700">
              <p>
                <span className="font-medium">Available Days:</span>{" "}
                {expert.schedule?.availableDays.join(", ") || "N/A"}
              </p>
              <p>
                <span className="font-medium">Time Slots:</span>{" "}
                {expert.schedule?.timeSlots
                  ?.map((slot) => `${slot.day}: ${slot.slots.join(", ")}`)
                  .join("; ") || "N/A"}
              </p>
              <p>
                <span className="font-medium">Timezone:</span> {expert.timezone || "N/A"}
              </p>
            </div>
          </div>

          {/* Languages */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Languages</h3>
            <p className="text-gray-700">{expert.languages?.join(", ") || "No languages added"}</p>
          </div>

          {/* Address */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Address</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-gray-700">
              <p>
                <span className="font-medium">Country:</span> {expert.country || "N/A"}
              </p>
              <p>
                <span className="font-medium">City/State:</span> {expert.city || "N/A"}
              </p>
              <p>
                <span className="font-medium">Postal Code:</span> {expert.postalCode || "N/A"}
              </p>
              <p>
                <span className="font-medium">TAX ID:</span> {expert.taxId || "N/A"}
              </p>
            </div>
          </div>
        </div>

        {/* Edit Button */}
        <div className="mt-6 flex justify-center sm:justify-end">
          <button
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
            onClick = {handleEditExpertProfile}
          >
            Edit
          </button>
        </div>
      </div>
    </div>
  );
};

export default ExpertProfile;
