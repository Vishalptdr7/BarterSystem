import { Link } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore.js";
import { LogOut, Settings, User, Home } from "lucide-react";
import Notification from "./Notification.jsx";
const Navbar = () => {
  const { logout, authUser,userId } = useAuthStore();

  return (
    <header className="bg-white shadow-md fixed w-full top-0 z-50">
      <div className="container mx-auto px-6 py-3 flex justify-between items-center">
        {/* Left - Logo & Branding */}
        <Link
          to="/"
          className="flex items-center gap-3 text-gray-800 hover:opacity-80 transition-all"
        >
          <nav className="bg-white py-3 px-6 flex items-center">
            <div className="flex items-center">
              <img
                src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ077k7uCCqVLzAQ7doJ8hMPg8Fxs6R7H_rJg&s"
                alt="Logo"
                className="h-14 w-auto object-contain"
              />
            </div>
          </nav>

          <h1 className="text-xl font-bold">BarterSystem</h1>
        </Link>

        {/* Center - Navigation Links
        <nav className="hidden md:flex items-center gap-6 text-gray-700">
          <Link to="/" className="hover:text-indigo-600 transition">
            Home
          </Link>

          <Link to="/about" className="hover:text-indigo-600 transition">
            About
          </Link>
          <Link to="/contact" className="hover:text-indigo-600 transition">
            Contact
          </Link>
        </nav> */}

        {/* Right - User Actions */}
        <div className="flex items-center gap-4">
          {authUser ? (
            <>
              <Link
                to="/editProfile"
                className="flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-md hover:bg-gray-200 transition"
              >
                <div className="relative w-8 h-8">
                  {authUser?.profile_pic ? (
                    <img
                      src={authUser.profile_pic}
                      alt="Profile"
                      className="w-8 h-8 rounded-full object-cover border border-gray-300"
                    />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-gray-400 flex items-center justify-center text-white text-xs font-semibold border border-gray-300">
                      {authUser?.name?.charAt(0).toUpperCase() || "U"}
                    </div>
                  )}
                </div>
                <span className="hidden sm:inline">{authUser?.name}</span>{" "}
                {/* Display the name, hidden on small screens */}
              </Link>

              <Notification userId={userId} />

              <Link
                to="/settings"
                className="flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-md hover:bg-gray-200 transition"
              >
                <Settings className="w-5 h-5" />
                <span className="hidden sm:inline">Settings</span>
              </Link>

              <button
                onClick={logout}
                className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition"
              >
                <LogOut className="w-5 h-5" />
                <span className="hidden sm:inline">Logout</span>
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="px-4 py-2 border border-indigo-600 text-indigo-600 rounded-md hover:bg-indigo-600 hover:text-white transition"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition"
              >
                Sign Up
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
