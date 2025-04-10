import React, { useState, useEffect } from "react";
import axios from "axios";
import { BASE_URL } from "../utils/constants";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react"

const ForgotPassword = () => {
  const [emailId, setEmailId] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (showToast) {
      const timer = setTimeout(() => setShowToast(false), 5000);
      return () => clearTimeout(timer);
    }
  }, [showToast]);

  const handleRequestOtp = async () => {
    setLoading(true);
    try {
      const res = await axios.post(
        `${BASE_URL}/forget-password`,
        { emailId },
        { withCredentials: true }
      );
      setMessage(res.data.message);
      setOtpSent(true);
      setShowToast(true);
      setError("");
    } catch (err) {
      setError(err?.response?.data?.message || "Something went wrong");
      setMessage("");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-dark-charcoal p-4 overflow-auto">
      <div className="bg-gray-800 shadow-lg rounded-xl p-6 w-full max-w-md text-soft-white">
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center text-slate-400 hover:text-slate-300 font-medium mb-6 transition duration-200"
        >
          <ArrowLeft className="w-6 h-7 mr-2"  />
        
        </button>

        <h2 className="text-2xl font-semibold text-center mb-6">Forgot Password</h2>

        {/* Email Input */}
        <label className="block mb-4">
          <span className="text-sm text-soft-white">Email ID</span>
          <input
            type="email"
            value={emailId}
            onChange={(e) => setEmailId(e.target.value)}
            placeholder="Enter your email"
            className="input input-bordered w-full bg-gray-700 text-soft-white border-gray-600 focus:ring focus:ring-vibrant-clay mt-1"
          />
        </label>

        {/* Send OTP Button */}
        {!otpSent && (
          <button
            onClick={handleRequestOtp}
            className={`w-full py-2 mt-2 rounded-md font-medium ${
              loading
                ? "bg-gray-600 cursor-not-allowed"
                : "bg-vibrant-clay hover:bg-orange-600 transition"
            }`}
            disabled={loading}
          >
            {loading ? "Sending..." : "Send OTP"}
          </button>
        )}

        {/* Success Message */}
        {otpSent && (
          <button
            onClick={() => navigate("/reset-password", { state: { emailId } })}
            className="w-full py-2 mt-4 bg-green-600 hover:bg-green-500 transition rounded-md font-medium"
          >
            Go to Reset Password
          </button>
        )}

        {/* Error Message */}
        {error && <p className="mt-4 text-sm text-red-500">{error}</p>}

        {/* Toast Notification */}
        {showToast && (
          <div className="fixed top-5 left-1/2 transform -translate-x-1/2 bg-green-600 text-soft-white px-4 py-2 rounded-lg shadow-md">
            {message}
          </div>
        )}
      </div>
    </div>
  );
};

export default ForgotPassword;
