"use client"

import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"
import axios from "axios"
import { BASE_URL } from "../../../utils/constants"
import { ArrowLeft, FileText, Upload } from 'lucide-react';
import { updateExpertStatus } from "../../../utils/expertDetailsSlice"

const EditExpertProfile = () => {
  const expert = useSelector((state) => state.expertDetails);
  const user = useSelector((state) => state.user)
  const navigate = useNavigate()

  const [profileData, setProfileData] = useState({
    expertise: expert.expertise?.join(", ") || "",
    experienceYears: expert.experienceYears || "",
    description: expert.description || "",
    certifications: expert.certifications?.join(", ") || "",
    linkedInProfile: expert.linkedInProfile || "",
    resumeUrl: "",
    portfolioUrl: expert.portfolioUrl || "",
    githubProfile: expert.githubProfile || "",
    languages: expert.languages?.join(", ") || "",
    timezone: expert.timezone || "",
    schedule: {
      availableDays: expert.schedule?.availableDays?.join(", ") || "",
      timeSlots: expert.schedule?.timeSlots?.map((slot) => `${slot.day}: ${slot.slots.join(", ")}`).join("; ") || "",
    }
  });
  const [errors, setErrors] = useState({
    expertise: "",
    experienceYears: "",
    linkedInProfile: "",
    githubProfile: "",
  });
  const [selectedFileName, setSelectedFileName] = useState("")
  const dispatch = useDispatch()
  const validateForm = () => {
    let isValid = true;
    const newErrors = {
      expertise: "",
      experienceYears: "",
      linkedInProfile: "",
      githubProfile: "",
      resumeUrl: ""
    };

    if (!profileData.expertise.trim()) {
      newErrors.expertise = "Expertise is required";
      isValid = false;
    }

    if (!profileData.experienceYears) {
      newErrors.experienceYears = "Years of experience is required";
      isValid = false;
    }

    if (!profileData.linkedInProfile.trim()) {
      newErrors.linkedInProfile = "LinkedIn profile is required";
      isValid = false;
    } else if (!profileData.linkedInProfile.includes('linkedin.com')) {
      newErrors.linkedInProfile = "Please enter a valid LinkedIn URL";
      isValid = false;
    }

    if (!profileData.githubProfile.trim()) {
      newErrors.githubProfile = "GitHub profile is required";
      isValid = false;
    } else if (!profileData.githubProfile.includes('github.com')) {
      newErrors.githubProfile = "Please enter a valid GitHub URL";
      isValid = false;
    }



    setErrors(newErrors);
    return isValid;
  };
  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (name === "availableDays" || name === "timeSlots") {
      setProfileData((prevData) => ({
        ...prevData,
        schedule: {
          ...prevData.schedule,
          [name]: value,
        },
      }));
    }
    else if (name === "resumeUrl") {
      setProfileData((prevData) => ({ ...prevData, [name]: files[0] }))
      setSelectedFileName(files[0]?.name || "")

    } else {
      setProfileData((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    }
  };


  const handleExpert = async () => {
    try {
      const getExpertDetails = await axios.get(BASE_URL + "/expert-details", { withCredentials: true });
      dispatch(updateExpertStatus(getExpertDetails.data));
    }
    catch (err) {
      console.log(err)

    }

  }
  useEffect(() => {
    if (!expert?.expertId) {
      handleExpert();
    }
  }, [expert?.expertId]);


  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      return;
    }
    const payLoad = {
      expertise: profileData.expertise.split(",").map(e => e.trim()).filter(Boolean),
      experienceYears: profileData.experienceYears,
      description: profileData.description,
      certifications: profileData.certifications.split(",").map(c => c.trim()).filter(Boolean),
      linkedInProfile: profileData.linkedInProfile,
      resumeUrl: profileData.resumeUrl,
      portfolioUrl: profileData.portfolioUrl,
      githubProfile: profileData.githubProfile,
      languages: profileData.languages.split(",").map(l => l.trim()).filter(Boolean),
      timezone: profileData.timezone.trim(),
      schedule: {
        availableDays: (profileData.schedule.availableDays || "")
          .split(",")
          .map((day) => day.trim())
          .filter(Boolean),
        timeSlots: (profileData.schedule.timeSlots || "")
          .split(";")
          .filter(Boolean)
          .map((entry) => {
            const [day, slotsStr] = entry.split(":");
            return {
              day: day.trim(),
              slots: (slotsStr || "")
                .split(",")
                .map((slot) => slot.trim())
                .filter(Boolean),
            };
          }),
      },
    };

    const formDataToSubmit = new FormData()
    Object.keys(payLoad).forEach((key) => {
      if (key === "schedule") {
        formDataToSubmit.append(key, JSON.stringify(payLoad[key])); // Fix is here
      }
      else if (key === "resumeUrl") {
        if (selectedFileName) {
          formDataToSubmit.append(key, payLoad[key]);
        }
      }
      else {
        formDataToSubmit.append(key, payLoad[key]);
      }

    });

    try {
      const res = await axios.post(`${BASE_URL}/edit-expert-profile`, formDataToSubmit, {
        headers: { "Content-Type": "multipart/form-data" },
        withCredentials: true,
      })
      dispatch(updateExpertStatus(res.data))
      alert("Profile updated successfully!")
      navigate("/expert-profile")
    } catch (error) {
      console.error(error)
      alert("Failed to update profile. Please try again.")
    }

  }
  const extractFilename = (url) => {
    if (!url) return '';
    // Handle both URL paths and full URLs
    const lastSegment = url.split('/').pop();
    // Remove query parameters if any
    return lastSegment.split('?')[0];
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
          <h1 className="text-2xl font-bold text-gray-100">Edit Profile</h1>
          <div className="w-16" /> {/* Spacer for alignment */}
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Basic Info */}
          <div className="space-y-4">
            <div className="flex items-center">
              <h3 className="text-lg font-semibold text-gray-200">Basic Information</h3>
              <div className="ml-3 h-px flex-grow bg-gray-800"></div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label htmlFor="expertise" className="text-sm text-gray-400">
                  Expertise
                </label>
                <input
                  type="text"
                  id="expertise"
                  name="expertise"
                  value={profileData.expertise}
                  onChange={handleChange}
                  placeholder="Your area of expertise"
                  className="w-full p-3 bg-gray-800 border border-gray-700 rounded-md text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-gray-600"
                />
                {errors.expertise && <p className="text-red-500 text-xs mt-1">{errors.expertise}</p>}
              </div>
              <div className="space-y-1">
                <label htmlFor="experienceYears" className="text-sm text-gray-400">
                  Experience (Years)
                </label>
                <input
                  type="number"
                  id="experienceYears"
                  name="experienceYears"
                  value={profileData.experienceYears}
                  onChange={handleChange}
                  placeholder="Years of experience"
                  className="w-full p-3 bg-gray-800 border border-gray-700 rounded-md text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-gray-600"
                />
                {errors.experienceYears && <p className="text-red-500 text-xs mt-1">{errors.experienceYears}</p>}
              </div>
              <div className="space-y-1 col-span-2">
                <label htmlFor="description" className="text-sm text-gray-400">
                  Description
                </label>
                <textarea
                  id="description"
                  name="description"
                  value={profileData.description}
                  onChange={handleChange}
                  placeholder="Describe your expertise and experience"
                  className="w-full p-3 bg-gray-800 border border-gray-700 rounded-md text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-gray-600"
                  rows="3"
                />
              </div>
            </div>
          </div>

          <hr className="border-gray-800" />

          {/* Certifications and Links */}
          <div className="space-y-4">
            <div className="flex items-center">
              <h3 className="text-lg font-semibold text-gray-200">Certifications and Links</h3>
              <div className="ml-3 h-px flex-grow bg-gray-800"></div>
            </div>
            <div className="space-y-4">
              <div className="space-y-1">
                <label htmlFor="certifications" className="text-sm text-gray-400">
                  Certifications (comma-separated)
                </label>
                <input
                  type="text"
                  id="certifications"
                  name="certifications"
                  value={profileData.certifications}
                  onChange={handleChange}
                  placeholder="AWS Certified, Google Cloud Professional, etc."
                  className="w-full p-3 bg-gray-800 border border-gray-700 rounded-md text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-gray-600"
                />
              </div>
              <div className="space-y-1">
                <label htmlFor="languages" className="text-sm text-gray-400">
                  Languages (comma-separated)
                </label>
                <input
                  type="text"
                  id="languages"
                  name="languages"
                  value={profileData.languages}
                  onChange={handleChange}
                  placeholder="English, Spanish, French, etc."
                  className="w-full p-3 bg-gray-800 border border-gray-700 rounded-md text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-gray-600"
                />
              </div>
              <div className="space-y-1">
                <label htmlFor="linkedInProfile" className="text-sm text-gray-400">
                  LinkedIn Profile
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <svg className="h-5 w-5 text-gray-500" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.32 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.79M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z" />
                    </svg>
                  </div>
                  <input
                    type="url"
                    id="linkedInProfile"
                    name="linkedInProfile"
                    value={profileData.linkedInProfile}
                    onChange={handleChange}
                    placeholder="https://linkedin.com/in/yourprofile"
                    className="w-full p-3 pl-10 bg-gray-800 border border-gray-700 rounded-md text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-gray-600"
                  />
                  {errors.linkedInProfile && <p className="text-red-500 text-xs mt-1">{errors.linkedInProfile}</p>}
                </div>
              </div>
              <div className="space-y-1">
                <label htmlFor="githubProfile" className="text-sm text-gray-400">
                  GitHub Profile
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <svg className="h-5 w-5 text-gray-500" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 2A10 10 0 0 0 2 12c0 4.42 2.87 8.17 6.84 9.5.5.08.66-.23.66-.5v-1.69c-2.77.6-3.36-1.34-3.36-1.34-.46-1.16-1.11-1.47-1.11-1.47-.91-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.87 1.52 2.34 1.07 2.91.83.09-.65.35-1.09.63-1.34-2.22-.25-4.55-1.11-4.55-4.92 0-1.11.38-2 1.03-2.71-.1-.25-.45-1.29.1-2.64 0 0 .84-.27 2.75 1.02.79-.22 1.65-.33 2.5-.33.85 0 1.71.11 2.5.33 1.91-1.29 2.75-1.02 2.75-1.02.55 1.35.2 2.39.1 2.64.65.71 1.03 1.6 1.03 2.71 0 3.82-2.34 4.66-4.57 4.91.36.31.69.92.69 1.85V21c0 .27.16.59.67.5C19.14 20.16 22 16.42 22 12A10 10 0 0 0 12 2z" />
                    </svg>
                  </div>
                  <input
                    type="url"
                    id="githubProfile"
                    name="githubProfile"
                    value={profileData.githubProfile}
                    onChange={handleChange}
                    placeholder="https://github.com/yourusername"
                    className="w-full p-3 pl-10 bg-gray-800 border border-gray-700 rounded-md text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-gray-600"
                  />
                  {errors.githubProfile && <p className="text-red-500 text-xs mt-1">{errors.githubProfile}</p>}

                </div>
              </div>
              <div>
                <label className="block text-slate-300 font-medium mb-2">
                  <span className="flex items-center">
                    <FileText className="w-4 h-4 mr-2" />
                    Resume (Optional Update)
                  </span>
                </label>

                {expert.resumeUrl && (
                  <div className="mb-2 text-sm text-gray-400">
                    Current resume: <a
                      href={expert.resumeUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-400 hover:underline"
                    >
                      View Current Resume
                    </a>
                  </div>
                )}

                <div className="relative border rounded-lg bg-slate-700">
                  <input
                    type="file"
                    id="resume"
                    name="resumeUrl"
                    onChange={handleChange}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                  <div className="flex items-center px-3 py-2">
                    <Upload className="w-5 h-5 text-slate-400 mr-2" />
                    <span className="text-slate-300 truncate">
                      {selectedFileName || "Choose file to update..."}
                    </span>
                  </div>
                </div>
                <p className="mt-1 text-xs text-gray-400">
                  Leave empty to keep current resume
                </p>
              </div>
            </div>
          </div>


          <hr className="border-gray-800" />

          {/* Schedule and Availability */}
          <div className="space-y-4">
            <div className="flex items-center">
              <h3 className="text-lg font-semibold text-gray-200">Schedule and Availability</h3>
              <div className="ml-3 h-px flex-grow bg-gray-800"></div>
            </div>
            <div className="space-y-4">
              <div className="space-y-1">
                <label htmlFor="availableDays" className="text-sm text-gray-400">
                  Available Days (comma-separated)
                </label>
                <input
                  type="text"
                  id="availableDays"
                  name="availableDays"
                  value={profileData.schedule.availableDays}
                  onChange={handleChange}
                  placeholder="Monday, Tuesday, Wednesday, etc."
                  className="w-full p-3 bg-gray-800 border border-gray-700 rounded-md text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-gray-600"
                />
              </div>
              <div className="space-y-1">
                <label htmlFor="timeSlots" className="text-sm text-gray-400">
                  Time Slots (e.g., Mon: 10 AM - 2 PM; Tue: 1 PM - 5 PM)
                </label>
                <textarea
                  id="timeSlots"
                  name="timeSlots"
                  value={profileData.schedule.timeSlots}
                  onChange={handleChange}
                  placeholder="Mon: 9 AM - 12 PM, 2 PM - 5 PM; Tue: 10 AM - 3 PM"
                  className="w-full p-3 bg-gray-800 border border-gray-700 rounded-md text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-gray-600"
                  rows="3"
                />
              </div>
              <div className="space-y-1">
                <label htmlFor="timezone" className="text-sm text-gray-400">
                  Timezone
                </label>
                <input
                  type="text"
                  id="timezone"
                  name="timezone"
                  value={profileData.timezone}
                  onChange={handleChange}
                  placeholder="UTC, EST, PST, etc."
                  className="w-full p-3 bg-gray-800 border border-gray-700 rounded-md text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-gray-600"
                />
              </div>
            </div>
          </div>

          <hr className="border-gray-800" />



          {/* Submit Button */}
          <div className="pt-4 flex justify-end">
            <button
              type="submit"
              className="px-6 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-md transition-colors"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default EditExpertProfile
