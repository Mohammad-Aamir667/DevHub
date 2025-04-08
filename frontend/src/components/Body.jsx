import React, { useEffect } from 'react'
import NavBar from './NavBar'
import { Outlet, useLocation, useNavigate } from 'react-router-dom'
import axios from 'axios'
import {BASE_URL} from '../utils/constants'
import { useDispatch, useSelector } from 'react-redux'
import { addUser } from '../utils/userSlice'
import BottomNavigation from './BottomNav'
import { updateExpertStatus } from '../utils/expertDetailsSlice';

const Body = () =>{
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const user = useSelector((store)=>store.user);
  const expertDetails = useSelector((store) => store.expertDetails)
  const hideTopNavBarPaths = ["/chat-list","/chat-box",];
  const shouldTopHideNavBar = hideTopNavBarPaths.some((path)=>
    location.pathname.startsWith(path.replace(":id",""))
  );
  const hideBotNavBarPaths = ["/chat-box"];
  const shouldBotHideNavBar = hideBotNavBarPaths.some((path)=>
    location.pathname.startsWith(path.replace(":id",""))
  );
  const fetchUser = async ()=>{
    try{   
      const res = await axios.get(BASE_URL+"/profile",{
       withCredentials:true,
      });
    dispatch(addUser(res.data));
    
       }
       catch(err){
        console.log(err)
       if(err.status === 401)
        navigate("/login"); 
else alert(err.response?.data)
       }
  }
  const handleExpert = async ()=>{
    try{
     const getExpertDetails = await axios.get(BASE_URL + "/expert-details", { withCredentials: true });
        dispatch(updateExpertStatus(getExpertDetails.data));
    }
    catch(err){
      console.log(err)

    }
   
  }
  

useEffect(()=>{
  fetchUser();
  if(expertDetails.expertId === null )
  handleExpert();
},[expertDetails]);

 
  return (
    <div>
     { !shouldTopHideNavBar && <NavBar/>}
     <div className="flex-1  pb-20"> 
        <Outlet />
      </div>
   {!shouldBotHideNavBar && <BottomNavigation/>}
    </div>
  )
}

export default Body