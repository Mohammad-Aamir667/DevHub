import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Edit, Briefcase, Code } from "lucide-react";

const Profile = () => {
  const user = useSelector((store) => store?.user);
  const navigate = useNavigate();
  const { firstName, lastName, photoUrl, age, gender, about, skills } = user || {};

  const handleEditProfile = () => navigate("/editProfile");

  return (
    user && (
      <div className="min-h-screen mt-16 bg-gradient-to-b from-gray-950 to-gray-900 py-12 px-6 flex justify-center">
        <div className="max-w-3xl w-full bg-gray-900 rounded-xl shadow-2xl p-8 relative">
          <button
            onClick={() => navigate(-1)}
            className="absolute top-4 left-4 flex items-center text-blue-400 hover:text-blue-300 font-semibold transition duration-200"
          >
            <ArrowLeft className="w-5 h-5 mr-2" /> 
          </button>

          <div className="flex flex-col items-center">
            <div className="relative w-32 h-32">
              <img
                src={photoUrl || "/placeholder.svg"}
                alt={`${firstName} ${lastName}`}
                className="w-full h-full rounded-full border-4 border-gray-700 object-cover shadow-lg"
              />
            </div>
            <h2 className="mt-4 text-3xl font-bold text-gray-100">{firstName} {lastName}</h2>
            <p className="text-blue-400 text-lg font-medium flex items-center gap-2 mt-2">
              <Briefcase className="w-5 h-5" /> Developer
            </p>
            <p className="text-gray-400 text-sm flex items-center gap-2 mt-2">
              <Code className="w-5 h-5" /> {skills?.join(", ") || "No skills added"}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-6 mt-6 text-gray-300 text-center">
            <div className="p-4 bg-gray-800 rounded-lg">
              <p className="text-sm font-semibold">Gender</p>
              <p className="text-lg">{gender || "Not specified"}</p>
            </div>
            <div className="p-4 bg-gray-800 rounded-lg">
              <p className="text-sm font-semibold">Age</p>
              <p className="text-lg">{age || "Not specified"}</p>
            </div>
          </div>

          <div className="mt-6">
            <h3 className="text-lg font-semibold text-gray-100 mb-2">About</h3>
            <p className="text-gray-300 bg-gray-800 p-4 rounded-lg">{about || "No bio added"}</p>
          </div>

          <div className="flex justify-center mt-6">
            <button
              onClick={handleEditProfile}
              className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-6 rounded-lg transition duration-200 flex items-center"
            >
              <Edit className="w-5 h-5 mr-2" /> Edit Profile
            </button>
          </div>
        </div>
      </div>
    )
  );
};

export default Profile;
