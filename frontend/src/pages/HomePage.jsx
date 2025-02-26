import { useEffect, useState } from "react";
import { axiosInstance } from "../lib/axios.js";
import { toast } from "react-hot-toast";
import { MessageCircle, Repeat, User } from "lucide-react";
import { useAuthStore } from "../store/useAuthStore.js";
import { useNavigate } from "react-router-dom";
import { useSwapStore } from "../store/useSwapStore.js";
import { useChatStore } from "../store/useChatStore.js"; // Chat store
import ChatContainer from "../components/ChatContainer"; // Chat UI

const HomePage = () => {
  const [users, setUsers] = useState([]);
  const { authUser } = useAuthStore();
  const navigate = useNavigate();
  const { setUserId } = useSwapStore();
  const { selectedUser, setSelectedUser } = useChatStore();
  const [isChatOpen, setIsChatOpen] = useState(false); // Track modal state

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    if (selectedUser) {
      setIsChatOpen(true); // Ensure chat opens when a user is selected
    }
  }, [selectedUser]);

  const fetchUsers = async () => {
    try {
      const { data } = await axiosInstance.get("/users/getAllUsers");
      setUsers(data.filter((user) => user.user_id !== authUser?.user_id));
    } catch (error) {
      toast.error("Failed to fetch users.");
    }
  };

  const handleSwapRequest = (userId) => {
    if (!userId) return;
    setUserId(userId);
    toast.success(`Swap request sent to user ${userId}`);
    navigate(`/notification`);
  };

  const handleChat = (user) => {
    if (!user) return;
    setSelectedUser(user); // Update selected user in store
  };

  const handleViewProfile = (userId) => {
    if (!userId) return;
    navigate(`/profile/${userId}`);
    toast.success(`Viewing profile of user ${userId}`);
  };

  return (
    <div className="container mx-auto py-20 p-8">
      <h1 className="text-3xl font-bold mb-6 text-center">Users</h1>

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
                {user.skills && user.skills.length > 0 ? (
                  <ul className="list-disc list-inside text-gray-600">
                    {user.skills.map((skill, index) => (
                      <li key={`${skill.skill_id}-${index}`}>
                        {skill.skill_name} ({skill.proficiency_level})
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-gray-500 text-sm">No skills listed</p>
                )}
              </div>

              <div className="flex justify-between mt-4">
                <button
                  className="bg-blue-500 text-white px-4 py-2 rounded flex items-center hover:bg-blue-600"
                  onClick={() => handleSwapRequest(user.user_id)}
                >
                  <Repeat className="w-5 h-5 mr-2" /> Swap
                </button>

                <button
                  className="bg-green-500 text-white px-4 py-2 rounded flex items-center"
                  onClick={() => handleChat(user)}
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

      {/* Chat Container - Render only when a user is selected */}
      {isChatOpen && selectedUser && (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-2xl relative">
            <button
              className="absolute top-3 right-3 bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
              onClick={() => {
                setIsChatOpen(false);
                setSelectedUser(null);
              }}
            >
              Close
            </button>
            <ChatContainer />
          </div>
        </div>
      )}
    </div>
  );
};

export default HomePage;
