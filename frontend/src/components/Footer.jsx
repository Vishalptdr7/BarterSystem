import { Link, useNavigate } from "react-router-dom";
import { Facebook, Twitter, Linkedin, Instagram, Settings } from "lucide-react";

const Footer = () => {
  const navigate = useNavigate(); 

  return (
    <footer className="bg-gray-900 text-gray-300 py-10">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center md:text-left">
          {/* Brand Section */}
          <div>
            <div className="flex items-center gap-2">
              <img
                onClick={() => navigate("/")}
                className="w-auto h-6 cursor-pointer"
                src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ077k7uCCqVLzAQ7doJ8hMPg8Fxs6R7H_rJg&s"
                alt="Logo"
              />
              <h2 className="text-2xl font-bold text-white">BarterSystem</h2>
            </div>
            <p className="text-sm mt-2 text-gray-400">
              Empowering users to exchange skills and services seamlessly.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-3">
              Quick Links
            </h3>
            <ul className="space-y-2">
              {[
                { to: "/", label: "Home" },
                { to: "/aboutus", label: "About Us" },
                { to: "/contact", label: "Contact" },
                { to: "/privacy-policy", label: "Privacy Policy" },
                { to: "/settings", label: "Settings", icon: Settings },
              ].map(({ to, label, icon: Icon }) => (
                <li key={to}>
                  <Link
                    to={to}
                    className="flex items-center gap-2 hover:text-indigo-400 transition"
                  >
                    {Icon && <Icon className="w-4 h-4" />}
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Social Media Links */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-3">Follow Us</h3>
            <div className="flex justify-center md:justify-start gap-4">
              <a
                href="https://www.facebook.com/profile.php?id=100025162934889"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-blue-500 transition"
              >
                <Facebook className="w-5 h-5" />
              </a>
              <a
                href="https://x.com/VishalPati11689"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-blue-400 transition"
              >
                <Twitter className="w-5 h-5" />
              </a>
              <a
                href="https://www.linkedin.com/in/vishal-patidar-234249286/"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-blue-300 transition"
              >
                <Linkedin className="w-5 h-5" />
              </a>
              <a
                href="https://www.instagram.com/vishal_ptdr07/?hl=en"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-pink-400 transition"
              >
                <Instagram className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="border-t border-gray-700 mt-10 pt-4 text-center text-sm text-gray-500">
          © {new Date().getFullYear()}{" "}
          <span className="text-white">BarterSystem</span>. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
