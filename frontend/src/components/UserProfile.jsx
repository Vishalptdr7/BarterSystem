import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { axiosInstance } from "../lib/axios";
import { toast } from "react-hot-toast";
import { ArrowLeft, MessageCircle, RefreshCw } from "lucide-react";

const UserProfile = () => {
  const { userId } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUserProfile();
  }, [userId]);

  const fetchUserProfile = async () => {
    try {
      setLoading(true);
      const { data } = await axiosInstance.get(`/users/${userId}`);
      setUser(data);
      setLoading(false);
    } catch (error) {
      toast.error("Failed to load user profile.");
      setLoading(false);
    }
  };

  const handleChat = () => {
    toast.success(`Starting chat with ${user?.name}`);
    // Navigate to chat page when integrated
  };

  const handleSwapSkill = () => {
    toast.success(`Requesting skill swap with ${user?.name}`);
    // Implement skill swap functionality
  };

  return (
    <div className="max-w-4xl mx-auto p-12 bg-white shadow-lg rounded-lg mt-16 py-16 ">
      {loading ? (
        <p className="text-center text-gray-500">Loading...</p>
      ) : user ? (
        <>
          {/* Profile Header */}
          <div className="flex items-center space-x-4">
            {user.profile_pic ? (
              <img
                src={user.profile_pic}
                alt={user.name}
                className="w-20 h-20 rounded-full border-2 border-gray-300 object-cover"
              />
            ) : (
              <div className="w-20 h-20 rounded-full bg-gray-400 flex items-center justify-center text-white text-2xl font-semibold border-2 border-gray-300">
                {user?.name?.charAt(0).toUpperCase() || "U"}
              </div>
            )}

            <div>
              <h2 className="text-2xl font-bold">{user.name}</h2>
              <p className="text-gray-600">{user.email}</p>
              <p className="text-gray-500">
                {user.location || "Location not provided"}
              </p>
            </div>
          </div>

          {/* Bio Section */}
          <div className="mt-4">
            <h3 className="text-lg font-semibold">Bio</h3>
            <p className="text-gray-600">{user.bio || "No bio available."}</p>
          </div>

          {/* Skills Section */}
          <div className="mt-4">
            <h3 className="text-lg font-semibold">Skills</h3>
            {user.skills.length > 0 ? (
              <ul className="mt-2 space-y-2">
                {user.skills.map((skill) => (
                  <li
                    key={skill.user_skill_id}
                    className="p-2 bg-gray-100 rounded-lg flex justify-between"
                  >
                    <div>
                      <span className="font-medium">{skill.skill_name}</span>
                      <p className="text-sm text-gray-500">
                        {skill.proficiency_level}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500">No skills added.</p>
            )}
          </div>

          {/* Action Buttons */}
          <div className="mt-6 flex space-x-4">
            <button
              onClick={handleChat}
              className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            >
              <MessageCircle className="w-5 h-5 mr-2" /> Chat
            </button>

            <button
              onClick={handleSwapSkill}
              className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
            >
              <RefreshCw className="w-5 h-5 mr-2" /> Swap Skill
            </button>

            <button
              onClick={() => navigate("/user/home")}
              className="flex items-center px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition"
            >
              <ArrowLeft className="w-5 h-5 mr-2" /> Back
            </button>
          </div>
        </>
      ) : (
        <p className="text-center text-red-500">User not found.</p>
      )}
    </div>
  );

};

export default UserProfile;
