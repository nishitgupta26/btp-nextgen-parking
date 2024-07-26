import React, { useEffect } from "react";
import { useState } from "react";
import Cookies from "universal-cookie";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function CheckExit() {
  const [vehicleNumber, setVehicleNumber] = useState("");
  const [parkingDetails, setParkingDetails] = useState({});
  const [dues, setDues] = useState(0);
  const [checkExit, setCheckExit] = useState(false);
  const [showDues, setShowDues] = useState(false);

  const host = import.meta.env.VITE_BACKEND_URI;
  const cookies = new Cookies();
  const authToken = cookies.get("access_token");

  useEffect(() => {
    if (!checkExit) return;

    const checkOutTime = parkingDetails.checkOut;
    const currentTime = new Date().toISOString();

    const calculateDues = (checkOutTime, currentTime) => {
      const checkOutDate = new Date(checkOutTime);
      const currentDate = new Date(currentTime);

      let diffInMinutes = Math.floor(
        (currentDate - checkOutDate) / (1000 * 60)
      );
      diffInMinutes = diffInMinutes - 5; // Subtract 5 minutes buffer time
      if (diffInMinutes <= 0) return 0;

      const diffInHours = Math.ceil(diffInMinutes / 60); // Convert to hours and take the ceiling
      console.log("diffInHours: ", diffInHours);
      const ratePerHour = parkingDetails.parkingRate;

      return diffInHours * ratePerHour;
    };

    const calculatedDues = calculateDues(checkOutTime, currentTime);
    setDues(calculatedDues);
    setCheckExit(false);
    setShowDues(true);
  }, [checkExit]);

  const handleVehicleDetails = async () => {
    try {
      const response = await fetch(
        `${host}/api/booking/checkentry/${vehicleNumber}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "auth-token": authToken,
          },
        }
      );

      const data = await response.json();
      if (data.error) {
        setDues(NaN);
        toast.error("Enter correct vehicle number", {
          position: "top-center",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });
        return;
      }

      setParkingDetails(data);
      setCheckExit(true);
    } catch (error) {
      console.error(error.message);
    }
  };

  const handleExit = async () => {
    try {
      const response = await fetch(
        `${host}/api/booking/exit/${parkingDetails._id}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            "auth-token": authToken,
          },
          body: JSON.stringify({
            vehicleType: parkingDetails.vehicleType,
            parkingLotId: parkingDetails.parkedAt,
          }),
        }
      );

      const data = await response.json();
      if (data.error) {
        toast.error(data.error, {
          position: "top-center",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });
        return;
      }

      toast.success(data.message, {
        position: "top-center",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });

      setShowDues(false);
    } catch (error) {
      console.error(error.message);
    }
  };

  return (
    <div className="p-3 max-w-screen min-h-screen mx-auto">
      <div className="mt-10 flex flex-col">
        <div className="text-center mt-3">
          <h1 className="text-3xl font-semibold text-center mb-4">
            Check for dues and allow exit
          </h1>
        </div>
        <div className="p-7 lg:px-40 flex flex-col gap-4 md:flex-row md:gap-8">
          <input
            onChange={(e) => setVehicleNumber(e.target.value)}
            type="text"
            placeholder="Enter vehicle number"
            className="border border-slate-700 p-3 rounded-lg w-full md:w-3/4"
            id="location"
          />

          <button
            onClick={handleVehicleDetails}
            className="p-3 bg-slate-700 text-white w-full md:w-1/4 rounded-lg uppercase hover:opacity-95 disabled:opacity-80"
          >
            Check dues
          </button>
        </div>

        {showDues && !isNaN(dues) && (
          <div className="flex flex-col text-center align items-center gap-3">
            <div className="w-full md:w-3/4">
              <h1 className="text-xl font-semibold">Dues: Rs. {dues}</h1>
            </div>
            <button
              onClick={handleExit}
              className="p-3 bg-slate-700 text-white w-full md:w-1/4 rounded-lg uppercase hover:opacity-95 disabled:opacity-80"
            >
              Collect dues and Allow Exit
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
