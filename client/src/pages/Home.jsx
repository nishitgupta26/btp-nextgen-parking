import React, { useEffect, useState } from "react";
import LocationAccess from "../components/LocationAccess";

export default function Home() {
  const [showLocationAccess, setShowLocationAccess] = useState(true);
  const [latitude, setLatitude] = useState(null);
  const [longitude, setLongitude] = useState(null);

  const toggleLocationAccess = () => {
    setShowLocationAccess(!showLocationAccess);
    //console.log(showLocationAccess);
  };

  const func = (c, b) => {
    setLatitude(c);
    setLongitude(b);
    {c ? toggleLocationAccess() : null}
  };
  return (
    <div className="relative h-screen">
      <div
        className={`absolute inset-0 bg-gray-800 bg-opacity-50 backdrop-filter backdrop-blur-lg ${
          showLocationAccess ? "z-10" : "hidden"
        }`}
      ></div>
      {showLocationAccess && (
        <div className="absolute left-1/4 h-2/5 w-3/5 z-20">
          <div className="">
            <LocationAccess a={func} />
          </div>
        </div>
      )}

      <div className="h-screen flex justify-center items-center">
        <h1 className="text-4xl text-center mt-8">Welcome to SmartPark</h1>
      </div>
    </div>
  );
}
