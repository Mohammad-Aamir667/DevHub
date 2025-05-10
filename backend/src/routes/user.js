const express = require("express")
const userRouter = express.Router();

const {userAuth} = require("../middlewares/auth");
const connectionRequest = require("../models/connectionRequest");
const User = require("../models/user");
const USER_SAFE_DATA = "firstName lastName age gender about skills photoUrl";
userRouter.get("/user/requests/received",userAuth,async(req,res)=>{
      try{
        const loggedInUser = req.user;
        const connectionRequests = await connectionRequest.find({
                 toUserId:loggedInUser._id,
                 status:"interested"
        }).populate("fromUserId",USER_SAFE_DATA).populate("toUserId",USER_SAFE_DATA);
        res.json({
             connectionRequests,
        })
      }       
      catch(err){
        console.error(err);
        res.status(500).send("Server error");
      }
})
userRouter.get("/user/connection",userAuth,async(req,res)=>{
      try{
       const loggedInUser = req.user;
       const connectionRequests = await connectionRequest.find({
        $or:[
            {toUserId:loggedInUser._id,status:"accepted"},
            {fromUserId:loggedInUser._id,status:"accepted"},
       ]
       }).populate("fromUserId",USER_SAFE_DATA).populate("toUserId",USER_SAFE_DATA);
       const data = connectionRequests.map((row)=>{
          if(row.fromUserId._id.toString() === loggedInUser._id.toString()){
            return row.toUserId;
          }
          return row.fromUserId;
       });
       res.json({data})
      }
      catch(err){
        console.error(err);
        res.status(500).send("Server error");
      }
})
userRouter.get("/feed",userAuth,async (req,res)=>{
   try{  
      const loggedInUser = req.user;
      const connectionRequests = await connectionRequest.find({
        $or :[
          {fromUserId:loggedInUser},
          {toUserId:loggedInUser}
        ]
      }).select("fromUserId toUserId");
      const hideUsersFromFeed = new Set();
      connectionRequests.forEach((req)=>{
               hideUsersFromFeed.add(req.fromUserId.toString());
               hideUsersFromFeed.add(req.toUserId.toString());
      });
      console.log(req.query);
      const page = parseInt(req.query.page)||1;
     
      let limit = parseInt(req.query.limit) || 10;
       limit = limit>10?10:limit;
       const skip = (page-1)*limit;
      const users = await User.find({
        $and:[
          {_id: {$nin:Array.from(hideUsersFromFeed)}},
          {_id:{$ne:loggedInUser._id}}
        ]
      }).select(USER_SAFE_DATA).skip(skip).limit(limit);
      res.json(users);
    }
    catch(err){
            res.status(500).json({message:err.message});
    }
})
module.exports = userRouter;