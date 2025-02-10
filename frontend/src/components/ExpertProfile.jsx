import { useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"

const ExpertProfile = () => {
  const expert = useSelector((state) => state.expertDetails)
  const user = useSelector((state) => state.user)
  const navigate = useNavigate()

  const handleEditExpertProfile = () => {
    return navigate("/edit-expert-profile")
  }

  return (
    <div className="bg-gray-900 min-h-screen mt-16 flex justify-center items-center p-4">
         
      <div className="bg-gray-800 shadow-lg rounded-lg w-full max-w-4xl p-6 sm:p-8 text-gray-100">
        {/* Header */}
        <button
          onClick={() => navigate(-1)}
          className="text-electric-blue hover:text-cyan-400 transition duration-200 flex items-center space-x-2"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
            className="w-5 h-5"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
          <span>Back</span>
        </button>
        <h1 className="text-2xl font-bold mb-6 text-center sm:text-left text-blue-400">My Profile</h1>

        {/* Profile Card */}
        <div className="bg-gray-700 rounded-lg p-4 sm:p-6 space-y-6">
          {/* Basic Info */}
          <div className="flex flex-col sm:flex-row items-center gap-4">
            <img
              src={user.photoUrl || "/default-avatar.jpg"}
              alt="Profile"
              className="w-20 h-20 rounded-full border-2 border-blue-400"
            />
            <div className="text-center sm:text-left">
              <h2 className="text-xl font-semibold text-blue-300">
                {`${user.firstName || "First Name"} ${user.lastName || "Last Name"}`}
              </h2>
            </div>
          </div>

          {/* Personal Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-blue-400">Personal Information</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-gray-300">
              <div>
                <p>
                  <span className="font-medium text-gray-100">Expertise:</span> {expert.expertise || "N/A"}
                </p>
                <p>
                  <span className="font-medium text-gray-100">Experience:</span>{" "}
                  {expert.experienceYears ? `${expert.experienceYears} years` : "N/A"}
                </p>
                <p>
                  <span className="font-medium text-gray-100">Description:</span>{" "}
                  {expert.description || "No description provided"}
                </p>
              </div>
              <div>
                <p>
                  <span className="font-medium text-gray-100">Certifications:</span>{" "}
                  {expert.certifications?.join(", ") || "No certifications added"}
                </p>
                <p>
                  <span className="font-medium text-gray-100">LinkedIn:</span>{" "}
                  <a href={expert.linkedInProfile || "#"} className="text-blue-400 hover:underline break-all">
                    {expert.linkedInProfile || "No profile added"}
                  </a>
                </p>
                <p>
                  <span className="font-medium text-gray-100">GitHub:</span>{" "}
                  <a href={expert.githubProfile || "#"} className="text-blue-400 hover:underline break-all">
                    {expert.githubProfile || "No profile added"}
                  </a>
                </p>
              </div>
            </div>
          </div>

          {/* Schedule Availability */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-blue-400">Schedule Availability</h3>
            <div className="text-gray-300">
              <p>
                <span className="font-medium text-gray-100">Available Days:</span>{" "}
                {expert.schedule?.availableDays.join(", ") || "N/A"}
              </p>
              <p>
                <span className="font-medium text-gray-100">Time Slots:</span>{" "}
                {expert.schedule?.timeSlots?.map((slot) => `${slot.day}: ${slot.slots.join(", ")}`).join("; ") || "N/A"}
              </p>
              <p>
                <span className="font-medium text-gray-100">Timezone:</span> {expert.timezone || "N/A"}
              </p>
            </div>
          </div>

          {/* Languages */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-blue-400">Languages</h3>
            <p className="text-gray-300">{expert.languages?.join(", ") || "No languages added"}</p>
          </div>

          {/* Address */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-blue-400">Address</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-gray-300">
              <p>
                <span className="font-medium text-gray-100">Country:</span> {expert.country || "N/A"}
              </p>
              <p>
                <span className="font-medium text-gray-100">City/State:</span> {expert.city || "N/A"}
              </p>
              <p>
                <span className="font-medium text-gray-100">Postal Code:</span> {expert.postalCode || "N/A"}
              </p>
              <p>
                <span className="font-medium text-gray-100">TAX ID:</span> {expert.taxId || "N/A"}
              </p>
            </div>
          </div>
        </div>

        {/* Edit Button */}
        <div className="mt-6 flex justify-center sm:justify-end">
          <button
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition duration-150"
            onClick={handleEditExpertProfile}
          >
            Edit Profile
          </button>
        </div>
      </div>
    </div>
  )
}

export default ExpertProfile

