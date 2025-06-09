export const FeatureSkeleton = () => {
  return (
    <section className="bg-white dark:bg-gray-300 animate-pulse">
      <div className="container px-6 py-10 mx-auto">
        <div className="lg:flex lg:items-center gap-12">
          {/* Left Content Skeleton */}
          <div className="w-full space-y-12 lg:w-1/2">
            {/* Heading Skeleton */}
            <div>
              <div className="h-8 w-3/4 bg-gray-300 rounded mb-2" />
              <div className="h-8 w-2/5 bg-gray-300 rounded" />
              <div className="mt-4 flex items-center space-x-1">
                <span className="w-20 h-1 bg-gray-300 rounded-full" />
                <span className="w-4 h-1 bg-gray-300 rounded-full" />
                <span className="w-2 h-1 bg-gray-300 rounded-full" />
              </div>
            </div>

            {/* Feature Blocks Skeleton */}
            <div className="space-y-8">
              {[...Array(3)].map((_, index) => (
                <div key={index} className="flex items-start space-x-4">
                  <div className="p-4 bg-gray-300 rounded-xl w-12 h-12" />
                  <div className="space-y-2 flex-1">
                    <div className="h-4 bg-gray-300 rounded w-1/3" />
                    <div className="h-3 bg-gray-200 rounded w-11/12" />
                    <div className="h-3 bg-gray-200 rounded w-4/5" />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Image Skeleton */}
          <div className="hidden lg:flex lg:items-center lg:w-1/2 lg:justify-center">
            <div className="w-full h-96 bg-gray-300 rounded-2xl shadow-xl" />
          </div>
        </div>

        {/* Divider Skeleton */}
        <div className="my-12 border-t border-gray-200 dark:border-gray-700" />
      </div>
    </section>
  );
};
