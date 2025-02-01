import React from 'react'
import { useSelector } from 'react-redux';
import { Outlet, useNavigate } from 'react-router-dom';


const Profile = () => {
  const user = useSelector((store)=>store.user);
  const navigate = useNavigate();
  const {firstName,lastName,photoUrl,age,gender,about,skills} = user;
   const handleEditProfile = ()=>{  
    return  navigate("/editProfile")
   }
  return   (
    <div className = "flex justify-center">
      
    <div className=" card bg-black w-96 shadow-xl">
    <button onClick = {()=>{navigate(-1)}} className="flex items-center text-darkPurple hover:text-electricBlue font-semibold px-4 py-2 rounded-lg focus:outline-none transition duration-200 mt-2">
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
     <div className="flex justify-center items-center py-6">
     <div className="flex justify-center w-32 h-32 rounded-full overflow-hidden border">      
            <img
              alt="Profile"
              src={photoUrl}
              className="w-full h-full object-cover"
            />
        </div>
     </div>

    <div className="card-body ">
      <h2 className="card-title">{firstName+" "+lastName}</h2>
      <p className ="">Gender:{gender}</p>
      <p className ="">Age:{age}</p>
      <text className ="">About:{about}</text>
      <text className ="">Skills:{skills}</text>
    </div>
    <div className="card-body flex justify-end items-center text-center">
      <div className="card-actions flex justify-end">
      <button onClick = {handleEditProfile} class="btn btn-xs sm:btn-sm md:btn-md lg:btn-lg">Edit Profile</button>
      </div>
    </div>
  </div>
  </div>
 
  
);
}

export default Profile;