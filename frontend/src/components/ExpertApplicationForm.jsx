import React, { useCallback, useState } from "react";
import ConfirmModal from "./common/ConfirmModal";
import axios from "axios";
import { BASE_URL } from "../utils/constants";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Toast from "./Toast";
import { updateExpertStatus } from "../utils/expertDetailsSlice";

const ExpertApplicationForm = () => {
  const [isModalOpen,setModalOpen] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [showToast, setShowToast] = useState(false);
  const expertDetails = useSelector((store)=>store.expertDetails);
  console.log(expertDetails);
  const onClose = useCallback(() => {
    setShowToast(false); 
  }, [])
  const [formData, setFormData] = useState({
    expertise: "",
    experienceYears: "",
    description: "",
    certifications: "",
    linkedInProfile: "",
    githubProfile: "",
    portfolioUrl: "",
    resume: null,
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "resume") {
      setFormData({ ...formData, [name]: files[0] });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };
   const handleExpertFormSubmit = async (formData) => {
    try {
      const res = await axios.post(BASE_URL+"/become-expert", formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        withCredentials:true});
        dispatch(updateExpertStatus({ expertId: res.data.expertId ,status:"pending"}));
        setShowToast(true);
        
        console.log(showToast);
    } catch (error) {
      console.error("Error submitting application:", error);
      alert("There was an issue submitting your application.");
    }
  };
  const validateForm = () => {
    const newErrors = {};
    if (!formData.expertise.trim()) newErrors.expertise = "Expertise is required.";
    if (!formData.experienceYears || formData.experienceYears < 0)
      newErrors.experienceYears = "Experience must be a non-negative number.";
    if (formData.description.length > 300)
      newErrors.description = "Description must be under 300 characters.";
    if (!formData.githubProfile.trim() || !formData.githubProfile.startsWith("http"))
      newErrors.githubProfile = "A valid GitHub profile is required.";
    if (!formData.linkedInProfile.trim() || !formData.linkedInProfile.startsWith("http"))
      newErrors.linkedInProfile = "A valid LinkedIn profile is required.";
    if (!formData.resume) newErrors.resume = "Resume is required.";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  const handleOpenModal = (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    setModalOpen(true);
  };
  const handleConfirmSubmit = () => {
    
    setModalOpen(false);
    const formDataToSubmit = new FormData();
    Object.keys(formData).forEach((key) => {
      formDataToSubmit.append(key, formData[key]);
    });
    handleExpertFormSubmit(formDataToSubmit);
  };
  
  if (expertDetails.expertId) {
    if (expertDetails.status === "pending"){
      return (
        <div className="p-6 text-center text-lg bg-lightGray rounded-md shadow-md">
          Your application is under review. Kindly wait for verification.
        </div>
      );
    } 
     else if (expertDetails.status === "rejected") {
      return (
        <div className="p-6 text-center text-lg bg-red-100 rounded-md shadow-md">
          <h2 className="text-xl font-bold text-red-600 mb-4">Application Rejected</h2>
          <p>We’re sorry to inform you that your application has been rejected.</p>
          <p>You may review your details and apply again if necessary.</p>
          <button
            onClick={() => navigate("/apply-again")}
            className="mt-4 bg-gray-500 text-white py-2 px-4 rounded-lg hover:bg-gray-600"
          >
            Apply Again
          </button>
        </div>
      );
    }
  }
  
  return (
     
    !expertDetails.expertId && 
    <form onSubmit={handleOpenModal} className="max-w-2xl mx-auto p-6 bg-white shadow-md rounded-lg">
              <button onClick = {()=>{navigate(-1)}} className="flex items-center text-darkPurple hover:text-electricBlue  rounded-lg focus:outline-none transition duration-200">
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={2}
    stroke="currentColor"
    className="w-5 h-5 mr-2"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M15 19l-7-7 7-7"
    />
  </svg>
</button>
      <h1 className="text-2xl font-bold mb-6 text-gray-800">Expert Application Form</h1>
   
      <div className="mb-4">
        <label className="block text-gray-700 font-semibold mb-2" htmlFor="expertise">
          Expertise (comma-separated)
        </label>
        <input
          type="text"
          id="expertise"
          name="expertise"
          value={formData.expertise}
          onChange={handleChange}
          className={`w-full px-3 py-2 border ${errors.expertise ? "border-red-500" : "border-gray-300"} rounded-lg`}
        />
        {errors.expertise && <p className="text-red-500 text-sm">{errors.expertise}</p>}
      </div>

      <div className="mb-4">
        <label className="block text-gray-700 font-semibold mb-2" htmlFor="experienceYears">
          Years of Experience
        </label>
        <input
          type="number"
          id="experienceYears"
          name="experienceYears"
          value={formData.experienceYears}
          onChange={handleChange}
          className={`w-full px-3 py-2 border ${errors.experienceYears ? "border-red-500" : "border-gray-300"} rounded-lg`}
        />
        {errors.experienceYears && <p className="text-red-500 text-sm">{errors.experienceYears}</p>}
      </div>

      <div className="mb-4">
        <label className="block text-gray-700 font-semibold mb-2" htmlFor="description">
          Brief Description (max 300 characters)
        </label>
        <textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          maxLength="300"
          className={`w-full px-3 py-2 border ${errors.description ? "border-red-500" : "border-gray-300"} rounded-lg`}
        ></textarea>
        {errors.description && <p className="text-red-500 text-sm">{errors.description}</p>}
      </div>

      <div className="mb-4">
        <label className="block text-gray-700 font-semibold mb-2" htmlFor="githubProfile">
          GitHub Profile
        </label>
        <input
          type="url"
          id="githubProfile"
          name="githubProfile"
          value={formData.githubProfile}
          onChange={handleChange}
          className={`w-full px-3 py-2 border ${errors.githubProfile ? "border-red-500" : "border-gray-300"} rounded-lg`}
        />
        {errors.githubProfile && <p className="text-red-500 text-sm">{errors.githubProfile}</p>}
      </div>

      <div className="mb-4">
        <label className="block text-gray-700 font-semibold mb-2" htmlFor="linkedInProfile">
          LinkedIn Profile
        </label>
        <input
          type="url"
          id="linkedInProfile"
          name="linkedInProfile"
          value={formData.linkedInProfile}
          onChange={handleChange}
          className={`w-full px-3 py-2 border ${errors.linkedInProfile ? "border-red-500" : "border-gray-300"} rounded-lg`}
        />
        {errors.linkedInProfile && <p className="text-red-500 text-sm">{errors.linkedInProfile}</p>}
      </div>

      <div className="mb-4">
        <label className="block text-gray-700 font-semibold mb-2" htmlFor="resume">
          Upload Resume
        </label>
        <input
          type="file"
          id="resume"
          name="resume"
          onChange={handleChange}
          className={`w-full px-3 py-2 border ${errors.resume ? "border-red-500" : "border-gray-300"} rounded-lg`}
        />
        {errors.resume && <p className="text-red-500 text-sm">{errors.resume}</p>}
      </div>

      <button
        type="submit"
        className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 focus:outline-none"
      >
        Submit Application
      </button>
      <ConfirmModal
        isOpen={isModalOpen}
        message="Are you sure you want to submit your application? Please review your details before confirming"
        onConfirm={handleConfirmSubmit}
        onCancel={() => setModalOpen(false)}
      />
   
    {expertDetails.expertId && expertDetails.status === "pending" && (
    ( <div className="p-6 text-center text-lg bg-lightGray rounded-md shadow-md">
       Your application is under review. Kindly wait for verification.
        </div>)
      )}  
    </form>
  );
};

export default ExpertApplicationForm;
