import React from "react";

export default function ParkingBox({ index }) {
  return (
    <div className="flex">
      <div
        className={`flex justify-center items-center w-10 h-10 rounded-lg border-2 border-slate-400 text-white ${
          index > 25 ? "bg-green-500" : "bg-red-500"
        }`}
      >
        {index + 1}
      </div>
    </div>
  );
}
