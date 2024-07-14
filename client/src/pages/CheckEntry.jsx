import React from "react";
import { useState } from "react";

export default function CheckEntry() {
  const [vehicleNumber, setVehicleNumber] = useState("");

  return (
    <div className="p-3 max-w-screen min-h-screen mx-auto">
      <div className="mt-10 flex flex-col">
        <div className="text-center mt-3">
          <h1 className="text-3xl font-semibold text-center mb-4">
            Check Vehicle Entry
          </h1>
        </div>
        <div className="p-7 lg:px-40 flex flex-col gap-4 md:flex-row md:gap-8">
          <input
            onChange={(e) => setVehicleNumber(e.target.value)}
            type="text"
            placeholder="Enter E-Mail of manager"
            className="border border-slate-700 p-3 rounded-lg w-full md:w-3/4"
            id="location"
          />

          <button className="p-3 bg-slate-700 text-white w-full md:w-1/4 rounded-lg uppercase hover:opacity-95 disabled:opacity-80">
            Check entry
          </button>
        </div>
      </div>
    </div>
  );
}
