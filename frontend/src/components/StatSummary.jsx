import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faList, faClock, faCheckCircle, faStar } from "@fortawesome/free-solid-svg-icons";

const StatsSummary = ({ totalRequests, pendingRequests, completedRequests, reviews }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
      {/* Total Requests */}
      <div className="bg-white p-4 shadow rounded-lg flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-600">Total Requests</h3>
          <p className="text-2xl font-bold text-gray-800">{totalRequests}+</p>
        </div>
        <FontAwesomeIcon icon={faList} size="2x" className="text-blue-500" />
      </div>

      {/* Pending Requests */}
      <div className="bg-white p-4 shadow rounded-lg flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-600">Pending Requests</h3>
          <p className="text-2xl font-bold text-gray-800">{pendingRequests}</p>
        </div>
        <FontAwesomeIcon icon={faClock} size="2x" className="text-yellow-500" />
      </div>

      {/* Completed Requests */}
      <div className="bg-white p-4 shadow rounded-lg flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-600">Completed Requests</h3>
          <p className="text-2xl font-bold text-gray-800">{completedRequests}</p>
        </div>
        <FontAwesomeIcon icon={faCheckCircle} size="2x" className="text-green-500" />
      </div>

      {/* Reviews */}
      <div className="bg-white p-4 shadow rounded-lg flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-600">Reviews</h3>
          <p className="text-2xl font-bold text-gray-800">{reviews}/5</p>
        </div>
        <FontAwesomeIcon icon={faStar} size="2x" className="text-purple-500" />
      </div>
    </div>
  );
};

export default StatsSummary;
