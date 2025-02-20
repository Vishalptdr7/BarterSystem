import HomePage from "./pages/HomePage";
import SignUpPage from "./pages/SignUpPage";
import LoginPage from "./pages/LoginPage";
import VerifyOtpPage from "./pages/OtpPage"; // Import VerifyOtpPage
import Navbar from "./components/Navbar";
import Footer from "./components/Footer"; // Import Footer component
import { Routes, Route, Navigate } from "react-router-dom";
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
const App = () => {
  const { authUser, checkAuth, isCheckingAuth } = useAuthStore();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);
  
  if (isCheckingAuth && !authUser)
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader className="size-10 animate-spin" />
      </div>
    );
    const role=authUser?.role;
    console.log(authUser)
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <div className="flex-grow">
        <Routes>
          <Route
            path="/admin/home"
            element={
              authUser && role === "admin" ? (
                <AdminHomePage />
              ) : (
                <Navigate to={authUser ? "/user/home" : "/login"} />
              )
            }
          />

          <Route
            path="/user/home"
            element={
              authUser && role === "user" ? (
                <HomePage />
              ) : (
                <Navigate to={authUser ? "/admin/home" : "/login"} />
              )
            }
          />

          <Route
            path="/"
            element={
              authUser ? (
                role === "admin" ? (
                  <Navigate to="/admin/home" />
                ) : (
                  <Navigate to="/user/home" />
                )
              ) : (
                <Navigate to="/login" />
              )
            }
          />

          <Route
            path="/register"
            element={
              !authUser ? (
                <SignUpPage />
              ) : (
                <Navigate
                  to={role === "admin" ? "/admin/home" : "/user/home"}
                />
              )
            }
          />
          <Route
            path="/login"
            element={
              !authUser ? (
                <LoginPage />
              ) : (
                <Navigate
                  to={role === "admin" ? "/admin/home" : "/user/home"}
                />
              )
            }
          />
          <Route path="/verifyOtp" element={<VerifyOtpPage />} />
          <Route
            path="/editProfile"
            element={authUser ? <EditProfilePage /> : <Navigate to="/login" />}
          />
          <Route path="/forgotPassword" element={<ForgotPasswordPage />} />
          <Route path="/resetPassword" element={<ResetPasswordPage />} />
          <Route
            path="/aboutus"
            element={authUser ? <AboutUs /> : <Navigate to="/login" />}
          />
          <Route
            path="/privacy-policy"
            element={authUser ? <PrivacyPolicy /> : <Navigate to="/login" />}
          />
          <Route
            path="/contact"
            element={authUser ? <ContactUs /> : <Navigate to="/login" />}
          />
          <Route
            path="/profile/:userId"
            element={authUser ? <UserProfile /> : <Navigate to="/login" />}
          />
          <Route path="/user_skill/:userId" element={authUser?<UserSkillsManager />:<Navigate to="/login" />} />
          <Route path="/settings" element={<SettingPage/>}/>
          {/* <Route
            path="/skill"
            element={authUser ? <SkillsPage /> : <Navigate to="/login" />}
          /> */}
        </Routes>
      </div>
      <Footer />
      {/* Footer stays at the bottom */}
      <Toaster />
    </div>
  );
};

export default App;
