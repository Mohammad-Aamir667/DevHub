import axios from "axios";
import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { BASE_URL } from "../../utils/constants";
import { ArrowLeft } from "lucide-react";
import { toast } from "react-toastify";

const ResetPassword = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const emailId = location.state?.emailId; // Safely extract

  const [otp, setOtp] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  // ✅ Handle Password Reset
  const handleResetPassword = async (e) => {
    e.preventDefault();

    if (!otp.trim() || !password.trim() || !confirmPassword.trim()) {
      toast.error("All fields are required");
      return;
    }

    if (password !== confirmPassword) {
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

      toast.success(res.data.message || "Password reset successfully!");
      setTimeout(() => navigate("/login"), 2000);

    } catch (err) {
      console.error("Reset Password Error:", err);
      const msg =
        err?.response?.data?.message ||
        "Something went wrong while resetting your password.";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  // ✅ Redirect user back if email is missing
  if (!emailId) {
    toast.error("Session expired. Please request OTP again.");
    navigate("/forgot-password");
    return null;
  }

  return (
    <div className="flex justify-center items-center min-h-screen bg-dark-charcoal p-4">
      <div className="bg-gray-800 shadow-lg rounded-xl p-6 w-full max-w-md text-soft-white">
        {/* 🔙 Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="text-slate-400 hover:text-slate-100 hover:bg-slate-800 p-2 sm:p-3 rounded-md flex items-center text-sm sm:text-base transition-colors"
        >
          <ArrowLeft className="w-5 h-5 sm:w-6 sm:h-6 mr-2" />
          Back
        </button>

        <h2 className="text-2xl font-semibold text-center mb-6 mt-2">
          Reset Password
        </h2>

        <form onSubmit={handleResetPassword}>
          {/* OTP Input */}
          <label className="block mb-4">
            <span className="text-sm text-soft-white">Enter OTP</span>
            <input
              type="text"
              value={otp}
              onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))} // digits only
              maxLength={6}
              placeholder="Enter 6-digit OTP"
              className="input input-bordered w-full bg-gray-700 text-soft-white border-gray-600 focus:ring focus:ring-vibrant-clay mt-1 text-center"
            />
          </label>

          {/* New Password */}
          <label className="block mb-4">
            <span className="text-sm text-soft-white">New Password</span>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter new password"
              className="input input-bordered w-full bg-gray-700 text-soft-white border-gray-600 focus:ring focus:ring-vibrant-clay mt-1"
            />
          </label>

          {/* Confirm Password */}
          <label className="block mb-6">
            <span className="text-sm text-soft-white">Confirm Password</span>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm new password"
              className="input input-bordered w-full bg-gray-700 text-soft-white border-gray-600 focus:ring focus:ring-vibrant-clay mt-1"
            />
          </label>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={
              loading ||
              !otp.trim() ||
              !password.trim() ||
              !confirmPassword.trim() ||
              password !== confirmPassword
            }
            className={`w-full py-2 rounded-md font-medium ${loading ||
              !otp.trim() ||
              !password.trim() ||
              !confirmPassword.trim() ||
              password !== confirmPassword
              ? "bg-gray-600 cursor-not-allowed"
              : "bg-vibrant-clay hover:bg-orange-600 transition"
              }`}
          >
            {loading ? "Resetting..." : "Reset Password"}
          </button>

        </form>
      </div>
    </div>
  );
};

export default ResetPassword;
