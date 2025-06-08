import { useState ,useEffect} from "react";
import { useAuthStore } from "../store/useAuthStore.js";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff, Loader2, Lock, Mail } from "lucide-react";

const LoginPage = () => {
  const navigate = useNavigate();
  const { login, isLoggingIn,authUser } = useAuthStore();
  useEffect(() => {
    if (authUser) {
      navigate("/user/home");
    }
  }, [authUser, navigate]);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleSubmit = async(e) => {
    e.preventDefault();
    await login(formData);
    
  };

  return (
    <div className="h-screen bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center p-8">
      <div className="bg-white rounded-lg shadow-xl w-full sm:max-w-md max-w-[400px] p-8">
        {/* Logo and Heading */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-semibold text-gray-900">Welcome Back</h1>
          <p className="text-gray-600">Please sign in to continue</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Email Input */}
          <div className="relative">
            <Mail className="absolute left-4 top-3 text-gray-500" />
            <input
              type="email"
              className="w-full px-12 py-3 border rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="you@example.com"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
            />
          </div>

          {/* Password Input */}
          <div className="relative">
            <Lock className="absolute left-4 top-3 text-gray-500" />
            <input
              type={showPassword ? "text" : "password"}
              className="w-full px-12 py-3 border rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Password"
              value={formData.password}
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
            />
            <button
              type="button"
              className="absolute right-4 top-3"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? (
                <EyeOff className="h-5 w-5 text-gray-500" />
              ) : (
                <Eye className="h-5 w-5 text-gray-500" />
              )}
            </button>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full py-3 bg-indigo-600 text-white rounded-lg font-semibold focus:outline-none hover:bg-indigo-700 transition duration-200 ease-in-out"
            disabled={isLoggingIn}
          >
            {isLoggingIn ? (
              <Loader2 className="h-5 w-5 animate-spin mx-auto" />
            ) : (
              "Sign In"
            )}
          </button>
        </form>

        {/* Additional Links */}
        <div className="text-center mt-6">
          <p className="text-gray-500 text-sm">
            Don't have an account?{" "}
            <Link
              to="/register"
              className="text-indigo-600 hover:text-indigo-700"
            >
              Create an account
            </Link>
          </p>

          {/* Forgot Password Link */}
          <p className="text-gray-500 text-sm mt-2">
            <Link
              to="/forgotPassword"
              className="text-indigo-600 hover:text-indigo-700"
            >
              Forgot Password?
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
