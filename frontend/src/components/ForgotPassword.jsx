import React, { useState } from 'react';
import axios from 'axios';
import { BASE_URL } from '../utils/constants';
import { useNavigate } from 'react-router-dom';

const ForgotPassword = () => {
  const [emailId, setEmailId] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [showToast,setShowToast] = useState(false);
  const navigate = useNavigate();
  setTimeout(()=>{
    setShowToast(null);
   },5000)


  const handleRequestOtp = async () => {
    try {
      const res = await axios.post(BASE_URL+'/forget-password', { emailId },{withCredentials:true});
      setMessage(res.data.message);
      setOtpSent(true);
      setShowToast(true);
      setError("");
    } catch (err) {
      setError(err?.response?.data?.message || 'Something went wrong');
      setMessage("");
    }  
  };
  const handleNavigateToReset = ()=>{
    navigate('/reset-password', { state: { emailId } });
   }
  return (
    <div className ="flex justify-center mt-4">
    <div className="card bg-black w-96 shadow-xl ">
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
     <div className="card-body">
          <h2 className="text-xl font-semibold mb-4">Forgot Password</h2>
          <label className="form-control w-full max-w-xs"> 
      <div className="label">
    <span className="label-text">Email ID</span>
      </div>
  <input type="text" value = {emailId} onChange={(e)=>{setEmailId(e.target.value)}} placeholder="Enter your email" className="input input-bordered w-full max-w-xs" />
     </label>
          {!otpSent && <div className="card-actions justify-center mt-3">
          <button
            onClick={handleRequestOtp}
            className="btn text-black bg-vibrantClay"
          >
          Send OTP
          </button>
          </div>}
          {showToast && (
  <div className="toast toast-top toast-center">
    <div className="alert bg-green-600 text-white rounded-lg p-4 shadow-md">
      <span>{message}</span>
    </div>
  </div>
        )}
          {error && <p className="mt-4 mx-auto text-red-600">{error}</p>}
          {otpSent && (
        <button onClick={handleNavigateToReset} className="btn text-black bg-vibrantClay">
          Go to Reset Password
        </button>
      )}
      </div>
</div>
</div>
  );
};

export default ForgotPassword;
