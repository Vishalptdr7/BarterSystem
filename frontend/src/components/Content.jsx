export const Content = () => {
  return (
    <div className="relative px-4 py-16 mx-auto sm:max-w-xl md:max-w-full lg:max-w-screen-xl md:px-8 lg:px-12 lg:py-20">
      <div className="absolute inset-0">
        <div className="absolute inset-y-0 z-0 w-full h-full bg-gray-100 lg:w-3/4" />
      </div>
      <div className="relative">
        <div className="grid gap-12 row-gap-10 lg:grid-cols-2">
          {/* Left Features */}
          <div className="grid gap-10 row-gap-8 sm:grid-cols-2">
            {/* Feature 1 */}
            <div className="relative">
              <svg
                viewBox="0 0 52 24"
                fill="currentColor"
                className="absolute top-0 left-0 z-0 w-32 -mt-8 -ml-16 text-blue-gray-100 lg:w-32 lg:-mt-12"
              >
                <defs>
                  <pattern
                    id="dots-pattern"
                    x="0"
                    y="0"
                    width=".135"
                    height=".30"
                  >
                    <circle cx="1" cy="1" r=".7" />
                  </pattern>
                </defs>
                <rect fill="url(#dots-pattern)" width="52" height="24" />
              </svg>
              <div className="relative">
                <div className="flex items-center justify-center w-10 h-10 mb-3 rounded-full bg-teal-200">
                  <svg
                    className="w-6 h-6 text-teal-900"
                    stroke="currentColor"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <path
                      d="M12 3v18m9-9H3"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
                <h6 className="mb-2 font-semibold leading-5">
                  Skill-Based Collaboration
                </h6>
                <p className="text-sm text-gray-900">
                  Empower users to connect based on skills they can offer and
                  those they seek—fostering mutual growth and opportunity.
                </p>
              </div>
            </div>

            {/* Feature 2 */}
            <div>
              <div className="flex items-center justify-center w-10 h-10 mb-3 rounded-full bg-teal-200">
                <svg
                  className="w-6 h-6 text-teal-900"
                  stroke="currentColor"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <path
                    d="M16 17l-4 4m0 0l-4-4m4 4V3"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
              <h6 className="mb-2 font-semibold leading-5">
                Verified Exchanges
              </h6>
              <p className="text-sm text-gray-900">
                Ensure trust and quality with verified user profiles and
                feedback-driven skill exchanges.
              </p>
            </div>

            {/* Feature 3 */}
            <div>
              <div className="flex items-center justify-center w-10 h-10 mb-3 rounded-full bg-teal-200">
                <svg
                  className="w-6 h-6 text-teal-900"
                  stroke="currentColor"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <path
                    d="M13 10V3L4 14h7v7l9-11h-7z"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
              <h6 className="mb-2 font-semibold leading-5">
                Smart Matching System
              </h6>
              <p className="text-sm text-gray-900">
                Leverage intelligent algorithms to match users with
                complementary skill sets for efficient and relevant
                collaborations.
              </p>
            </div>

            {/* Feature 4 */}
            <div>
              <div className="flex items-center justify-center w-10 h-10 mb-3 rounded-full bg-teal-200">
                <svg
                  className="w-6 h-6 text-teal-900"
                  stroke="currentColor"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <path
                    d="M17 9V7a4 4 0 00-8 0v2M5 12h14l-1 9H6l-1-9z"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
              <h6 className="mb-2 font-semibold leading-5">
                Secure Transactions
              </h6>
              <p className="text-sm text-gray-900">
                All skill trades and interactions are backed by secure channels
                and transparent communication policies.
              </p>
            </div>
          </div>

          {/* Right Image & Text */}
          <div className="flex flex-col justify-center">
            <div className="max-w-xl mb-6">
              <h2 className="max-w-lg mb-6 font-sans text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl sm:leading-tight">
                A Professional Platform for
                <br className="hidden md:block" /> Skill Exchange and Growth
              </h2>
              <p className="text-base text-gray-700 md:text-lg">
                Whether you're a graphic designer looking to learn web
                development or a language tutor offering sessions in return for
                marketing help — our platform brings professionals together to
                grow through exchange.
              </p>
            </div>
            <div>
              <a
                href="/get-started"
                className="inline-flex items-center font-semibold transition-colors duration-200 text-teal-500 hover:text-teal-700"
              >
                Get Started
                <svg
                  className="inline-block w-3 h-3 ml-2"
                  fill="currentColor"
                  viewBox="0 0 12 12"
                >
                  <path d="M9.707 5.293a1 1 0 00-1.414 0L5 8.586V1a1 1 0 10-2 0v7.586L1.707 5.293a1 1 0 00-1.414 1.414l4 4a1 1 0 001.414 0l4-4a1 1 0 000-1.414z" />
                </svg>
              </a>
            </div>
          </div>
        </div>

        {/* Responsive Image at the Bottom for Mobile/Tablet */}
        <div className="mt-10 lg:hidden">
          <img
            className="object-cover w-full h-56 rounded shadow-lg sm:h-80"
            src="https://images.pexels.com/photos/927022/pexels-photo-927022.jpeg?auto=compress&amp;cs=tinysrgb&amp;dpr=3&amp;h=750&amp;w=1260"
            alt=""
          />
        </div>

        {/* Desktop image */}
        <div className="hidden lg:block absolute right-0 top-0 w-full lg:w-1/2 h-full">
          <img
            className="object-cover w-full h-full rounded shadow-lg"
            src="https://images.pexels.com/photos/927022/pexels-photo-927022.jpeg?auto=compress&amp;cs=tinysrgb&amp;dpr=3&amp;h=750&amp;w=1260"
            alt=""
          />
        </div>
      </div>
    </div>
  );
};
