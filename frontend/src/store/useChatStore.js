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

  getMessages: async (userId) => {
    set({ isMessagesLoading: true });
    try {
      const res = await axiosInstance.get(`/message/${userId}`);

      const sortedMessages = (res.data || []).sort(
        (a, b) => new Date(a.sent_at) - new Date(b.sent_at)
      );

      set({ messages: sortedMessages });
    } catch (error) {
      console.error("Fetch message error:", error.response?.data);
      toast.error(error.response?.data?.message || "Failed to fetch messages");
    } finally {
      set({ isMessagesLoading: false });
    }
  },

  sendMessage: async ({ content, image }) => {
    const { selectedUser, messages } = get();
    const authUser = useAuthStore.getState().authUser;
    const socket = useAuthStore.getState().socket;

    if (!selectedUser || !authUser) return;

    try {
      const formData = new FormData();
      formData.append("content", content);

      if (image) {
        const blob = await fetch(image).then((res) => res.blob());
        formData.append("image", blob, "image.jpg");
      }

      // ✅ Send to backend (save to DB)
      const res = await axiosInstance.post(
        `/message/${selectedUser.user_id}`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      const newMessage = res.data;

      // ✅ Update local state
      set({ messages: [...messages, newMessage] });

      // ✅ Emit via socket for real-time delivery
      if (socket) {
        socket.emit("sendMessage", {
          groupId: null,
          message: newMessage,
          sender: authUser.user_id,
          receiver: selectedUser.user_id,
        });
      }
    } catch (error) {
      console.error("Error Response:", error.response?.data);
      toast.error(error.response?.data?.message || "Failed to send message");
    }
  },

  markMessagesAsRead: async (messageId) => {
    try {
      await axiosInstance.post("/message/mark-read", {
        message_id: messageId,
      });
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to mark as read");
    }
  },

  subscribeToMessages: () => {
    const socket = useAuthStore.getState().socket;
    if (!socket) return;

    socket.off("receiveMessage"); // Prevent duplicate listeners

    socket.on("receiveMessage", (payload) => {
      const { message, sender } = payload;
      const selectedUser = get().selectedUser;
      const authUserId = useAuthStore.getState().authUser?.user_id;

      // ✅ Append only if the message is between the current user and selected user
      if (
        selectedUser &&
        ((message.sender_user_id === selectedUser.user_id &&
          message.receiver_user_id === authUserId) ||
          (message.receiver_user_id === selectedUser.user_id &&
            message.sender_user_id === authUserId))
      ) {
        set((state) => ({
          messages: [...state.messages, message],
        }));
      }
    });
  },

  unsubscribeFromMessages: () => {
    const socket = useAuthStore.getState().socket;
    if (!socket) return;
    socket.off("receiveMessage"); // ✅ Correct event name
  },

  markMessagesAsRead: async (messageId) => {
    const authUser = useAuthStore.getState().authUser;

    if (!authUser?.user_id || !messageId) return;

    try {
      await axiosInstance.post("/message/mark_read", {
        message_id: messageId,
        user_id: authUser.user_id, // ✅ include user_id
      });
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to mark as read");
    }
  },

  setSelectedUser: (selectedUser) => set({ selectedUser }),
}));
