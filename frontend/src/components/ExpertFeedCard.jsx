import { Image } from "lucide-react";
import React from "react";
import { Link } from "react-router-dom";

const ExpertFeedCard = ({ expertDetails }) => {
  const { expertise, experienceYears, expertId } = expertDetails
    
  return (
    <div className="bg-gray-800 shadow-lg rounded-xl p-6 transition-all duration-300 hover:shadow-xl hover:bg-gray-750">
      {/* Profile Image & Info */}
      <div className="flex items-center space-x-4 mb-4">
        <div className="relative w-16 h-16 rounded-full overflow-hidden border-2 border-blue-400">
          <img
            src={expertId?.photoUrl || "/placeholder.svg"}
            alt={expertId?.firstName}
            layout="fill"
            objectFit="cover"
          />
        </div>
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-100">
            {expertId?.firstName} {expertId?.lastName}
          </h3>
          <p className="text-sm text-gray-300">{expertise.join(", ")}</p>
        </div>
      </div>

      {/* Experience */}
      <p className="text-sm text-gray-400 mb-4">Experience: {experienceYears} years</p>

      {/* Action Button */}
      <div className="mt-4">
        <Link
          to={`/expert/${expertId?._id}`}
          state={{ expertDetails }}
         className="block w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-all text-center"
        >
          View Profile
        </Link>
      </div>
    </div>
  )
}


export default ExpertFeedCard;
