import { Briefcase, Globe, Users, CheckCircle } from "lucide-react";

const AboutUs = () => {
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center  px-6 py-20">
      {/* Hero Section */}
      <div className="max-w-4xl text-center">
        <h1 className="text-4xl font-bold text-gray-900">
          About Barter System
        </h1>
        <p className="mt-4 text-lg text-gray-600">
          Barter System is a modern platform designed to facilitate skill and
          service exchange without the use of money. We empower users to
          connect, collaborate, and grow through mutual exchange.
        </p>
      </div>

      {/* Core Values Section */}
      <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl">
        <div className="p-6 bg-white rounded-xl shadow-md flex flex-col items-center text-center">
          <Globe className="size-12 text-indigo-600" />
          <h3 className="mt-4 text-xl font-semibold text-gray-900">
            Global Community
          </h3>
          <p className="mt-2 text-gray-600">
            Connecting people across the world to exchange skills and services.
          </p>
        </div>

        <div className="p-6 bg-white rounded-xl shadow-md flex flex-col items-center text-center">
          <Users className="size-12 text-indigo-600" />
          <h3 className="mt-4 text-xl font-semibold text-gray-900">
            Collaboration
          </h3>
          <p className="mt-2 text-gray-600">
            Encouraging partnerships and mutual learning through fair exchanges.
          </p>
        </div>

        <div className="p-6 bg-white rounded-xl shadow-md flex flex-col items-center text-center">
          <Briefcase className="size-12 text-indigo-600" />
          <h3 className="mt-4 text-xl font-semibold text-gray-900">
            Skill Development
          </h3>
          <p className="mt-2 text-gray-600">
            Helping individuals enhance their skills by trading expertise.
          </p>
        </div>

        <div className="p-6 bg-white rounded-xl shadow-md flex flex-col items-center text-center">
          <CheckCircle className="size-12 text-indigo-600" />
          <h3 className="mt-4 text-xl font-semibold text-gray-900">
            Trust & Integrity
          </h3>
          <p className="mt-2 text-gray-600">
            Ensuring safe, reliable, and transparent transactions between users.
          </p>
        </div>
      </div>

      {/* Call to Action */}
      <div className="mt-12 text-center">
        <h2 className="text-2xl font-bold text-gray-900">
          Join Us & Start Bartering Today!
        </h2>
        <p className="mt-2 text-gray-600">
          Be part of a thriving community where skills are exchanged, and
          connections are built.
        </p>
        <a
          href="/register"
          className="mt-4 inline-block px-6 py-3 bg-indigo-600 text-white text-lg font-medium rounded-lg hover:bg-indigo-700 transition"
        >
          Get Started
        </a>
      </div>
    </div>
  );
};

export default AboutUs;
