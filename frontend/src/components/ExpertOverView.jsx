import axios from 'axios';
import React, { useCallback, useEffect, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { BASE_URL } from '../utils/constants';
import Toast from './Toast';
import { useDispatch, useSelector } from 'react-redux';
import { addInteraction } from '../utils/interactionSlice';


const ExpertOverView = () => {
         const location = useLocation();
         const [isModalOpen, setIsModalOpen] = useState(false);
         const [error,setError] = useState("");
         const dispatch = useDispatch();
         const { expertDetails } = location.state || {};
         const [issueDescription,setIssueDescription] = useState("");
         const [codeSnippet,setCodeSnippet] = useState("");
         const navigate = useNavigate();
         const [showToast,setShowToast] = useState(false);
         const {  expertise, experienceYears,expertId,description} = expertDetails;
         const interaction = useSelector((store) =>
          store.userInteractions.find((interaction) => interaction.expertId._id === expertDetails.expertId._id)
        );
        console.log(interaction)
          const onClose = useCallback(() => {
             setShowToast(false); 
           }, [])
         const handleRequestHelp = ()=>{
          setIsModalOpen(true);
         }
         const handleSendRequestHelp = async (e)=>{
          e.preventDefault();
          if(!issueDescription.trim()){
            setError("Issue Description is required");
          }
         try{ 
          const res = await axios.post(BASE_URL+"/request-help/"+expertId._id,{issueDescription,codeSnippet},{withCredentials:true});
           setShowToast(true);
           dispatch(addInteraction(res.data));
         
           setIsModalOpen(false);
        }
        catch(err){
          console.log("something went wrong",err);
        }
      
         }
      return (
        <div className="bg-white shadow-lg p-6 rounded-lg max-w-md mx-auto">
              <button onClick = {()=>{navigate(-1)}} className="flex items-center text-darkPurple hover:text-electricBlue font-semibold px-4 py-2 rounded-lg focus:outline-none transition duration-200">
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={2}
    stroke="currentColor"
    className="w-5 h-5 mr-2"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M15 19l-7-7 7-7"
    />
  </svg>
</button>
          <img
            src={expertId.photoUrl}
            alt={expertId.firstName}
            className="w-24 h-24 rounded-full mx-auto object-cover"
          />
          <h2 className="text-2xl font-bold text-center mt-4">{expertId.firstName+" "+expertId.lastName}</h2>
          <p className="text-gray-600 text-center">{expertise}</p>
          <p className="text-gray-600 text-center">{description}</p>
          <p className="text-gray-600 text-center">{experienceYears} years of experience</p>
          <p className="text-gray-600 text-center font-bold mt-2">500 INR Fees</p>
          
          <button
          disabled={interaction?.status === "pending"} onClick = {handleRequestHelp}
           className={`w-full py-2 mt-4 rounded-lg ${
            interaction?.status === "pending"
      ? "bg-gray-400 text-white cursor-not-allowed"
      : "bg-purple-500 text-white hover:bg-purple-600"
        }`}
>
  {interaction?.status ==="pending" ? "Request Pending" : "Request Help"}
</button>
<div>
  {interaction?.status ==="pending" ? <Link to = "/view-requests">View Requests</Link>:""}
  </div>
 
          {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded shadow-lg w-96">
            <h3 className="text-lg font-semibold mb-4">Request Help</h3>
            <form>
              <div className="mb-4">
                <label htmlFor="issueDescription" className="block text-gray-700">
                  Issue Description
                </label>
                <textarea value = {issueDescription} onChange={(e)=>{setIssueDescription(e.target.value)}}
                  id="issueDescription"
                  className="w-full p-2 border rounded"
                  required
                />
              </div>
              {error && <p className="text-red-500 -mt-6 text-sm">{error}</p>}
              <div className="mb-4">
                <label htmlFor="codeSnippet" className="block text-gray-700">
                  Code Snippet (Optional)
                </label>
                <textarea value = {codeSnippet} onChange={(e)=>{setCodeSnippet(e.target.value)}}
                  id="codeSnippet"
                  className="w-full p-2 border rounded"
                />
              </div>
              <button
                type="submit" onClick = {(e)=>handleSendRequestHelp(e)}
                className="bg-purple-500 text-white py-2 px-4 rounded"
              >
                Send Request
              </button>
            </form>
            <button
              className="mt-4 text-gray-600 hover:text-gray-800"
              onClick={() => setIsModalOpen(false)}
            >
              Close
            </button>
          </div>
        </div>
      )}
      {showToast && <Toast message =  "Request Sent! The expert will review and get back to you soon." onClose = {onClose}/>}
        </div>
      );
    };

    
  


export default ExpertOverView