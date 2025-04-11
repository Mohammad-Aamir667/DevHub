"use client"

import { useCallback, useState } from "react"
import ConfirmModal from "./common/ConfirmModal"
import axios from "axios"
import { BASE_URL } from "../utils/constants"
import { useNavigate } from "react-router-dom"
import { useDispatch, useSelector } from "react-redux"
import Toast from "./Toast"
import { updateExpertStatus } from "../utils/expertDetailsSlice"
import { ArrowLeft, Upload, XCircle, FileText, Github, Linkedin, Globe, Clock } from "lucide-react"

const ExpertApplicationForm = () => {
  const [isModalOpen, setModalOpen] = useState(false)
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const [showToast, setShowToast] = useState(false)
  const expertDetails = useSelector((store) => store.expertDetails)

  const onClose = useCallback(() => {
    setShowToast(false)
  }, [])

  const [formData, setFormData] = useState({
    expertise: "",
    experienceYears: "",
    description: "",
    certifications: "",
    linkedInProfile: "",
    githubProfile: "",
    portfolioUrl: "",
    resume: null,
  })

  const [errors, setErrors] = useState({})
  const [selectedFileName, setSelectedFileName] = useState("")

  const handleChange = (e) => {
    const { name, value, files } = e.target
    if (name === "resume") {
      setFormData({ ...formData, [name]: files[0] })
      setSelectedFileName(files[0]?.name || "")
    } else {
      setFormData({ ...formData, [name]: value })
    }
  }

  const handleExpertFormSubmit = async (formData) => {
    try {
      const res = await axios.post(BASE_URL + "/become-expert", formData, {
        headers: { "Content-Type": "multipart/form-data" },
        withCredentials: true,
      })
      dispatch(updateExpertStatus({ expertId: res.data.expertId, status: "pending" }))
      setShowToast(true)
    } catch (error) {
      console.error("Error submitting application:", error)
      alert("There was an issue submitting your application.")
    }
  }

  const validateForm = () => {
    const newErrors = {}
    if (!formData.expertise.trim()) newErrors.expertise = "Expertise is required."
    if (!formData.experienceYears || formData.experienceYears < 0)
      newErrors.experienceYears = "Experience must be a non-negative number."
    if (formData.description.length > 300) newErrors.description = "Description must be under 300 characters."
    if (!formData.githubProfile.trim() || !formData.githubProfile.startsWith("http"))
      newErrors.githubProfile = "A valid GitHub profile is required."
    if (!formData.linkedInProfile.trim() || !formData.linkedInProfile.startsWith("http"))
      newErrors.linkedInProfile = "A valid LinkedIn profile is required."
    if (!formData.resume) newErrors.resume = "Resume is required."
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleOpenModal = (e) => {
    e.preventDefault()
    if (!validateForm()) return
    setModalOpen(true)
  }

  const handleConfirmSubmit = () => {
    setModalOpen(false)
    const formDataToSubmit = new FormData()
    Object.keys(formData).forEach((key) => {
      formDataToSubmit.append(key, formData[key])
    })
    handleExpertFormSubmit(formDataToSubmit)
  }

  const handleReapply = () => {
    dispatch(updateExpertStatus({ status: "pending" }))
  }

  // Render application status screens
  if (expertDetails.expertId) {
    if (expertDetails.status === "pending") {
      return (
        <div className="min-h-screen bg-gradient-to-b from-slate-950 to-slate-900 pt-16 px-6 py-12 flex items-center justify-center">
          <div className="max-w-md w-full bg-slate-800 border border-slate-700 rounded-xl p-8 text-center">
            <div className="flex justify-center mb-4">
              <div className="relative">
                <Clock className="h-16 w-16 text-cyan-400" />
                <div className="absolute inset-0 rounded-full animate-ping bg-cyan-500 opacity-20"></div>
              </div>
            </div>
            <h2 className="text-2xl font-bold text-slate-100 mb-4">Application Under Review</h2>
            <p className="text-slate-300 mb-6">
              Your expert application is currently being reviewed by our team. We'll notify you once a decision has been
              made.
            </p>
            <button
              onClick={() => navigate(-1)}
              className="bg-slate-700 hover:bg-slate-600 text-slate-200 px-6 py-2 rounded-lg text-sm font-medium transition-colors inline-flex items-center"
            >
              <ArrowLeft className="w-4 h-4 mr-2" /> Return to Dashboard
            </button>
          </div>
        </div>
      )
    } else if (expertDetails.status === "rejected") {
      return (
        <div className="min-h-screen bg-gradient-to-b from-slate-950 to-slate-900 pt-16 px-6 py-12 flex items-center justify-center">
          <div className="max-w-md w-full bg-slate-800 border border-red-800 rounded-xl p-8 text-center">
            <div className="flex justify-center mb-4">
              <XCircle className="h-16 w-16 text-red-500" />
            </div>
            <h2 className="text-2xl font-bold text-slate-100 mb-4">Application Rejected</h2>
            <p className="text-slate-300 mb-6">
              We're sorry to inform you that your expert application has been rejected. You may review your details and
              apply again.
            </p>
            <button
              onClick={() => handleReapply()}
              className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white px-6 py-2 rounded-lg text-sm font-medium transition-colors inline-flex items-center"
            >
              Apply Again
            </button>
          </div>
        </div>
      )
    }
  }

  return (
    !expertDetails.expertId && (
      <div className="min-h-screen bg-gradient-to-b mt-3 from-slate-950 to-slate-900 pt-16 px-6 py-12">
        <div className="max-w-2xl mx-auto bg-slate-800 border border-slate-700 rounded-xl shadow-xl overflow-hidden">
          <div className="h-2 bg-gradient-to-r from-cyan-500 to-blue-600"></div>

          <div className="p-6">
     <button
               onClick={() => navigate(-1)}
               className="text-slate-400 hover:text-slate-100 hover:bg-slate-800 p-2 sm:p-3 rounded-md flex items-center text-sm sm:text-base transition-colors"
             >
               <ArrowLeft className="w-5 h-5 sm:w-6 sm:h-6 mr-2" /> 
             </button>


            <div className="mb-8 text-center">
              <h1 className="text-2xl font-bold text-slate-100">Expert Application</h1>
              <p className="text-slate-400 mt-2">Share your expertise and help other developers grow</p>
            </div>

            <form onSubmit={handleOpenModal} className="space-y-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-slate-300 font-medium mb-2" htmlFor="expertise">
                    Expertise (comma-separated)
                  </label>
                  <input
                    type="text"
                    id="expertise"
                    name="expertise"
                    value={formData.expertise}
                    onChange={handleChange}
                    placeholder="React, Node.js, TypeScript, etc."
                    className={`w-full px-3 py-2 bg-slate-700 border ${
                      errors.expertise ? "border-red-500" : "border-slate-600"
                    } rounded-lg text-slate-200 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent`}
                  />
                  {errors.expertise && <p className="text-red-400 text-sm mt-1">{errors.expertise}</p>}
                </div>

                <div>
                  <label className="block text-slate-300 font-medium mb-2" htmlFor="experienceYears">
                    Years of Experience
                  </label>
                  <input
                    type="number"
                    id="experienceYears"
                    name="experienceYears"
                    value={formData.experienceYears}
                    onChange={handleChange}
                    placeholder="3"
                    className={`w-full px-3 py-2 bg-slate-700 border ${
                      errors.experienceYears ? "border-red-500" : "border-slate-600"
                    } rounded-lg text-slate-200 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent`}
                  />
                  {errors.experienceYears && <p className="text-red-400 text-sm mt-1">{errors.experienceYears}</p>}
                </div>

                <div>
                  <label className="block text-slate-300 font-medium mb-2" htmlFor="description">
                    Brief Description <span className="text-slate-400 text-sm">(max 300 characters)</span>
                  </label>
                  <textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    maxLength="300"
                    placeholder="Describe your expertise and how you can help others..."
                    className={`w-full px-3 py-2 bg-slate-700 border ${
                      errors.description ? "border-red-500" : "border-slate-600"
                    } rounded-lg text-slate-200 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent min-h-[100px]`}
                  ></textarea>
                  <div className="flex justify-end">
                    <span className="text-slate-400 text-sm">{formData.description.length}/300</span>
                  </div>
                  {errors.description && <p className="text-red-400 text-sm mt-1">{errors.description}</p>}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-slate-300 font-medium mb-2" htmlFor="githubProfile">
                      <span className="flex items-center">
                        <Github className="w-4 h-4 mr-2" /> GitHub Profile
                      </span>
                    </label>
                    <input
                      type="url"
                      id="githubProfile"
                      name="githubProfile"
                      value={formData.githubProfile}
                      onChange={handleChange}
                      placeholder="https://github.com/yourusername"
                      className={`w-full px-3 py-2 bg-slate-700 border ${
                        errors.githubProfile ? "border-red-500" : "border-slate-600"
                      } rounded-lg text-slate-200 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent`}
                    />
                    {errors.githubProfile && <p className="text-red-400 text-sm mt-1">{errors.githubProfile}</p>}
                  </div>

                  <div>
                    <label className="block text-slate-300 font-medium mb-2" htmlFor="linkedInProfile">
                      <span className="flex items-center">
                        <Linkedin className="w-4 h-4 mr-2" /> LinkedIn Profile
                      </span>
                    </label>
                    <input
                      type="url"
                      id="linkedInProfile"
                      name="linkedInProfile"
                      value={formData.linkedInProfile}
                      onChange={handleChange}
                      placeholder="https://linkedin.com/in/yourusername"
                      className={`w-full px-3 py-2 bg-slate-700 border ${
                        errors.linkedInProfile ? "border-red-500" : "border-slate-600"
                      } rounded-lg text-slate-200 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent`}
                    />
                    {errors.linkedInProfile && <p className="text-red-400 text-sm mt-1">{errors.linkedInProfile}</p>}
                  </div>
                </div>

                <div>
                  <label className="block text-slate-300 font-medium mb-2" htmlFor="portfolioUrl">
                    <span className="flex items-center">
                      <Globe className="w-4 h-4 mr-2" /> Portfolio URL{" "}
                      <span className="text-slate-400 text-sm ml-1">(optional)</span>
                    </span>
                  </label>
                  <input
                    type="url"
                    id="portfolioUrl"
                    name="portfolioUrl"
                    value={formData.portfolioUrl}
                    onChange={handleChange}
                    placeholder="https://yourportfolio.com"
                    className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-slate-200 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-medium mb-2" htmlFor="resume">
                    <span className="flex items-center">
                      <FileText className="w-4 h-4 mr-2" /> Upload Resume
                    </span>
                  </label>
                  <div
                    className={`relative border ${errors.resume ? "border-red-500" : "border-slate-600"} rounded-lg bg-slate-700`}
                  >
                    <input
                      type="file"
                      id="resume"
                      name="resume"
                      onChange={handleChange}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    />
                    <div className="flex items-center px-3 py-2">
                      <Upload className="w-5 h-5 text-slate-400 mr-2" />
                      <span className="text-slate-300 truncate">{selectedFileName || "Choose a file..."}</span>
                    </div>
                  </div>
                  {errors.resume && <p className="text-red-400 text-sm mt-1">{errors.resume}</p>}
                </div>
              </div>

              <div className="pt-4">
                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white font-medium py-2.5 px-4 rounded-lg transition-colors flex items-center justify-center"
                >
                  Submit Application
                </button>
              </div>
            </form>
          </div>
        </div>

        <ConfirmModal
          isOpen={isModalOpen}
          message="Are you sure you want to submit your application? Please review your details before confirming"
          onConfirm={handleConfirmSubmit}
          onCancel={() => setModalOpen(false)}
        />

        {showToast && <Toast message="Application submitted successfully!" onClose={onClose} />}
      </div>
    )
  )
}

export default ExpertApplicationForm
