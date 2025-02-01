import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { removeFeed } from '../utils/feedSlice';
import axios from 'axios';
import { BASE_URL } from '../utils/constants';
import { useNavigate } from 'react-router-dom';


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

  return feedUser && (
    <div
      className="bg-gray-700 shadow-lg rounded-lg mx-auto relative overflow-hidden"
      style={{ width: '100%', height: '350px' }}
    >
      <div onClick={() => viewProfile(feedUser)} className="absolute top-5 w-full">
        <img
          src={photoUrl}
          alt="user-photo"
          className="w-28 h-28 rounded-full mx-5"
          style={{ objectFit: 'cover' }}
        />
        <h2 className="text-lg font-semibold text-soft-white mx-5 mt-4">
          {firstName} {lastName}
        </h2>
      </div>
      <div
        className="absolute top-[190px] w-full mx-5"
        style={{ transform: 'translateY(-50%)' }}
      >
        <p className="text-sm text-light-gray">
          {about?.length > 60 ? `${about.substring(0, 60)}...` : about || 'No details provided'}
        </p>
      </div>
      <div className="absolute bottom-4 w-full px-3 flex justify-between gap-3">
        <button
          onClick={() => requestSend('ignored')}
          className="bg-purple-600 text-soft-white hover:bg-purple-700 px-2 py-2 rounded-full w-full"
        >
          Ignore
        </button>
        <button
          onClick={() => requestSend('interested')}
          className="bg-cyan-500 text-soft-white hover:bg-cyan-600 px-2 py-2 rounded-full w-full"
        >
          Interested
        </button>
      </div>
    </div>
  );
};

export default FeedCard;


;
