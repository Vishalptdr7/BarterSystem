import { useState, useEffect, useRef } from "react";
import { io } from "socket.io-client";
import { axiosInstance } from "../lib/axios.js";
import { useAuthStore } from "../store/useAuthStore.js";
import { FaBell } from "react-icons/fa";

const SendNotification = ({ userId: propUserId }) => {
  const [userId, setUserId] = useState(propUserId || "");
  const [messageType, setMessageType] = useState("connect");
  const [status, setStatus] = useState("");
  const { authUser } = useAuthStore();
  const socketRef = useRef(null); 

  useEffect(() => {
    if (!authUser?.user_id) return;

    socketRef.current = io("http://localhost:8080", {
      transports: ["websocket"],
      withCredentials: true,
      auth: {
        userId: authUser.user_id,
      },
    });

    socketRef.current.on("receiveNotification", ({ message }) => {
      // alert(`🔔 New Notification: ${message}`);
    });

    return () => {
      socketRef.current?.disconnect();
    };
  }, [authUser?.user_id]);

  const getMessage = async () => {
    const senderName = authUser?.name || "Someone";
    return messageType === "connect"
      ? `${senderName} wants to connect with you`
      : `${senderName} wants to swap with you`;
  };

  const handleSendNotification = async () => {
    if (!userId) {
      setStatus("⚠️ User ID is required!");
      return;
    }

    if (!authUser) {
      setStatus("❌ Authentication required!");
      return;
    }

    const message = await getMessage();

    try {
      await axiosInstance.post("/notification", {
        user_id: userId,
        message: message,
        sender_id: authUser.user_id,
      });

      setStatus("✅ Notification Sent!");

      socketRef.current?.emit("sendNotification", {
        user_id: userId,
        sender_id: authUser.user_id,
        message: message,
      });

      setUserId(propUserId || "");
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
          disabled={!!propUserId}
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
