import { Mail, Phone, MapPin } from "lucide-react";

const ContactComponent = () => {
  return (
    <section className="bg-white dark:bg-gray-900 min-h-screen flex items-center justify-center px-4 py-12">
      <div className="container max-w-6xl mx-auto space-y-12">
        {/* Header */}
        <div className="text-center">
          <p className="text-blue-600 p-7 font-medium dark:text-blue-400">
            Contact us
          </p>
          <h1 className="mt-2 text-3xl font-semibold text-gray-800 dark:text-white md:text-4xl">
            Get in touch
          </h1>
          <p className="mt-3 text-gray-600 dark:text-gray-400">
            Our friendly team would love to hear from you.
          </p>
        </div>

        {/* Contact Info Grid */}
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {/* Email */}
          <div className="flex items-start gap-4 bg-gray-50 dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700">
            <span className="inline-block p-3 text-blue-600 rounded-full bg-blue-100 dark:bg-gray-700">
              <Mail className="w-6 h-6" />
            </span>
            <div>
              <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
                Email
              </h3>
              <a
                href="mailto:supportbartersystem@gmail.com"
                className="block mt-1 text-gray-600 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400"
              >
                supportbartersystem@gmail.com
              </a>
            </div>
          </div>

          {/* Phone */}
          <div className="flex items-start gap-4 bg-gray-50 dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700">
            <span className="inline-block p-3 text-green-600 rounded-full bg-green-100 dark:bg-gray-700">
              <Phone className="w-6 h-6" />
            </span>
            <div>
              <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
                Phone
              </h3>
              <p className="mt-1 text-gray-600 dark:text-gray-300">
                +91 9174030338
              </p>
            </div>
          </div>

          {/* Location */}
          <div className="flex items-start gap-4 bg-gray-50 dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700">
            <span className="inline-block p-3 text-red-600 rounded-full bg-red-100 dark:bg-gray-700">
              <MapPin className="w-6 h-6" />
            </span>
            <div>
              <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
                Location
              </h3>
              <p className="mt-1 text-gray-600 dark:text-gray-300">
                Bhopal, India
              </p>
            </div>
          </div>
        </div>

        {/* Contact Button */}
        <div className="text-center">
          <a
            href="mailto:supportbartersystem@gmail.com"
            className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
          >
            Send Email
          </a>
        </div>

        {/* Map */}
        <div className="w-full h-[400px] rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700">
          <iframe
            title="Barter System Location"
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3672.025054280661!2d77.41261507519355!3d23.02727127917114!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x397c43ee5f178005%3A0x14e08b4a083d0e3c!2sBhopal%2C%20Madhya%20Pradesh!5e0!3m2!1sen!2sin!4v1717865725670!5m2!1sen!2sin"
            width="100%"
            height="100%"
            allowFullScreen=""
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            className="w-full h-full"
          ></iframe>
        </div>
      </div>
    </section>
  );
};

export default ContactComponent;
