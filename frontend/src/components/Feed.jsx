import axios from "axios";
import React, { useEffect, useState, useRef, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { BASE_URL } from "../utils/constants";
import { addFeed } from "../utils/feedSlice";
import FeedCard from "./FeedCard";

const Feed = () => {
  const dispatch = useDispatch();
  const feedUsers = useSelector((store) => store.feed);

  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1); // Track the current page
  const [isLoading, setIsLoading] = useState(false); // Prevent duplicate API calls
  const [hasMore, setHasMore] = useState(true); // Check if there's more data to load

  const getFeed = async (page) => {
    try {
      setIsLoading(true); // Start loading
      const res = await axios.get(`${BASE_URL}/feed?page=${page}`, {
        withCredentials: true,
      });

      if (res?.data?.length > 0) {
        dispatch(addFeed(res.data)); // Only add new data
      } else {
        setHasMore(false); // No more data
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false); // Stop loading
    }
  };

  useEffect(() => {
    if (hasMore) {
      getFeed(page);
    }
  }, [page]); // Trigger whenever `page` changes

  const handleScroll = () => {
    if (
      window.innerHeight + document.documentElement.scrollTop >=
        document.documentElement.offsetHeight - 50 &&
      !isLoading &&
      hasMore
    ) {
      setPage((prevPage) => prevPage + 1); // Load next page
    }
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll); // Cleanup
  }, [isLoading, hasMore]);

  const filteredFeed = feedUsers?.filter((user) =>
    Object.values(user).some(
      (value) =>
        typeof value === "string" &&
        value.toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-lightGray to-softWhite py-8 px-4">
      {/* Fixed Search Bar */}
      <div className="fixed top-16 left-0 w-full bg-white shadow-md z-20 p-3">
        <input
          type="text"
          placeholder="Search developers..."
          className="w-full p-2 border border-gray-300 rounded-md"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Feed Content */}
      <div className="mt-14 grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5">
        {filteredFeed?.map((feedUser) => (
          <FeedCard key={feedUser?._id} feedUser={feedUser} />
        ))}
      </div>

      {isLoading && (
        <div className="text-center text-gray-500 mt-5">Loading more...</div>
      )}
      {!hasMore && (
        <div className="text-center text-gray-500 mt-5">No more developers.</div>
      )}
    </div>
  );
};

export default Feed;
