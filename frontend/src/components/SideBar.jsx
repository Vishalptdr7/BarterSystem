import { useEffect, useMemo, useState } from "react";
import { useChatStore } from "../store/useChatStore";
import { useAuthStore } from "../store/useAuthStore";
import { Home, Users, MessageSquare } from "lucide-react";
import SidebarSkeleton from "./skeletons/SidebarSkeleton";
import { Link } from "lucide-react";
const Sidebar = () => {
  const { getUsers, users, selectedUser, setSelectedUser, isUsersLoading } =
    useChatStore();
  const { onlineUsers } = useAuthStore();

  const [showOnlineOnly, setShowOnlineOnly] = useState(false);

  useEffect(() => {
    getUsers();
  }, []);

  const filteredUsers = useMemo(
    () =>
      showOnlineOnly
        ? users.filter((user) => onlineUsers.includes(user.user_id))
        : users,
    [showOnlineOnly, users, onlineUsers]
  );

  if (isUsersLoading) return <SidebarSkeleton />;

  return (
    <aside className="flex h-screen ">
      {/* Compact vertical nav */}
      <div className="flex flex-col items-center w-16 h-full py-24  space-y-6 bg-white dark:bg-gray-900 dark:border-gray-700 border-r">
        <Link>
          
            <img
              className="w-auto h-6"
              src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ077k7uCCqVLzAQ7doJ8hMPg8Fxs6R7H_rJg&s"
              alt=""
            />
          
        </Link>

        {[Home, Users, MessageSquare].map((Icon, index) => (
          <a
            key={index}
            href="#"
            className="p-1.5 text-gray-500 dark:text-gray-400 rounded-lg transition hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            <Icon className="w-6 h-6" />
          </a>
        ))}
      </div>

      {/* Expanded sidebar for tablets and up */}
      <div className="hidden sm:flex flex-col w-64 max-w-xs h-full border-r border-base-300 bg-white dark:bg-gray-900 p-11 ">
        <div className="border-b pb-3">
          <div className="flex items-center gap-2 text-gray-900 dark:text-white">
            <Users className="size-5" />
            <span className="font-medium text-base">Contacts</span>
          </div>
          <div className="mt-3 flex items-center gap-2">
            <label className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300 p-6">
              <input
                type="checkbox"
                checked={showOnlineOnly}
                onChange={(e) => setShowOnlineOnly(e.target.checked)}
                className="checkbox checkbox-sm"
              />
              Show online only
            </label>
            <span className="text-xs text-zinc-500">
              ({Math.max(onlineUsers.length - 1, 0)} online)
            </span>
          </div>
        </div>

        {/* User list */}
        <div className="overflow-y-auto flex-1 py-3">
          {filteredUsers.length > 0 ? (
            filteredUsers.map((user) => (
              <button
                key={user.user_id}
                onClick={() => setSelectedUser(user)}
                className={`w-full p-2 flex items-center gap-3 hover:bg-base-300 rounded transition ${
                  selectedUser?.user_id === user.user_id
                    ? "bg-base-300 ring-1 ring-base-300"
                    : ""
                }`}
              >
                <div className="relative">
                  {user.profilePic ? (
                    <img
                      src={user.profilePic}
                      alt={user.name}
                      className="w-10 h-10 object-cover rounded-full"
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-gray-400 flex items-center justify-center text-white font-bold text-lg">
                      {user.name.charAt(0).toUpperCase()}
                    </div>
                  )}
                  {onlineUsers.includes(user.user_id) && (
                    <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full ring-2 ring-white dark:ring-gray-900" />
                  )}
                </div>
                <div className="flex-1 text-left overflow-hidden">
                  <p className="text-sm font-medium text-gray-800 dark:text-white truncate">
                    {user.name}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                    {user.email}
                  </p>
                </div>
              </button>
            ))
          ) : (
            <div className="p-4 text-center text-gray-500 dark:text-gray-400">
              No users found.
            </div>
          )}
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
