import { useDispatch, useSelector } from "react-redux"
import { removeFeed } from "../utils/feedSlice"
import axios from "axios"
import { BASE_URL } from "../utils/constants"
import { useNavigate } from "react-router-dom"
import { UserX, UserCheck } from "lucide-react"

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
      <div className="bg-white dark:bg-gray-800 shadow-lg rounded-lg overflow-hidden transition-all duration-300 hover:shadow-xl hover:scale-105">
        <div onClick={() => viewProfile(feedUser)} className="cursor-pointer">
          <div className="relative h-24 bg-gradient-to-r from-blue-500 to-purple-600">
            <img
              src={photoUrl || "/placeholder.svg"}
              alt={`${firstName} ${lastName}`}
              className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2 w-20 h-20 rounded-full border-4 border-white dark:border-gray-800 object-cover shadow-lg"
            />
          </div>
          <div className="pt-12 pb-4 px-4 text-center">
            <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-1">
              {firstName} {lastName}
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-300 mb-4 h-12 overflow-hidden">
              {about?.length > 60 ? `${about.substring(0, 60)}...` : about || "No details provided"}
            </p>
          </div>
        </div>
        <div className="px-4 pb-4 flex justify-between gap-2">
          <button
            onClick={() => requestSend("ignored")}
            className="flex-1 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600 px-3 py-2 rounded-full flex items-center justify-center text-sm transition-colors duration-300"
          >
            <UserX size={16} className="mr-2" />
            Ignore
          </button>
          <button
            onClick={() => requestSend("interested")}
            className="flex-1 bg-blue-600 text-white hover:bg-blue-700 px-3 py-2 rounded-full flex items-center justify-center text-sm transition-colors duration-300"
          >
            <UserCheck size={16} className="mr-2" />
            Interested
          </button>
        </div>
      </div>
    )
  )
}

export default FeedCard

