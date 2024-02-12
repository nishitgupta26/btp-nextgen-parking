import React from "react";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 flex flex-col justify-center items-center">
      <div className="text-2xl font-bold mb-4 text-white">Who are you?</div>
      <div className="flex space-x-4">
        <div className="bg-blue-500 text-white px-4 py-2 rounded-md cursor-pointer hover:bg-blue-600">
          User
        </div>
        <div className="bg-green-500 text-white px-4 py-2 rounded-md cursor-pointer hover:bg-green-600">
          Admin
        </div>
        <div className="bg-yellow-500 text-white px-4 py-2 rounded-md cursor-pointer hover:bg-yellow-600">
          Owner
        </div>
        <div className="bg-purple-500 text-white px-4 py-2 rounded-md cursor-pointer hover:bg-purple-600">
          Manager
        </div>
      </div>
    </div>
  );
}
