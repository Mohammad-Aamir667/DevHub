"use client"

import axios from "axios"
import React, { useEffect } from "react"
import { BASE_URL } from "../utils/constants"
import { useDispatch, useSelector } from "react-redux"
import { addConnections } from "../utils/connectionSlice"
import { useNavigate } from "react-router-dom"
import { ArrowLeft, UserCircle, ExternalLink } from 'lucide-react'

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
    if (!connections) getConnections()
  }, [])

  if (!connections) return null

  return (
    <div className="min-h-screen bg-gradient-to-b mt-12 from-slate-950 to-slate-900 pt-5 px-6 py-12">
      <div className="max-w-4xl mx-auto">
        {/* Header with Back Button */}
        <div className="mb-8 flex items-center justify-between">
          <button
            onClick={() => navigate(-1)}
            className="text-slate-400 hover:text-slate-100 hover:bg-slate-800 p-2 sm:p-3 rounded-md flex items-center text-sm sm:text-base transition-colors"
          >
            <ArrowLeft className="w-5 h-5 sm:w-6 sm:h-6 mr-2" /> 
          </button>

          <div className="text-center flex-1">
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-100">Your Connections</h1>
            <p className="text-slate-400">Connect with other developers in your network</p>
          </div>
        </div>

        {/* Empty State */}
        {connections?.length === 0 && (
          <div className="bg-slate-800 border border-slate-700 rounded-xl p-10 text-center">
            <div className="flex justify-center mb-4">
              <UserCircle className="h-16 w-16 text-slate-600" />
            </div>
            <h3 className="text-xl font-semibold text-slate-300 mb-2">No Connections Found</h3>
            <p className="text-slate-400 mb-6 max-w-md mx-auto">
              You haven't connected with any developers yet. Start building your network to collaborate on projects.
            </p>
          </div>
        )}

        {/* Connection Cards */}
        {connections?.data && connections.data.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {connections.data.map((connection) => {
              const { firstName, lastName, about, photoUrl, _id, skills } = connection;
              
              const skillsArray = Array.isArray(skills) ? skills.slice(0, 2) : [];

              
              return (
                <div
                  key={_id}
                  className="bg-slate-800 border border-slate-700 rounded-xl overflow-hidden transition-all duration-300 hover:shadow-lg hover:border-slate-600 group"
                >
                  <div className="h-2 bg-gradient-to-r from-cyan-500 to-blue-600"></div>
                  <div className="p-5">
                    <div className="flex items-start gap-4">
                      {/* Profile Image */}
                      <div className="relative">
                        <div className="absolute inset-0 rounded-full bg-gradient-to-r from-cyan-500 to-blue-600 opacity-70 animate-pulse"></div>
                        <img
                          src={photoUrl || "/placeholder.svg"}
                          alt={`${firstName} ${lastName}`}
                          className="w-16 h-16 rounded-full border-2 border-slate-700 object-cover relative z-10"
                        />
                      </div>

                      {/* User Info */}
                      <div className="flex-1">
                        <h2 className="text-lg font-semibold text-slate-100">
                          {firstName} {lastName}
                        </h2>
                        
                        {/* Skills */}
                        {skillsArray && skillsArray.length > 0 && (
                          <div className="flex flex-wrap gap-2 mt-1 mb-2">
                            {skillsArray.map((skill, index) => (
                              <span
                                key={index}
                                className="bg-slate-700 text-cyan-300 px-2 py-0.5 rounded-md text-xs font-medium"
                              >
                                {skill}
                              </span>
                            ))}
                            { skills?.length >  2 && (
                              <span className="text-slate-400 text-xs">+more</span>
                            )}
                          </div>
                        )}
                        
                        <p className="text-sm text-slate-400 line-clamp-2">{about || "No bio available"}</p>
                      </div>
                    </div>

                    {/* View Profile Button */}
                    <div className="mt-4 flex justify-end">
                      <button
                        onClick={() => viewProfile(connection)}
                        className="bg-slate-700 hover:bg-slate-600 text-slate-200 px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center group-hover:bg-gradient-to-r group-hover:from-cyan-500 group-hover:to-blue-600 group-hover:text-white"
                      >
                        View Profile <ExternalLink className="w-3.5 h-3.5 ml-2" />
                      </button>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}

export default Connections
