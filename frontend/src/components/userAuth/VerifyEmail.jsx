import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { BASE_URL } from "../../utils/constants";
import { useDispatch } from "react-redux";
import { addUser } from "../../utils/userSlice";

const VerifyEmail = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [otp, setOtp] = useState("");
    const [loading, setLoading] = useState(false);
    const location = useLocation();
    const emailId = location.state?.emailId;

    // If no email passed via navigation, redirect to login
    useEffect(() => {
        if (!emailId) {
            toast.warn("Session expired. Please sign up again.");
            navigate("/login");
        }
    }, [emailId, navigate]);

    const handleVerify = async (e) => {
        e.preventDefault();
        if (otp.length !== 6 || !emailId) return;

        setLoading(true);
        try {
            const res = await axios.post(
                `${BASE_URL}/verify-email`,
                { otp, emailId },
                { withCredentials: true }
            );

            // ✅ Success — backend sends user data directly
            toast.success("Email verified successfully!");
            dispatch(addUser(res.data));
            navigate("/");

        } catch (err) {
            console.log("Verify Email Error:", err);
            const msg =
                err.response?.data?.message ||
                "Unable to verify your email. Please try again.";
            toast.error(msg);
        } finally {
            setLoading(false);
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
                            onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))} // only digits
                            maxLength={6}
                            placeholder="Enter 6-digit OTP"
                            className="input input-bordered w-full bg-gray-700 text-soft-white text-center text-lg tracking-widest"
                        />

                        <button
                            type="submit"
                            disabled={otp.length !== 6 || loading}
                            className="btn bg-vibrant-clay hover:bg-orange-600 text-soft-white w-full disabled:bg-gray-600"
                        >
                            {loading ? "Verifying..." : "Verify Email"}
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
