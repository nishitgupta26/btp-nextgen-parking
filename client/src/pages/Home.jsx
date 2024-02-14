import React, { useState } from "react";

export default function Home() {
  const [selectedRole, setSelectedRole] = useState(null);

  return (
    <div className="bg-slate-300">
      <h1 className="text-4xl text-center text-slate-700 font-bold py-8">
        Welcome to our Smart Parking System
      </h1>
      <div className="flex flex-col justify-center items-center min-h-screen bg-slate-100">
        <div className="text-4xl font-bold mb-8 text-black">Who are you?</div>
        <div className="flex flex-col space-y-4">
          <div className="flex flex-col items-centers max-w-lg">
            <button
              className="bg-slate-700 text-white px-4 py-2 rounded-lg uppercase cursor-pointer hover:bg-slate-900 transition-colors"
              onClick={() => setSelectedRole('User')}
            >
              User
            </button>
          </div>
          <div className="flex flex-col items-centers max-w-lg">
            <button
              className="bg-slate-700 text-white px-4 py-2 rounded-lg uppercase cursor-pointer hover:bg-slate-900 transition-colors"
              onClick={() => setSelectedRole('Admin')}
            >
              Admin
            </button>
          </div>
          <div className="flex flex-col items-centers max-w-lg">
            <button
              className="bg-slate-700 text-white px-4 py-2 rounded-lg uppercase cursor-pointer hover:bg-slate-900 transition-colors"
              onClick={() => setSelectedRole('Owner')}
            >
              Owner
            </button>
          </div>
          <div className="flex flex-col items-centers max-w-lg">
            <button
              className="bg-slate-700 text-white px-4 py-2 rounded-lg uppercase cursor-pointer hover:bg-slate-900 transition-colors"
              onClick={() => setSelectedRole('Manager')}
            >
              Manager
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
