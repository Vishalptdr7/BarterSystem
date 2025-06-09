import React from "react";

const HeroSectionSkeleton = () => {
  return (
    <section className="sm:mt-6 lg:mt-8 mt-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 animate-pulse">
      <div className="my-10 mx-auto max-w-7xl px-4 sm:mt-12 sm:px-6 md:mt-16 lg:mt-20 lg:px-8 xl:mt-28 flex gap-3 flex-col lg:flex-row">
        {/* Left Content Skeleton */}
        <div className="sm:text-center lg:text-left flex-1 space-y-4">
          <div className="h-10 bg-gray-300 rounded w-3/4 mx-auto lg:mx-0" />
          <div className="h-10 bg-gray-300 rounded w-1/2 mx-auto lg:mx-0" />

          <div className="mt-6 space-y-2">
            <div className="h-4 bg-gray-200 rounded w-full max-w-xl mx-auto lg:mx-0" />
            <div className="h-4 bg-gray-200 rounded w-full max-w-md mx-auto lg:mx-0" />
            <div className="h-4 bg-gray-200 rounded w-3/4 mx-auto lg:mx-0" />
          </div>

          {/* Button Skeletons */}
          <div className="mt-8 flex flex-col sm:flex-row sm:justify-center lg:justify-start gap-4">
            <div className="h-12 w-44 bg-gray-300 rounded-md" />
            <div className="h-12 w-44 bg-gray-200 rounded-md" />
          </div>
        </div>

        {/* Right Image Skeleton */}
        <div className="lg:w-1/2 my-4">
          <div className="w-full h-56 sm:h-72 md:h-96 lg:h-full bg-gray-300 rounded-lg" />
        </div>
      </div>
    </section>
  );
};

export default HeroSectionSkeleton;
