"use client"

import { useDispatch, useSelector } from "react-redux"
import { removeFeed } from "../utils/feedSlice"
import axios from "axios"
import { BASE_URL } from "../utils/constants"
import { useNavigate } from "react-router-dom"
import { UserX, UserCheck, User } from "lucide-react"

const FeedCard = ({ feedUser }) => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const loggedInUser = useSelector((store) => store.user)
  const fromUserId = loggedInUser?._id

  const { firstName, lastName, photoUrl, about, _id } = feedUser

  const viewProfile = (feedUser) => {
    navigate(`/view-profile`, { state: { userProfile: feedUser } })
  }

  const requestSend = async (status) => {
    try {
      await axios.post(
        `${BASE_URL}/request/send/${status}/${_id}`,
        { fromUserId },
        {
          withCredentials: true,
        },
      )
      dispatch(removeFeed(_id))
    } catch (err) {
      console.error(err)
    }
  }

  return (
    feedUser && (
      <div className="bg-gray-800 shadow-lg rounded-xl overflow-hidden transition-all duration-300 hover:scale-102 hover:shadow-xl border border-gray-700 h-full flex flex-col">
        <div onClick={() => viewProfile(feedUser)} className="cursor-pointer flex-1 flex flex-col">
          <div className="relative h-16 sm:h-20 bg-gradient-to-r from-gray-700 to-gray-800">
            {photoUrl ? (
              <img
                src={photoUrl || "/placeholder.svg"}
                alt={`${firstName} ${lastName}`}
                className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2 w-14 h-14 sm:w-16 sm:h-16 rounded-full border-3 border-gray-800 object-cover shadow-md"
              />
            ) : (
              <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2 w-14 h-14 sm:w-16 sm:h-16 rounded-full border-3 border-gray-800 bg-gray-600 flex items-center justify-center shadow-md">
                <User className="w-7 h-7 text-gray-300" />
              </div>
            )}
          </div>

          <div className="pt-10 sm:pt-12 pb-3 px-2 sm:px-3 text-center flex-1 flex flex-col">
            <h2 className="text-xs sm:text-sm font-semibold text-white mb-1 line-clamp-1">
              {firstName} {lastName}
            </h2>
            <div className="mt-1 mb-2 mx-auto w-8 h-0.5 bg-gray-600 rounded-full"></div>
            <p className="text-xs text-gray-300 line-clamp-2 flex-1">{about || "No details provided"}</p>
          </div>
        </div>

        <div className="px-2 pb-2 pt-1 flex justify-between gap-1 sm:gap-2 border-t border-gray-700">
          <button
            onClick={() => requestSend("ignored")}
            className="flex-1 bg-gray-700 text-gray-300 hover:bg-gray-600 px-1 py-1.5 rounded-md flex items-center justify-center text-[10px] sm:text-xs font-medium transition-colors duration-200"
            aria-label="Ignore developer"
          >
            <UserX size={12} className="mr-1" />
            Ignore
          </button>
          <button
            onClick={() => requestSend("interested")}
            className="flex-1 bg-blue-600 text-white hover:bg-blue-700 px-1 py-1.5 rounded-md flex items-center justify-center text-[10px] sm:text-xs font-medium transition-colors duration-200"
            aria-label="Show interest in developer"
          >
            <UserCheck size={12} className="mr-1" />
            Interested
          </button>
        </div>
      </div>
    )
  )
}

export default FeedCard

