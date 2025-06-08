export const Feature = () => {
  return (
    <section className="bg-white dark:bg-gray-300">
      <div className="container px-6 py-10 mx-auto">
        <div className="lg:flex lg:items-center gap-12">
          {/* Left Content */}
          <div className="w-full space-y-12 lg:w-1/2">
            {/* Heading */}
            <div>
              <h1 className="text-3xl font-bold text-gray-900 capitalize lg:text-4xl dark:text-white leading-tight">
                Explore our <br className="hidden sm:block" />{" "}
                <span className="text-blue-600">Awesome Components</span>
              </h1>
              <div className="mt-3 flex items-center space-x-1">
                <span className="w-20 h-1 bg-blue-500 rounded-full"></span>
                <span className="w-4 h-1 bg-blue-500 rounded-full"></span>
                <span className="w-2 h-1 bg-blue-500 rounded-full"></span>
              </div>
            </div>

            {/* Features */}
            <div className="space-y-8">
              {/* Feature 1 */}
              <div className="flex items-start space-x-4">
                <div className="p-3 bg-blue-100 text-blue-600 rounded-xl dark:bg-blue-500 dark:text-white">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-6 h-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"
                    />
                  </svg>
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-gray-800 dark:text-black">
                    Real-time Chat
                  </h2>
                  <p className="mt-2 text-black-600 dark:text-black-300">
                    Instantly communicate with other users through a smooth,
                    real-time messaging system. Whether you're planning a skill
                    exchange or simply networking, our chat keeps you connected
                    at all times.
                  </p>
                </div>
              </div>

              {/* Feature 2 */}
              <div className="flex items-start space-x-4">
                <div className="p-3 bg-blue-100 text-blue-600 rounded-xl dark:bg-blue-500 dark:text-white">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-6 h-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"
                    />
                  </svg>
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-black-800 dark:text-black">
                    Group Collaboration Tools
                  </h2>
                  <p className="mt-2 text-black-600 dark:text-black-300">
                    Collaborate with multiple users through group chats and
                    shared exchanges. Perfect for learning circles, project
                    teams, or hobby groups.
                  </p>
                </div>
              </div>

              {/* Feature 3 */}
              <div className="flex items-start space-x-4">
                <div className="p-3 bg-blue-100 text-blue-600 rounded-xl dark:bg-blue-500 dark:text-white">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-6 h-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M9.879 16.121A3 3 0 1012.015 11L11 14H9c0 .768.293 1.536.879 2.121z"
                    />
                  </svg>
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-black-800 dark:text-black">
                    Smart Notifications
                  </h2>
                  <p className="mt-2 text-black-600 dark:text-black-300">
                    Stay updated with personalized notifications. Whether it’s a
                    new message, a swap request, or a review, you’ll never miss
                    important updates.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Image */}
          <div className="hidden lg:flex lg:items-center lg:w-1/2 lg:justify-center">
            <img
              className="object-cover w-full h-96 rounded-2xl shadow-xl"
              src="https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?ixlib=rb-1.2.1&auto=format&fit=crop&w=755&q=80"
              alt="Skill Exchange"
            />
          </div>
        </div>

        <hr className="my-12 border-gray-200 dark:border-gray-700" />

        
      </div>
    </section>
  );
};

