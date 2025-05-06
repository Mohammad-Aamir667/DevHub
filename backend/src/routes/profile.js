const express = require("express");
const { userAuth } = require("../middlewares/auth");
const { validateEditProfileData, validateEditExpertProfileData } = require("../utils/validation");
const profileRouter = express.Router();
const multer = require('multer'); 
const upload1 = multer({ dest: "uploadsResume/" });
const { uploadToCloudinary } = require("../utils/cloudinaryConfig");
const ExpertDetails = require("../models/expertDetails");
const upload = multer({ dest: 'uploadImage/' });

profileRouter.get("/profile",userAuth,async (req,res)=>{
  try{
     const loggedInUser = req.user; 
   return res.json(loggedInUser);
  }
  catch(err){
       res.status(500).json(err)
  }
});
profileRouter.post("/editProfile",userAuth,async (req,res)=>{
   try{
    if(!validateEditProfileData(req)){
  res.status(400).send("Invalid Edit Request");
}
   const loggedInUser = req.user;
   Object.keys(req.body).forEach((key)=>{
    loggedInUser[key] = req.body[key];
   });
   await loggedInUser.save();
   res.json(
   loggedInUser,
   )
}
catch (err) {
  res.status(500).send("Server error");
}

})
profileRouter.post("/uploadImage", userAuth, upload.single('file'), async (req, res) => {
  try {
    const user = req.user;
    const imageUrl = await uploadToCloudinary(req.file); // Reusing utility
    user.photoUrl = imageUrl;
    await user.save();
    res.json({ url: imageUrl });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

profileRouter.post("/edit-expert-profile",upload1.single("resumeUrl"),userAuth,async (req,res)=>{
  try{
   if(!validateEditExpertProfileData(req)){
    throw new Error("Invalid Edit Request");
}
  const expertId = req.user._id;
  const expertDetails = await ExpertDetails.findOne({ expertId: expertId });
  if(!expertDetails) return res.status(401).json("invalid request");
  
  if (req.file) {
    // Delete old resume from Cloudinary if exists
    // if (expertDetails.resumeUrl) {
    //   const publicId = extractPublicId(expertDetails.resumeUrl);
    //   await cloudinary.uploader.destroy(publicId);
    // }
  const resumeUrl = await uploadToCloudinary(req.file);
  expertDetails.resumeUrl = resumeUrl;
  }

  Object.keys(req.body).forEach((key)=>{
    if (key === "schedule") {
      expertDetails.schedule = JSON.parse(req.body.schedule);
    } else {
      expertDetails[key] = req.body[key];
    }
  });
  
 
   expertDetails.profileUpdated = true;
   await expertDetails.save();
  
    const filteredExpertDetails = await ExpertDetails.findOne({ expertId: expertId })
           .select("expertId expertise experienceYears description certifications linkedInProfile githubProfile portfolioUrl resumeUrl status profileUpdated languages");
   
         return res.status(200).json(filteredExpertDetails);
  
}
catch(err){
   res.status(400).send("ERROR" + err.message);
}

})

module.exports = profileRouter;