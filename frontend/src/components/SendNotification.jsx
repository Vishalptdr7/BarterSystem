import { useState, useEffect } from "react";
import { io } from "socket.io-client";
import { axiosInstance } from "../lib/axios.js";
import { useAuthStore } from "../store/useAuthStore.js"; // Assuming authentication store
import { FaBell } from "react-icons/fa"; // Import an icon for better UI

const SendNotification = ({ userId: propUserId }) => {
  const [userId, setUserId] = useState(propUserId || ""); // Initialize with propUserId
  console.log({ userId });
  const [messageType, setMessageType] = useState("connect");
  const [status, setStatus] = useState("");

  // Get sender details (Assuming user data is stored in an authentication store)
  const { authUser } = useAuthStore(); // user = { user_id: "123", name: "John Doe" }
  console.log(authUser.user_id);
  useEffect(() => {
    // Connect WebSocket inside useEffect to avoid multiple connections
    const socket = io("http://localhost:8080", {
      transports: ["websocket"],
      withCredentials: true,
    });

    socket.on("receiveNotification", ({ message }) => {
      alert(`🔔 New Notification: ${message}`);
    });

    return () => {
      socket.disconnect(); // Cleanup on unmount
    };
  }, []);

  // Generate message including sender's name
  const getMessage = () => {
    const senderName = authUser?.name || "Someone"; // Fallback if user is undefined
    return messageType === "connect"
      ? `${senderName} wants to connect with you`
      : `${senderName} wants to swap with you`;
  };

  // Send notification via API and WebSocket
  const handleSendNotification = async () => {
    if (!userId) {
      setStatus("⚠️ User ID is required!");
      return;
    }

    if (!authUser) {
      setStatus("❌ Authentication required!");
      return;
    }

    const message = getMessage();

    try {
      // Send notification via REST API
      await axiosInstance.post("/notification", {
        user_id: userId,
        message: message,
        sender_id: authUser?.user_id, // Ensure sender_id is passed correctly
      });

      setStatus("✅ Notification Sent!");

      // Emit WebSocket event
      const socket = io("http://localhost:8080");
      socket.emit("sendNotification", {
        user_id: userId,
        sender_id: authUser?.user_id,
        message: message,
      });

      setUserId(propUserId || ""); // Reset userId to prop value
    } catch (error) {
      setStatus("❌ Failed to send notification.");
      console.error("Error:", error);
    }
  };

  return (
    <div className="max-w-lg mx-auto mt-10 p-6 bg-white shadow-xl rounded-lg border border-gray-200">
      <h2 className="text-2xl font-semibold text-gray-800 flex items-center gap-2">
        <FaBell className="text-blue-500" /> Send Notification
      </h2>

      <div className="mt-4">
        <label className="block text-gray-600 text-sm font-medium mb-1">
          User ID
        </label>
        <input
          type="text"
          placeholder="Enter User ID"
          value={userId}
          onChange={(e) => setUserId(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
          disabled={!!propUserId} // Disable input if userId is passed via props
        />
      </div>

      <div className="mt-4">
        <label className="block text-gray-600 text-sm font-medium mb-1">
          Notification Type
        </label>
        <select
          value={messageType}
          onChange={(e) => setMessageType(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-blue-400 focus:outline-none"
        >
          <option value="connect">Connect Request</option>
          <option value="swap">Swap Request</option>
        </select>
      </div>

      <button
        onClick={handleSendNotification}
        className="mt-6 w-full bg-blue-600 text-white font-semibold py-2 rounded-lg hover:bg-blue-700 transition duration-300"
      >
        Send Notification
      </button>

      {status && (
        <p
          className={`mt-3 text-sm font-medium ${
            status.includes("❌") ? "text-red-600" : "text-green-600"
          }`}
        >
          {status}
        </p>
      )}
    </div>
  );
};

export default SendNotification;
