const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen bg-gray-100 py-12 px-6 flex justify-center">
      <div className="max-w-4xl bg-white p-8 rounded-lg shadow-md">
        {/* Header */}
        <h1 className="text-3xl font-bold text-gray-900 text-center">
          Privacy Policy
        </h1>
        <p className="mt-2 text-gray-600 text-center">
          Last Updated: February 2025
        </p>

        {/* Introduction */}
        <section className="mt-6">
          <h2 className="text-xl font-semibold text-gray-900">Introduction</h2>
          <p className="mt-2 text-gray-600">
            Welcome to Barter System! Your privacy is important to us. This
            Privacy Policy explains how we collect, use, and protect your
            personal data when you use our platform.
          </p>
        </section>

        {/* Data Collection */}
        <section className="mt-6">
          <h2 className="text-xl font-semibold text-gray-900">
            1. Information We Collect
          </h2>
          <ul className="mt-2 text-gray-600 list-disc list-inside">
            <li>
              <strong>Personal Information:</strong> Name, email, location, and
              profile details.
            </li>
            <li>
              <strong>Usage Data:</strong> Activity logs, interactions, and
              preferences.
            </li>
            <li>
              <strong>Device & Log Data:</strong> IP address, browser type, and
              cookies.
            </li>
          </ul>
        </section>

        {/* Data Usage */}
        <section className="mt-6">
          <h2 className="text-xl font-semibold text-gray-900">
            2. How We Use Your Information
          </h2>
          <p className="mt-2 text-gray-600">
            We use your data to improve your experience and ensure secure
            transactions:
          </p>
          <ul className="mt-2 text-gray-600 list-disc list-inside">
            <li>Provide and enhance platform features.</li>
            <li>Ensure secure and fair exchanges.</li>
            <li>Send important updates and notifications.</li>
          </ul>
        </section>

        {/* Data Protection */}
        <section className="mt-6">
          <h2 className="text-xl font-semibold text-gray-900">
            3. Data Security & Protection
          </h2>
          <p className="mt-2 text-gray-600">
            We take data security seriously and use industry-standard measures
            to protect your information. However, no system is 100% secure, and
            we encourage users to take precautions.
          </p>
        </section>

        {/* User Rights */}
        <section className="mt-6">
          <h2 className="text-xl font-semibold text-gray-900">
            4. Your Rights & Choices
          </h2>
          <p className="mt-2 text-gray-600">You have the right to:</p>
          <ul className="mt-2 text-gray-600 list-disc list-inside">
            <li>Access, update, or delete your personal data.</li>
            <li>Opt out of marketing communications.</li>
            <li>Request data portability where applicable.</li>
          </ul>
        </section>

        {/* Contact Section */}
        <section className="mt-6">
          <h2 className="text-xl font-semibold text-gray-900">5. Contact Us</h2>
          <p className="mt-2 text-gray-600">
            If you have any questions about our Privacy Policy, please contact
            us at:{" "}
            <a
              href="mailto:support@bartersystem.com"
              className="text-indigo-600 font-medium hover:underline"
            >
              support@bartersystem.com
            </a>
          </p>
        </section>

        {/* Acknowledgment */}
        <p className="mt-6 text-gray-600 text-sm text-center">
          By using our platform, you agree to this Privacy Policy.
        </p>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
