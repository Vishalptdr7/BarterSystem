import React from "react";

const UserCardSkeleton = () => {
  return (
    <div className="border border-gray-200 rounded-lg p-4 shadow-sm animate-pulse bg-white">
      <div className="w-24 h-24 rounded-full bg-gray-200 mx-auto mb-4" />
      <div className="h-4 bg-gray-200 rounded w-3/4 mx-auto mb-2" />
      <div className="h-4 bg-gray-100 rounded w-1/2 mx-auto mb-4" />

      <div className="flex flex-col space-y-2">
        <div className="h-8 w-full bg-gray-200 rounded" />
        <div className="h-8 w-full bg-gray-200 rounded" />
        <div className="h-8 w-full bg-gray-200 rounded" />
      </div>
    </div>
  );
};

const ChatSkeleton = () => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 px-4">
      <div className="bg-white w-full max-w-2xl rounded-lg shadow-lg p-6 relative animate-pulse">
        <div className="h-4 w-20 bg-gray-300 rounded mb-4" />
        <div className="space-y-3">
          <div className="h-4 bg-gray-200 rounded w-3/4" />
          <div className="h-4 bg-gray-200 rounded w-2/3" />
          <div className="h-4 bg-gray-200 rounded w-full" />
          <div className="h-4 bg-gray-200 rounded w-5/6" />
        </div>
      </div>
    </div>
  );
};

const UsersPageSkeleton = ({ showChat = false }) => {
  return (
    <div className="container mx-auto py-16 px-4 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold mb-10 text-center font-sans text-gray-700 animate-pulse">
        Loading Users...
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <UserCardSkeleton key={i} />
        ))}
      </div>

      {showChat && <ChatSkeleton />}
    </div>
  );
};

export default UsersPageSkeleton;
