const express = require("express");
const interactionRouter = express.Router();
const {userAuth} = require("../middlewares/auth");
const ExpertDetails = require("../models/expertDetails");
const Interaction = require("../models/interaction");
const EXPERT_SAFE_DATA = "firstName lastName age gender about skills photoUrl";
const USER_SAFE_DATA = "firstName lastName age photoUrl";
interactionRouter.post("/request-help/:expertId", userAuth, async (req, res) => {
  try {
    const userId = req.user._id;
    const expertId = req.params.expertId.trim();
    const { issueDescription, codeSnippet } = req.body;

    if (!issueDescription) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    if (userId.toString() === expertId.toString()) {
      return res.status(400).json({ error: "You cannot send a request to yourself." });
    }

    const expert = await ExpertDetails.findOne({ expertId });
    if (!expert) {
      return res.status(400).send("Expert not found");
    }

    const existingHelpRequest = await Interaction.findOne({
      userId,
      expertId,
      status: "pending",
      
    });
    console.log("Existing Help Request:", existingHelpRequest);

    if (existingHelpRequest) {
      return res.status(400).send({
        message: "Request help already exists!!!",
      });
    }

    const newInteraction = new Interaction({
      userId,
      expertId,
      issueDescription,
      codeSnippet,
      status: "pending",
      expertDetailsId:expert._id,
    });
    await newInteraction.save();
    const data = await Interaction.findById(newInteraction._id)
    .populate("expertId", "firstName lastName photoUrl");

    console.log("Response Data:", data); // Log the response data here
    res.status(201).json(data);
  } catch (err) {
    console.error("Error creating interaction:", err);
    res.status(500).json({ err: "Internal Server Error" });
  }
});

interactionRouter.post("/request-review/:status/:requestId",userAuth,async(req,res)=>{
      try{
      const expert = req.user;
      const {status} = req.params;
      const requestId = req.params.requestId.trim();
      const allowedStatus = ["accepted","declined"];
      if(!allowedStatus.includes(status)){
        return res.status(400).send("invalid status type "+ status)
        }
  const existingHelpRequest
     = await Interaction.findOne({
          _id:requestId,
          expertId:expert._id,
          status:"pending"
        }).populate("userId",USER_SAFE_DATA);                            
        if(!existingHelpRequest) {
            return res.status(400).json({
              message:"connection request not found"
            })
        }   
       
      existingHelpRequest.status = status;
      const data = await existingHelpRequest.save();
      res.status(200).json(data);
    }
    catch(err){
        console.error("Error reviewing request:", err);
        res.status(500).json( err);
    }

 
}) 
interactionRouter.get("/user-interactions", userAuth, async (req, res) => {
  try {
    const userId = req.user._id;

    const allInteractions = await Interaction.find({ userId }).populate("expertId", "firstName lastName photoUrl " );

    res.status(200).json(allInteractions);
  } catch (err) {
    console.error("Error fetching all interactions:", err);
    res.status(500).json( err);
  }
});
interactionRouter.get("/expert/pending-requests",userAuth,async(req,res)=>{
                   try{
                      const expertId = req.user._id;
                      const expertPendingRequets = await Interaction.find({expertId,status:"pending"}).populate("userId",USER_SAFE_DATA);
                      return res.status(200).json(expertPendingRequets);
                   }
                   catch(err){
                    console.error("Error fetching pending interactions:", err);
                    res.status(500).json({ err: "Internal Server Error" });
                   }
})
interactionRouter.get("/expert/accepted-requests",userAuth,async(req,res)=>{
  try{
     const expertId = req.user._id;
     const expertAcceptedRequests = await Interaction.find({expertId,status:"accepted"}).populate("userId",USER_SAFE_DATA);
     return res.status(200).json(expertAcceptedRequests);
  }
  catch(err){
   console.error("Error fetching accepted interactions:", err);
   res.status(500).json({ err: "Internal Server Error" });
  }
})
interactionRouter.get("/expert/all-requests",userAuth,async(req,res)=>{
  try{
     const expertId = req.user._id;
     const expertAllRequets = await Interaction.find({expertId}).populate("userId",USER_SAFE_DATA);
     return res.status(200).json(expertAllRequets);
  }
  catch(err){
   console.error("Error fetching all interactions:", err);
   res.status(500).json({ err: "Internal Server Error" });
  }
})
interactionRouter.post("/request-resolved/:requestId",userAuth,async(req,res)=>{
  try{
  const expert = req.user;
  const requestId = req.params.requestId.trim();
const existingHelpAccepted
 = await Interaction.findOne({
      _id:requestId,
      expertId:expert._id,
      status:"accepted"
    }).populate("userId",USER_SAFE_DATA);                            
    if(!existingHelpAccepted) {
        return res.status(400).json({
          message:"Help request not found"
        })
    }   
   
    existingHelpAccepted.status = "resolved";
  const data = await existingHelpAccepted.save();
  res.status(200).json(data);
}
catch(err){
    console.error("Error resolving request:", err);
    res.status(500).json( err);
}


}) 
interactionRouter.get("/expert/resolved-requests",userAuth,async(req,res)=>{
  try{
     const expertId = req.user._id;
     const resolvedRequests = await Interaction.find({expertId,status:"resolved"}).populate("userId",USER_SAFE_DATA);
     return res.status(200).json(resolvedRequests);
  }
  catch(err){
   console.error("Error fetching resolved interactions:", err);
   res.status(500).json({ err: "Internal Server Error" });
  }
})


module.exports = interactionRouter; 