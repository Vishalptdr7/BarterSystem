export const ContentSkeleton = () => {
  return (
    <div className="relative px-4 py-16 mx-auto sm:max-w-xl md:max-w-full lg:max-w-screen-xl md:px-8 lg:px-12 lg:py-20 animate-pulse">
      {/* Background block */}
      <div className="absolute inset-0">
        <div className="absolute inset-y-0 z-0 w-full h-full bg-gray-100 lg:w-3/4" />
      </div>

      <div className="relative grid gap-12 row-gap-10 lg:grid-cols-2">
        {/* Left Features Skeleton */}
        <div className="grid gap-10 row-gap-8 sm:grid-cols-2">
          {Array(4)
            .fill()
            .map((_, i) => (
              <div key={i}>
                <div className="flex items-center justify-center w-10 h-10 mb-3 rounded-full bg-gray-300" />
                <div className="h-4 bg-gray-300 rounded w-3/4 mb-2" />
                <div className="h-3 bg-gray-200 rounded w-full mb-1" />
                <div className="h-3 bg-gray-200 rounded w-5/6" />
              </div>
            ))}
        </div>

        {/* Right Text/Image Skeleton */}
        <div className="flex flex-col justify-center space-y-6">
          <div className="space-y-4">
            <div className="h-6 bg-gray-300 rounded w-3/4" />
            <div className="h-6 bg-gray-300 rounded w-1/2" />
            <div className="h-4 bg-gray-200 rounded w-full" />
            <div className="h-4 bg-gray-200 rounded w-5/6" />
            <div className="h-4 bg-gray-200 rounded w-2/3" />
          </div>
          <div className="h-4 w-32 bg-gray-300 rounded" />
        </div>
      </div>

      {/* Mobile Image Skeleton */}
      <div className="mt-10 lg:hidden">
        <div className="w-full h-56 sm:h-80 bg-gray-300 rounded shadow-lg" />
      </div>

      {/* Desktop Image Skeleton */}
      <div className="hidden lg:block absolute right-0 top-0 w-full lg:w-1/2 h-full">
        <div className="w-full h-full bg-gray-300 rounded shadow-lg" />
      </div>
    </div>
  );
};
