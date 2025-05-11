"use client"

import axios from "axios"
import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { BASE_URL } from "../utils/constants"
import { addFeed } from "../utils/feedSlice"
import FeedCard from "./FeedCard"
import { Loader2, Search } from "lucide-react"
import { handleAxiosError } from "../utils/handleAxiosError"

const Feed = () => {
  const dispatch = useDispatch()
  const feedUsers = useSelector((store) => store.feed)
  const [searchTerm, setSearchTerm] = useState("")
  const [page, setPage] = useState(1)
  const [isLoading, setIsLoading] = useState(false)
  const [hasMore, setHasMore] = useState(true)
  const [error, setError] = useState(false)
  const getFeed = async (page) => {
    try {
      setError(false) 
      setIsLoading(true)
      const res = await axios.get(`${BASE_URL}/feed?page=${page}`, {
        withCredentials: true,
      })
      if (res?.data?.length > 0) {
        dispatch(addFeed(res.data))
      } else {
        setHasMore(false)
      }
    } catch (err) {
     setError(true) 
           handleAxiosError(err, {},[401],"connection-error-toast");
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    if (hasMore) {
      getFeed(page)
    }
  }, [page, hasMore])
 
  const handleScroll = () => {
    if (
      window.innerHeight + document.documentElement.scrollTop >= document.documentElement.offsetHeight - 50 &&
      !isLoading &&
      hasMore
    ) {
      setPage((prevPage) => prevPage + 1)
    }
   
  }

  useEffect(() => {
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [isLoading, hasMore])

  const filteredFeed = feedUsers?.filter((user) =>
    Object.values(user).some(
      (value) => typeof value === "string" && value.toLowerCase().includes(searchTerm.toLowerCase()),
    ),
  )
  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-950 to-slate-900 flex items-center justify-center px-4">
        <div className="bg-slate-800 border border-slate-700 p-8 rounded-xl text-center max-w-md w-full">
          <h2 className="text-xl font-semibold text-red-400 mb-2">Failed to load feed</h2>
          <p className="text-slate-400 mb-4">Something went wrong while fetching your feed. Please try again.</p>
          <button
            onClick={getFeed}
            className="bg-gradient-to-r from-cyan-500 to-blue-600 text-white px-4 py-2 rounded-md font-medium hover:opacity-90 transition"
          >
            Retry
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-900 py-8 px-4 sm:px-6 mt-5 lg:px-8">
      <div className="fixed top-16 left-0 w-full bg-gray-800/95 backdrop-blur-sm shadow-lg z-20 py-4 px-4 sm:px-6 lg:px-8 border-b border-gray-700">
        <div className="max-w-4xl mx-auto relative">
          <div className="relative group">
            <Search
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 group-focus-within:text-blue-500 transition-colors duration-200"
              size={20}
            />
            <input
              type="text"
              placeholder="Search developers..."
              className="w-full p-3 pl-10 bg-gray-700/80 text-white border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto">
        <div className="mt-28 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
          {filteredFeed?.length > 0 ? (
            filteredFeed.map((feedUser) => <FeedCard key={feedUser?._id} feedUser={feedUser} />)
          ) : (
            <div className="col-span-full flex flex-col items-center justify-center py-16 px-4">
              <div className="bg-gray-800/50 rounded-xl p-8 text-center max-w-md">
                <Search className="mx-auto h-12 w-12 text-gray-500 mb-4" />
                <p className="text-xl font-medium text-gray-300 mb-2">No developers found</p>
                <p className="text-gray-400">
                  {searchTerm
                    ? "Try adjusting your search terms or filters"
                    : "Developers will appear here once they're available"}
                </p>
              </div>
            </div>
          )}
        </div>

        {isLoading && (
          <div className="text-center py-8 flex flex-col items-center">
            <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
            <p className="mt-3 text-gray-300 font-medium">Loading more developers...</p>
          </div>
        )}

        {!hasMore && filteredFeed?.length > 0 && (
          <div className="text-center py-10 border-t border-gray-800 mt-8">
            <p className="text-gray-400 font-medium">You've reached the end of the list</p>
            <p className="text-gray-500 text-sm mt-1">No more developers to display</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default Feed

