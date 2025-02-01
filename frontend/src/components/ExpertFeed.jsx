import React, { useEffect } from 'react'
import { BASE_URL } from '../utils/constants'
import { useDispatch, useSelector } from 'react-redux'
import axios from 'axios';
import ExpertFeedCard from './ExpertFeedCard';
import { addExpertFeed } from '../utils/expertFeedSlice';
import { Link } from 'react-router-dom';

const ExpertFeed = () => {
    const dispatch = useDispatch();
    const expertFeed = useSelector((store)=>store.expertFeed);
     const getExperts = async ()=>{
       try{ 
        const res = await axios.get(BASE_URL+ "/expert-list/approved",{
            withCredentials:true
        });
        dispatch(addExpertFeed(res?.data))
    }
     catch(err){
        console.log(err); 
     }
     }
     useEffect(()=>{
        getExperts();
     },[])

  return expertFeed && (
    <div className="min-h-screen bg-gradient-to-b from-lightGray to-softWhite py-6 ">
   <Link to={"/view-requests?role=user"}>View Requests (Expert)</Link>
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-2">
    {expertFeed.map((expertDetails) => (
               <ExpertFeedCard key = {expertDetails._id} expertDetails ={expertDetails} />
        ))}
    </div>
  </div>
  )
}

export default ExpertFeed