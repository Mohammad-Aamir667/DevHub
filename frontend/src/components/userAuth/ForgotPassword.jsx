import React, { useState } from "react";
import axios from "axios";
import { BASE_URL } from "../../utils/constants";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { toast } from "react-hot-toast";

const ForgotPassword = () => {
  const [emailId, setEmailId] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleRequestOtp = async (e) => {
    e.preventDefault();

    if (!emailId.trim()) {
      toast.error("Email ID is required");
      return;
    }

    setLoading(true);
    try {
      const res = await axios.post(
        `${BASE_URL}/forget-password`,
        { emailId: emailId.trim() },
        { withCredentials: true }
      );

      // ✅ Always show success message (generic from backend)
      toast.success(res.data.message || "If this email is registered, an OTP has been sent.");
      // ✅ Navigate directly to reset password page
      navigate("/reset-password", { state: { emailId } });

    } catch (err) {
      const msg =
        err?.response?.data?.message ||
        "Something went wrong. Please try again later.";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-dark-charcoal p-4 overflow-auto">
      <div className="bg-gray-800 shadow-lg rounded-xl p-6 w-full max-w-md text-soft-white">

        {/* 🔙 Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="text-slate-400 hover:text-slate-100 hover:bg-slate-800 p-2 sm:p-3 rounded-md flex items-center text-sm sm:text-base transition-colors"
        >
          <ArrowLeft className="w-5 h-5 sm:w-6 sm:h-6 mr-2" />
          Back
        </button>

        <h2 className="text-2xl font-semibold text-center mb-6 mt-3">
          Forgot Password
        </h2>

        <form onSubmit={handleRequestOtp}>
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

          <button
            type="submit"
            className={`w-full py-2 mt-2 rounded-md font-medium ${loading
                ? "bg-gray-600 cursor-not-allowed"
                : "bg-vibrant-clay hover:bg-orange-600 transition"
              }`}
            disabled={loading}
          >
            {loading ? "Sending..." : "Send OTP"}
          </button>
        </form>

        <p className="text-center text-slate-400 text-sm mt-4">
          You'll be redirected to reset password after OTP is sent.
        </p>
      </div>
    </div>
  );
};

export default ForgotPassword;
