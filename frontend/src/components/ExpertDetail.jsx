import axios from "axios";
import React from "react";
import { BASE_URL } from "../utils/constants";
import { useDispatch, useSelector } from "react-redux";
import { setExperts } from "../utils/expertSlice";

const ExpertDetail = ({ expert, onBack }) => {
  const dispatch = useDispatch();
  const { pending, approved, rejected } = useSelector((state) => state.experts);

  const handleReview = async (status) =>{ 
         const expertId = expert.expertId._id;
        try{
          const res = await axios.post(BASE_URL+"/expert/review/"+status+"/"+expertId,{},{withCredentials:true});
          const expert = pending.find((expert) => expert.expertId._id === expertId);
          if (expert) {
            // Remove the expert from the pending list
            const updatedPending = pending.filter((expert) => expert.expertId._id !== expertId);
      
            // Update the status of the expert (add to approved or rejected list)
            let updatedApproved = [...approved];
            let updatedRejected = [...rejected];
      
            if (status === "approved") {
              updatedApproved.push(expert);
            } else if (status === "rejected") {
              updatedRejected.push(expert);
            }
      
            // Dispatch updated lists to the Redux store
            dispatch(setExperts({
              pending: updatedPending,
              approved: updatedApproved,
              rejected: updatedRejected,
            }));
      }
    }
      catch(err){
        console.log(err);
      }
  }
  return (
    <div className="max-w-3xl mx-auto p-6 bg-white shadow-lg rounded-lg">
      
      <div className="flex items-center mb-6">
        <img
          src={expert.expertId.photoUrl}
          alt="Expert"
          className="w-24 h-24 rounded-full object-cover mr-6"
        />
        <div>
          <h2 className="text-2xl font-bold text-gray-800">
            {expert.expertId.firstName} {expert.expertId.lastName}
          </h2>
          <p className="text-gray-600">{expert.expertId.about}</p>
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-700">Expertise</h3>
          <p className="text-gray-800">{expert.expertise.join(", ")}</p>
        </div>

        <div>
          <h3 className="text-lg font-semibold text-gray-700">Experience</h3>
          <p className="text-gray-800">{expert.experienceYears} years</p>
        </div>

        {expert.description && (
          <div>
            <h3 className="text-lg font-semibold text-gray-700">Description</h3>
            <p className="text-gray-800">{expert.description}</p>
          </div>
        )}

        <div>
          <h3 className="text-lg font-semibold text-gray-700">Links</h3>
          <div className="space-y-2">
            <a
              href={expert.linkedInProfile}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
              LinkedIn
            </a>
            <br />
            <a
              href={expert.githubProfile}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
              GitHub
            </a>
            {expert.portfolioUrl && (
              <>
                <br />
                <a
                  href={expert.portfolioUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline"
                >
                  Portfolio
                </a>
              </>
            )}
          </div>
        </div>

        <div>
          <h3 className="text-lg font-semibold text-gray-700">Resume</h3>
          <a
            href={expert.resumeUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:underline"
          >
            View Resume
          </a>
        </div>
      </div>

      <div className="flex justify-between mt-6">
        <button
          onClick={onBack}
          className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded-lg"
        >
          Back
        </button>
        {expert.status === "pending" && (
          <div className="space-x-4">
            <button
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg"
              onClick={()=> handleReview("approved")}
            >
              Approve
            </button>
            <button
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg"
              onClick={() => handleReview("Rejected")}
            >
              Reject
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ExpertDetail;
