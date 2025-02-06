import React, { useEffect } from 'react'
import NavBar from './NavBar'
import { Outlet, useLocation, useNavigate } from 'react-router-dom'
import axios from 'axios'
import {BASE_URL} from '../utils/constants'
import { useDispatch, useSelector } from 'react-redux'
import { addUser } from '../utils/userSlice'
import BottomNavigation from './BottomNav'
import { updateExpertStatus } from '../utils/expertDetailsSlice';
import { setInteractions } from '../utils/interactionSlice';
import { setAcceptedRequests, setExpertInteractions, setPendingRequests, setResolvedRequests } from '../utils/expertInteractionslice';

const Body = () =>{
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const user = useSelector((store)=>store.user);
  const hideNavBarPaths = ["/chat-list","/chat-box"];
  const shouldHideNavBar = hideNavBarPaths.some((path)=>
    location.pathname.startsWith(path.replace(":id",""))
  );
  const fetchUser = async ()=>{
     if(user) return;
    try{   
      const res = await axios.get(BASE_URL+"/profile",{
       withCredentials:true,
      });
      console.log(res.data)
    dispatch(addUser(res.data));
    
       }
       catch(err){
        console.log(err)
       if(err.status === 401)
        navigate("/login"); 
else alert(err.response.data)
       }
  }
  

useEffect(()=>{
  fetchUser(); 
 
},[]);

 
  return (
    <div>
     { !shouldHideNavBar && <NavBar/>}
     <div className="flex-1 pt-8 pb-20"> 
        <Outlet />
      </div>
     <BottomNavigation/>
    </div>
  )
}

export default Body