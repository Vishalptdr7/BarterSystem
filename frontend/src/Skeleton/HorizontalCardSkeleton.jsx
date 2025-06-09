import React from "react";

export  const  HorizontalCardSkeleton=() =>{
  return (
    <div className="w-full flex flex-col lg:flex-row max-w-6xl mx-auto shadow-lg border border-gray-200 rounded-xl overflow-hidden my-4 animate-pulse">
      {/* Left Skeleton (Image Carousel Placeholder) */}
      <div className="w-full lg:w-1/2 h-60 sm:h-72 md:h-96 lg:h-auto bg-gray-200" />

      {/* Right Skeleton (Text Placeholder) */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center px-4 py-6 sm:px-6 sm:py-8 bg-white space-y-4">
        {/* Tag */}
        <div className="w-24 h-4 bg-gray-300 rounded" />

        {/* Title */}
        <div className="w-3/4 h-6 bg-gray-300 rounded" />
        <div className="w-2/3 h-6 bg-gray-300 rounded" />

        {/* Description lines */}
        <div className="space-y-2">
          <div className="w-full h-4 bg-gray-200 rounded" />
          <div className="w-full h-4 bg-gray-200 rounded" />
          <div className="w-5/6 h-4 bg-gray-200 rounded" />
        </div>

        {/* Button Placeholder */}
        <div className="mt-4 w-32 h-10 bg-gray-300 rounded-full" />
      </div>
    </div>
  );
}
