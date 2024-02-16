import React from "react";
import { useNavigate } from "react-router-dom";

export default function Home() {
  const navigate = useNavigate();

  const callManagerSignIn = () => {
    navigate("/manager/sign-in");
  };

  return (
    <div className="bg-gradient-to-b from-indigo-700 to-blue-500 min-h-screen flex flex-col justify-center items-center text-white">
      <header className="text-4xl text-center font-bold py-8 absolute top-0 w-full bg-blue-400">
        Welcome to our Smart Parking System
      </header>
      <div className="bg-white rounded-lg p-8 shadow-lg mt-24">
        <div className="text-2xl font-semibold mb-6 text-gray-800">
          Who are you?
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <button
            className="bg-purple-600 text-white px-6 py-3 rounded-md uppercase cursor-pointer transition-colors w-full hover:bg-purple-700"
            onClick={() => navigate("/user")}
          >
            User
          </button>
          <button
            className="bg-green-600 text-white px-6 py-3 rounded-md uppercase cursor-pointer transition-colors w-full hover:bg-green-700"
            onClick={() => navigate("/admin")}
          >
            Admin
          </button>
          <button
            className="bg-yellow-600 text-white px-6 py-3 rounded-md uppercase cursor-pointer transition-colors w-full hover:bg-yellow-700"
            onClick={() => navigate("/owner")}
          >
            Owner
          </button>
          <button
            className="bg-pink-600 text-white px-6 py-3 rounded-md uppercase cursor-pointer transition-colors w-full hover:bg-pink-700"
            onClick={callManagerSignIn}
          >
            Manager
          </button>
        </div>
      </div>
    </div>
  );
}
