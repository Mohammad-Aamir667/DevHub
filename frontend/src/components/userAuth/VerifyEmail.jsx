import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { BASE_URL } from "../../utils/constants";
import { useDispatch } from "react-redux";
import { addUser } from "../../utils/userSlice";

const VerifyEmail = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [otp, setOtp] = useState("");

    const handleVerify = async (e) => {
        e.preventDefault();
        if (otp.length !== 6) return;

        try {
            const res = await axios.post(
                BASE_URL + "/verify-email",
                { otp },  // No need to send email here since it's in cookies/session
                { withCredentials: true }
            );

            toast.success("Email verified successfully!");
            dispatch(addUser(res.data));
            navigate("/");
        } catch (err) {
            toast.error(err?.response?.data || "Invalid OTP");
        }
    };

    return (
        <div className="flex justify-center items-center min-h-screen bg-dark-charcoal p-4">
            <div className="card bg-gray-800 w-full max-w-md shadow-xl rounded-xl">
                <div className="card-body p-6">
                    <h2 className="card-title text-2xl font-bold text-soft-white mb-4 text-center">
                        Verify Your Email
                    </h2>

                    <p className="text-soft-white text-center mb-6">
                        We’ve sent a 6-digit verification code to your email.
                    </p>

                    <form onSubmit={handleVerify} className="space-y-5">
                        <input
                            type="text"
                            value={otp}
                            onChange={(e) => setOtp(e.target.value)}
                            maxLength={6}
                            placeholder="Enter 6-digit OTP"
                            className="input input-bordered w-full bg-gray-700 text-soft-white text-center text-lg tracking-widest"
                        />

                        <button
                            type="submit"
                            disabled={otp.length !== 6}
                            className="btn bg-vibrant-clay hover:bg-orange-600 text-soft-white w-full disabled:bg-gray-600"
                        >
                            Verify Email
                        </button>
                    </form>

                    <p
                        onClick={() => navigate("/login")}
                        className="text-electric-blue hover:underline text-center mt-6 cursor-pointer"
                    >
                        Back to Login
                    </p>
                </div>
            </div>
        </div>
    );
};

export default VerifyEmail;
