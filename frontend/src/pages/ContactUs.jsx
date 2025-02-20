import { Mail, Phone, MapPin } from "lucide-react";

const ContactComponent = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white max-w-lg w-full p-8 rounded-lg shadow-lg border border-gray-200">
        {/* Header */}
        <h2 className="text-3xl font-bold text-gray-900 text-center">
          Contact Us
        </h2>
        <p className="mt-2 text-gray-600 text-center">
          We're here to help! Reach out to us for any inquiries or support.
        </p>

        {/* Contact Info */}
        <div className="mt-6 space-y-6">
          <div className="flex items-center gap-4 bg-gray-50 p-4 rounded-lg border">
            <Mail className="text-indigo-600 size-6" />
            <a
              href="mailto:support@bartersystem.com"
              className="text-gray-800 font-medium hover:text-indigo-600 transition"
            >
              supportbartersystem@gmail.com
            </a>
          </div>

          <div className="flex items-center gap-4 bg-gray-50 p-4 rounded-lg border">
            <Phone className="text-green-600 size-6" />
            <span className="text-gray-800 font-medium">+91 9174030338</span>
          </div>

          <div className="flex items-center gap-4 bg-gray-50 p-4 rounded-lg border">
            <MapPin className="text-red-600 size-6" />
            <span className="text-gray-800 font-medium">Bhopal, India</span>
          </div>
        </div>

        {/* Contact Button */}
        <div className="mt-8 text-center">
          <a
            href="mailto:support@bartersystem.com"
            className="bg-indigo-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-indigo-700 transition"
          >
            Send Email
          </a>
        </div>
      </div>
    </div>
  );
};

export default ContactComponent;
