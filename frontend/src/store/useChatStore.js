import { create } from "zustand";
import toast from "react-hot-toast";
import { axiosInstance } from "../lib/axios";
import { useAuthStore } from "./useAuthStore";

export const useChatStore = create((set, get) => ({
  messages: [],
  users: [],
  selectedUser: null,
  isUsersLoading: false,
  isMessagesLoading: false,

  // Fetch users for the sidebar (users who have chatted)
  getUsers: async () => {
    set({ isUsersLoading: true });
    try {
      const res = await axiosInstance.get("/message/user");
      set({ users: res.data });
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to fetch users");
    } finally {
      set({ isUsersLoading: false });
    }
  },

  // Fetch messages between logged-in user and selected user
  getMessages: async (userId) => {
    set({ isMessagesLoading: true });
    try {
      const res = await axiosInstance.get(`/message/${userId}`);
      console.log("New message response:", res.data);

      set({ messages: res.data || [] }); // Ensure messages is always an array
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to fetch messages");
    } finally {
      set({ isMessagesLoading: false });
    }
  },

  // Send a new message (text/image)
  sendMessage: async ({ content, image }) => {
    const { selectedUser, messages } = get();
    if (!selectedUser) return;

    try {
      const formData = new FormData();
      formData.append("content", content);

      if (image) {
        const blob = await fetch(image).then((res) => res.blob()); // Convert Base64 to Blob
        formData.append("image", blob, "image.jpg"); // Append the image file
      }

      const res = await axiosInstance.post(
        `/message/${selectedUser.user_id}`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      set({ messages: [...messages, res.data] });
    } catch (error) {
      console.error("Error Response:", error.response?.data);
      toast.error(error.response?.data?.message || "Failed to send message");
    }
  },

  // Mark messages as read
  markMessagesAsRead: async (messageId) => {
    try {
      await axiosInstance.post("/message/mark-read", {
        message_id: messageId,
      });
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to mark as read");
    }
  },

  // Subscribe to real-time new messages
  subscribeToMessages: () => {
    const { selectedUser } = get();
    if (!selectedUser) return;

    const socket = useAuthStore.getState().socket;
    if (!socket) return;

    socket.on("newMessage", (newMessage) => {
      if (
        newMessage.sender_user_id === selectedUser.user_id || // Adjusted for MySQL
        newMessage.receiver_user_id === selectedUser.user_id
      ) {
        set({ messages: [...get().messages, newMessage] });
      }
    });

    console.log("Subscribed to new messages...");
  },

  // Unsubscribe from messages when switching users
  unsubscribeFromMessages: () => {
    const socket = useAuthStore.getState().socket;
    if (!socket) return;
    socket.off("newMessage");
    console.log("Unsubscribed from new messages...");
  },

  setSelectedUser: (selectedUser) => set({ selectedUser }),
}));
