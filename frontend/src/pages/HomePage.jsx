import { useEffect, useState } from "react";
import { axiosInstance } from "../lib/axios.js";
import { toast } from "react-hot-toast";
import { MessageCircle, Repeat, User } from "lucide-react";
import { useAuthStore } from "../store/useAuthStore.js"; // Assuming you have an AuthContext for logged-in user info
import { useNavigate } from "react-router-dom";
import { useSwapStore } from "../store/useSwapStore.js";
const HomePage = () => {
  const [users, setUsers] = useState([]);
  const { authUser } = useAuthStore();        
  // Get logged-in user details
const navigate=useNavigate();
  useEffect(() => {
    fetchUsers();
  }, []);
  
  const fetchUsers = async () => {
    try {
      const { data } = await axiosInstance.get("/users/getAllUsers"); // Fetch all users
      const filteredUsers = data.filter(
        (user) => user.user_id !== authUser?.user_id
      ); // Exclude logged-in user
      setUsers(filteredUsers);
    } catch (error) {
      toast.error("Failed to fetch users.");
    }
  };
  const {setUserId}=useSwapStore();
  const handleSwapRequest = (userId) => {
    
    setUserId(userId);
    toast.success(`Swap request sent to user ${userId}`);
    
    navigate(`/notification`);

    
    // Call swap API when integrated
  };

  const handleChat = (userId) => {
    navigate('/chatting');
    toast.success(`Opening chat with user ${userId}`);
    // Navigate to chat page when integrated
  };

  const handleViewProfile = (userId) => {
    toast.success(`Viewing profile of user ${userId}`);
    navigate(`/profile/${userId}`);
    // Navigate to profile page when integrated
  };

  return (
    <div className="container mx-auto py-20 p-8">
      <h1 className="text-3xl font-bold mb-6 text-center"></h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {users.length > 0 ? (
          users.map((user) => (
            <div
              key={user.user_id}
              className="bg-white shadow-md p-4 rounded-lg border"
            >
              <div className="flex items-center space-x-4">
                {user.profile_pic ? (
                  <img
                    src={user.profile_pic}
                    alt={user.name}
                    className="w-14 h-14 rounded-full"
                  />
                ) : (
                  <div className="w-14 h-14 rounded-full bg-gray-400 flex items-center justify-center text-white text-xl font-semibold">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                )}
                <div>
                  <h2 className="text-xl font-semibold">{user.name}</h2>
                  <p className="text-gray-600">
                    {user.location || "Unknown Location"}
                  </p>
                </div>
              </div>

              <div className="mt-3">
                <h3 className="font-semibold text-gray-800">Skills:</h3>
                <ul className="list-disc list-inside text-gray-600">
                  {(user.skills || []).map((skill) => (
                    <li key={skill.skill_id}>
                      {skill.skill_name} ({skill.proficiency_level})
                    </li>
                  ))}
                </ul>
              </div>

              <div className="flex justify-between mt-4">
                <button
                  className="bg-blue-500 text-white px-4 py-2 rounded flex items-center"
                  onClick={() => handleSwapRequest(user.user_id)}
                >
                  <Repeat className="w-5 h-5 mr-2" /> Swap
                </button>

                <button
                  className="bg-green-500 text-white px-4 py-2 rounded flex items-center"
                  onClick={() => handleChat(user.user_id)}
                >
                  <MessageCircle className="w-5 h-5 mr-2" /> Chat
                </button>

                <button
                  className="bg-gray-700 text-white px-4 py-2 rounded flex items-center"
                  onClick={() => handleViewProfile(user.user_id)}
                >
                  <User className="w-5 h-5 mr-2" /> Profile
                </button>
              </div>
            </div>
          ))
        ) : (
          <p className="text-center col-span-3">No users available.</p>
        )}
      </div>
    </div>
  );
};

export default HomePage;
