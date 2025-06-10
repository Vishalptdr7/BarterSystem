import UsersPage from "./pages/HomePage";
import SignUpPage from "./pages/SignUpPage";
import LoginPage from "./pages/LoginPage";
import VerifyOtpPage from "./pages/OtpPage"; // Import VerifyOtpPage
import Navbar from "./components/Navbar";
import Footer from "./components/Footer"; // Import Footer component
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { useAuthStore } from "./store/useAuthStore.js";
import { useEffect } from "react";
import EditProfilePage from "./pages/EditProfilePage";
import { Loader } from "lucide-react";
import { Toaster } from "react-hot-toast";
import ForgotPasswordPage from "./pages/ForgotPasswordPage.jsx";
import ResetPasswordPage from "./pages/ResetPasswordPage.jsx";
import AboutUs from "./pages/AboutUs.jsx";
import PrivacyPolicy from "./pages/PrivacyPolicy.jsx";
import ContactUs from "./pages/ContactUs.jsx";
import AdminHomePage from "./pages/HomeAdminPage";
import UserProfile from "./components/UserProfile.jsx";
import UserSkillsManager from "./components/UserSkillsManager.jsx";
import SettingPage from "./pages/SettingPage.jsx";
import { useThemeStore } from "./store/useThemeStore";
import SendNotification from "./components/SendNotification.jsx";
import { useSwapStore } from "./store/useSwapStore.js";
import { useChatStore } from "./store/useChatStore.js";
import ChatPage from "./pages/Cont.jsx";
import { useCallback } from "react";
import MainHomePage from "./pages/MainHomePage.jsx";
const App = () => {
  const { selectedUser, setSelectedUser } = useChatStore();

  const location = useLocation();

  const { authUser, checkAuth, isCheckingAuth } = useAuthStore();
  console.log("app.jsx file",authUser)
  const { theme } = useThemeStore();

  const { userId } = useSwapStore();

  // const checkAuthStatus = useCallback(() => {
  //   checkAuth();
  // }, [checkAuth]);
  // useEffect(() => {
  //   checkAuth();
  // }, []);
  
  // useEffect(() => {
  //   checkAuthStatus();
  //   setSelectedUser(null); // Reset selectedUser when navigating back to home page
  // }, [checkAuthStatus, setSelectedUser]);
  useEffect(() => {
    checkAuth();
  }, []);

  // ✅ Reset selectedUser only when location changes (no infinite loop)
  useEffect(() => {
    setSelectedUser(null);
  }, [location.pathname]);

  if (isCheckingAuth && !authUser)
    return (
      <div
        data-theme={theme}
        className="flex items-center justify-center h-screen"
      >
        <Loader className="size-10 animate-spin" />
      </div>
    );

  const role = authUser?.role || "";

  
  return (
    <div data-theme={theme} className="flex flex-col min-h-screen">
      <Navbar />
      <div className="flex-grow">
        <Routes>
          <Route path="/" element={<MainHomePage />} />

          <Route
            path="/admin"
            element={
              authUser && role === "admin" ? (
                <AdminHomePage />
              ) : (
                <Navigate to={authUser ? "/users" : "/"} />
              )
            }
          />

          <Route
            path="/users"
            element={
              authUser && role === "user" ? (
                <UsersPage />
              ) : (
                <Navigate to={authUser ? "/admin" : "/"} />
              )
            }
          />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<SignUpPage/>} />
          <Route path="/verifyOtp" element={<VerifyOtpPage />} />
          <Route path="/editProfile" element={<EditProfilePage />} />
          <Route path="/forgotPassword" element={<ForgotPasswordPage />} />
          <Route path="/resetPassword" element={<ResetPasswordPage />} />
          <Route path="/aboutus" element={<AboutUs />} />
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          <Route path="/contact" element={<ContactUs />} />
          <Route
            path="/profile/:userId"
            element={authUser ? <UserProfile /> : <Navigate to="/login" />}
          />
          <Route
            path="/user_skill/:userId"
            element={
              authUser ? <UserSkillsManager /> : <Navigate to="/login" />
            }
          />
          <Route path="/settings" element={<SettingPage />} />
          <Route
            path="/notification"
            element={<SendNotification userId={userId} />}
          />
          <Route
            path="/chat"
            element={authUser ? <ChatPage /> : <Navigate to="/login" />}
          />
        </Routes>
      </div>
      {location.pathname !== "/chat" && <Footer />}
      <Toaster />
    </div>
  );
};

export default App;
