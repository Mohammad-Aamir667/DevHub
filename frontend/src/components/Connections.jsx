import axios from 'axios'
import React, { useEffect } from 'react'
import { BASE_URL } from '../utils/constants'
import { useDispatch, useSelector } from 'react-redux'
import { addConnections } from '../utils/connectionSlice'
import { useNavigate } from 'react-router-dom'

const Connections = () => {
    const connections = useSelector((store) => store.connections);
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const viewProfile = (connection) => {
      navigate(`/view-profile`, { state: {userProfile: connection } });
    };
    const getConnections = async ()=>{
      try{
         const res = await axios.get(BASE_URL+"/user/connection",{
            withCredentials:true
        });
        dispatch(addConnections(res?.data))
      }  
  catch(err){
      console.log(err.message);
  }}
    useEffect(()=>{
        getConnections();
    },[])
       if(!connections) return;
       if(connections?.length === 0) return(<div>No Connection found!</div>)
  return (
      
    <div className="flex justify-center items-center flex-col mt-10 space-y-6"> 
    <h1 className = "text-xl font-semibold">Connections</h1>
    {connections.data.map((connection) => {
      const { firstName, lastName, about, photoUrl } = connection;
      return (
        <div key={connection._id} className="w-[70%]">
  
          <div className="card card-compact flex-row bg-black shadow-xl mx-auto">
          <button onClick = {()=>{navigate(-1)}} className="flex  text-darkPurple hover:text-electricBlue  rounded-lg px-4 pt-3 focus:outline-none transition duration-200">
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={2}
    stroke="currentColor"
    className="w-5 h-5 mr-2"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M15 19l-7-7 7-7"
    />
  </svg>
</button>
            <figure>
              <img src={photoUrl} alt="user-photo" className="w-16 h-16 rounded-full mx-2" />
            </figure>
            <div className="card-body">
              <h2 className="card-title">{firstName + " " + lastName}</h2>
              <p>{about}</p>
              <div className="card-actions justify-end">
                <button onClick={() => viewProfile(connection)} className="btn btn-sm">View Profile</button>
              </div>
            </div>
          </div>
        </div>
      );
    })}
  </div>
  
  )
}

export default Connections