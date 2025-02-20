const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-16 px-6 flex justify-center">
      <div className="max-w-3xl bg-white p-10 rounded-lg shadow-lg border border-gray-200">
        {/* Header */}
        <h1 className="text-4xl font-bold text-gray-900 text-center">
          Privacy Policy
        </h1>
        <p className="mt-2 text-gray-600 text-center">
          Last Updated: <span className="font-medium">February 2025</span>
        </p>

        {/* Introduction */}
        <section className="mt-8">
          <h2 className="text-2xl font-semibold text-gray-800">Introduction</h2>
          <p className="mt-3 text-gray-700 leading-relaxed">
            Welcome to <span className="font-medium">Barter System</span>! Your
            privacy is our priority. This Privacy Policy outlines how we
            collect, use, and safeguard your personal information.
          </p>
        </section>

        {/* Data Collection */}
        <section className="mt-8">
          <h2 className="text-2xl font-semibold text-gray-800">
            1. Information We Collect
          </h2>
          <ul className="mt-3 text-gray-700 leading-relaxed list-disc list-inside space-y-2">
            <li>
              <span className="font-medium">Personal Information:</span> Name,
              email, location, and profile details.
            </li>
            <li>
              <span className="font-medium">Usage Data:</span> Activity logs,
              interactions, and preferences.
            </li>
            <li>
              <span className="font-medium">Device & Log Data:</span> IP
              address, browser type, and cookies.
            </li>
          </ul>
        </section>

        {/* Data Usage */}
        <section className="mt-8">
          <h2 className="text-2xl font-semibold text-gray-800">
            2. How We Use Your Information
          </h2>
          <p className="mt-3 text-gray-700 leading-relaxed">
            We use your data to enhance your experience and ensure secure
            transactions:
          </p>
          <ul className="mt-3 text-gray-700 list-disc list-inside space-y-2">
            <li>Improve and personalize platform features.</li>
            <li>Maintain a secure and fair exchange system.</li>
            <li>Send important updates and service notifications.</li>
          </ul>
        </section>

        {/* Data Protection */}
        <section className="mt-8">
          <h2 className="text-2xl font-semibold text-gray-800">
            3. Data Security & Protection
          </h2>
          <p className="mt-3 text-gray-700 leading-relaxed">
            We implement industry-standard security measures to protect your
            data. However, no system is 100% secure, so we encourage users to
            take precautions while sharing personal information.
          </p>
        </section>

        {/* User Rights */}
        <section className="mt-8">
          <h2 className="text-2xl font-semibold text-gray-800">
            4. Your Rights & Choices
          </h2>
          <p className="mt-3 text-gray-700 leading-relaxed">
            You have the right to:
          </p>
          <ul className="mt-3 text-gray-700 list-disc list-inside space-y-2">
            <li>Access, update, or delete your personal information.</li>
            <li>Opt out of marketing communications.</li>
            <li>Request data portability where applicable.</li>
          </ul>
        </section>

        {/* Contact Section */}
        <section className="mt-8">
          <h2 className="text-2xl font-semibold text-gray-800">
            5. Contact Us
          </h2>
          <p className="mt-3 text-gray-700 leading-relaxed">
            If you have any questions, please contact us at:{" "}
            <a
              href="mailto:support@bartersystem.com"
              className="text-indigo-600 font-medium hover:underline"
            >
              support@bartersystem.com
            </a>
          </p>
        </section>

        {/* Acknowledgment */}
        <p className="mt-10 text-gray-600 text-sm text-center">
          By using our platform, you agree to this Privacy Policy.
        </p>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
