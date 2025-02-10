import { useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"
import { ArrowLeft, Edit } from "lucide-react"

const Profile = () => {
  const user = useSelector((store) => store.user)
  const navigate = useNavigate()
  const { firstName, lastName, photoUrl, age, gender, about, skills } = user

  const handleEditProfile = () => {
    return navigate("/editProfile")
  }

  return (
    <div className="min-h-screen mt-16 bg-gradient-to-b from-gray-900 to-gray-800 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center text-blue-400 hover:text-blue-300 font-semibold mb-6 transition duration-200"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Back
        </button>

        <div className="bg-gray-800 rounded-2xl shadow-xl overflow-hidden">
          <div className="relative h-40 bg-gradient-to-r from-gray-500 to-gray-600">
            <img
              src={photoUrl || "/placeholder.svg"}
              alt={`${firstName} ${lastName}`}
              className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2 rounded-full w-32 h-32 border-4 border-gray-800 object-cover"
            />
          </div>

          <div className="pt-20 pb-8 px-6">
            <h2 className="text-2xl font-bold text-gray-100 text-center mb-2">
              {firstName} {lastName}
            </h2>
            <p className="text-blue-400 text-center mb-6">{skills.join(", ")}</p>

            <div className="grid grid-cols-2 gap-4 mb-6 text-gray-300">
              <div>
                <p className="font-semibold">Gender</p>
                <p>{gender}</p>
              </div>
              <div>
                <p className="font-semibold">Age</p>
                <p>{age}</p>
              </div>
            </div>

            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-100 mb-2">About</h3>
              <p className="text-gray-300">{about}</p>
            </div>

            <button
              onClick={handleEditProfile}
              className="w-1/3 bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-4 rounded-lg transition duration-200 flex items-center justify-center"
            >
              <Edit className="w-5 h-5 mr-2" />
              Edit Profile
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Profile

