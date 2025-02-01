import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { BASE_URL } from '../utils/constants';
import axios from 'axios';
import { addUser } from '../utils/userSlice';
import ProfilePictureUpload from './ProfilePictureUpload';
import { useNavigate } from 'react-router-dom';

const EditProfile = () => {
        const user = useSelector((store)=>store.user);
        const [firstName,setFirstName] = useState(user.firstName);
        const [lastName,setLastName] = useState(user.lastName);
        const [gender,setGender] = useState(user.gender);
        const [age,setAge] = useState(user.age);
        const [skills,setSkills]  = useState(user.skills) ;
        const [about,setAbout] = useState(user.about);
        const [photoUrl,setPhotoUrl]  = useState(user.photoUrl)
        const [error,setError] = useState("");
        const [showToast,setShowToast] = useState(false);
        const navigate = useNavigate()
        const dispatch = useDispatch();
        setTimeout(()=>{
            setShowToast(null);
        },5000)
   const saveProfile = async()=>{
    setError("");
       try{
         const res = await axios.post(BASE_URL+"/editProfile",{
            firstName,lastName,age,gender,about,skills,photoUrl,
        },{withCredentials:true});
       dispatch(addUser(res.data));
       setShowToast(true);
        }
        catch(err){
            setError(err.message);
        }
   }  
  return (
    <div className =" flex justify-center  mt-4">  
    <div className="bg-black card  w-96 shadow-xl ">
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
    <ProfilePictureUpload
  photoUrl={photoUrl}
  setPhotoUrl={setPhotoUrl}
/>
 <div className="card-body">
   <h2 className="card-title">Edit Profile</h2>
   <label className="form-control w-full max-w-xs">
 <div className="label">
   <span className="label-text">First Name</span>
 </div>
 <input type="text" value = {firstName} onChange={(e)=>{setFirstName(e.target.value)}} className="input input-bordered w-full max-w-xs" />
</label>
<label className="form-control w-full max-w-xs">
 <div className="label">
   <span className="label-text">Last Name</span>
 </div>
 <input type="text" value = {lastName} onChange={(e)=>{setLastName(e.target.value)}} className="input input-bordered w-full max-w-xs" />
</label>
<label className="form-control w-full max-w-xs">
 <div className="label">
   <span className="label-text">Gender</span>
 </div>
 <select value={gender}  onChange={(e)=> setGender(e.target.value)} className="select select-bordered w-full max-w-xs">
  <option disabled selected>Select Gender</option>
  <option>Male</option>
  <option>Female</option>
  <option>Other</option>
</select>
</label>
<label className="form-control w-full max-w-xs">
 <div className="label">
   <span className="label-text">Age</span>
 </div>
 <input type="text" value = {age} onChange={(e)=>{setAge(e.target.value)}} className="input input-bordered w-full max-w-xs" />
</label>
<label className="form-control w-full max-w-xs">
 <div className="label">
   <span className="label-text">About</span>
 </div>
 <textarea type="text" value = {about} onChange={(e)=>{setAbout(e.target.value)}} className="input input-bordered w-full max-w-xs" />
</label>
<label className="form-control w-full max-w-xs">
 <div className="label">
   <span className="label-text">Skills</span>
 </div>
 <textarea type="text" value = {skills} onChange={(e)=>{setSkills(e.target.value)}} className="input input-bordered w-full max-w-xs" />
</label>
   <div className="card-actions justify-center mt-3">
   <p className = "text-red-500">{error}</p>
     <button onClick = {saveProfile} className="btn btn-primary">Save</button>
   </div>
  {showToast &&  <div className="toast toast-top toast-center">
  <div className="alert alert-info">
    <span>Profile Saved successfully</span>
  </div>
</div>}
 </div>
</div>
</div>
  )
}

export default EditProfile;