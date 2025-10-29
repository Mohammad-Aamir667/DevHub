"use client"

import { useCallback, useState } from "react"
import { Link, useLocation, useNavigate } from "react-router-dom"
import { BASE_URL } from "../../../utils/constants"
import Toast from "../../Toast"
import { useDispatch, useSelector } from "react-redux"
import { addInteraction } from "../../../utils/interactionSlice"
import axios from "axios"
import {
  ArrowLeft,
  Github,
  Linkedin,
  FileText,
  Calendar,
  Clock,
  Star,
  Award,
  Globe,
  MessageSquare,
  X,
  Send,
} from "lucide-react"

const ExpertProfilePublicView = () => {
  const location = useLocation()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [error, setError] = useState("")
  const dispatch = useDispatch()
  const { expertDetails } = location.state || {}
  const [issueDescription, setIssueDescription] = useState("")
  const [codeSnippet, setCodeSnippet] = useState("")
  const navigate = useNavigate()
  const [showToast, setShowToast] = useState(false)

  const { expertise, experienceYears, expertId, description, githubProfile, linkedInProfile, certifications } =
    expertDetails

  const interaction = useSelector((store) =>
    store?.userInteractions?.find((interaction) => interaction.expertId._id === expertDetails.expertId._id),
  )

  const onClose = useCallback(() => {
    setShowToast(false)
  }, [])

  const handleRequestHelp = () => {
    setIsModalOpen(true)
  }

  const handleSendRequestHelp = async (e) => {
    e.preventDefault()
    if (!issueDescription.trim()) {
      setError("Issue Description is required")
      return
    }
    try {
      const res = await axios.post(
        BASE_URL + "/request-help/" + expertId._id,
        { issueDescription, codeSnippet },
        { withCredentials: true },
      )
      setShowToast(true)
      dispatch(addInteraction(res.data))
      setIsModalOpen(false)
      setIssueDescription("")
      setCodeSnippet("")
      setError("")
    } catch (err) {
      console.error("Something went wrong", err)
    }
  }

  // Format rating if available
  const rating = expertDetails.rating || 0
  const formattedRating = rating.toFixed(1)

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 to-slate-900 pt-16 px-4 sm:px-6 py-12">
      <div className="max-w-4xl mx-auto">
        <button
          onClick={() => navigate(-1)}
          className="text-slate-400 hover:text-slate-100 hover:bg-slate-800 p-2 sm:p-3 rounded-md flex items-center text-sm sm:text-base transition-colors"
        >
          <ArrowLeft className="w-5 h-5 sm:w-6 sm:h-6 mr-2" />
        </button>

        <div className="bg-slate-800 border border-slate-700 rounded-xl overflow-hidden shadow-xl">
          <div className="h-2 bg-gradient-to-r from-cyan-500 to-blue-600"></div>

          <div className="p-6">
            {/* Expert Profile Header */}
            <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
              <div className="relative">
                <div className="absolute inset-0 rounded-full bg-gradient-to-r from-cyan-500 to-blue-600 opacity-70 animate-pulse"></div>
                <img
                  src={expertId.photoUrl || "/placeholder.svg"}
                  alt={expertId.firstName}
                  className="w-32 h-32 rounded-full object-cover border-4 border-slate-700 relative z-10"
                />
              </div>

              <div className="flex-1 text-center md:text-left">
                <h1 className="text-2xl font-bold text-slate-100">{expertId.firstName + " " + expertId.lastName}</h1>

                <div className="flex flex-wrap gap-2 mt-2 justify-center md:justify-start">
                  {expertise.map((skill, index) => (
                    <span key={index} className="bg-slate-700 text-cyan-300 px-2 py-0.5 rounded-md text-xs font-medium">
                      {skill}
                    </span>
                  ))}
                </div>

                <p className="text-slate-300 mt-3">{description}</p>

                <div className="flex items-center mt-2 justify-center md:justify-start">
                  <Clock className="w-4 h-4 text-cyan-400 mr-1" />
                  <span className="text-slate-300 text-sm">{experienceYears} years of experience</span>
                </div>

                {rating > 0 && (
                  <div className="flex items-center mt-2 justify-center md:justify-start">
                    <Star className="w-4 h-4 text-yellow-400 fill-yellow-400 mr-1" />
                    <span className="text-slate-300 text-sm">
                      {formattedRating} ({expertDetails.reviews?.length || 0} reviews)
                    </span>
                  </div>
                )}

                <p className="text-lg font-bold mt-3 text-cyan-400">₹500 Fees</p>
              </div>
            </div>

            {/* Divider */}
            <div className="h-px bg-slate-700 my-6"></div>

            {/* Expert Details Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Links Section */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-slate-200 mb-3 flex items-center">
                  <Globe className="w-5 h-5 mr-2 text-cyan-400" /> Professional Links
                </h3>

                {githubProfile && (
                  <div className="flex items-center">
                    <Github className="w-5 h-5 mr-2 text-slate-400" />
                    <Link
                      to={githubProfile}
                      className="text-cyan-400 hover:text-cyan-300 transition-colors"
                      target="_blank"
                    >
                      GitHub Profile
                    </Link>
                  </div>
                )}

                {linkedInProfile && (
                  <div className="flex items-center">
                    <Linkedin className="w-5 h-5 mr-2 text-slate-400" />
                    <Link
                      to={linkedInProfile}
                      className="text-cyan-400 hover:text-cyan-300 transition-colors"
                      target="_blank"
                    >
                      LinkedIn Profile
                    </Link>
                  </div>
                )}

                {expertDetails.resumeUrl && (
                  <div className="flex items-center">
                    <FileText className="w-5 h-5 mr-2 text-slate-400" />
                    <Link
                      to={expertDetails.resumeUrl}
                      className="text-cyan-400 hover:text-cyan-300 transition-colors"
                      target="_blank"
                    >
                      Download Resume
                    </Link>
                  </div>
                )}

                {/* Certifications */}
                {certifications?.length > 0 && (
                  <div className="mt-6">
                    <h3 className="text-lg font-semibold text-slate-200 mb-3 flex items-center">
                      <Award className="w-5 h-5 mr-2 text-cyan-400" /> Certifications
                    </h3>
                    <ul className="space-y-2 text-slate-300">
                      {certifications.map((cert, index) => (
                        <li key={index} className="flex items-start">
                          <span className="text-cyan-400 mr-2">•</span>
                          {cert}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              {/* Schedule and Languages Section */}
              <div className="space-y-6">
                {/* Schedule */}
                {expertDetails.schedule?.availableDays?.length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold text-slate-200 mb-3 flex items-center">
                      <Calendar className="w-5 h-5 mr-2 text-cyan-400" /> Available Schedule
                    </h3>
                    <div className="bg-slate-700 rounded-lg p-4 border border-slate-600">
                      <div className="flex items-start mb-2">
                        <Calendar className="w-4 h-4 text-slate-400 mt-1 mr-2" />
                        <div>
                          <span className="text-slate-300 font-medium">Days:</span>
                          <p className="text-slate-300">{expertDetails.schedule.availableDays.join(", ")}</p>
                        </div>
                      </div>

                      {expertDetails.schedule?.timeSlots?.length > 0 && (
                        <div className="flex items-start">
                          <Clock className="w-4 h-4 text-slate-400 mt-1 mr-2" />
                          <div>
                            <span className="text-slate-300 font-medium">Time Slots:</span>
                            <p className="text-slate-300">{expertDetails.schedule.timeSlots.join(", ")}</p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Languages */}
                {expertDetails.languages?.length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold text-slate-200 mb-3 flex items-center">
                      <Globe className="w-5 h-5 mr-2 text-cyan-400" /> Languages
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {expertDetails.languages.map((lang, index) => (
                        <span key={index} className="bg-slate-700 text-slate-300 px-3 py-1 rounded-lg text-sm">
                          {lang}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Reviews */}
                {expertDetails.reviews?.length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold text-slate-200 mb-3 flex items-center">
                      <Star className="w-5 h-5 mr-2 text-cyan-400" /> Reviews
                    </h3>
                    <div className="bg-slate-700 rounded-lg p-4 border border-slate-600 max-h-48 overflow-y-auto">
                      {expertDetails.reviews.map((review, index) => (
                        <div
                          key={index}
                          className="mb-2 pb-2 border-b border-slate-600 last:border-0 last:mb-0 last:pb-0"
                        >
                          <p className="text-slate-300">{review}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Request Help Button */}
            <div className="mt-8">
              <button
                disabled={interaction?.status === "pending"}
                onClick={handleRequestHelp}
                className={`w-full py-3 rounded-lg font-medium transition-colors ${interaction?.status === "pending"
                  ? "bg-slate-700 text-slate-400 cursor-not-allowed"
                  : "bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white"
                  }`}
              >
                {interaction?.status === "pending" ? (
                  <span className="flex items-center justify-center">
                    <Clock className="w-5 h-5 mr-2" /> Request Pending
                  </span>
                ) : (
                  <span className="flex items-center justify-center">
                    <MessageSquare className="w-5 h-5 mr-2" /> Request Help
                  </span>
                )}
              </button>

              {/* View Requests Link */}
              {interaction?.status === "pending" && (
                <div className="mt-3 text-center">
                  <Link to="/view-requests" className="text-cyan-400 hover:text-cyan-300 transition-colors">
                    View Your Requests
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Request Help Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900 bg-opacity-80 flex justify-center items-center p-4 z-50">
          <div className="bg-slate-800 border border-slate-700 rounded-xl shadow-xl w-full max-w-lg overflow-hidden">
            <div className="h-1 bg-gradient-to-r from-cyan-500 to-blue-600"></div>

            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-semibold text-slate-100">Request Help from Expert</h3>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="text-slate-400 hover:text-slate-100 hover:bg-slate-700 p-1 rounded-full transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form>
                <div className="mb-4">
                  <label htmlFor="issueDescription" className="block text-sm font-medium text-slate-300 mb-1">
                    Issue Description
                  </label>
                  <textarea
                    value={issueDescription}
                    onChange={(e) => setIssueDescription(e.target.value)}
                    id="issueDescription"
                    className="w-full p-3 border border-slate-600 rounded-lg bg-slate-700 text-slate-200 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent min-h-[100px]"
                    placeholder="Describe your issue in detail..."
                    required
                  />
                  {error && <p className="text-red-400 text-sm mt-1">{error}</p>}
                </div>

                <div className="mb-6">
                  <label htmlFor="codeSnippet" className="block text-sm font-medium text-slate-300 mb-1">
                    Code Snippet (optional)
                  </label>
                  <textarea
                    value={codeSnippet}
                    onChange={(e) => setCodeSnippet(e.target.value)}
                    id="codeSnippet"
                    className="w-full p-3 border border-slate-600 rounded-lg bg-slate-700 text-slate-200 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent min-h-[120px] font-mono text-sm"
                    placeholder="Paste your code here..."
                  />
                </div>

                <div className="flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-slate-300 rounded-lg transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    onClick={handleSendRequestHelp}
                    className="px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white rounded-lg transition-colors flex items-center"
                  >
                    <Send className="w-4 h-4 mr-2" /> Send Request
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Toast */}
      {showToast && <Toast message="Request sent successfully!" onClose={onClose} />}
    </div>
  )
}

export default ExpertProfilePublicView
