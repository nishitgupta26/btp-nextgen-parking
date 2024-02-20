import React, { useState } from "react";
import "./home.css";
export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <div className="bg-slate-300">
        <h1 className="border border-10 border-blue-600 text-4xl text-white text-center font-bold py-8">
          Welcome to Next-Gen Parking System
        </h1>
      </div>
      <div className="flex-grow flex flex-col justify-center items-center bg-slate-100">
        <div className="text-4xl font-bold mb-8 text-black">Who are you?</div>
        <div className="flex flex-col space-y-4">
          <div className="flex flex-col items-centers max-w-lg">
            <button
              className="button"
              onClick={() => setSelectedRole("User")}
            >
              User
            </button>
          </div>
          <div className="flex flex-col items-centers max-w-lg">
            <button
              className="button"
              onClick={() => setSelectedRole("Admin")}
            >
              Admin
            </button>
          </div>
          <div className="flex flex-col items-centers max-w-lg">
            <button
              className="button"
              onClick={() => setSelectedRole("Owner")}
            >
              Owner
            </button>
          </div>
          <div className="flex flex-col items-centers max-w-lg">
            <button
              className="button"
              // className="bg-slate-700 text-white px-4 py-2 rounded-lg uppercase cursor-pointer hover:bg-slate-900 transition-colors"
              onClick={() => setSelectedRole("Manager")}
            >
              Manager
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
