import React, { useEffect } from 'react'
import NavBar from './NavBar'
import { Outlet, useNavigate } from 'react-router-dom'
import axios from 'axios'
import {BASE_URL} from '../utils/constants'
import { useDispatch, useSelector } from 'react-redux'
import { addUser } from '../utils/userSlice'
import BottomNavigation from './BottomNav'

const Body = () =>{
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((store)=>store.user);
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
},[])
 
  return (
    <div>
     <NavBar/>
     <div className="flex-1 pt-20 pb-20"> 
        <Outlet />
      </div>
     <BottomNavigation/>
    </div>
  )
}

export default Body