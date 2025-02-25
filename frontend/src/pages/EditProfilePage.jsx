import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore.js";
import { toast } from "react-hot-toast";
import { axiosInstance } from "../lib/axios.js";
import { Camera } from "lucide-react";

const EditProfilePage = () => {
  const { authUser, setAuthUser } = useAuthStore(); // Get authentication details from store
  const navigate = useNavigate(); // Hook for navigation

  // Initialize form state with user details
  const [formData, setFormData] = useState({
    name: authUser?.name || "",
    location: authUser?.location || "",
    bio: authUser?.bio || "",
  });

  // State for profile picture
  const [profilePic, setProfilePic] = useState(null);
  const [previewImage, setPreviewImage] = useState(authUser?.profile_pic || "");
  const [loading, setLoading] = useState(false); // Loading state for submission

  // Handle text input change
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle profile picture selection
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfilePic(file);
      setPreviewImage(URL.createObjectURL(file)); // Show preview
    }
  };

  // Navigate to UserSkillsManager
  const handleSkills = () => {
    navigate(`/user_skill/${authUser?.user_id}`);
  };

  // Handle profile update submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Prepare form data for API call
      const formDataToSend = new FormData();
      formDataToSend.append("name", formData.name);
      formDataToSend.append("location", formData.location);
      formDataToSend.append("bio", formData.bio);
      if (profilePic) {
        formDataToSend.append("profile_pic", profilePic);
      }

      // API call to update profile
      const response = await axiosInstance.put(
        "/users/editProfile",
        formDataToSend,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      // Update local state with new user details
      setAuthUser({
        ...authUser,
        ...formData,
        profile_pic: response.data.profile_pic,
      });

      toast.success("Profile updated successfully!");
      navigate("/user/home"); // Redirect user to profile page
    } catch (error) {
      console.error("Profile update failed:", error);
      toast.error(error?.response?.data?.message || "Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="w-full max-w-lg bg-white shadow-md rounded-xl p-6 border">
        <h2 className="text-2xl font-bold text-center text-gray-900">
          
        </h2>

        {/* Profile Picture Upload */}
        <div className="flex flex-col items-center my-4">
          <div className="relative w-24 h-24">
            {previewImage ? (
              <img
                src={previewImage}
                alt="Profile Preview"
                className="w-24 h-24 rounded-full object-cover border border-gray-300"
              />
            ) : (
              <div className="w-24 h-24 rounded-full bg-gray-400 flex items-center justify-center text-white text-3xl font-semibold border border-gray-300">
                {authUser?.name?.charAt(0).toUpperCase() || "U"}{" "}
                {/* Fixed from 'user' to 'authUser' */}
              </div>
            )}

            <label className="absolute bottom-0 right-0 bg-indigo-600 p-2 rounded-full cursor-pointer">
              <Camera className="w-5 h-5 text-white" />
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
              />
            </label>
          </div>
        </div>

        {/* Profile Update Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Name Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Name
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Enter your name"
            />
          </div>

          {/* Location Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Location
            </label>
            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Enter your location"
            />
          </div>

          {/* Bio Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Bio
            </label>
            <textarea
              name="bio"
              value={formData.bio}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Tell us about yourself"
            ></textarea>
          </div>

          {/* Buttons */}
          <div className="flex flex-col gap-3">
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 disabled:bg-indigo-400 transition duration-200 ease-in-out"
            >
              {loading ? "Updating..." : "Save Changes"}
            </button>

            <button
              type="button"
              onClick={handleSkills}
              className="w-full py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition duration-200 ease-in-out"
            >
              Manage Skills
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProfilePage;
