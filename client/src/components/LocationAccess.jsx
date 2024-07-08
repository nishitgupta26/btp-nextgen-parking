import React, { useState } from "react";
import "./LocationAccess.css";

export default function LocationAccess() {
  return (
    <div className="flex justify-center items-center h-screen">
      <div className="flex justify-center items-center h-2/5 w-3/5 p-4 rounded-lg bg-slate-200">
        <div className="flex flex-wrap items-centre justify-center">
          <div className="geo-btn text-black text-2xl p-2" variant="outlined">
            Grant Location Access
          </div>
          <p>
            <em>
              Please grant location access from
              <strong> Browser Settings </strong>
              to view all parking lots near you *
            </em>
          </p>
        </div>
      </div>
    </div>
  );
}
