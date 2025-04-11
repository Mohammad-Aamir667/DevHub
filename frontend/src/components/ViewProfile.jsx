"use client"
import { useLocation, useNavigate } from "react-router-dom"
import { ArrowLeft, MessageCircle, Briefcase, User, Calendar } from "lucide-react"

const ViewProfile = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const { userProfile } = location.state
  const { firstName, lastName, age, gender, about, skills, photoUrl } = userProfile

  const messageUser = () => {
    navigate("/chat-box", { state: { chatUser: userProfile } })
  }

  return (
    <div className="min-h-screen bg-slate-950 mt-10 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
       

        <div className="bg-slate-900 rounded-lg shadow-xl overflow-hidden border border-slate-800">
          {/* Profile Header */}
          <button
          onClick={() => navigate(-1)}
          className="flex items-center text-slate-400 hover:text-slate-300 p-3 font-medium mb-6 transition duration-200"
        >
          <ArrowLeft className="w-6 h-7 mr-2"  />
        
        </button>
          <div className="relative h-48 bg-gradient-to-r from-slate-800 to-slate-900">
            <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2">
              <div className="w-32 h-32 rounded-full border-4 border-slate-900 shadow-lg overflow-hidden">
                {photoUrl ? (
                  <img
                    src={photoUrl || "/placeholder.svg"}
                    alt={`${firstName} ${lastName}`}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-slate-700 flex items-center justify-center">
                    <User className="w-16 h-16 text-slate-400" />
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Profile Content */}
          <div className="pt-20 pb-8 px-6 sm:px-8">
            {/* Name and Title */}
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-slate-100">
                {firstName} {lastName}
              </h2>
              <p className="text-slate-400 mt-1 flex items-center justify-center">
                <Briefcase className="w-4 h-4 mr-1.5" />
                Developer
              </p>
            </div>

            {/* Skills Section */}
            {skills && skills.length > 0 && (
              <div className="mb-8">
                <div className="flex items-center justify-center mb-3">
                  <div className="h-px w-16 bg-slate-800"></div>
                  <h3 className="text-sm font-semibold text-slate-300 mx-3 uppercase tracking-wider">Skills</h3>
                  <div className="h-px w-16 bg-slate-800"></div>
                </div>
                <div className="flex flex-wrap justify-center gap-2">
                  {skills.map((skill, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 text-sm bg-slate-800 text-slate-300 rounded-md border border-slate-700"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}

            
            {about && (
              <div className="mb-8 bg-slate-800/30 rounded-lg p-5 border border-slate-800/50">
                <h3 className="text-lg font-semibold text-slate-200 mb-3">About</h3>
                <p className="text-slate-300 leading-relaxed">{about}</p>
              </div>
            )}

            {/* Message Button */}
            <div className="flex justify-center mt-6">
              <button
                onClick={messageUser}
                className="bg-slate-800 hover:bg-slate-700 text-slate-200 font-medium py-2.5 px-5 rounded-lg transition duration-200 flex items-center justify-center border border-slate-700 shadow-sm"
              >
                <MessageCircle className="w-5 h-5 mr-2 text-slate-400" />
                Message
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ViewProfile
