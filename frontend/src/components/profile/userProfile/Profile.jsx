"use client"

import { useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"
import { ArrowLeft, Edit, Briefcase, Code, Github, Linkedin, Globe, Terminal } from "lucide-react"

const Profile = () => {
  const user = useSelector((store) => store?.user)
  const navigate = useNavigate()
  const { firstName, lastName, photoUrl, age, gender, about, skills } = user || {}

  const handleEditProfile = () => navigate("/editProfile")
  const skillsArray =
    typeof skills === "string" ? skills.split(",").map((skill) => skill.trim()) : Array.isArray(skills) ? skills : []

  return (
    user && (
      <div className="min-h-screen mt-2 pt-16 bg-gradient-to-b from-slate-950 to-slate-900 py-12 px-6 flex justify-center">
        <div className="max-w-3xl w-full bg-slate-900 border border-slate-800 rounded-xl shadow-xl relative">
        <button
                   onClick={() => navigate(-1)}
                   className="text-slate-400 hover:text-slate-100 hover:bg-slate-800 p-2 sm:p-3 rounded-md flex items-center text-sm sm:text-base transition-colors"
                 >
                   <ArrowLeft className="w-5 h-5 sm:w-6 sm:h-6 mr-2" /> 
                 </button>
       

          <div className="flex flex-col items-center pt-12 pb-6">
            <div className="relative w-32 h-32 mb-4">
              <div className="absolute inset-0 rounded-full bg-gradient-to-r from-cyan-500 to-blue-600 animate-pulse opacity-70"></div>
              <img
                src={photoUrl || "/placeholder.svg"}
                alt={`${firstName} ${lastName}`}
                className="w-full h-full rounded-full border-4 border-slate-800 object-cover shadow-lg relative z-10"
              />
              <div className="absolute -bottom-2 -right-2 bg-slate-800 rounded-full p-1 border-2 border-slate-700 z-20">
                <Terminal className="w-5 h-5 text-cyan-400" />
              </div>
            </div>

            <h2 className="text-3xl font-bold text-slate-100 mt-2">
              {firstName} {lastName}
            </h2>

            <div className="flex items-center gap-2 mt-1">
              <Briefcase className="w-4 h-4 text-cyan-400" />
              <span className="text-cyan-400 font-medium">Software Developer</span>
            </div>

            <div className="flex gap-3 mt-4">
              <button className="rounded-full h-9 w-9 border border-slate-700 text-slate-400 hover:text-cyan-400 hover:border-cyan-400 flex items-center justify-center transition-colors">
                <Github className="h-4 w-4" />
              </button>
              <button className="rounded-full h-9 w-9 border border-slate-700 text-slate-400 hover:text-cyan-400 hover:border-cyan-400 flex items-center justify-center transition-colors">
                <Linkedin className="h-4 w-4" />
              </button>
              <button className="rounded-full h-9 w-9 border border-slate-700 text-slate-400 hover:text-cyan-400 hover:border-cyan-400 flex items-center justify-center transition-colors">
                <Globe className="h-4 w-4" />
              </button>
            </div>
          </div>

          <div className="px-6 pb-8">
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="bg-slate-800 border border-slate-700 rounded-lg p-4 text-center">
                <p className="text-sm font-medium text-slate-400">Gender</p>
                <p className="text-lg text-slate-200">{gender || "Not specified"}</p>
              </div>
              <div className="bg-slate-800 border border-slate-700 rounded-lg p-4 text-center">
                <p className="text-sm font-medium text-slate-400">Age</p>
                <p className="text-lg text-slate-200">{age || "Not specified"}</p>
              </div>
            </div>

            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-slate-200 mb-2 flex items-center">
                  <Code className="w-5 h-5 mr-2 text-cyan-400" />
                  Technical Skills
                </h3>
                <div className="bg-slate-800 border border-slate-700 rounded-lg p-4">
                  {skillsArray && skillsArray.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {skillsArray.map((skill, index) => (
                        <span
                          key={index}
                          className="bg-slate-700 hover:bg-slate-600 text-cyan-300 px-2.5 py-0.5 rounded-md text-sm font-medium"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <p className="text-slate-400">No skills added yet</p>
                  )}
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-slate-200 mb-2">About</h3>
                <div className="bg-slate-800 border border-slate-700 rounded-lg p-4">
                  <p className="text-slate-300 leading-relaxed">{about || "No bio added yet"}</p>
                </div>
              </div>
            </div>

            <div className="h-px bg-slate-800 my-6"></div>

            <div className="flex justify-center">
              <button
                onClick={handleEditProfile}
                className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white font-medium py-2 px-6 rounded-lg flex items-center transition-colors"
              >
                <Edit className="w-4 h-4 mr-2" /> Edit Profile
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  )
}

export default Profile
