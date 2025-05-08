import axios from "axios";
import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { BASE_URL } from "../utils/constants";
import { ArrowLeft } from "lucide-react";
import toast from "react-hot-toast";

const ResetPassword = () => {
  const location = useLocation();
  const { emailId } = location.state;
  const navigate = useNavigate();

  const [otp, setOtp] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleResetPassword = async () => {
    if (password !== confirmPassword) {
      setError("Password and Confirm Password do not match");
      toast.error("Passwords do not match");
      return;
    }

    setLoading(true);
    try {
      const res = await axios.post(
        `${BASE_URL}/reset-password`,
        { emailId, otp, newPassword: password },
        { withCredentials: true }
      );
      toast.success(res.data.message);
      setError("");
      setTimeout(() => navigate("/login"), 2000);
    } catch (err) {
      const msg = err?.response?.data?.message || "Something went wrong";
      toast.error(msg);
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-dark-charcoal p-4">
      <div className="bg-gray-800 shadow-lg rounded-xl p-6 w-full max-w-md text-soft-white">
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="text-slate-400 hover:text-slate-100 hover:bg-slate-800 p-2 sm:p-3 rounded-md flex items-center text-sm sm:text-base transition-colors"
        >
          <ArrowLeft className="w-5 h-5 sm:w-6 sm:h-6 mr-2" />
        </button>

        <h2 className="text-2xl font-semibold text-center mb-6">
          Reset Password
        </h2>

        {/* OTP Input */}
        <label className="block mb-4">
          <span className="text-sm text-soft-white">Enter OTP</span>
          <input
            type="text"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            placeholder="Enter OTP"
            className="input input-bordered w-full bg-gray-700 text-soft-white border-gray-600 focus:ring focus:ring-vibrant-clay mt-1"
          />
        </label>

        {/* New Password Input */}
        <label className="block mb-4">
          <span className="text-sm text-soft-white">New Password</span>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="New Password"
            className="input input-bordered w-full bg-gray-700 text-soft-white border-gray-600 focus:ring focus:ring-vibrant-clay mt-1"
          />
        </label>

        {/* Confirm Password Input */}
        <label className="block mb-4">
          <span className="text-sm text-soft-white">Confirm Password</span>
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Confirm Password"
            className="input input-bordered w-full bg-gray-700 text-soft-white border-gray-600 focus:ring focus:ring-vibrant-clay mt-1"
          />
        </label>

        {/* Submit Button */}
        <button
          onClick={handleResetPassword}
          className={`w-full py-2 mt-2 rounded-md font-medium ${
            loading
              ? "bg-gray-600 cursor-not-allowed"
              : "bg-vibrant-clay hover:bg-orange-600 transition"
          }`}
          disabled={loading}
        >
          {loading ? "Resetting..." : "Reset Password"}
        </button>

        {/* Error Message */}
        {error && <p className="mt-4 text-sm text-red-500">{error}</p>}
      </div>
    </div>
  );
};

export default ResetPassword;
