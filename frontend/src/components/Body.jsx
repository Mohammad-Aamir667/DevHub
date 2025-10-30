import React, { useEffect, useState } from 'react'
import TopNavBar from './navigation/TopNavBar'
import { Outlet, useLocation, useNavigate } from 'react-router-dom'
import axios from 'axios'
import { BASE_URL } from '../utils/constants'
import { useDispatch, useSelector } from 'react-redux'
import { addUser } from '../utils/userSlice'
import BottomNavigation from './navigation/BottomNav'
import { updateExpertStatus } from '../utils/expertDetailsSlice';
import { Loader2 } from 'lucide-react'

const Body = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const user = useSelector((store) => store.user);
  const expertDetails = useSelector((store) => store.expertDetails)
  const [loading, setLoading] = useState(true);

  const hideTopNavBarPaths = ["/chat-list", "/chat-box", "/expert-dashboard"];
  const shouldTopHideNavBar = hideTopNavBarPaths.some((path) =>
    location.pathname.startsWith(path.replace(":id", ""))
  );
  const hideBotNavBarPaths = ["/chat-box", "/create-group-chat"];
  const shouldBotHideNavBar = hideBotNavBarPaths.some((path) =>
    location.pathname.startsWith(path.replace(":id", ""))
  );
  const authNotRequiredPaths = ["/forgot-password", "/reset-password", "/login", "/signup", "/verify-email"];
  const fetchUser = async () => {

    try {
      const res = await axios.get(BASE_URL + "/profile", {
        withCredentials: true,
      });
      dispatch(addUser(res.data));

    }
    catch (err) {
      if (err?.response?.status === 401) {
        navigate("/login");
      } else {
        console.log("Fetch user error", err);
      }
    } finally {
      setLoading(false);
    }
  }
  const handleExpert = async () => {
    try {
      const getExpertDetails = await axios.get(BASE_URL + "/expert-details", { withCredentials: true });
      dispatch(updateExpertStatus(getExpertDetails.data));
    }
    catch (err) {
      console.log(err)

    }

  }


  useEffect(() => {
    if (user) {
      handleExpert();
    }
  }, [user]);

  useEffect(() => {
    if (authNotRequiredPaths.includes(location.pathname)) {
      setLoading(false);
      return;
    }
    if (location.pathname === "/" && !user) {
      setLoading(true);
      fetchUser();
    } else if (!user) {
      fetchUser();
    }
  }, [location.pathname]);



  if (loading) return (<div className="text-center py-8 flex flex-col items-center">
    <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
    <p className="mt-3 text-gray-300 font-medium">Loading...</p>
  </div>
  )

  return (
    <div>
      {!shouldTopHideNavBar && <TopNavBar />}
      <div className={`flex-1 ${!shouldBotHideNavBar ? "pb-14" : ""}`}>
        <Outlet />
      </div>
      {!shouldBotHideNavBar && <BottomNavigation />}
    </div>
  )
}

export default Body
