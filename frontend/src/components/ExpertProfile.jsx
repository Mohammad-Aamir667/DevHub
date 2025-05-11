"use client"

import { useSelector } from "react-redux"
import { Link, useNavigate } from "react-router-dom"
import { ArrowLeft, FileText } from 'lucide-react';
const ExpertProfile = () => {
  const expert = useSelector((state) => state.expertDetails);
 
  const user = useSelector((state) => state.user)
  const navigate = useNavigate()

  const handleEditExpertProfile = () => {
    return navigate("/edit-expert-profile")
  }

  return (
    <div className="bg-gray-950 min-h-screen mt-16 flex justify-center items-center p-4 py-8">
      <div className="w-full max-w-4xl bg-gray-900 border border-gray-800 rounded-lg shadow-xl text-gray-100">
        {/* Header */}
        <div className="p-6 pb-2 flex items-center justify-between">
        <button
            onClick={() => navigate(-1)}
            className="text-slate-400 hover:text-slate-100 hover:bg-slate-800 p-2 sm:p-3 rounded-md flex items-center text-sm sm:text-base transition-colors"
          >
            <ArrowLeft className="w-5 h-5 sm:w-6 sm:h-6 mr-2" /> 
          </button>
          <h1 className="text-2xl font-bold text-gray-100">My Profile</h1>
          <div className="w-16" /> {/* Spacer for alignment */}
        </div>

        <div className="p-6 space-y-6">
          {/* Basic Info */}
          <div className="flex flex-col sm:flex-row items-center gap-6 pt-2">
            <div className="relative">
              <img
                src={user?.photoUrl || "/default-avatar.jpg"}
                alt="Profile"
                className="w-24 h-24 rounded-full object-cover border-2 border-gray-700 shadow-md"
              />
            </div>
            <div className="text-center sm:text-left">
              <h2 className="text-2xl font-bold text-gray-100">
                {`${user?.firstName || "First Name"} ${user?.lastName || "Last Name"}`}
              </h2>
              <p className="text-gray-400 mt-1">{expert.expertise || "Expertise not specified"}</p>
            </div>
          </div>

          <hr className="border-gray-800" />

          {/* Personal Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-200 flex items-center">Personal Information</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-gray-300">
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-gray-400">Experience</p>
                  <p className="font-medium">
                    {expert.experienceYears ? `${expert.experienceYears} years` : "Not specified"}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-400">Description</p>
                  <p className="font-medium line-clamp-3">{expert.description || "No description provided"}</p>
                </div>
              </div>
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-gray-400">Certifications</p>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {expert.certifications?.length > 0 ? (
                      expert.certifications.map((cert, index) => (
                        <span key={index} className="px-2 py-1 text-xs rounded-full bg-gray-800 text-gray-200">
                          {cert}
                        </span>
                      ))
                    ) : (
                      <p className="text-gray-500">No certifications added</p>
                    )}
                  </div>
                </div>
                <div className="space-y-2">
                  <p className="text-sm text-gray-400">Professional Profiles</p>
                  <div className="flex flex-col gap-2">
                    {expert.linkedInProfile && (
                      <a
                        href={expert.linkedInProfile}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center text-gray-300 hover:text-gray-100 transition-colors"
                      >
                        <svg className="h-4 w-4 mr-2 text-blue-400" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.32 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.79M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z" />
                        </svg>
                        <span className="truncate">{expert.linkedInProfile}</span>
                        <svg
                          className="h-3 w-3 ml-1 text-gray-500"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                        >
                          <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                          <polyline points="15 3 21 3 21 9" />
                          <line x1="10" y1="14" x2="21" y2="3" />
                        </svg>
                      </a>
                    )}
                    {expert.githubProfile && (
                      <a
                        href={expert.githubProfile}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center text-gray-300 hover:text-gray-100 transition-colors"
                      >
                        <svg className="h-4 w-4 mr-2 text-gray-300" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M12 2A10 10 0 0 0 2 12c0 4.42 2.87 8.17 6.84 9.5.5.08.66-.23.66-.5v-1.69c-2.77.6-3.36-1.34-3.36-1.34-.46-1.16-1.11-1.47-1.11-1.47-.91-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.87 1.52 2.34 1.07 2.91.83.09-.65.35-1.09.63-1.34-2.22-.25-4.55-1.11-4.55-4.92 0-1.11.38-2 1.03-2.71-.1-.25-.45-1.29.1-2.64 0 0 .84-.27 2.75 1.02.79-.22 1.65-.33 2.5-.33.85 0 1.71.11 2.5.33 1.91-1.29 2.75-1.02 2.75-1.02.55 1.35.2 2.39.1 2.64.65.71 1.03 1.6 1.03 2.71 0 3.82-2.34 4.66-4.57 4.91.36.31.69.92.69 1.85V21c0 .27.16.59.67.5C19.14 20.16 22 16.42 22 12A10 10 0 0 0 12 2z" />
                        </svg>
                        <span className="truncate">{expert.githubProfile}</span>
                        <svg
                          className="h-3 w-3 ml-1 text-gray-500"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                        >
                          <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                          <polyline points="15 3 21 3 21 9" />
                          <line x1="10" y1="14" x2="21" y2="3" />
                        </svg>
                      </a>
                    )}
                     {expert.portfolioUrl && (
                      <a
                        href={expert.portfolioUrl
                        }
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center text-gray-300 hover:text-gray-100 transition-colors"
                      >
                        <svg className="h-4 w-4 mr-2 text-gray-300" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M12 2A10 10 0 0 0 2 12c0 4.42 2.87 8.17 6.84 9.5.5.08.66-.23.66-.5v-1.69c-2.77.6-3.36-1.34-3.36-1.34-.46-1.16-1.11-1.47-1.11-1.47-.91-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.87 1.52 2.34 1.07 2.91.83.09-.65.35-1.09.63-1.34-2.22-.25-4.55-1.11-4.55-4.92 0-1.11.38-2 1.03-2.71-.1-.25-.45-1.29.1-2.64 0 0 .84-.27 2.75 1.02.79-.22 1.65-.33 2.5-.33.85 0 1.71.11 2.5.33 1.91-1.29 2.75-1.02 2.75-1.02.55 1.35.2 2.39.1 2.64.65.71 1.03 1.6 1.03 2.71 0 3.82-2.34 4.66-4.57 4.91.36.31.69.92.69 1.85V21c0 .27.16.59.67.5C19.14 20.16 22 16.42 22 12A10 10 0 0 0 12 2z" />
                        </svg>
                        <span className="truncate">{expert.portfolioUrl
                        }</span>
                        <svg
                          className="h-3 w-3 ml-1 text-gray-500"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                        >
                          <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                          <polyline points="15 3 21 3 21 9" />
                          <line x1="10" y1="14" x2="21" y2="3" />
                        </svg>
                      </a>
                    )}
                        {expert.resumeUrl && (
                  <div className="flex items-center">
                    <FileText className="w-5 h-5 mr-2 text-slate-400" />
                    <Link
                      to={expert.resumeUrl}
                      className="text-cyan-400 hover:text-cyan-300 transition-colors"
                      target="_blank"
                    >
                      Download Resume
                    </Link>
                  </div>
                )}

                    {!expert.linkedInProfile && !expert.githubProfile && (
                      <p className="text-gray-500">No profiles added</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <hr className="border-gray-800" />

          {/* Schedule Availability */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-200">Schedule Availability</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-gray-300">
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-gray-400">Available Days</p>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {expert.schedule?.availableDays?.length > 0  ? (
                      expert.schedule.availableDays.map((day, index) => (
                        <span
                          key={index}
                          className="px-2 py-1 text-xs rounded-full border border-gray-700 text-gray-200"
                        >
                          {day}
                        </span>
                      ))
                    ) : (
                      <p className="text-gray-500">Not specified</p>
                    )}
                  </div>
                </div>
                <div>
                  <p className="text-sm text-gray-400">Timezone</p>
                  <p className="font-medium">{expert.timezone || "Not specified"}</p>
                </div>
              </div>
              <div>
                <p className="text-sm text-gray-400">Time Slots</p>
                {expert.schedule?.timeSlots?.length > 0 ? (
                  <div className="mt-1 space-y-2">
                    {expert.schedule.timeSlots.map((slot, index) => (
                      <div key={index} className="text-sm">
                        <span className="font-medium">{slot.day}:</span>{" "}
                        <span className="text-gray-400">{slot.slots.join(", ")}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500">No time slots specified</p>
                )}
              </div>
            </div>
          </div>

          <hr className="border-gray-800" />

          {/* Languages */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-200">Languages</h3>
            <div className="flex flex-wrap gap-2">
              {expert.languages?.length > 0 ? (
                expert.languages.map((language, index) => (
                  <span
                    key={index}
                    className="px-2 py-1 text-xs rounded-full bg-gray-800 hover:bg-gray-700 text-gray-200"
                  >
                    {language}
                  </span>
                ))
              ) : (
                <p className="text-gray-500">No languages added</p>
              )}
            </div>
          </div>

          <hr className="border-gray-800" />

          {/* Address */}
         
        </div>

        {/* Edit Button */}
        <div className="px-6 pb-6 pt-2 flex justify-end">
          <button
            onClick={handleEditExpertProfile}
            className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-md transition-colors"
          >
            Edit Profile
          </button>
        </div>
      </div>
    </div>
  )
}

export default ExpertProfile
