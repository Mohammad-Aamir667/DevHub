"use client"

import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import axios from "axios"
import { BASE_URL } from "../utils/constants"
import ConfirmModal from "./common/ConfirmModal"
import { ArrowLeft, Users, Crown, Mail, User, Shield, UserCheck, ChevronUp } from "lucide-react"

const Dashboard = () => {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(false)
  const [isModalOpen, setModalOpen] = useState(false)
  const [selectedUserId, setSelectedUserId] = useState(null)
  const navigate = useNavigate()

  const fetchUsers = async () => {
    try {
      const res = await axios.get(BASE_URL + "/admin/users", { withCredentials: true })
      setUsers(res.data)
    } catch (err) {
      console.error("Error fetching users:", err.response?.data || err.message)
    }
  }

  const handlePromoteClick = (userId) => {
    setSelectedUserId(userId)
    setModalOpen(true)
  }

  const promoteToAdmin = async () => {
    try {
      setLoading(true)
      const res = await axios.put(BASE_URL + "/promote-to-admin/" + selectedUserId, {}, { withCredentials: true })
      fetchUsers()
    } catch (err) {
      alert(err.response?.data?.message || "An error occurred while promoting the user.")
    } finally {
      setLoading(false)
      setModalOpen(false)
      setSelectedUserId(null)
    }
  }

  useEffect(() => {
    fetchUsers()
  }, [])

  const getRoleBadge = (role) => {
    const roleConfig = {
      admin: { color: "bg-gradient-to-r from-purple-500 to-indigo-600", icon: Crown, text: "Admin" },
      user: { color: "bg-gradient-to-r from-blue-500 to-cyan-600", icon: User, text: "User" },
      expert: { color: "bg-gradient-to-r from-green-500 to-emerald-600", icon: UserCheck, text: "Expert" },
    }

    const config = roleConfig[role] || roleConfig.user
    const Icon = config.icon

    return (
      <div
        className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-white text-xs font-medium ${config.color}`}
      >
        <Icon className="w-3 h-3" />
        {config.text}
      </div>
    )
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
            <Users className="w-6 h-6 mr-2 text-cyan-400" /> Admin Management
          </h1>
          <div className="w-20"></div> {/* Spacer for alignment */}
        </div>

        {/* Stats Card */}
        <div className="bg-slate-800 border border-slate-700 rounded-xl p-4 mb-8 shadow-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-cyan-500 bg-opacity-20 rounded-lg">
                <Users className="w-6 h-6 text-cyan-400" />
              </div>
              <div>
                <p className="text-slate-400 text-sm">Total Users</p>
                <p className="text-2xl font-bold text-slate-100">{users.length}</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-slate-400 text-sm">Admins</p>
              <p className="text-lg font-semibold text-purple-400">
                {users.filter((user) => user.role === "admin").length}
              </p>
            </div>
          </div>
        </div>

        {/* Users Table */}
        <div className="bg-slate-800 border border-slate-700 rounded-xl shadow-lg overflow-hidden">
          <div className="p-6 border-b border-slate-700">
            <h2 className="text-lg font-semibold text-slate-100 flex items-center gap-2">
              <Shield className="w-5 h-5 text-cyan-400" />
              User Directory
            </h2>
            <p className="text-slate-400 text-sm mt-1">Manage user roles and permissions</p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-slate-700 border-b border-slate-600">
                  <th className="px-6 py-4 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">
                    <div className="flex items-center gap-2">
                      <User className="w-4 h-4" />
                      Name
                    </div>
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">
                    <div className="flex items-center gap-2">
                      <Mail className="w-4 h-4" />
                      Email
                    </div>
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">
                    <div className="flex items-center gap-2">
                      <Crown className="w-4 h-4" />
                      Role
                    </div>
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-700">
                {users.length > 0 ? (
                  users.map((user, index) => (
                    <tr
                      key={user._id}
                      className="hover:bg-slate-700 hover:bg-opacity-50 transition-colors duration-200"
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-slate-600 rounded-full flex items-center justify-center">
                            <User className="w-4 h-4 text-slate-300" />
                          </div>
                          <div>
                            <div className="text-slate-200 font-medium">
                              {user.firstName} {user.lastName}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-slate-300">{user.emailId}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">{getRoleBadge(user.role)}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {user.role !== "admin" && (
                          <button
                            onClick={() => handlePromoteClick(user._id)}
                            disabled={loading}
                            className="bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 flex items-center gap-2 shadow-md hover:shadow-lg transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                          >
                            {loading && selectedUserId === user._id ? (
                              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                            ) : (
                              <ChevronUp className="w-4 h-4" />
                            )}
                            Promote to Admin
                          </button>
                        )}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" className="px-6 py-12 text-center">
                      <div className="flex flex-col items-center gap-3">
                        <Users className="w-12 h-12 text-slate-600" />
                        <div>
                          <h3 className="text-lg font-medium text-slate-300 mb-1">No users found</h3>
                          <p className="text-slate-400 text-sm">There are no users in the system yet.</p>
                        </div>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        <ConfirmModal
          isOpen={isModalOpen}
          message="Are you sure you want to promote this user to admin?"
          onConfirm={promoteToAdmin}
          onCancel={() => setModalOpen(false)}
        />
      </div>
    </div>
  )
}

export default Dashboard
