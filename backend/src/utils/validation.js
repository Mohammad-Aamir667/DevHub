const validator = require("validator");
const validateSignUpData = (req)=>{
       const {firstName,lastName,emailId,password} = req.body; 
         if(!firstName ){
              throw new Error("Enter a valid name");
          }
         else if(!validator.isEmail(emailId)){
            throw new Error("Enter a valid email")
         }
         else if(!validator.isStrongPassword(password)){
            throw new Error("Enter a strong password")
         }  
} 
const validateEditProfileData = (req)=>{
   const allowedEditFields = ["firstName","lastName","age","gender","age","about","skills","photoUrl",];
   const isEditAllowed = Object.keys(req.body).every((field)=>allowedEditFields.includes(field)
   );
   return isEditAllowed;
}
const validateExpertFormData = (req)=>{
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
const validateEditExpertProfileData = (req)=>{
   const allowedEditFields = ["expertise","experienceYears","description","certifications","linkedInProfile","githubProfile","portfolioUrl","resumeUrl",];
   const isEditAllowed = Object.keys(req.body).every((field)=>allowedEditFields.includes(field)
   );
   return isEditAllowed;
}
module.exports = {validateSignUpData,validateEditProfileData,validateExpertFormData,validateEditExpertProfileData};
