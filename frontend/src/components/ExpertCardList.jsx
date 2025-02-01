import React from "react";

const ExpertCardList = ({ experts, onExpertClick }) => {
  if (!experts || experts.length === 0) {
      console.log(experts)
    return (
      <p className="text-gray-500 text-center mt-4">
        No experts available in this category.
      </p>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {experts.map((expert) => (
        <div
          key={expert._id}
          className="bg-white shadow-md rounded-lg p-4 hover:shadow-lg cursor-pointer transition duration-200"
          onClick={() => onExpertClick(expert)}
        >
          <img
            src={expert.expertId.photoUrl || "/default-avatar.png"}
            alt={`${expert.expertId.firstName}`}
            className="w-16 h-16 rounded-full object-cover mx-auto"
          />
          <h3 className="text-lg font-semibold text-gray-800 text-center mt-2">
            {expert.expertId.firstName} {expert.expertId.lastName}
          </h3>
          <p className="text-sm text-gray-600 text-center">
            {expert.expertId.about || "No description provided"}
          </p>
        </div>
      ))}
    </div>
  );
};

export default ExpertCardList;
