import React, { useState } from "react";

export default function Home() {
  const [selectedRole, setSelectedRole] = useState(null);

  return (
    <div className="flex flex-col justify-center items-center h-screen bg-slate-300">
      <div className="text-4xl font-bold mb-8 text-black">Who are you?</div>
      <div className="flex flex-col space-y-4">
        {['User', 'Admin', 'Owner', 'Manager'].map((role) => (
          <div key={role} className="flex flex-col items-centers max-w-lg">
            <button
              className="bg-slate-700 text-white px-4 py-2 rounded-lg uppercase cursor-pointer hover:bg-slate-900 transition-colors"
            >
              {role}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}