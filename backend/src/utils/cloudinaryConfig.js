const cloudinary = require("cloudinary").v2;

cloudinary.config({
  cloud_name: "dydksbxkx",
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const generateSignature = (paramsToSign) => {
  return cloudinary.utils.api_sign_request(
    paramsToSign,
    cloudinary.config().api_secret
  );
};

const uploadToCloudinary = async (filePath) => {
  try {
    const timestamp = Math.floor(Date.now() / 1000);
    const paramsToSign = { timestamp, use_filename: true, unique_filename: false };

    const signature = generateSignature(paramsToSign);
    console.log("Generated Signature:", signature); // Debugging

    const result = await cloudinary.uploader.upload(filePath, {
      api_key: cloudinary.config().api_key,
      timestamp,
      signature,
      resource_type: "auto",
      use_filename: true,
      unique_filename: false,
    });

    return result.secure_url;
  } catch (error) {
    console.error("Error uploading file to Cloudinary:", error);
    throw error;
  }
};

module.exports = {
  cloudinary,
  generateSignature,
  uploadToCloudinary,
};
