import { Link } from "react-router-dom";
import { Facebook, Twitter, Linkedin, Instagram, Settings } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-gray-300 py-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center md:text-left">
          {/* Brand Section */}
          <div>
            <h2 className="text-xl font-bold text-white">BarterSystem</h2>
            <p className="text-sm mt-2">
              Empowering users to exchange skills and services seamlessly.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold text-white">Quick Links</h3>
            <ul className="mt-2 space-y-2">
              <li>
                <Link to="/" className="hover:text-indigo-400 transition">
                  Home
                </Link>
              </li>
              <li>
                <Link
                  to="/aboutus"
                  className="hover:text-indigo-400 transition"
                >
                  About Us
                </Link>
              </li>
              <li>
                <Link
                  to="/contact"
                  className="hover:text-indigo-400 transition"
                >
                  Contact
                </Link>
              </li>
              <li>
                <Link
                  to="/privacy-policy"
                  className="hover:text-indigo-400 transition"
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link
                  to="/settings"
                  className="hover:text-indigo-400 transition"
                >
                  Settings
                </Link>
              </li>
            </ul>
          </div>

          {/* Social Media Links */}
          <div>
            <h3 className="text-lg font-semibold text-white">Follow Us</h3>
            <div className="flex justify-center md:justify-start gap-4 mt-3">
              <Link to="https://www.facebook.com/profile.php?id=100025162934889">
                <Facebook className="w-5 h-5" />
              </Link>
              <Link to="https://x.com/VishalPati11689">
                <Twitter className="w-5 h-5" />
              </Link>
              <Link to="https://www.linkedin.com/in/vishal-patidar-234249286/">
                <Linkedin className="w-5 h-5" />
              </Link>
              <Link to="https://www.instagram.com/vishal_ptdr07/?hl=en">
                <Instagram className="w-5 h-5" />
              </Link>
            </div>
          </div>
        </div>

        {/* Copyright Section */}
        <div className="border-t border-gray-700 mt-6 pt-4 text-center text-sm">
          © {new Date().getFullYear()} BarterSystem. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
