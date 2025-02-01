import axios from 'axios';
import React, { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { BASE_URL } from '../utils/constants';

const ResetPassword = () => {
    const location = useLocation();
    const {emailId} = location.state;
    const navigate = useNavigate()
    const [password,setPassword] = useState("");
    const [confirmPassword,setConfirmPassword] = useState("");
    const [otp,setOtp] = useState("");
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const handleResetPassword = async ()=>{
        if (password !== confirmPassword) {
            setError("Password and Confirm Password do not match");
            setMessage(""); 
            return;
          }
        try{
              const res = await axios.post(BASE_URL + "/reset-password",{emailId,otp,newPassword:password},{withCredentials:true});
                 setMessage(res.data.message);
                 setError("");
                 setTimeout(() => navigate('/login'), 2000);
        }
        catch(err){
            setError(err?.response?.data?.message || 'Something went wrong');
               setMessage("");
        }
    }
  return (
    <div className ="flex justify-center mt-4">
    <div className="card bg-black w-96 shadow-xl ">
 <div className="card-body">
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
 <h2 className="card-title">Reset Password</h2>
 <label className="form-control w-full max-w-xs"> 
  <div className="label">
    <span className="label-text">Enter OTP</span>
  </div>
  <input type="text" value = {otp} onChange={(e)=>{setOtp(e.target.value)}} placeholder="Enter OTP" className="input input-bordered w-full max-w-xs" />
   </label>
 <label className="form-control w-full max-w-xs"> 
  <div className="label">
    <span className="label-text">Password</span>
  </div>
  <input type="text" value = {password} onChange={(e)=>{setPassword(e.target.value)}} placeholder="Password" className="input input-bordered w-full max-w-xs" />
   </label>
   <label className="form-control w-full max-w-xs"> 
  <div className="label">
    <span className="label-text">Confirm Password</span>
  </div>
  <input type="text" value = {confirmPassword} onChange={(e)=>{setConfirmPassword(e.target.value)}} placeholder="Confirm Password" className="input input-bordered w-full max-w-xs" />
   </label>
   <div className="card-actions justify-center mt-3">
      <button onClick = {handleResetPassword} className="btn text-black bg-vibrantClay">Reset Password</button>
    </div>
    {message && (
  <div className="toast toast-top toast-center">
    <div className="alert bg-green-600 text-white rounded-lg p-4 shadow-md">
      <span>{message}</span>
    </div>
  </div>
)}
    {error && <p className="mt-4 text-red-600">{error}</p>}
 </div>
</div>
</div>
  )
}

export default ResetPassword