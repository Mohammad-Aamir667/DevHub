import { useDispatch, useSelector } from "react-redux";
import { removeFeed } from "../utils/feedSlice";
import axios from "axios";
import { BASE_URL } from "../utils/constants";
import { useNavigate } from "react-router-dom";
import { UserX, UserCheck } from "lucide-react";

const FeedCard = ({ feedUser }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const loggedInUser = useSelector((store) => store.user);
  const fromUserId = loggedInUser?._id;

  const { firstName, lastName, photoUrl, about, _id } = feedUser;

  const viewProfile = (feedUser) => {
    navigate(`/view-profile`, { state: { userProfile: feedUser } });
  };

  const requestSend = async (status) => {
    try {
      await axios.post(
        `${BASE_URL}/request/send/${status}/${_id}`,
        { fromUserId },
        {
          withCredentials: true,
        }
      );
      dispatch(removeFeed(_id));
    } catch (err) {
      console.error(err);
    }
  };

  return (
    feedUser && (
      <div className="bg-gray-800 shadow-lg rounded-lg overflow-hidden transition-transform duration-300 hover:scale-105 w-full sm:w-48">
        <div onClick={() => viewProfile(feedUser)} className="cursor-pointer">
          <div className="relative h-20 bg-gradient-to-r from-gray-500 to-gray-600">
            <img
              src={photoUrl || "/placeholder.svg"}
              alt={`${firstName} ${lastName}`}
              className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2 w-16 h-16 rounded-full border-4 border-gray-800 object-cover"
            />
          </div>
          <div className="pt-10 pb-2 px-2 text-center">
            <h2 className="text-sm font-semibold text-white mb-1">
              {firstName} {lastName}
            </h2>
            <p className="text-xs text-gray-400 mb-2 h-10 overflow-hidden">
              {about?.length > 40
                ? `${about.substring(0, 40)}...`
                : about || "No details provided"}
            </p>
          </div>
        </div>
        <div className="px-2 pb-2 flex justify-between gap-2">
          <button
            onClick={() => requestSend("ignored")}
            className="flex-1 bg-gray-700 text-gray-300 hover:bg-gray-600 px-2 py-1 rounded-full flex items-center justify-center text-xs transition-colors duration-300"
          >
            <UserX size={14} className="mr-1" />
            Ignore
          </button>
          <button
            onClick={() => requestSend("interested")}
            className="flex-1 bg-blue-600 text-white hover:bg-blue-700 px-2 py-1 rounded-full flex items-center justify-center text-xs transition-colors duration-300"
          >
            <UserCheck size={14} className="mr-1" />
            Interested
          </button>
        </div>
      </div>
    )
  );
};

export default FeedCard;
