import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore.js";
import { LogOut, MessageCircleCodeIcon, Menu, X } from "lucide-react";
import Notification from "./Notification.jsx";

const Navbar = () => {
  const { logout, authUser, userId } = useAuthStore();
  const [menuOpen, setMenuOpen] = useState(false);
  const dropdownRef = useRef(null);
  const internalClickRef = useRef(false);
  const role=authUser?.role || "user";
  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (internalClickRef.current) {
        internalClickRef.current = false;
        return;
      }
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setMenuOpen(false);
      }
    };

    if (menuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [menuOpen]);

  // 🔁 Keep your imports and state as is
  // ... (same up to return)

  return (
    <nav className="bg-white border-gray-200 dark:bg-gray-900 shadow-sm fixed w-full top-0 z-50">
      <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center space-x-3">
          <img
            src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ077k7uCCqVLzAQ7doJ8hMPg8Fxs6R7H_rJg&s"
            className="h-10 w-auto rounded-md shadow-sm"
            alt="Logo"
          />
          <span className="text-2xl font-semibold whitespace-nowrap dark:text-white">
            BarterSystem
          </span>
        </Link>

        {/* Mobile menu toggle */}
        <div className="md:hidden flex items-center gap-3">
          {authUser && (
            <>
              <Link
                to="/chat"
                className="text-gray-600 hover:text-indigo-600 dark:text-gray-300 dark:hover:text-indigo-400"
              >
                <MessageCircleCodeIcon size={24} />
              </Link>
              <Notification userId={userId} />
            </>
          )}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="text-gray-700 dark:text-gray-200 focus:outline-none"
          >
            {menuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Desktop Nav Links */}
        <div className="hidden md:flex space-x-6 items-center">
          <Link
            to="/"
            className="text-gray-700 hover:text-blue-700 dark:text-gray-200 dark:hover:text-blue-500"
          >
            Home
          </Link>
          {role === "user" ? (
            <Link
              to="/users"
              className="text-gray-700 hover:text-blue-700 dark:text-gray-200 dark:hover:text-blue-500"
            >
              Users
            </Link>
          ) : (
            <Link
              to="/admin"
              className="text-gray-700 hover:text-blue-700 dark:text-gray-200 dark:hover:text-blue-500"
            >
              Users
            </Link>
          )}
        </div>

        {/* Right Side Auth Actions (desktop) */}
        <div className="hidden md:flex items-center space-x-4">
          {authUser ? (
            <>
              <Link
                to="/editProfile"
                className="flex items-center gap-2 px-3 py-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition"
              >
                <div className="relative w-8 h-8">
                  {authUser?.profile_pic ? (
                    <img
                      src={authUser.profile_pic}
                      alt="Profile"
                      className="w-8 h-8 rounded-full object-cover border border-gray-300"
                    />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center text-white text-xs font-bold">
                      {authUser?.name?.charAt(0).toUpperCase() || "U"}
                    </div>
                  )}
                </div>
                <span className="hidden sm:inline text-sm text-gray-800 dark:text-black font-medium">
                  {authUser?.name}
                </span>
              </Link>

              <Link
                to="/chat"
                className="text-gray-600 hover:text-indigo-600 dark:text-gray-300 dark:hover:text-indigo-400"
              >
                <MessageCircleCodeIcon size={26} />
              </Link>

              <Notification userId={userId} />

              <button
                onClick={logout}
                className="flex items-center gap-2 px-3 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
              >
                <LogOut className="w-4 h-4" />
                <span className="hidden sm:inline text-sm">Logout</span>
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

      {/* Mobile Dropdown Menu */}
      {menuOpen && (
        <div
          className="md:hidden bg-white dark:bg-gray-900 px-6 pb-4 space-y-4"
          ref={dropdownRef}
        >
          <Link
            to="/"
            className="block text-gray-700 hover:text-blue-700 dark:text-gray-200 dark:hover:text-blue-500"
            onClick={() => {
              internalClickRef.current = true;
              setMenuOpen(false);
            }}
          >
            Home
          </Link>
          <Link
            to="/users"
            className="block text-gray-700 hover:text-blue-700 dark:text-gray-200 dark:hover:text-blue-500"
            onClick={() => {
              internalClickRef.current = true;
              setMenuOpen(false);
            }}
          >
            {authUser?.role === "admin" ? (
              <div>AdminPage</div>
            ) : authUser ? (
              <div>Users</div>
            ) : (
              ""
            )}
          </Link>

          {authUser ? (
            <>
              <Link
                to="/editProfile"
                className="flex items-center gap-2 px-3 py-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition"
                onClick={() => {
                  internalClickRef.current = true;
                  setMenuOpen(false);
                }}
              >
                <div className="relative w-8 h-8">
                  {authUser?.profile_pic ? (
                    <img
                      src={authUser.profile_pic}
                      alt="Profile"
                      className="w-8 h-8 rounded-full object-cover border border-gray-300"
                    />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center text-white text-xs font-bold">
                      {authUser?.name?.charAt(0).toUpperCase() || "U"}
                    </div>
                  )}
                </div>
                <span className="text-sm text-gray-800 dark:text-black font-medium">
                  {authUser?.name}
                </span>
              </Link>

              <button
                onClick={() => {
                  internalClickRef.current = true;
                  logout();
                  setMenuOpen(false);
                }}
                className="flex items-center gap-2 px-3 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition w-full"
              >
                <LogOut className="w-4 h-4" />
                <span className="text-sm">Logout</span>
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="block px-4 py-2 border border-indigo-600 text-indigo-600 rounded-md hover:bg-indigo-600 hover:text-white transition"
                onClick={() => {
                  internalClickRef.current = true;
                  setMenuOpen(false);
                }}
              >
                Login
              </Link>
              <Link
                to="/register"
                className="block px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition"
                onClick={() => {
                  internalClickRef.current = true;
                  setMenuOpen(false);
                }}
              >
                Sign Up
              </Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
