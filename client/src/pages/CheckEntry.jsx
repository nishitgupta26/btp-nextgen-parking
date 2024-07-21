import React, { useEffect } from "react";
import { useState } from "react";
import Cookies from "universal-cookie";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function CheckEntry() {
  const [manualVehicleNumber, setManualVehicleNumber] = useState("");
  const [parkingDetails, setParkingDetails] = useState({});
  const [parkinglotId, setParkinglotId] = useState("");
  const [showDetails, setShowDetails] = useState(false);
  const [checkEntry, setCheckEntry] = useState(false);

  const host = "https://next-gen-parking-backend.vercel.app/";
  const cookies = new Cookies();
  const authToken = cookies.get("access_token");

  useEffect(() => {
    console.log("useEffect called");
    const fetchListing = async () => {
      try {
        if (!checkEntry) return;
        const res = await fetch(`${host}/api/lots/getlot/${parkinglotId}`);
        const data = await res.json();
        if (data.success === false) {
          console.log(data.message);
          return;
        }

        setParkingDetails({ ...parkingDetails, parkingName: data.name });
        setShowDetails(true);

        toast.success("Booking found successfully!", {
          position: "top-center",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });

        setCheckEntry(false);
      } catch (error) {
        console.error("Error fetching listing:", error);
        setCheckEntry(false);
      }
    };

    fetchListing();
  }, [checkEntry]);

  const handleVehicleDetails = async () => {
    try {
      const response = await fetch(
        `${host}/api/booking/checkentry/${manualVehicleNumber}`,
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
        setShowDetails(false);
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
      const { vehicleNumber, vehicleType } = data;

      setParkingDetails({ vehicleNumber, vehicleType });
      setParkinglotId(data.parkedAt);
      setCheckEntry(true);
    } catch (error) {
      console.error(error.message);
    }
  };

  return (
    <div className="p-3 max-w-screen min-h-screen mx-auto">
      <div className="mt-10 flex flex-col">
        <div className="text-center mt-3">
          <h1 className="text-3xl font-semibold text-center mb-4">
            Check Entry
          </h1>
        </div>
        <div className="p-7 lg:px-40 flex flex-col gap-4 md:flex-row md:gap-8">
          <input
            onChange={(e) => setManualVehicleNumber(e.target.value)}
            type="text"
            placeholder="Enter vehicle number"
            className="border border-slate-700 p-3 rounded-lg w-full md:w-3/4"
            id="location"
          />

          <button
            onClick={handleVehicleDetails}
            className="p-3 bg-slate-700 text-white w-full md:w-1/4 rounded-lg uppercase hover:opacity-95 disabled:opacity-80"
          >
            Check entry
          </button>
        </div>
      </div>

      {showDetails && (
        <div className="mt-10">
          <h1 className="text-3xl font-semibold text-center mb-4">
            Parking Details
          </h1>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-3 border border-slate-700 rounded-lg">
              <h2 className="text-xl font-semibold">Vehicle Number</h2>
              <p>{parkingDetails.vehicleNumber}</p>
            </div>
            <div className="p-3 border border-slate-700 rounded-lg">
              <h2 className="text-xl font-semibold">Vehicle Type</h2>
              <p>{parkingDetails.vehicleType}</p>
            </div>
            <div className="p-3 border border-slate-700 rounded-lg">
              <h2 className="text-xl font-semibold">Parking Lot Name</h2>
              <p>{parkingDetails.parkingName}</p>
            </div>
          </div>
        </div>
      )}

      {!showDetails && (
        <div className="mt-10">
          <h1 className="text-3xl font-semibold text-center mb-4">
            Parking Details
          </h1>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-3 border border-slate-700 rounded-lg">
              <h2 className="text-xl font-semibold">Vehicle Number</h2>
              <p>Not available</p>
            </div>
            <div className="p-3 border border-slate-700 rounded-lg">
              <h2 className="text-xl font-semibold">Vehicle Type</h2>
              <p>Not available</p>
            </div>
            <div className="p-3 border border-slate-700 rounded-lg">
              <h2 className="text-xl font-semibold">Parking Lot Name</h2>
              <p>Not available</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
