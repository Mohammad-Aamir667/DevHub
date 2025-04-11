"use client"

import { useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { BASE_URL } from "../utils/constants"
import axios from "axios"
import { addUser } from "../utils/userSlice"
import ProfilePictureUpload from "./ProfilePictureUpload"
import { useNavigate } from "react-router-dom"
import { ArrowLeft, Save, Upload } from "lucide-react"

const EditProfile = () => {
  const user = useSelector((store) => store.user)
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const [firstName, setFirstName] = useState(user?.firstName || "")
  const [lastName, setLastName] = useState(user?.lastName || "")
  const [gender, setGender] = useState(user?.gender || "")
  const [age, setAge] = useState(user?.age || "")
  const [skills, setSkills] = useState(user?.skills || "")
  const [about, setAbout] = useState(user?.about || "")
  const [photoUrl, setPhotoUrl] = useState(user?.photoUrl || "")
  const [error, setError] = useState("")
  const [showToast, setShowToast] = useState(false)

  const saveProfile = async () => {
    setError("")
    try {
      const res = await axios.post(
        `${BASE_URL}/editProfile`,
        { firstName, lastName, age, gender, about, skills, photoUrl },
        { withCredentials: true },
      )
      dispatch(addUser(res.data))
      setShowToast(true)
      setTimeout(() => setShowToast(false), 3000)
    } catch (err) {
      setError(err.message)
    }
  }

  // This is a simplified version of the ProfilePictureUpload component
  // since we're keeping the original component's functionality
  const CustomProfilePictureUpload = () => {
    return (
      <div className="flex flex-col items-center mb-6">
        <ProfilePictureUpload photoUrl={photoUrl} setPhotoUrl={setPhotoUrl} />
      </div>
    )
  }
  

  return (
    <div className="min-h-screen mt-2 pt-16 bg-gradient-to-b from-slate-950 to-slate-900 py-12 px-6 flex justify-center">
      <div className="max-w-md w-full bg-slate-900 border border-slate-800 rounded-xl shadow-xl relative">
        <button
          onClick={() => navigate(-1)}
          className="absolute top-4 left-4 text-slate-400 hover:text-slate-100 hover:bg-slate-800 p-1 rounded-md flex items-center text-sm transition-colors"
        >
          <ArrowLeft className="w-6 h-6 mr-2" /> 
        </button>

        <div className="pt-12 pb-6 px-6">
          <h2 className="text-2xl font-bold text-slate-100 text-center">Edit Developer Profile</h2>
        </div>

        <div className="px-6 pb-6 space-y-6">
          <CustomProfilePictureUpload />

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label htmlFor="firstName" className="block text-sm font-medium text-slate-300">
                First Name
              </label>
              <input
                id="firstName"
                type="text"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                placeholder="First Name"
                className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-md text-slate-200 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="lastName" className="block text-sm font-medium text-slate-300">
                Last Name
              </label>
              <input
                id="lastName"
                type="text"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                placeholder="Last Name"
                className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-md text-slate-200 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label htmlFor="gender" className="block text-sm font-medium text-slate-300">
                Gender
              </label>
              <select
                id="gender"
                value={gender}
                onChange={(e) => setGender(e.target.value)}
                className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-md text-slate-200 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
              >
                <option value="">Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div className="space-y-2">
              <label htmlFor="age" className="block text-sm font-medium text-slate-300">
                Age
              </label>
              <input
                id="age"
                type="number"
                value={age}
                onChange={(e) => setAge(e.target.value)}
                placeholder="Age"
                className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-md text-slate-200 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label htmlFor="skills" className="block text-sm font-medium text-slate-300">
              Skills (comma separated)
            </label>
            <textarea
              id="skills"
              value={skills}
              onChange={(e) => setSkills(e.target.value)}
              placeholder="JavaScript, React, Node.js, TypeScript, etc."
              className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-md text-slate-200 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent min-h-[80px]"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="about" className="block text-sm font-medium text-slate-300">
              About You
            </label>
            <textarea
              id="about"
              value={about}
              onChange={(e) => setAbout(e.target.value)}
              placeholder="Tell us about yourself, your experience, and what you're passionate about..."
              className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-md text-slate-200 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent min-h-[120px]"
            />
          </div>

          {error && <div className="bg-red-900 border border-red-800 text-red-200 px-4 py-3 rounded-md">{error}</div>}

          <div className="h-px bg-slate-800 my-2"></div>

          <button
            onClick={saveProfile}
            className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white font-medium py-2 px-4 rounded-md flex items-center justify-center transition-colors"
          >
            <Save className="w-4 h-4 mr-2" /> Save Profile
          </button>
        </div>
      </div>

      {showToast && (
        <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 bg-green-600 text-white py-2 px-4 rounded-lg shadow-lg z-50 animate-in fade-in slide-in-from-bottom-4">
          Profile updated successfully!
        </div>
      )}
    </div>
  )
}

export default EditProfile
