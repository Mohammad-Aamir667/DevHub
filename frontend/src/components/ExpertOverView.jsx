import axios from "axios";
import React, { useCallback, useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { BASE_URL } from "../utils/constants";
import Toast from "./Toast";
import { useDispatch, useSelector } from "react-redux";
import { addInteraction, setInteractions } from "../utils/interactionSlice";

const ExpertOverView = () => {
  const location = useLocation();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [error, setError] = useState("");
  const dispatch = useDispatch();
  const { expertDetails } = location.state || {};
  const [issueDescription, setIssueDescription] = useState("");
  const [codeSnippet, setCodeSnippet] = useState("");
  const navigate = useNavigate();
  const [showToast, setShowToast] = useState(false);

  const { expertise, experienceYears, expertId, description } = expertDetails;
  const interaction = useSelector((store) =>
    store?.userInteractions?.find(
      (interaction) => interaction.expertId._id === expertDetails.expertId._id
    )
  );

 
  const onClose = useCallback(() => {
    setShowToast(false);
  }, []);

  const handleRequestHelp = () => {
    setIsModalOpen(true);
  };

  const handleSendRequestHelp = async (e) => {
    e.preventDefault();
    if (!issueDescription.trim()) {
      setError("Issue Description is required");
      return;
    }
    try {
      const res = await axios.post(
        BASE_URL + "/request-help/" + expertId._id,
        { issueDescription, codeSnippet },
        { withCredentials: true }
      );
      setShowToast(true);
      dispatch(addInteraction(res.data));
      setIsModalOpen(false);
      setIssueDescription("");
      setCodeSnippet("");
      setError("");
    } catch (err) {
      console.error("Something went wrong", err);
    }
  };

  return (
    <div className="bg-gray-800 shadow-lg p-6 mt-20 rounded-lg max-w-md mx-auto text-softWhite">
      {/* Back Button */}
      <button
        onClick={() => navigate(-1)}
        className="flex items-center text-vibrantCyan hover:text-electricBlue font-semibold px-4 py-2 rounded-lg focus:outline-none transition duration-200"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={2}
          stroke="currentColor"
          className="w-5 h-5 mr-2"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
        </svg>
      </button>

      {/* Expert Profile */}
      <div className="text-center">
        <img
          src={expertId.photoUrl}
          alt={expertId.firstName}
          className="w-24 h-24 rounded-full mx-auto object-cover border-2 border-vibrantCyan"
        />
        <h2 className="text-2xl font-bold mt-4">{expertId.firstName + " " + expertId.lastName}</h2>
        <p className="text-gray-400">{expertise}</p>
        <p className="text-gray-400">{description}</p>
        <p className="text-gray-400">{experienceYears} years of experience</p>
        <p className="text-lg font-bold mt-2 text-limeGreen">₹500 Fees</p>
      </div>

      {/* Request Help Button */}
      <button
        disabled={interaction?.status === "pending"}
        onClick={handleRequestHelp}
        className={`w-full py-2 mt-4 rounded-lg font-semibold transition ${
          interaction?.status === "pending"
            ? "bg-gray-500 text-white cursor-not-allowed"
            : "bg-deepTeal text-softWhite hover:bg-[#003636]"
        }`}
      >
        {interaction?.status === "pending" ? "Request Pending" : "Request Help"}
      </button>

      {/* View Requests Link */}
      {interaction?.status === "pending" && (
        <div className="mt-2 text-center">
          <Link to="/view-requests" className="text-vibrantCyan hover:text-electricBlue underline">
            View Requests
          </Link>
        </div>
      )}

      {/* Request Help Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center p-4">
          <div className="bg-darkCharcoalGray p-6 rounded-lg shadow-xl w-full max-w-lg text-softWhite">
            <h3 className="text-xl font-semibold mb-4">Request Help</h3>
            <form>
              <div className="mb-4">
                <label htmlFor="issueDescription" className="block text-gray-300 mb-1">
                  Issue Description
                </label>
                <textarea
                  value={issueDescription}
                  onChange={(e) => setIssueDescription(e.target.value)}
                  id="issueDescription"
                  className="w-full p-2 border border-gray-600 rounded bg-gray-700 text-white"
                  required
                />
                {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
              </div>
              <div className="mb-4">
                <label htmlFor="codeSnippet" className="block text-gray-300 mb-1">
                  Code Snippet (Optional)
                </label>
                <textarea
                  value={codeSnippet}
                  onChange={(e) => setCodeSnippet(e.target.value)}
                  id="codeSnippet"
                  className="w-full p-2 border border-gray-600 rounded bg-gray-700 text-white"
                />
              </div>
              <button
                type="submit"
                onClick={handleSendRequestHelp}
                className="w-full bg-deepTeal text-white py-2 px-4 rounded-lg hover:bg-[#003636] transition"
              >
                Send Request
              </button>
            </form>
            <button
              className="mt-4 block text-gray-300 hover:text-white text-center w-full"
              onClick={() => setIsModalOpen(false)}
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Toast Notification */}
      {showToast && (
        <Toast
          message="Request Sent! The expert will review and get back to you soon."
          onClose={onClose}
        />
      )}
    </div>
  );
};

export default ExpertOverView;
