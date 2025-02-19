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
import AboutUs from "./components/AboutUs.jsx";
import PrivacyPolicy from "./components/PrivacyPolicy.jsx";
import ContactUs from "./components/ContactUs.jsx";

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

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <div className="flex-grow">
        <Routes>
          <Route
            path="/"
            element={authUser ? <HomePage /> : <Navigate to="/login" />}
          />
          <Route
            path="/register"
            element={!authUser ? <SignUpPage /> : <Navigate to="/" />}
          />
          <Route
            path="/login"
            element={!authUser ? <LoginPage /> : <Navigate to="/" />}
          />
          <Route path="/verifyOtp" element={<VerifyOtpPage />} />
          <Route
            path="/editProfile"
            element={authUser ? <EditProfilePage /> : <Navigate to="/login" />}
          />
          <Route path="/forgotPassword" element={<ForgotPasswordPage />} />
          <Route path="/resetPassword" element={<ResetPasswordPage />} />
          <Route path="/aboutus"  element={authUser?<AboutUs/>:<Navigate to="/login"/>}/>
          <Route path="/privacy-policy" element={authUser?<PrivacyPolicy/>:<Navigate to="/login"/>} />
          <Route path="/contact"  element={authUser?<ContactUs/>:<Navigate to="/login"/>}/>
        </Routes>
      </div>
      <Footer />
      {/* Footer stays at the bottom */}
      <Toaster />
    </div>
  );
};

export default App;
