import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Home() {
  const navigate = useNavigate();

  const callManagerSignIn = () => {
    navigate("/manager/sign-in");
  };

  return (
    <div className="bg-slate-300 min-h-screen flex flex-col">
      <h1 className="text-4xl text-center text-slate-700 font-bold py-8">
        Welcome to our Smart Parking System
      </h1>
      <div className="flex flex-col justify-center items-center flex-grow bg-slate-100">
        <div className="text-4xl font-bold mb-8 text-black">
          Who are you?
        </div>
        <div className="flex flex-col space-y-4">
          <button
            className="bg-slate-700 text-white px-4 py-2 rounded-lg uppercase cursor-pointer hover:bg-slate-900 transition-colors w-48"
            onClick={() => navigate("/user")}
          >
            User
          </button>
          <button
            className="bg-slate-700 text-white px-4 py-2 rounded-lg uppercase cursor-pointer hover:bg-slate-900 transition-colors w-48"
            onClick={() => navigate("/admin")}
          >
            Admin
          </button>
          <button
            className="bg-slate-700 text-white px-4 py-2 rounded-lg uppercase cursor-pointer hover:bg-slate-900 transition-colors w-48"
            onClick={() => navigate("/owner")}
          >
            Owner
          </button>
          <button
            className="bg-slate-700 text-white px-4 py-2 rounded-lg uppercase cursor-pointer hover:bg-slate-900 transition-colors w-48"
            onClick={callManagerSignIn}
          >
            Manager
          </button>
        </div>
      </div>
    </div>
  );
}
