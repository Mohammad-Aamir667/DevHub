const express = require("express");
const { userAuth, isAdmin } = require("../middlewares/auth");
const ExpertDetails = require("../models/expertDetails");
const { validateExpertFormData } = require("../utils/validation");
const multer = require("multer");
const { uploadToCloudinary } = require("../utils/cloudinaryConfig");
const User = require("../models/user");
const USER_SAFE_DATA = "firstName lastName age gender about skills photoUrl";
const expertRouter = express.Router();
const upload = multer({ dest: "uploads/" });

expertRouter.post("/become-expert", upload.single("resume"), userAuth, async (req, res) => {
  try {
    const expertId = req.user._id;
    const existingApplication = await ExpertDetails.findOne({
      expertId,
      status: { $in: ["pending", "approved", "rejected"] },
    });

    if (existingApplication) {
      if (existingApplication.status === "pending") {
        return res.status(400).json("You already have a pending application.");
      } else if (existingApplication.status === "approved") {
        return res.status(400).json("You are already an approved expert.");
      } else {
        return res.status(400).json("Sorry, your application has been rejected.");
      }
    }
    // if (!validateExpertFormData(req)) {
    //   return res.status(400).json("Invalid expert data");
    // }
    const resumeUrl = await uploadToCloudinary(req.file);

    const { expertise, experienceYears, description, certifications, linkedInProfile, githubProfile, portfolioUrl } = req.body;

    const expert = new ExpertDetails({
      expertId,
      expertise,
      experienceYears,
      description,
      certifications,
      linkedInProfile,
      githubProfile,
      portfolioUrl,
      resumeUrl,
    });

    await expert.save();
    await User.findByIdAndUpdate(expertId, { type: "expert" });
    return res.status(201).json({expertId});
  } catch (err) {
    res.status(500).json(err);
  }
});
expertRouter.get("/expert-list",userAuth,isAdmin,async (req,res)=>{
                try {
                    const expertDetails = await ExpertDetails.find({}).populate("expertId",USER_SAFE_DATA); 
                    res.status(200).json(expertDetails);
                } catch (error) {
                    res.status(500).json({ message: "Failed to fetch users.", error: error.message });
                }
})
expertRouter.post("/expert/review/:status/:expertId",userAuth,isAdmin,async (req,res)=>{
  try {
      const allowedStatus = ["approved","rejected"];
      const {status} = req.params;
      const expertId = req.params.expertId.trim();
      if(!allowedStatus.includes(status)){
        return res.status(400).send("invalid status type "+ status)
        }
      const expertDetails = await ExpertDetails.findOne({expertId,status:"pending"});
      if(!expertDetails)  return res.status(400).json({
        message:`expert not found with status ${status} `
      })
      expertDetails.status = status;
      const data = await expertDetails.save();
      res.status(201).json(data);
  } catch (error) {
      res.status(500).json({ message: "Failed to fetch users.", error: error.message });
  }
})
expertRouter.get("/expert-list/approved",userAuth,async (req,res)=>{
  try {
      const loggedInUserId = req.user._id;

      const expertDetails = await ExpertDetails.find({status:"approved", expertId: { $ne: loggedInUserId },}).populate("expertId",USER_SAFE_DATA); 
      res.status(200).json(expertDetails);
  } catch (error) {
      res.status(500).json({ message: "Failed to fetch users.", error: error.message });
  }
})
expertRouter.get("/expert-details", userAuth, async (req, res) => {
  try {
    const expertId = req.user._id;
    const expertDetails = await ExpertDetails.findOne({ expertId: expertId });
    
    if (!expertDetails) {
      return res.status(200).json({ expertId: null });
    } else if (expertDetails.status === "pending") {
      return res.status(200).json({ expertId, status: "pending" });
    } else if (expertDetails.status === "rejected") {
      return res.status(200).json({ expertId, status: "rejected" });
    } else {
      const filteredExpertDetails = await ExpertDetails.findOne({ expertId: expertId })
        .select("expertId expertise experienceYears description certifications linkedInProfile githubProfile portfolioUrl resumeUrl status profileUpdated languages timezone schedule reviews rating");

      return res.status(200).json(filteredExpertDetails);
    }
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch user details.", error: error.message });
  }
});

module.exports = expertRouter;
