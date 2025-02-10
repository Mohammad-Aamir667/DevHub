"use client"

import axios from "axios"
import { useEffect } from "react"
import { BASE_URL } from "../utils/constants"
import { useDispatch, useSelector } from "react-redux"
import { addConnections } from "../utils/connectionSlice"
import { useNavigate } from "react-router-dom"
import { ArrowLeft, User } from "lucide-react"

const Connections = () => {
  const connections = useSelector((store) => store.connections)
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const viewProfile = (connection) => {
    navigate(`/view-profile`, { state: { userProfile: connection } })
  }

  const getConnections = async () => {
    try {
      const res = await axios.get(BASE_URL + "/user/connection", {
        withCredentials: true,
      })
      dispatch(addConnections(res?.data))
    } catch (err) {
      console.log(err.message)
    }
  }

  useEffect(() => {
    getConnections()
  }, [dispatch]) // Added dispatch to dependencies

  if (!connections) return null
  if (connections?.length === 0)
    return (
      <div className="flex items-center justify-center h-screen bg-gray-100 dark:bg-gray-900">
        <div className="text-center p-8 bg-white dark:bg-gray-800 rounded-lg shadow-xl">
          <User size={48} className="mx-auto text-gray-400 dark:text-gray-600 mb-4" />
          <p className="text-xl font-semibold text-gray-700 dark:text-gray-300">No Connections Found</p>
          <p className="mt-2 text-gray-500 dark:text-gray-400">Start connecting with other professionals!</p>
        </div>
      </div>
    )

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 p-6 flex flex-col items-center">
      <div className="w-full max-w-4xl">
        <button
          onClick={() => navigate(-1)}
          className="mb-6 flex items-center text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 transition duration-200"
        >
          <ArrowLeft size={20} className="mr-2" />
          <span className="font-medium">Back</span>
        </button>

        <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-8">Your Connections</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {connections.data.map((connection) => {
            const { firstName, lastName, about, photoUrl, _id } = connection
            return (
              <div
                key={_id}
                className="bg-white dark:bg-gray-800 shadow-lg rounded-xl p-6 flex items-center space-x-4 transition-all duration-300 hover:shadow-xl"
              >
                <img
                  src={photoUrl || "/placeholder.svg"}
                  alt={`${firstName} ${lastName}`}
                  className="w-20 h-20 rounded-full object-cover border-4 border-gray-200 dark:border-gray-700"
                />
                <div className="flex-1">
                  <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
                    {firstName} {lastName}
                  </h2>
                  <p className="text-sm text-gray-600 dark:text-gray-300 mt-1 line-clamp-2">{about}</p>
                  <button
                    onClick={() => viewProfile(connection)}
                    className="mt-3 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-all"
                  >
                    View Profile
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

export default Connections

