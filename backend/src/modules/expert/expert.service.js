const ExpertDetails = require("../../models/expertDetails");
const User = require("../../models/user");
const { uploadToCloudinary } = require("../../utils/cloudinaryConfig");

const USER_SAFE_DATA = "firstName lastName age gender about skills photoUrl";

const becomeExpertService = async (expertId, file, body) => {
    const existingApplication = await ExpertDetails.findOne({
        expertId,
        status: { $in: ["pending", "approved", "rejected"] },
    });

    if (existingApplication) {
        if (existingApplication.status === "pending") {
            return { error: "You already have a pending application.", status: 400 };
        } else if (existingApplication.status === "approved") {
            return { error: "You are already an approved expert.", status: 400 };
        } else {
            return { error: "Sorry, your application has been rejected.", status: 400 };
        }
    }

    const resumeUrl = await uploadToCloudinary(file);

    const {
        expertise,
        experienceYears,
        description,
        certifications,
        linkedInProfile,
        githubProfile,
        portfolioUrl
    } = body;

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

    return { data: { expertId }, status: 201 };
};

const getExpertListService = async () => {
    return await ExpertDetails.find({})
        .populate("expertId", USER_SAFE_DATA);
};

const reviewExpertService = async (expertId, status) => {
    const allowedStatus = ["approved", "rejected"];

    if (!allowedStatus.includes(status)) {
        return { error: "invalid status type " + status, status: 400 };
    }

    const expertDetails = await ExpertDetails.findOne({
        expertId,
        status: "pending"
    });

    if (!expertDetails) {
        return {
            error: `expert not found with status ${status} `,
            status: 400
        };
    }

    expertDetails.status = status;
    const data = await expertDetails.save();

    return { data, status: 201 };
};

const getApprovedExpertsService = async (loggedInUserId) => {
    return await ExpertDetails.find({
        status: "approved",
        expertId: { $ne: loggedInUserId }
    }).populate("expertId", USER_SAFE_DATA);
};

const getExpertDetailsService = async (expertId) => {
    const expertDetails = await ExpertDetails.findOne({ expertId });

    if (!expertDetails) {
        return { data: { expertId: null }, status: 200 };
    } else if (expertDetails.status === "pending") {
        return { data: { expertId, status: "pending" }, status: 200 };
    } else if (expertDetails.status === "rejected") {
        return { data: { expertId, status: "rejected" }, status: 200 };
    } else {
        const filteredExpertDetails = await ExpertDetails.findOne({ expertId })
            .select("expertId expertise experienceYears description certifications linkedInProfile githubProfile portfolioUrl resumeUrl status profileUpdated languages timezone schedule reviews rating");

        return { data: filteredExpertDetails, status: 200 };
    }
};

module.exports = {
    becomeExpertService,
    getExpertListService,
    reviewExpertService,
    getApprovedExpertsService,
    getExpertDetailsService
};