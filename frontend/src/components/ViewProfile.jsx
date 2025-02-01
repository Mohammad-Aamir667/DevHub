import React from 'react'

import { useLocation, useNavigate } from 'react-router-dom'

const ViewProfile = () => {
       const location = useLocation();
       const navigate = useNavigate();
       const {userProfile} = location.state;
       const {firstName,lastName,age,gender,about,skills,photoUrl} = userProfile;
       const messageUser = ()=>{
           navigate("/chat-box",{state:{chatUser:userProfile}});
       }

  return (
    <div className = "flex justify-center mt-4">
       <div className="card bg-black w-96 shadow-xl">
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
  Back
</button>


    <figure className="px-10 pt-10">
      <img
        src={photoUrl}
        alt="photo"
        className="rounded-full w-32 h-32" />
    </figure>
    <div className="card-body ">
      <h2 className="card-title">{firstName+" "+lastName}</h2>
      <p className ="">Gender:{gender}</p>
      <p className ="">Age:{age}</p>
      <text className ="">About:{about}</text>
      <text className ="">Skills:{skills}</text>
    </div>
    <div className="card-body flex justify-end items-center text-center">
      <div className="card-actions flex justify-end">
      <button onClick={messageUser} className="text-base btn btn-wide">Message</button>
    

      </div>
    </div>
  </div>
  </div>
 
  )
}

export default ViewProfile