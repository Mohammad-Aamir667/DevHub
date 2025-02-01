import axios from 'axios';
import React, { useEffect } from 'react'
import { BASE_URL } from '../utils/constants';
import { useDispatch, useSelector } from 'react-redux';
import { addRequest, removeRequest } from '../utils/requestSlice';

const Requests = () => {
          const dispatch = useDispatch();
        const requests = useSelector((store)=>store.requests);
      const reqLen = requests?.length;
         const handleReviewReview = async(status,_id)=>{
                   try{
                    const res = await axios.post(BASE_URL+"/request/review/"+status+"/"+_id,{},{
                        withCredentials:true,
                    });
                    dispatch(removeRequest(_id));

                }
                catch(err){
                    console.log(err);
                }
         }
      
          const getRequest = async()=>{
            try{
               const res = await axios.get(BASE_URL + "/user/requests/received",{
                withCredentials:true,
              });
             dispatch(addRequest(res.data?.connectionRequests));
              
            }
            catch(err){
                console.log(err);
            }
          }
    
   
  useEffect(()=>{
          getRequest();
  },[])
 if(!requests) return;
 if(requests?.length === 0) return(<div className="flex justify-center items-center mt-10 "> 
<h1 className = "text-xl font-semibold">No Request found</h1></div>)
return (
 
<div className="flex justify-center items-center flex-col mt-10 space-y-6"> 
<h1 className = "text-xl font-semibold">Requests({reqLen})</h1>

{requests.map((request) => {
   
    const {_id} = request;
 const { firstName, lastName, about, photoUrl } = request.fromUserId;
 return ( 
   
   <div key={request._id} className="w-[70%]">
     <div className="card card-compact flex-row bg-black shadow-xl mx-auto px-3">
       <figure>
         <img src={photoUrl} alt="user-photo" className="w-24 h-24 rounded-full" />
       </figure>
       <div className="card-body">
         <h2 className="card-title">{firstName + " " + lastName}</h2>
         <p>{about}</p>
         <div className="card-actions justify-end">
         <button onClick = {()=>handleReviewReview("rejected",_id)} class="btn btn-secondary">Reject</button>
         <button onClick = {()=>handleReviewReview("accepted",_id)} class="btn btn-accent">Accept</button>
         </div>
       </div>
     </div>
   </div>
 );
})}
</div> 

)
}

export default Requests