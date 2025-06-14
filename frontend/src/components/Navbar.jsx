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
  const role = authUser?.role || "user";

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

  return (
    <nav className="bg-white dark:bg-gray-900 shadow-md fixed w-full z-50 top-0 border-b border-gray-200">
      <div className="max-w-screen-xl mx-auto flex items-center justify-between px-4 py-3 md:px-6 lg:px-8">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-3">
          <img
            src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ077k7uCCqVLzAQ7doJ8hMPg8Fxs6R7H_rJg&s"
            alt="Logo"
            className="h-10 w-auto rounded-md shadow-md"
          />
          <span className="text-2xl font-bold text-gray-800 dark:text-white tracking-wide">
            BarterSystem
          </span>
        </Link>

        {/* Mobile menu button */}
        <div className="flex md:hidden items-center gap-3">
          {authUser && (
            <>
              <Link
                to="/chat"
                className="text-gray-600 hover:text-indigo-600 dark:text-gray-300 dark:hover:text-indigo-400 transition"
              >
                <MessageCircleCodeIcon size={24} />
              </Link>
              <Notification userId={userId} />
            </>
          )}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="text-gray-700 dark:text-gray-200 focus:outline-none transition"
          >
            {menuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center space-x-6">
          <Link
            to="/"
            className="text-gray-700 dark:text-gray-200 hover:text-indigo-600 dark:hover:text-indigo-400 transition"
          >
            Home
          </Link>
          <Link
            to={role === "user" ? "/users" : "/admin"}
            className="text-gray-700 dark:text-gray-200 hover:text-indigo-600 dark:hover:text-indigo-400 transition"
          >
            Users
          </Link>
        </div>

        {/* Desktop right auth actions */}
        <div className="hidden md:flex items-center space-x-4">
          {authUser ? (
            <>
              <Link
                to="/editProfile"
                className="flex items-center gap-2 px-3 py-2 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition shadow-sm"
              >
                <div className="w-8 h-8 relative">
                  {authUser?.profile_pic ? (
                    <img
                      src={authUser.profile_pic}
                      alt="Profile"
                      className="w-8 h-8 rounded-full object-cover border border-gray-300"
                    />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center text-white text-xs font-bold">
                      {authUser?.name?.charAt(0).toUpperCase() || "U"}
                    </div>
                  )}
                </div>
                <span className="hidden sm:inline text-sm font-medium text-gray-900 dark:text-white">
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
                className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition shadow-md"
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

      {/* Mobile dropdown menu */}
      {menuOpen && (
        <div
          ref={dropdownRef}
          className="md:hidden px-6 pb-4 pt-2 space-y-4 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700"
        >
          <Link
            to="/"
            onClick={() => {
              internalClickRef.current = true;
              setMenuOpen(false);
            }}
            className="block text-gray-700 dark:text-gray-200 hover:text-indigo-600 dark:hover:text-indigo-400 transition"
          >
            Home
          </Link>

          <Link
            to="/users"
            onClick={() => {
              internalClickRef.current = true;
              setMenuOpen(false);
            }}
            className="block text-gray-700 dark:text-gray-200 hover:text-indigo-600 dark:hover:text-indigo-400 transition"
          >
            {authUser?.role === "admin" ? "AdminPage" : "Users"}
          </Link>

          {authUser ? (
            <>
              <Link
                to="/editProfile"
                onClick={() => {
                  internalClickRef.current = true;
                  setMenuOpen(false);
                }}
                className="flex items-center gap-3 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 px-3 py-2 rounded-lg shadow-sm transition"
              >
                {authUser?.profile_pic ? (
                  <img
                    src={authUser.profile_pic}
                    alt="Profile"
                    className="w-8 h-8 rounded-full object-cover border"
                  />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center text-white text-xs font-bold">
                    {authUser?.name?.charAt(0).toUpperCase() || "U"}
                  </div>
                )}
                <span className="text-sm font-medium text-gray-900 dark:text-white">
                  {authUser?.name}
                </span>
              </Link>

              <button
                onClick={() => {
                  internalClickRef.current = true;
                  logout();
                  setMenuOpen(false);
                }}
                className="w-full flex items-center justify-start gap-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
              >
                <LogOut className="w-4 h-4" />
                <span className="text-sm">Logout</span>
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                onClick={() => {
                  internalClickRef.current = true;
                  setMenuOpen(false);
                }}
                className="block px-4 py-2 border border-indigo-600 text-indigo-600 rounded-md hover:bg-indigo-600 hover:text-white transition"
              >
                Login
              </Link>
              <Link
                to="/register"
                onClick={() => {
                  internalClickRef.current = true;
                  setMenuOpen(false);
                }}
                className="block px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition"
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
