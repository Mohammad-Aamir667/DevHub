import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addUser } from '../utils/userSlice';
import { useNavigate } from 'react-router-dom';
import { BASE_URL } from '../utils/constants';
import { setInteractions } from '../utils/interactionSlice';

const Login = () => {
  const [emailId, setEmailId] = useState("ayat123@gmail.com");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoginForm, setIsLoginForm] = useState(true);
  const [password, setPassword] = useState("Ayat@123");
  const [error, setError] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((store) => store.user);

  // useEffect(() => {
  //   if (user ) {
  //     navigate('/');
  //   }
  // }, [user, navigate]);

  const handleLogin = async () => {
    try {
      const res = await axios.post(BASE_URL + "/login", {
        emailId,
        password,
      }, { withCredentials: true });
      dispatch(addUser(res.data));
     
      return navigate("/");
    } catch (err) {
      console.log(err);
      setError(err?.response?.data);
    }
  };

  const handleSignUp = async () => {
    if (password !== confirmPassword) {
      setError("Password and Confirm Password do not match");
      return;
    }
    try {
      const res = await axios.post(BASE_URL + "/signup", {
        firstName,
        lastName,
        emailId,
        password,
      }, { withCredentials: true });
      dispatch(addUser(res.data));
      return navigate("/profile");
    } catch (err) {
      console.log(err.message);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-dark-charcoal p-4">
      <div className="card bg-gray-800 w-full max-w-md shadow-xl rounded-xl">
        <div className="card-body p-6">
          <h2 className="card-title text-2xl font-bold text-soft-white mb-6">{isLoginForm ? "Login" : "Sign Up"}</h2>
          {!isLoginForm && (
            <>
              <label className="form-control w-full max-w-xs mb-4">
                <span className="label-text text-soft-white mb-1">First Name</span>
                <input
                  type="text"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  placeholder="Enter Your First Name"
                  className="input input-bordered w-full bg-gray-700 text-soft-white"
                />
              </label>
              <label className="form-control w-full max-w-xs mb-4">
                <span className="label-text text-soft-white mb-1">Last Name</span>
                <input
                  type="text"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  placeholder="Enter Your Last Name"
                  className="input input-bordered w-full bg-gray-700 text-soft-white"
                />
              </label>
            </>
          )}
          <label className="form-control w-full max-w-xs mb-4">
            <span className="label-text text-soft-white mb-1">Email ID</span>
            <input
              type="text"
              value={emailId}
              onChange={(e) => setEmailId(e.target.value)}
              placeholder="Enter your emailId"
              className="input input-bordered w-full bg-gray-700 text-soft-white"
            />
          </label>
          <label className="form-control w-full max-w-xs mb-4">
            <span className="label-text text-soft-white mb-1">Password</span>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              className="input input-bordered w-full bg-gray-700 text-soft-white"
            />
          </label>
          {!isLoginForm && (
            <label className="form-control w-full max-w-xs mb-4">
              <span className="label-text text-soft-white mb-1">Confirm Password</span>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm Password"
                className="input input-bordered w-full bg-gray-700 text-soft-white"
              />
            </label>
          )}
          {confirmPassword !== "" && password !== confirmPassword && (
            <p className="text-red-500 mb-4">Password does not match</p>
          )}
          <p className="text-red-500 mb-4">{error}</p>
          <div className="card-actions justify-center mt-6">
            <button
              onClick={isLoginForm ? handleLogin : handleSignUp}
              className="btn bg-vibrant-clay hover:bg-orange-600 text-soft-white w-full"
            >
              {isLoginForm ? "Login" : "Sign Up"}
            </button>
          </div>
          <div className="card-actions justify-center mt-4">
            {isLoginForm && (
              <p
                onClick={() => navigate("/forgot-password")}
                className="hover:cursor-pointer text-electric-blue hover:underline"
              >
                Forgot Password?
              </p>
            )}
          </div>
          <div className="card-actions justify-center mt-4">
            <p className="hover:cursor-pointer text-soft-white" onClick={() => setIsLoginForm((value) => !value)}>
              {isLoginForm ? "New User" : "Already registered"}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
};

export default Login;
