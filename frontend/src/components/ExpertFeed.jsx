"use client"

import { useEffect, useState } from "react"
import { BASE_URL } from "../utils/constants"
import { useDispatch, useSelector } from "react-redux"
import axios from "axios"
import ExpertFeedCard from "./ExpertFeedCard"
import { addExpertFeed } from "../utils/expertFeedSlice"
import { Link, useNavigate } from "react-router-dom"
import { Search, Filter, ArrowLeft, Briefcase } from "lucide-react"
import { setInteractions } from "../utils/interactionSlice"
import { handleAxiosError } from "../utils/handleAxiosError"

const ExpertFeed = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const expertFeed = useSelector((store) => store.expertFeed);
  const userInteractions = useSelector((store) => store.userInteractions)

  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedExpertise, setSelectedExpertise] = useState("")
  const getExperts = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/expert-list/approved`, {
        withCredentials: true,
      })
      dispatch(addExpertFeed(res?.data))
      
    } catch (err) {
      console.error(err)
      handleAxiosError(err, {}, [], "expert-feed-error")
    } finally {
      setLoading(false)
    }
  }
  
  useEffect(() => {
    if (!expertFeed || expertFeed.length === 0) {
      getExperts()
    } else {
      setLoading(false)
    }
  }, [])
  
  const fetchUserInteractions = async () => {
    try {
      const userInteractions = await axios.get(BASE_URL + "/user-interactions", { withCredentials: true })
      dispatch(setInteractions(userInteractions.data))
    } catch (err) {
      console.error("Error fetching interactions:", err)
      handleAxiosError(err, {}, [], "user-interactions-error")
    }
  }

  useEffect(() => {
     if (!userInteractions || userInteractions.length === 0) 
    fetchUserInteractions()
  }, [])

  // Get all unique expertise areas from experts
  const allExpertise = expertFeed ? [...new Set(expertFeed.flatMap((expert) => expert.expertise || []))] : []

  const filteredFeed = expertFeed?.filter((expert) => {
    const lowerSearch = searchTerm.toLowerCase()
    const matchesSearch =
      expert.expertId.firstName?.toLowerCase().includes(lowerSearch) ||
      expert.expertId.lastName?.toLowerCase().includes(lowerSearch) ||
      expert.expertise.some((exp) => exp.toLowerCase().includes(lowerSearch)) ||
      expert?.skills?.some((skill) => skill.toLowerCase().includes(lowerSearch))

    const matchesExpertise = selectedExpertise === "" || expert.expertise.includes(selectedExpertise)

    return matchesSearch && matchesExpertise
  })
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 to-slate-900 pt-16 px-4 sm:px-6 py-12">
      <div className="max-w-7xl mx-auto">
        {/* Header with back navigation */}
        <div className="flex items-center justify-between mb-8">
        <button
                  onClick={() => navigate(-1)}
                  className="text-slate-400 hover:text-slate-100 hover:bg-slate-800 p-2 sm:p-3 rounded-md flex items-center text-sm sm:text-base transition-colors"
                >
                  <ArrowLeft className="w-5 h-5 sm:w-6 sm:h-6 mr-2" /> 
                </button>
          <h1 className="text-2xl font-bold text-slate-100 flex items-center">
            <Briefcase className="w-6 h-6 mr-2 text-cyan-400" /> Expert Directory
          </h1>
          <div className="w-20"></div> {/* Spacer for alignment */}
        </div>

        {/* Search and Filter Bar */}
        <div className="bg-slate-800 border border-slate-700 rounded-xl p-4 mb-8 shadow-lg">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search Input */}
            <div className="relative flex-grow">
              <input
                type="text"
                placeholder="Search by name, expertise, or skills..."
                className="w-full p-3 pl-10 bg-slate-700 text-slate-200 border border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={18} />
            </div>

            {/* Expertise Filter */}
            <div className="relative md:w-64">
              <select
                value={selectedExpertise}
                onChange={(e) => setSelectedExpertise(e.target.value)}
                className="w-full p-3 pl-10 bg-slate-700 text-slate-200 border border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent appearance-none"
              >
                <option value="">All Expertise</option>
                {allExpertise.map((expertise) => (
                  <option key={expertise} value={expertise}>
                    {expertise}
                  </option>
                ))}
              </select>
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={18} />
              <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                <svg
                  className="h-5 w-5 text-slate-400"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path
                    fillRule="evenodd"
                    d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
            </div>

            {/* View Requests Button */}
            <Link
              to="/view-requests?role=user"
              className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white px-4 py-3 rounded-lg text-sm font-medium transition-colors shadow-md flex items-center justify-center md:w-auto"
            >
              View Requests
            </Link>
          </div>
        </div>

        {/* Loading State */}
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="relative">
              <div className="w-12 h-12 rounded-full absolute border-4 border-slate-200 border-opacity-20"></div>
              <div className="w-12 h-12 rounded-full animate-spin absolute border-4 border-cyan-500 border-t-transparent"></div>
            </div>
          </div>
        ) : expertFeed?.length === 0 ? (
          <div className="bg-slate-800 border border-slate-700 rounded-xl p-8 text-center">
            <Briefcase className="h-16 w-16 text-slate-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-slate-300 mb-2">No Experts Available</h3>
            <p className="text-slate-400 max-w-md mx-auto">
              There are no experts available at the moment. Please check back later.
            </p>
          </div>
        ) : (
          <div>
            {/* Results Count */}
            <div className="mb-4 text-slate-400">
              Showing {filteredFeed?.length} {filteredFeed?.length === 1 ? "expert" : "experts"}
            </div>

            {/* Expert Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredFeed?.map((expertDetails) => (
                <ExpertFeedCard key={expertDetails._id} expertDetails={expertDetails} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default ExpertFeed
