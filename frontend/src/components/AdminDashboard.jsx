"use client"

import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import axios from "axios"
import { BASE_URL } from "../utils/constants"
import ExpertDetail from "./ExpertDetail"
import { setExperts } from "../utils/expertSlice"
import { useNavigate } from "react-router-dom"
import ExpertCardList from "./ExpertCardList"
import { ArrowLeft, Shield, Users, CheckCircle, XCircle, Clock } from "lucide-react"

const AdminDashboard = () => {
  const dispatch = useDispatch()
  const experts = useSelector((state) => state.experts)
  const [currentStatus, setCurrentStatus] = useState("pending")
  const [selectedExpert, setSelectedExpert] = useState(null)
  const navigate = useNavigate()

  const fetchExperts = async () => {
    try {
      const response = await axios.get(BASE_URL + "/expert-list", {
        withCredentials: true,
      })
      const allExperts = response.data
      dispatch(
        setExperts({
          pending: allExperts.filter((e) => e.status === "pending"),
          approved: allExperts.filter((e) => e.status === "approved"),
          rejected: allExperts.filter((e) => e.status === "rejected"),
        }),
      )
    } catch (error) {
      console.error("Error fetching experts:", error)
    }
  }

  useEffect(() => {
    if (!experts || experts.length === 0) fetchExperts()
  }, [])

  const handleStatusChange = (status) => {
    setCurrentStatus(status)
    setSelectedExpert(null)
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case "pending":
        return <Clock className="w-4 h-4" />
      case "approved":
        return <CheckCircle className="w-4 h-4" />
      case "rejected":
        return <XCircle className="w-4 h-4" />
      default:
        return null
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case "pending":
        return currentStatus === status
          ? "bg-gradient-to-r from-yellow-500 to-orange-600 text-white"
          : "bg-slate-700 text-slate-300 hover:bg-slate-600"
      case "approved":
        return currentStatus === status
          ? "bg-gradient-to-r from-green-500 to-emerald-600 text-white"
          : "bg-slate-700 text-slate-300 hover:bg-slate-600"
      case "rejected":
        return currentStatus === status
          ? "bg-gradient-to-r from-red-500 to-rose-600 text-white"
          : "bg-slate-700 text-slate-300 hover:bg-slate-600"
      default:
        return "bg-slate-700 text-slate-300 hover:bg-slate-600"
    }
  }

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
            <Shield className="w-6 h-6 mr-2 text-cyan-400" /> Admin Dashboard
          </h1>
          <div className="w-20"></div> {/* Spacer for alignment */}
        </div>

        {/* Status Filter Buttons */}
        <div className="bg-slate-800 border border-slate-700 rounded-xl p-4 mb-8 shadow-lg">
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            {["pending", "approved", "rejected"].map((status) => (
              <button
                key={status}
                onClick={() => handleStatusChange(status)}
                className={`px-6 py-3 rounded-lg font-medium transition-all duration-200 flex items-center justify-center gap-2 ${getStatusColor(
                  status,
                )} shadow-md hover:shadow-lg transform hover:scale-105`}
              >
                {getStatusIcon(status)}
                {status.charAt(0).toUpperCase() + status.slice(1)}
                {experts && experts[status] && (
                  <span className="ml-2 px-2 py-1 bg-slate-900 bg-opacity-50 rounded-full text-xs">
                    {experts[status].length}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Main Content Area */}
        <div className="bg-slate-800 border border-slate-700 rounded-xl shadow-lg overflow-hidden">
          {experts ? (
            selectedExpert ? (
              <div className="p-6">
                <ExpertDetail expert={selectedExpert} onBack={() => setSelectedExpert(null)} />
              </div>
            ) : (
              <div className="p-6">
                {experts[currentStatus] && experts[currentStatus].length > 0 ? (
                  <div>
                    <div className="mb-4 text-slate-400 flex items-center gap-2">
                      <Users className="w-4 h-4" />
                      Showing {experts[currentStatus].length}{" "}
                      {experts[currentStatus].length === 1 ? "expert" : "experts"} with{" "}
                      <span className="text-slate-200 font-medium">{currentStatus}</span> status
                    </div>
                    <ExpertCardList experts={experts[currentStatus]} onExpertClick={setSelectedExpert} />
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <Users className="h-16 w-16 text-slate-600 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-slate-300 mb-2">No {currentStatus} experts</h3>
                    <p className="text-slate-400 max-w-md mx-auto">
                      There are no experts with {currentStatus} status at the moment.
                    </p>
                  </div>
                )}
              </div>
            )
          ) : (
            <div className="flex justify-center items-center h-64">
              <div className="relative">
                <div className="w-12 h-12 rounded-full absolute border-4 border-slate-200 border-opacity-20"></div>
                <div className="w-12 h-12 rounded-full animate-spin absolute border-4 border-cyan-500 border-t-transparent"></div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default AdminDashboard
