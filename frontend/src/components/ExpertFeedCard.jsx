import React from "react";
import { Link, useNavigate } from "react-router-dom";

const ExpertFeedCard = ({expertDetails}) => {
  const {  expertise, experienceYears,expertId} = expertDetails;
  const navigate = useNavigate();
   return (

    <div className="space-y-4">
  
    <div className="flex items-center bg-white shadow-md rounded-xl p-4 hover:shadow-lg cursor-pointer">
      <img
        src={expertId.photoUrl} 
        alt={expertId.firstName}
        className="w-16 h-16 rounded-full object-cover"
      />
      <div className="ml-4 flex-1">
        <h3 className="text-xl font-semibold text-gray-800">{expertId?.firstName+" "+expertId?.lastName}</h3>
        <p className="text-sm text-gray-600">{expertise}</p>
        <p className="text-sm text-gray-500 mt-1">Experience Years {experienceYears}</p>
      </div>
      <Link
        to={'/expert/'+expertId?._id}
        state={{ expertDetails: expertDetails }}
        className="text-purple-500 text-sm font-medium hover:underline"
      >
        See Details
      </Link>
    </div>  
  </div>
  
  
   )

};

export default ExpertFeedCard;
