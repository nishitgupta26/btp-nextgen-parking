import React, { useState } from "react";
import Button from "@mui/material-next/Button";
import "./LocationAccess.css";

export default function LocationAccess(props) {
  const [locationDetails, setLocationDetails] = useState(null);
  const [error, setError] = useState(null);

  const handleButtonClick = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setLocationDetails(
            `The latitude is ${latitude} & longitude is ${longitude}`
          );
          if (typeof props.a === "function") { // Check if props.a is a function
            props.a(latitude, longitude); // Call props.a if it's a function
          }
          console.log(latitude, longitude);
        },
        (error) => {
          setError(error.message);
          console.error(error.message);
        }
      );
    } else {
      setError("Geolocation is not supported by this browser.");
      console.error("Geolocation is not supported by this browser.");
    }
  };

  return (
    <div className="flex justify-center items-center h-screen">
      <div className="flex justify-center items-center h-2/5 w-3/5 p-4 rounded-lg bg-slate-200">
        <div className="flex flex-wrap items-centre justify-center">
          <Button
            className="geo-btn text-black text-2xl"
            disabled={false}
            variant="outlined"
            onClick={handleButtonClick}
          >
            Grant Location Access
          </Button>
          <p><em>*after granting location access <strong>click again</strong>* to see the parking slots</em></p>
        </div>
      </div>
    </div>
  );
}
