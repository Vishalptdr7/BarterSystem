import { X } from "lucide-react";
import { useAuthStore } from "../store/useAuthStore";
import { useChatStore } from "../store/useChatStore";

const ChatHeader = () => {
  const { selectedUser, setSelectedUser } = useChatStore();
  const { onlineUsers } = useAuthStore();

  return (
    <div className="p-4 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900">
      <div className="flex items-center justify-between">
        {/* Avatar & Info */}
        <div className="flex items-center gap-4">
          <div className="relative">
            {selectedUser?.profilePic ? (
              <img
                src={selectedUser.profilePic}
                alt={selectedUser.name}
                className="w-12 h-12 rounded-full object-cover border border-gray-300 shadow-sm"
              />
            ) : (
              <div className="w-12 h-12 rounded-full bg-gradient-to-r from-pink-500 to-purple-500 flex items-center justify-center text-white font-bold text-lg shadow-sm">
                {selectedUser?.name?.charAt(0).toUpperCase() || "U"}
              </div>
            )}

            {/* Online Indicator */}
            <span
              className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white dark:border-gray-900 ${
                onlineUsers.includes(selectedUser?.user_id)
                  ? "bg-green-500"
                  : "bg-gray-400"
              }`}
            />
          </div>

          {/* Name & Status */}
          <div>
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
              {selectedUser?.name || "Unknown User"}
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {onlineUsers.includes(selectedUser?.user_id)
                ? "Online"
                : "Offline"}
            </p>
          </div>
        </div>

        {/* Close Button */}
        <button
          onClick={() => setSelectedUser(null)}
          className="text-gray-500 hover:text-red-500 transition p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"
        >
          <X className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};

export default ChatHeader;
