import { create } from "zustand";
import { axiosInstance } from "../lib/axios.js";
import toast from "react-hot-toast";
import { io } from "socket.io-client";
const BASE_URL =
  import.meta.env.MODE === "development" ? "http://localhost:8080" : "/";

export const useAuthStore = create((set, get) => ({
  authUser: null,
  isSigningUp: false,
  isLoggingIn: false,
  isUpdatingProfile: false,
  isCheckingAuth: true,
  onlineUsers: [],
  socket: null,
  userId: null,
  setAuthUser: (userData) => set({ authUser: userData }),
  checkAuth: async () => {
    try {
      const res = await axiosInstance.get("/users/current");
      if (res.data.statusCode === 200) {
        set({ authUser: res.data.message, userId: res.data.message.user_id });
        get().connectSocket();
        console.log("Auth user set:", res.data.message);
      } else {
        set({ authUser: null });
      }
    } catch (error) {
      set({ authUser: null });
    } finally {
      set({ isCheckingAuth: false });
    }
  },

  signup: async (formData) => {
    set({ isSigningUp: true });
    try {
      const res = await axiosInstance.post("/users/register", formData);

      if (!res.data.success) {
        throw new Error(res.data.message || "Signup failed");
      }

      toast.success("Registered successfully. Check your email for OTP.");
    } catch (error) {
      toast.error(error.response?.data?.message || "Signup failed");
      throw error; // Ensure caller (SignUpPage) knows it failed
    } finally {
      set({ isSigningUp: false });
    }
  },
  verifyOtp: async ({ email, otp }) => {
    set({ isVerifying: true });
    try {
      const res = await axiosInstance.post("/users/verifyOtp", { email, otp });
      toast.success(res.data.message);

      // Save verified user to authUser (optional)
      set({ authUser: res.data.user });

      // ✅ FIXED
    } catch (error) {
      toast.error(error.response?.data?.message || "OTP verification failed");
      console.error("Error during OTP verification:", error);
      throw error;
    } finally {
      set({ isVerifying: false });
    }
  },

  login: async (formData) => {
    set({ isLoggingIn: true });
    try {
      const res = await axiosInstance.post("/users/login", formData);

      // ✅ Properly store user object (not just message string)
      set({ authUser: res.data.data.user, userId: res.data.data.user.user_id });

      toast.success("Logged in successfully");
      get().connectSocket();
      window.location.reload();
    } catch (error) {
      toast.error(error.response?.data?.errors?.[0] || "Login failed");
      console.log("login error", error.message);
    } finally {
      set({ isLoggingIn: false });
    }
  },

  logout: async () => {
    try {
      await axiosInstance.post("/users/logout");
      set({ authUser: null, userId: null });
      toast.success("Logged out successfully");
      get().disconnectSocket();
    } catch (error) {
      toast.error(error.response?.data?.message || "Logout failed");
    }
  },
  resendOtp: async (email) => {
    if (!email) {
      toast.error("Email is required to resend OTP");
      return;
    }

    try {
      await axiosInstance.post("/users/resendOtp", { email });
      set({ authUser: email });
      get().connectSocket();
      toast.success("OTP sent again to your email.");
      console.log("resendOtp", authUser);
    } catch (error) {
      console.error("Error in resending OTP:", error);
      toast.error(error.response?.data?.message || "Failed to resend OTP");
    }
  },
  connectSocket: () => {
    const { authUser } = get();

    if (!authUser || get().socket?.connected) return;

    // Ensure correct WebSocket connection
    const socket = io(BASE_URL, {
      auth: { userId: authUser?.user_id }, // Send userId for authentication
      transports: ["websocket"], // Force WebSocket transport
      withCredentials: true, // Ensure cookies and auth headers are sent
    });

    socket.on("connect", () =>
      console.log("✅ WebSocket connected:", socket.id)
    );
    socket.on("welcome", (msg) => console.log("📩 Message from server:", msg));
    socket.on("disconnect", (reason) =>
      console.warn("⚠️ WebSocket Disconnected:", reason)
    );
    socket.on("getOnlineUsers", (userIds) => {
      set({ onlineUsers: userIds });
    });
    socket.on("connect_error", (err) =>
      console.error("❌ WebSocket Error:", err)
    );

    set({ socket });
  },

  disconnectSocket: () => {
    if (get().socket?.connected) {
      get().socket.disconnect();
    }
  },
}));
