import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { removeFeed } from "../utils/feedSlice";
import axios from "axios";
import { BASE_URL } from "../utils/constants";
import { useNavigate } from "react-router-dom";
import { UserX, UserCheck, User } from "lucide-react";
import { Tooltip } from "react-tooltip";

const FeedCard = ({ feedUser }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const loggedInUser = useSelector((store) => store.user);
  const fromUserId = loggedInUser?._id;
  
  const [confirmAction, setConfirmAction] = useState(null);

  const { firstName, lastName, photoUrl, skills, _id } = feedUser;

  const viewProfile = (feedUser) => {
    navigate(`/view-profile`, { state: { userProfile: feedUser } });
  };

  const requestSend = async (status) => {
    try {
      await axios.post(`${BASE_URL}/request/send/${status}/${_id}`, { fromUserId }, { withCredentials: true });
      dispatch(removeFeed(_id));
      setConfirmAction(null); 
    } catch (err) {
      console.error(err);
    }
  };

  return (
    feedUser && (
      <div className="bg-gray-900 shadow-lg rounded-lg overflow-hidden transition-all duration-300 hover:shadow-xl border border-gray-800 h-64 flex flex-col justify-between">
        <div onClick={() => viewProfile(feedUser)} className="cursor-pointer flex-1 flex flex-col">
          <div className="relative h-20 bg-gradient-to-r from-gray-800 to-gray-900">
            <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 w-14 h-14 rounded-full border-4 border-gray-900 shadow-md overflow-hidden">
              {photoUrl ? (
                <img src={photoUrl || "/placeholder.svg"} alt={`${firstName} ${lastName}`} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full bg-gray-700 flex items-center justify-center">
                  <User className="w-7 h-7 text-gray-300" />
                </div>
              )}
            </div>
          </div>

          <div className="pt-6 px-4 pb-3 text-center flex-1 flex flex-col justify-center">
            <h2 className="text-sm font-semibold text-gray-100">{firstName} {lastName}</h2>
            <div className="mt-2 mb-2 mx-auto w-10 h-0.5 bg-gray-700 rounded-full"></div>
            <div className="h-10 text-xs text-gray-300 overflow-hidden">
              {skills?.length > 0 ? (
                <p className="line-clamp-2 text-center">
                  {skills.slice(0, 6).join(", ")}
                  {skills.length > 6 && " ..."}
                </p>
              ) : (
                <p className="text-gray-400"></p>
              )}
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="px-4 py-2 flex justify-center gap-4 border-t border-gray-800 bg-gray-900">
          <button
            onClick={() => setConfirmAction("ignored")}
            className="p-2 rounded-md bg-gray-800 hover:bg-gray-700 transition flex items-center justify-center"
            aria-label="Ignore developer"
            data-tooltip-id={`ignore-tooltip-${_id}`}
          >
            <UserX size={18} className="text-gray-400 hover:text-red-500 transition" />
          </button>

          <button
            onClick={() => setConfirmAction("interested")}
            className="p-2 rounded-md bg-gray-800 hover:bg-gray-700 transition flex items-center justify-center"
            aria-label="Show interest in developer"
            data-tooltip-id={`interested-tooltip-${_id}`}
          >
            <UserCheck size={18} className="text-gray-400 hover:text-emerald-400 transition" />
          </button>

          <Tooltip id={`ignore-tooltip-${_id}`} place="top" effect="solid">
            Ignore
          </Tooltip>
          <Tooltip id={`interested-tooltip-${_id}`} place="top" effect="solid">
            Interested
          </Tooltip>
        </div>
        {confirmAction && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-gray-800 p-5 rounded-lg shadow-lg text-white w-80">
              <p className="text-center text-sm">Are you sure you want to {confirmAction === "ignored" ? "ignore" : "show interest in"} this user?</p>
              <div className="flex justify-center mt-4 space-x-4">
                <button
                  onClick={() => requestSend(confirmAction)}
                  className="bg-red-500 px-4 py-2 rounded hover:bg-red-600 transition"
                >
                  Confirm
                </button>
                <button
                  onClick={() => setConfirmAction(null)}
                  className="bg-gray-600 px-4 py-2 rounded hover:bg-gray-700 transition"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    )
  );
};

export default FeedCard;
