import React, { useEffect, useState } from "react";
import axios from "axios";
import { useForm } from "react-hook-form";

const API_BASE_URL = "http://localhost:8080/api/message";

const MessageComponent = ({ chatId, userId }) => {
  const [messages, setMessages] = useState([]);
  const { register, handleSubmit, reset } = useForm();

  useEffect(() => {
    fetchMessages();
  }, [chatId]);

  const fetchMessages = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/chat/${chatId}`, {
        headers: { Authorization: `Bearer YOUR_TOKEN_HERE` },
      });
      setMessages(res.data);
    } catch (error) {
      console.error("Error fetching messages", error);
    }
  };

  const onSubmit = async (data) => {
    const formData = new FormData();
    formData.append("chat_id", chatId);
    formData.append("sender_user_id", userId);
    formData.append("content", data.content);
    if (data.image[0]) {
      formData.append("image", data.image[0]);
    }

    try {
      const res = await axios.post(API_BASE_URL, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer YOUR_TOKEN_HERE`,
        },
      });
      setMessages([...messages, res.data]);
      reset();
    } catch (error) {
      console.error("Error sending message", error);
    }
  };

  const handleDeleteMessage = async (messageId) => {
    try {
      await axios.delete(`${API_BASE_URL}/${messageId}`, {
        headers: { Authorization: `Bearer YOUR_TOKEN_HERE` },
      });
      setMessages(messages.filter((msg) => msg.message_id !== messageId));
    } catch (error) {
      console.error("Error deleting message", error);
    }
  };

  return (
    <div className="flex flex-col h-full">
      <h2 className="text-xl font-bold mb-4">Messages</h2>
      <div className="flex-1 overflow-y-auto border p-2 mb-2">
        {messages.map((msg) => (
          <div key={msg.message_id} className="mb-2 flex items-center">
            <span
              className={`font-bold ${
                msg.sender_user_id === userId
                  ? "text-blue-500"
                  : "text-gray-700"
              }`}
            >
              {msg.sender_user_id === userId
                ? "You"
                : `User ${msg.sender_user_id}`}
              :
            </span>
            <span className="ml-2">{msg.content}</span>
            {msg.image && (
              <img
                src={msg.image}
                alt="Sent"
                className="w-12 h-12 ml-2 rounded"
              />
            )}
            <button
              className="ml-2 text-red-500"
              onClick={() => handleDeleteMessage(msg.message_id)}
            >
              ❌
            </button>
          </div>
        ))}
      </div>
      <form onSubmit={handleSubmit(onSubmit)} className="flex">
        <input
          type="text"
          {...register("content")}
          className="border p-2 flex-1"
          placeholder="Type a message..."
        />
        <input type="file" {...register("image")} className="border p-2" />
        <button type="submit" className="ml-2 bg-blue-500 text-white px-4 py-2">
          Send
        </button>
      </form>
    </div>
  );
};

export default MessageComponent;
