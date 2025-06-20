import { useEffect, useState, useRef } from "react";
import { axiosInstance } from "../lib/axios.js";
import { toast } from "react-hot-toast";
import { Bell, CheckCircle, Trash2 } from "lucide-react";
import { io } from "socket.io-client"; // ✅ Import socket.io
const Notification = ({ userId }) => {
  const [notifications, setNotifications] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [loading, setLoading] = useState(false);
  const socketRef = useRef(null); // ✅ Store socket reference

  useEffect(() => {
    fetchNotifications();
  }, [userId]);

  useEffect(() => {
    if (!userId) return;
    if (!socketRef.current || !socketRef.current.connected) {
      socketRef.current = io("http://localhost:8080", {
        transports: ["websocket"],
        withCredentials: true,
        auth: { userId },
      });
    }

    socketRef.current = io("http://localhost:8080", {
      transports: ["websocket"],
      withCredentials: true,
      auth: {
        userId,
      },
    });

    socketRef.current.on("receiveNotification", (data) => {
      setNotifications((prev) => [data, ...prev]);
      fetchNotifications();
    });
    
    
    return () => {
      socketRef.current.disconnect();
    };
  }, [userId]);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const { data } = await axiosInstance.get(`/notification/user/${userId}`);
      setNotifications(data.notifications);
      setLoading(false);
    } catch (error) {
      setLoading(false);
    }
  };

  const markAsRead = async (notificationId) => {
    try {
      await axiosInstance.put(`/notification/${notificationId}`);
      setNotifications(
        notifications.map((n) =>
          n.notification_id === notificationId ? { ...n, is_read: true } : n
        )
      );
    } catch (error) {
    }
  };

  const deleteNotification = async (notificationId) => {
    try {
      await axiosInstance.delete(`/notification/${notificationId}`);
      setNotifications(
        notifications.filter((n) => n.notification_id !== notificationId)
      );
    } catch (error) {
    }
  };

  return (
    <div className="relative">
      {/* Bell Icon */}
      <button
        onClick={() => setShowDropdown(!showDropdown)}
        className="relative p-2 bg-gray-800 text-white rounded-full hover:bg-gray-700 transition duration-200"
      >
        <Bell className="w-6 h-6" />
        {notifications.some((n) => !n.is_read) && (
          <span className="absolute top-0 right-0 bg-red-500 text-white text-xs px-2 rounded-full">
            {notifications.filter((n) => !n.is_read).length}
          </span>
        )}
      </button>

      {/* Notification Dropdown */}
      {showDropdown && (
        <div className="absolute right-0 mt-2 w-80 bg-white shadow-lg rounded-lg p-4">
          <h3 className="text-lg font-semibold">Notifications</h3>
          <div className="divide-y">
            {loading ? (
              <p className="text-gray-500 text-center py-2">Loading...</p>
            ) : notifications.length > 0 ? (
              notifications.map((n) => (
                <div
                  key={n.notification_id || `${n.message}-${Math.random()}`}
                  className={`p-2 flex justify-between items-center ${
                    n.is_read ? "text-gray-500" : "text-black font-semibold"
                  }`}
                >
                  <p>{n.message}</p>
                  <div className="flex gap-2">
                    {!n.is_read && (
                      <button
                        className="text-green-500"
                        onClick={() => markAsRead(n.notification_id)}
                      >
                        <CheckCircle className="w-5 h-5" />
                      </button>
                    )}
                    <button
                      className="text-red-500"
                      onClick={() => deleteNotification(n.notification_id)}
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-center py-2">No notifications</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Notification;
