const { uploadToCloudinary } = require("../../utils/cloudinaryConfig");
const ExpertDetails = require("../../models/expertDetails");

const getProfileService = async (loggedInUser) => {
    return loggedInUser;
};

const editProfileService = async (loggedInUser, body) => {
    Object.keys(body).forEach((key) => {
        loggedInUser[key] = body[key];
    });

    await loggedInUser.save();

    return loggedInUser;
};

const uploadImageService = async (user, file) => {
    const imageUrl = await uploadToCloudinary(file);

    user.photoUrl = imageUrl;
    await user.save();

    return imageUrl;
};

const editExpertProfileService = async (expertId, body, file) => {
    const expertDetails = await ExpertDetails.findOne({ expertId: expertId });

    if (!expertDetails) {
        return { error: "invalid request", status: 401 };
    }

    if (file) {
        const resumeUrl = await uploadToCloudinary(file);
        expertDetails.resumeUrl = resumeUrl;
    }

    Object.keys(body).forEach((key) => {
        if (key === "schedule") {
            expertDetails.schedule = JSON.parse(body.schedule);
        } else {
            expertDetails[key] = body[key];
        }
    });

    expertDetails.profileUpdated = true;
    await expertDetails.save();

    const filteredExpertDetails = await ExpertDetails.findOne({ expertId: expertId })
        .select("expertId expertise experienceYears description certifications linkedInProfile githubProfile portfolioUrl resumeUrl status profileUpdated languages");

    return { data: filteredExpertDetails, status: 200 };
};

module.exports = {
    getProfileService,
    editProfileService,
    uploadImageService,
    editExpertProfileService
};