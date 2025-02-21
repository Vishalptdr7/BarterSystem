import { useState, useEffect } from "react";
import { io } from "socket.io-client";
import { axiosInstance } from "../lib/axios.js";
import { useAuthStore } from "../store/useAuthStore.js"; // Assuming authentication store

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
      setStatus("User ID is required!");
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
    <div className="max-w-md mx-auto p-4 bg-white shadow-lg rounded-lg">
      <h2 className="text-xl font-bold mb-4">Send Notification</h2>

      <input
        type="text"
        placeholder="User ID"
        value={userId}
        onChange={(e) => setUserId(e.target.value)}
        className="w-full p-2 border rounded mb-2"
        disabled={!!propUserId} // Disable input if userId is passed via props
      />

      <select
        value={messageType}
        onChange={(e) => setMessageType(e.target.value)}
        className="w-full p-2 border rounded mb-2"
      >
        <option value="connect">Connect Request</option>
        <option value="swap">Swap Request</option>
      </select>

      <button
        onClick={handleSendNotification}
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
      >
        Send Notification
      </button>

      {status && <p className="mt-2 text-sm">{status}</p>}
    </div>
  );
};

export default SendNotification;
