import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { BASE_URL } from "../utils/constants";
import { removeUser } from "../utils/userSlice";
import axios from "axios";
import { removerExpertInteractions } from "../utils/expertInteractionslice";
import { clearFeed } from "../utils/feedSlice";
import { clearExpertData } from "../utils/expertDetailsSlice";

const NavBar = () => {
  const user = useSelector((store) => store.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const expertDetails = useSelector((store) => store.expertDetails);

  // Example notification count (replace with actual state if using Redux or backend integration)
  const notifications = useSelector((store) => store.notifications || []); // Assuming you have a notifications slice
  const unreadCount = notifications.filter((n) => !n.read).length;

  const handleLogout = async () => {
    try {
      await axios.post(BASE_URL + "/logout", {}, { withCredentials: true });
      dispatch(removeUser());
      dispatch(removerExpertInteractions());
      dispatch(clearFeed());
      dispatch(clearExpertData());
      return navigate("/login");
    } catch (err) {
      console.log(err);
      alert("Something went wrong");
    }
  };

  return (
    <div className="fixed z-30 navbar bg-vibrantClay text-white">
      <div className="flex-1">
        <Link to="/" className="btn btn-ghost text-xl text-gray-700">
          Dev Tinder
        </Link>
      </div>
      <div className="flex-none gap-4">
        {user && (
          <div className="flex items-center gap-4">
            {/* Notification Badge */}
            <div className="relative">
              <Link to="/notifications" className="btn btn-ghost btn-circle">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6 6 0 10-12 0v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0a3 3 0 01-6 0m6 0H9"
                  />
                </svg>
                {unreadCount > 0 && (
                  <span className="absolute top-0 right-0 inline-flex items-center justify-center w-5 h-5 text-xs font-bold text-white bg-red-500 rounded-full">
                    {unreadCount}
                  </span>
                )}
              </Link>
            </div>

            {/* User Dropdown */}
            <div className="dropdown dropdown-end">
              <div
                tabIndex={0}
                role="button"
                className="btn btn-ghost btn-circle avatar mx-6"
              >
                <div className="relative w-10 h-10 rounded-full overflow-hidden border border-gray-300">
                  <img
                    alt="User Avatar"
                    src={user?.photoUrl}
                    className="object-cover w-full h-full"
                  />
                </div>
              </div>
              <ul
                tabIndex={0}
                className="menu menu-sm dropdown-content bg-black rounded-box z-[1] mt-3 w-52 p-2 shadow"
              >
                <li>
                  <Link to="/profile" className="justify-between">
                    Profile
                    <span className="badge">New</span>
                  </Link>
                </li>

                <li>
                  <Link to="/requests">Requests</Link>
                </li>
                {!expertDetails?.expertId &&
                  expertDetails?.status !== "approved" && (
                    <li>
                      <Link to="/expert-application-form">
                        Apply for Expert
                      </Link>
                    </li>
                  )}
                {expertDetails?.expertId &&
                  expertDetails?.status === "approved" && (
                    <li>
                      <Link to="/expert-dashboard">Go to Expert Dashboard</Link>
                    </li>
                  )}
                <li>
                  <a onClick={handleLogout}>Logout</a>
                </li>
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default NavBar;
