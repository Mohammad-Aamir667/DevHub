import axios from "axios";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { BASE_URL } from "../utils/constants";
import { addFeed } from "../utils/feedSlice";
import FeedCard from "./FeedCard";
import { Search } from "lucide-react";

const Feed = () => {
  const dispatch = useDispatch();
  const feedUsers = useSelector((store) => store.feed);

  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  const getFeed = async (page) => {
    try {
      setIsLoading(true);
      const res = await axios.get(`${BASE_URL}/feed?page=${page}`, {
        withCredentials: true,
      });

      if (res?.data?.length > 0) {
        dispatch(addFeed(res.data));
      } else {
        setHasMore(false);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (hasMore) {
      getFeed(page);
    }
  }, [page, hasMore]);

  const handleScroll = () => {
    if (
      window.innerHeight + document.documentElement.scrollTop >=
        document.documentElement.offsetHeight - 50 &&
      !isLoading &&
      hasMore
    ) {
      setPage((prevPage) => prevPage + 1);
    }
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isLoading, hasMore]);

  const filteredFeed = feedUsers?.filter((user) =>
    Object.values(user).some(
      (value) =>
        typeof value === "string" &&
        value.toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  return (
    <div className="min-h-screen bg-gray-900 py-8 px-4">
      <div className="fixed top-16 left-0 w-full bg-gray-800 shadow-md z-20 p-3">
        <div className="max-w-3xl mx-auto relative">
          <input
            type="text"
            placeholder="Search developers..."
            className="w-full p-2 pl-10 bg-gray-700 text-white border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Search
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
            size={20}
          />
        </div>
      </div>

      <div className="mt-28 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {filteredFeed?.length > 0 ? (
          filteredFeed.map((feedUser) => (
            <FeedCard key={feedUser?._id} feedUser={feedUser} />
          ))
        ) : (
          <p className="text-center text-gray-400 col-span-full">
            No developers found.
          </p>
        )}
      </div>

      {isLoading && (
        <div className="text-center text-gray-400 mt-8">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
          <p className="mt-2">Loading more developers...</p>
        </div>
      )}
      {!hasMore && (
        <div className="text-center text-gray-400 mt-8">
          No more developers to display.
        </div>
      )}
    </div>
  );
};

export default Feed;
