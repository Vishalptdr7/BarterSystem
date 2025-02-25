import React, { useState, useEffect } from "react";
import axios from "axios";
import { axiosInstance } from "../lib/axios";

const ChatComponent = () => {
  const [chats, setChats] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);
  const [newChatUser, setNewChatUser] = useState("");
  const [userId, setUserId] = useState(1); // Set user ID dynamically

  useEffect(() => {
    fetchChats();
  }, []);

  const fetchChats = async () => {
    try {
      const response = await axios.get(`/chat/${userId}`);
      setChats(response.data);
    } catch (error) {
      console.error("Error fetching chats", error);
    }
  };

  const startChat = async () => {
    if (!newChatUser) return;
    try {
      const response = await axiosInstance.post("/chat", {
        user1_id: userId,
        user2_id: newChatUser,
      });
      setChats([...chats, response.data]);
      setNewChatUser("");
    } catch (error) {
      console.error("Error starting chat", error);
    }
  };

  const deleteChat = async (chatId) => {
    try {
      await axios.delete(`/chat/${chatId}`);
      setChats(chats.filter((chat) => chat.chat_id !== chatId));
    } catch (error) {
      console.error("Error deleting chat", error);
    }
  };

  return (
    <div style={{ display: "flex", gap: "20px" }}>
      {/* Sidebar for Chat List */}
      <div
        style={{ width: "30%", borderRight: "1px solid #ccc", padding: "10px" }}
      >
        <h2>Chats</h2>
        <input
          type="text"
          placeholder="Enter user ID"
          value={newChatUser}
          onChange={(e) => setNewChatUser(e.target.value)}
        />
        <button onClick={startChat}>Start Chat</button>
        <ul>
          {chats.map((chat) => (
            <li key={chat.chat_id}>
              <button onClick={() => setSelectedChat(chat)}>
                Chat {chat.chat_id}
              </button>
              <button onClick={() => deleteChat(chat.chat_id)}>Delete</button>
            </li>
          ))}
        </ul>
      </div>

      {/* Chat Details */}
      <div style={{ width: "70%", padding: "10px" }}>
        {selectedChat ? (
          <div>
            <h2>Chat {selectedChat.chat_id}</h2>
            <p>
              Users: {selectedChat.user1_id} & {selectedChat.user2_id}
            </p>
          </div>
        ) : (
          <p>Select a chat to view details</p>
        )}
      </div>
    </div>
  );
};

export default ChatComponent;
