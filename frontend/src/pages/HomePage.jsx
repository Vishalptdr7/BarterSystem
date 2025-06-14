import { useEffect, useState } from "react";
import { axiosInstance } from "../lib/axios.js";
import { toast } from "react-hot-toast";
import { useAuthStore } from "../store/useAuthStore.js";
import { useNavigate } from "react-router-dom";
import { useSwapStore } from "../store/useSwapStore.js";
import { useChatStore } from "../store/useChatStore.js";
import ChatContainer from "../components/ChatContainer";
import UserCard from "../components/UserCard";
import UsersPageSkeleton from "../Skeleton/UserPageSkeleton.jsx";
import { Typography, Card, IconButton } from "@material-tailwind/react";
import { XMarkIcon } from "@heroicons/react/24/solid";

const UsersPage = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const { authUser } = useAuthStore();
  const navigate = useNavigate();
  const { setUserId } = useSwapStore();
  const { selectedUser, setSelectedUser } = useChatStore();
  const [isChatOpen, setIsChatOpen] = useState(false);

  useEffect(() => {
    if (selectedUser) setIsChatOpen(true);
  }, [selectedUser]);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const { data } = await axiosInstance.get("/users/getAllUsers");
      setUsers(data);
    } catch (error) {
      if (error.response?.status === 401) {
        toast.error("Unauthorized. Please login again.");
        navigate("/login");
      } else {
        toast.error("Failed to fetch users.");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleSwapRequest = (userId) => {
    if (!userId) return;
    setUserId(userId);
    navigate(`/notification`);
    toast.success(`Swap request sent to user ${userId}`);
  };

  const handleChat = (user) => {
    if (!user) return;
    setSelectedUser(user);
  };

  const handleViewProfile = (userId) => {
    if (!userId) return;
    navigate(`/profile/${userId}`);
    toast.success(`Viewing profile of user ${userId}`);
  };

  if (loading) return <UsersPageSkeleton showChat={isChatOpen} />;

  return (
    <div className="min-h-screen py-10 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-blue-50 to-indigo-100">
      <Typography
        variant="h2"
        className="text-center text-blue-gray-800 font-bold mb-10 text-3xl sm:text-4xl"
      >
        Browse Users
      </Typography>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {users.length > 0 ? (
          users.map((user) => (
            <Card
              key={user.user_id}
              className="p-4 shadow-lg rounded-xl bg-white hover:shadow-2xl transition-shadow duration-300"
            >
              <UserCard
                user={user}
                onSwap={handleSwapRequest}
                onChat={handleChat}
                onProfile={handleViewProfile}
              />
            </Card>
          ))
        ) : (
          <Typography
            variant="h6"
            className="text-center text-blue-gray-600 col-span-full"
          >
            No users available.
          </Typography>
        )}
      </div>

      {isChatOpen && selectedUser && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50 p-4">
          <Card className="w-full max-w-2xl relative rounded-xl shadow-2xl p-6">
            <IconButton
              variant="text"
              color="red"
              size="sm"
              className="absolute top-3 right-3"
              onClick={() => {
                setIsChatOpen(false);
                setSelectedUser(null);
              }}
            >
              <XMarkIcon className="w-5 h-5" />
            </IconButton>
            <ChatContainer />
          </Card>
        </div>
      )}
    </div>
  );
};

export default UsersPage;
