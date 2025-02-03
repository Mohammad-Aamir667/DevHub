import React from "react";
import { Link } from "react-router-dom";

const ExpertFeedCard = ({ expertDetails }) => {
  const { expertise, experienceYears, expertId } = expertDetails;

  return (
    <div className="bg-gray-800 shadow-lg rounded-xl p-4 transition-all duration-300 hover:shadow-xl hover:scale-[1.02]">
      {/* Profile Image & Info */}
      <div className="flex items-center space-x-4">
        <img
          src={expertId?.photoUrl}
          alt={expertId?.firstName}
          className="w-16 h-16 rounded-full object-cover border-2 border-electric-blue"
        />
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-soft-white">
            {expertId?.firstName} {expertId?.lastName}
          </h3>
          <p className="text-sm text-light-gray">{expertise}</p>
          <p className="text-sm text-gray-400 mt-1">
            Experience: {experienceYears} years
          </p>
        </div>
      </div>

      {/* Action Button */}
      <div className="mt-4 flex justify-end">
        <Link
          to={`/expert/${expertId?._id}`}
          state={{ expertDetails }}
          className="bg-cyan-600 hover:bg-cyan-700 text-soft-white px-3 py-2 rounded-lg text-sm font-medium transition-all"
        >
          View Profile
        </Link>
      </div>
    </div>
  );
};

export default ExpertFeedCard;
