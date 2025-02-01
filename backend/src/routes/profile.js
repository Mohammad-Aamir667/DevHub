const express = require("express");
const { userAuth } = require("../middlewares/auth");
const { validateEditProfileData, validateEditExpertProfileData } = require("../utils/validation");
const profileRouter = express.Router();
const multer = require('multer'); 
const upload1 = multer({ dest: "uploads/" });
const cloudinary = require('cloudinary').v2;
const crypto = require('crypto');
const { uploadToCloudinary } = require("../utils/cloudinaryConfig");
const ExpertDetails = require("../models/expertDetails");
cloudinary.config({
    cloud_name: 'dydksbxkx',   
    api_key: '728257438437895',         
    api_secret: 'YQi6SvEbJ-spvI_YD4OwXYKoHoI'    
  });
  const upload = multer({ dest: 'uploadImage/' });
  const generateSignature = (timestamp) => {
      const signature = crypto
        .createHash('sha1')
        .update(`timestamp=${timestamp}${cloudinary.config().api_secret}`)
        .digest('hex');
      return signature;
    }; 
    const timestamp = Math.floor(Date.now() / 1000);
    const signature = generateSignature(timestamp);
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
     throw new Error("Invalid Edit Request");
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
catch(err){
    res.status(400).send("ERROR" + err.message);
}

})
profileRouter.post("/uploadImage",userAuth,upload.single('file'), async (req,res)=>{
          try{
             const user =  req.user;
            const result = await cloudinary.uploader.upload(req.file.path, {
                api_key: cloudinary.config().api_key,
                timestamp,
                signature
              });
              user.photoUrl = result.secure_url;
              await user.save();
              res.json({ url: result.secure_url });
          }
            
                catch (error) {
              res.status(500).json({ error:error.message});
            }   
} )
profileRouter.post("/edit-expert-profile",upload1.single("resume"),userAuth,async (req,res)=>{
  try{
   if(!validateEditExpertProfileData(req)){
    throw new Error("Invalid Edit Request");
}
  //const resumeUrl = await uploadToCloudinary(req.file.path);
  const expertId = req.user._id;
  const expertDetails = await ExpertDetails.findOne({ expertId: expertId });
  if(!expertDetails) return res.status(401).json("invalid request");
  Object.keys(req.body).forEach((key)=>{
    expertDetails[key] = req.body[key];
   });
 //  expertDetails.resumeUrl = resumeUrl;
   expertDetails.profileUpdated = true;
   await expertDetails.save();
  
    const filteredExpertDetails = await ExpertDetails.findOne({ expertId: expertId })
           .select("expertId expertise experienceYears description certifications linkedInProfile githubProfile portfolioUrl resumeUrl status profileUpdated");
   
         return res.status(200).json(filteredExpertDetails);
  
}
catch(err){
   res.status(400).send("ERROR" + err.message);
}

})

module.exports = profileRouter;