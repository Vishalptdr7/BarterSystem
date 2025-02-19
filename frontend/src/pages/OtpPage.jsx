import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore.js";
import { toast } from "react-hot-toast";

const VerifyOtpPage = () => {
  const [otp, setOtp] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const [isResending, setIsResending] = useState(false); // State for resending OTP
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email || "";
  const password = location.state?.password;

  const [formData, setFormData] = useState({
    email: email,
    password: password,
  });

  const { verifyOtp, authUser, login, resendOtp } = useAuthStore(); // Import resendOtp

  const handleOtpChange = (e) => setOtp(e.target.value);

  const handleVerifyOtp = async () => {
    if (!otp) {
      toast.error("Please enter the OTP");
      return;
    }

    if (!email) {
      toast.error("User email is missing");
      return;
    }

    if (!/^\d{6}$/.test(otp)) {
      toast.error("OTP should be a 6-digit number");
      return;
    }

    setIsVerifying(true);

    try {
      await verifyOtp({ email, otp });
      setTimeout(() => {
        if (authUser) {
          console.log("User logged in successfully", authUser);
          login(formData);
          toast.success("Email verified successfully.");
          navigate("/"); // Redirect to home page
        } else {
          toast.error("User data not found after OTP verification");
        }
      }, 500); // Delay to ensure authUser is updated
    } catch (error) {
      console.error("Error in OTP verification:", error);
      toast.error("OTP verification failed");
    } finally {
      setIsVerifying(false);
    }
  };

  const handleResendOtp = async () => {
    if (!email) {
      toast.error("User email is missing");
      return;
    }
    setIsResending(true);
    try {
       resendOtp({ email });
      toast.success("OTP resent successfully.");
    } catch (error) {
      console.error("Error in resending OTP:");
      toast.error("Failed to resend OTP");
    } finally {
      setIsResending(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-indigo-500 via-purple-600 to-pink-500 flex justify-center items-center p-6">
      <div className="w-full max-w-md bg-white rounded-lg shadow-lg p-8 border border-gray-200">
        <h2 className="text-3xl font-semibold text-center text-gray-900 mb-6">
          Verify Your OTP
        </h2>
        <div className="space-y-4">
          <div>
            <label
              htmlFor="otp"
              className="block text-sm font-medium text-gray-700"
            >
              Enter OTP
            </label>
            <input
              id="otp"
              type="text"
              value={otp}
              onChange={handleOtpChange}
              className="w-full p-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 transition duration-200 ease-in-out"
              maxLength={6}
              placeholder="Enter 6-digit OTP"
            />
          </div>
          <button
            onClick={handleVerifyOtp}
            disabled={isVerifying}
            className="w-full py-3 bg-indigo-600 text-white rounded-md text-lg font-medium hover:bg-indigo-700 disabled:bg-indigo-400 transition duration-200 ease-in-out"
          >
            {isVerifying ? "Verifying..." : "Verify OTP"}
          </button>
          <p className="text-center text-sm text-gray-500">
            Didn't receive an OTP?{" "}
            <button
              onClick={handleResendOtp}
              disabled={isResending}
              className="text-indigo-600 hover:text-indigo-700"
            >
              {isResending ? "Resending..." : "Resend OTP"}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default VerifyOtpPage;
