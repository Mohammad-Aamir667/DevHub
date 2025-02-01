const express = require("express");
const requestRouter = express.Router();
const {userAuth} = require("../middlewares/auth");
const User = require("../models/user")
const connectionRequest = require("../models/connectionRequest");
const user = require("../models/user");
requestRouter.post("/request/send/:status/:toUserId",userAuth,async (req,res)=>{
                try{ 
                   const fromUserId = req.user._id;
                  const toUserId = req.params.toUserId.trim();
                  ;
                  const status = req.params.status;
                  const allowedStatus = ["ignored","interested"];   
                  if(!allowedStatus.includes(status)){
                   return res.status(400).send("Invalid status type " + status)
                  };
                  const toUser = await User.findById(toUserId);
                  if(!toUser){
                  return res.status(400).send("User not found");
                  }
                  if (fromUserId.toString() === toUserId) {
                    return res.status(400).json({ error: "You cannot send a request to yourself." });
                  }
                  const existingConnectionRequest = await connectionRequest.findOne({
                    $or:[
                 {fromUserId,toUserId},
                 {fromUserId:toUserId,toUserId:fromUserId}
                    ],
                  });
                  if(existingConnectionRequest){
                  return res.status(400).send({
                      message:"connection request already exists!!!"
                    })
                  }
                  const newConnectionRequest = new connectionRequest({
                    fromUserId,toUserId,status,
                  });
                  const data = await newConnectionRequest.save();
                 return res.send(
                    "Connection Request sent successfully"
                  )
}
catch(err){
    res.status(400).send("something went wrong !!" + err.message);  

}
})
requestRouter.post("/request/review/:status/:requestId",userAuth,async(req,res)=>{
     try{
       const loggedInUser = req.user;
      const {status} = req.params;
      const requestId = req.params.requestId.trim();
      const allowedStatus = ["accepted","rejected"];
      if(!allowedStatus.includes(status)){
        return res.status(400).send("invalid status type "+ status)
        }
  const existingConnectionRequest
     = await connectionRequest.findOne({
         _id:requestId,
          toUserId:loggedInUser._id,
          status:"interested"
        })                            
        if(!existingConnectionRequest) {
            return res.status(400).json({
              message:"connection request not found"
            })
        }   
        existingConnectionRequest.status = status;
      const data = await existingConnectionRequest.save();
   
      res.send(" save successfully")
}
catch(err){
    console.error("Error reviewing request:", err);
    res.status(500).json({ err: "Internal Server Error" });

}
     

    

     




})    
module.exports = requestRouter; 