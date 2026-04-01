const {
    getProfileService,
    editProfileService,
    uploadImageService,
    editExpertProfileService
} = require("./profile.service");

const {
    validateEditProfileData,
    validateEditExpertProfileData
} = require("../../utils/validation");

const getProfile = async (req, res) => {
    try {
        const data = await getProfileService(req.user);
        return res.json(data);
    } catch (err) {
        res.status(500).json(err);
    }
};

const editProfile = async (req, res) => {
    try {
        if (!validateEditProfileData(req)) {
            return res.status(400).send("Invalid Edit Request");
        }

        const data = await editProfileService(req.user, req.body);

        res.json(data);
    } catch (err) {
        res.status(500).send("Server error");
    }
};

const uploadImage = async (req, res) => {
    try {
        const imageUrl = await uploadImageService(req.user, req.file);
        res.json({ url: imageUrl });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const editExpertProfile = async (req, res) => {
    try {
        if (!validateEditExpertProfileData(req)) {
            throw new Error("Invalid Edit Request");
        }

        const result = await editExpertProfileService(
            req.user._id,
            req.body,
            req.file
        );

        if (result?.error) {
            return res.status(result.status).json(result.error);
        }

        return res.status(result.status).json(result.data);
    } catch (err) {
        res.status(400).send("ERROR" + err.message);
    }
};

module.exports = {
    getProfile,
    editProfile,
    uploadImage,
    editExpertProfile
};