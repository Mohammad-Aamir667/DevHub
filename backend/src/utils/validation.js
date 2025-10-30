const validator = require("validator");
const validateSignUpData = (req) => {
  const { firstName, emailId, password } = req.body;

  if (!firstName || !firstName.trim()) {
    return { isValid: false, message: "Enter a valid name" };
  }

  if (!validator.isEmail(emailId)) {
    return { isValid: false, message: "Enter a valid email" };
  }

  if (!validator.isStrongPassword(password)) {
    return { isValid: false, message: "Enter a strong password" };
  }

  return { isValid: true };
};


const validateEditProfileData = (req) => {
  const allowedEditFields = ["firstName", "lastName", "age", "gender", "about", "skills", "photoUrl"];
  const requiredFields = ["firstName"]; // Add required fields here

  const bodyKeys = Object.keys(req.body);

  const isEditAllowed = bodyKeys.every(field => allowedEditFields.includes(field));
  const areRequiredFieldsPresent = requiredFields.every(field => bodyKeys.includes(field) && req.body[field]);

  return isEditAllowed && areRequiredFieldsPresent;
};

const validateExpertFormData = (req) => {
  // const allowedExpertFormData = ["expertise","experienceYears","description","certifications","linkedInProfile","githubProfile","portfolioUrl",];
  // const isAllowedExpertFormData = Object.keys(req.body).every((field)=>allowedExpertFormData.includes(field)
  // );
  // if(!isAllowedExpertFormData) return false;
  const { expertise, experienceYears, linkedInProfile, githubProfile, portfolioUrl } = req.body;

  if (!Array.isArray(expertise) || expertise.length === 0) return false;
  if (typeof experienceYears !== "number" || experienceYears < 0) return false;
  if (linkedInProfile && !validator.isURL(linkedInProfile)) return false;
  if (githubProfile && !validator.isURL(githubProfile)) return false;
  //  if (portfolioUrl && !validator.isURL(portfolioUrl)) return false;
  return true;
}
const validateEditExpertProfileData = (req) => {
  const allowedEditFields = ["expertise", "experienceYears", "description", "certifications", "linkedInProfile", "githubProfile", "portfolioUrl", "resumeUrl", "languages",
    "timezone", "schedule", "timeSlots"
  ];
  const isEditAllowed = Object.keys(req.body).every((field) => allowedEditFields.includes(field)
  );
  return isEditAllowed;
}
module.exports = { validateSignUpData, validateEditProfileData, validateExpertFormData, validateEditExpertProfileData };
