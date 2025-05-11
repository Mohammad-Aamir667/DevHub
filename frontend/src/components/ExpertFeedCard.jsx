"use client"

import { Star, Clock, Calendar, ExternalLink } from "lucide-react"
import { Link } from "react-router-dom"

const ExpertFeedCard = ({ expertDetails }) => {
  const {
    expertise = [],
    experienceYears,
    expertId,
    description = "",
    rating = 0,
    reviews = [],
    schedule = { availableDays: [], timeSlots: [] },
  } = expertDetails

  const availableDays = schedule?.availableDays?.length > 0 ? schedule.availableDays.join(", ") : "No schedule set"
  const availableTimes = schedule?.timeSlots?.length > 0 ? schedule.timeSlots.join(", ") : null

  // Format rating to one decimal place
  const formattedRating = rating ? rating.toFixed(1) : "0.0"

  return (
    <div className="bg-slate-800 border border-slate-700 rounded-xl overflow-hidden transition-all duration-300 hover:shadow-lg hover:border-slate-600 group h-full flex flex-col">
      <div className="h-2 bg-gradient-to-r from-cyan-500 to-blue-600"></div>

      <div className="p-5 flex-grow">
        {/* Profile Image & Info */}
        <div className="flex items-center space-x-4 mb-4">
          <div className="relative">
            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-cyan-500 to-blue-600 opacity-70 animate-pulse"></div>
            <img
              src={expertId?.photoUrl || "/placeholder.svg"}
              alt={`${expertId?.firstName || "Expert"} ${expertId?.lastName || ""}`}
              className="w-16 h-16 rounded-full border-2 border-slate-700 object-cover relative z-10"
            />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-slate-100">
              {expertId?.firstName} {expertId?.lastName}
            </h3>
            {/* Rating */}
            {rating > 0 && (
              <div className="flex items-center mt-1">
                <Star className="w-4 h-4 text-yellow-400 mr-1 fill-yellow-400" />
                <span className="text-sm font-medium text-slate-300">{formattedRating}</span>
                <span className="text-xs text-slate-400 ml-1">({reviews.length} reviews)</span>
              </div>
            )}
          </div>
        </div>

        {/* Experience */}
        <div className="flex items-center text-sm text-slate-300 mb-3">
          <Clock className="w-4 h-4 mr-2 text-cyan-400" />
          <span>
            {experienceYears} {experienceYears === 1 ? "year" : "years"} of experience
          </span>
        </div>

        {/* Description */}
        <p className="text-sm text-slate-400 mb-4 line-clamp-2" title={description}>
          {description || "No description provided"}
        </p>

        {/* Expertise */}
        <div className="mb-4">
          <h4 className="text-xs font-medium text-slate-400 uppercase tracking-wider mb-2">Expertise</h4>
          <div className="flex flex-wrap gap-2">
            {expertise.length > 0 ? (
              expertise.map((skill, i) => (
                <span key={i} className="bg-slate-700 text-cyan-300 px-2 py-0.5 rounded-md text-xs font-medium">
                  {skill}
                </span>
              ))
            ) : (
              <span className="text-sm text-slate-500">No expertise listed</span>
            )}
          </div>
        </div>

        {/* Schedule */}
        <div className="mb-4">
          <h4 className="text-xs font-medium text-slate-400 uppercase tracking-wider mb-2">Availability</h4>
          <div className="space-y-1">
            <div className="flex items-start">
              <Calendar className="w-4 h-4 mr-2 text-slate-500 mt-0.5" />
              <span className="text-sm text-slate-300">{availableDays}</span>
            </div>
            {availableTimes && (
              <div className="flex items-start">
                <Clock className="w-4 h-4 mr-2 text-slate-500 mt-0.5" />
                <span className="text-sm text-slate-300">{availableTimes}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Action Button */}
      <div className="p-4 pt-0 mt-auto">
        <Link
          to={`/expert/${expertId?._id}`}
          state={{ expertDetails }}
          className=" w-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors text-center flex items-center justify-center"
        >
          View Profile <ExternalLink className="w-3.5 h-3.5 ml-2" />
        </Link>
      </div>
    </div>
  )
}

export default ExpertFeedCard
