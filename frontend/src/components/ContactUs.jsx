import { Mail, Phone, MapPin } from "lucide-react";

const ContactComponent = () => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200 max-w-lg">
      {/* Header */}
      <h2 className="text-2xl font-semibold text-gray-900 text-center">
        Contact Us
      </h2>
      <p className="mt-2 text-gray-600 text-center">
        Reach out to us for any inquiries or support.
      </p>

      {/* Contact Info */}
      <div className="mt-6 space-y-4">
        <div className="flex items-center gap-3">
          <Mail className="text-indigo-600 size-6" />
          <a
            href="mailto:support@bartersystem.com"
            className="text-gray-800 font-medium hover:text-indigo-600 transition"
          >
            supportbartersystem@gmail.com
          </a>
        </div>

        <div className="flex items-center gap-3">
          <Phone className="text-indigo-600 size-6" />
          <span className="text-gray-800 font-medium">+91 9174030338</span>
        </div>

        <div className="flex items-center gap-3">
          <MapPin className="text-indigo-600 size-6" />
          <span className="text-gray-800 font-medium">Bhopal, India</span>
        </div>
      </div>
    </div>
  );
};

export default ContactComponent;
