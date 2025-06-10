import { useState } from "react";
import { useAuthStore } from "../store/useAuthStore.js";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { EyeIcon, EyeOffIcon } from "lucide-react"; // Using lucide-react for icons

const SignUpPage = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { signup, isSigningUp } = useAuthStore();
  const navigate = useNavigate();
    const [showPassword, setShowPassword] = useState(false);


  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Wait for signup to finish before redirecting
      await signup({ name, email, password });

      // Pass email to VerifyOtpPage using state in the navigate
      navigate("/verifyOtp", { state: { email ,password} });
    } catch (error) {
      toast.error("Signup failed. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-teal-400 via-teal-500 to-teal-600 flex justify-center items-center p-6">
      <div className="w-full max-w-lg bg-white rounded-lg shadow-lg p-8 border border-gray-200">
        <h2 className="text-3xl font-semibold text-center text-gray-900 mb-6">
          Sign Up
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-700"
            >
              Name
            </label>
            <input
              id="name"
              type="text"
              placeholder="Enter your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full p-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 transition duration-200 ease-in-out"
            />
          </div>
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700"
            >
              Email
            </label>
            <input
              id="email"
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full p-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 transition duration-200 ease-in-out"
            />
          </div>
          <div className="relative">
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700"
            >
              Password
            </label>
            <div className="relative">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full p-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 transition duration-200 ease-in-out pr-12"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 transition"
              >
                {showPassword ? (
                  <EyeOffIcon size={20} />
                ) : (
                  <EyeIcon size={20} />
                )}
              </button>
            </div>
          </div>
          
          <button
            type="submit"
            disabled={isSigningUp}
            className="w-full py-3 bg-teal-600 text-white rounded-md text-lg font-medium hover:bg-teal-700 disabled:bg-teal-400 transition duration-200 ease-in-out"
          >
            {isSigningUp ? "Signing up..." : "Sign Up"}
          </button>
          <p className="text-center text-sm text-gray-500">
            Already have an account?{" "}
            <a href="/login" className="text-teal-600 hover:text-teal-700">
              Log in
            </a>
          </p>
        </form>
      </div>
    </div>
  );
};

export default SignUpPage;
