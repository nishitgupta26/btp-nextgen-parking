import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import Cookies from "universal-cookie";
import BgImg from "../img/parkingSlotCardBg.png";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function BookParking() {
  // const { listingId } = useParams();
  const [formData, setFormData] = useState({});
  const [difference, setDifference] = useState("");
  const [startTime, setStartTime] = useState("");
  const [EndTime, setEndTime] = useState("");
  const host = "http://localhost:3001";
  const cookies = new Cookies();
  const navigate = useNavigate();
  const params = useParams();
  const listingId = params.listingId;

  useEffect(() => {
    const fetchListing = async () => {
      try {
        const res = await fetch(`${host}/api/lots/getlot/${listingId}`);
        const data = await res.json();
        if (data.success === false) {
          console.log(data.message);
          return;
        }
        setFormData(data);
        console.log("I am useEffect");
      } catch (error) {
        console.error("Error fetching listing:", error);
      }
    };

    fetchListing();
  }, [listingId]);

  const handleStartTimeChange = (e) => {
    setStartTime(e.target.value);
    calculateDifference(e.target.value, endTime);
  };

  const handleEndTimeChange = (e) => {
    setEndTime(e.target.value);
    calculateDifference(startTime, e.target.value);
  };

  const calculateDifference = (startTime, endTime) => {
    if (!startTime || !endTime) {
      // If either time is empty, reset the difference
      setDifference("");
      return;
    }

    const startTimeInMs = new Date(`1970-01-01T${startTime}`).getTime();
    const endTimeInMs = new Date(`1970-01-01T${endTime}`).getTime();

    if (endTimeInMs < startTimeInMs) {
      // If second time is earlier than first time, set error message
      // setDifference("Error: Second time cannot be earlier than first time.");
      const errorMessage = "Error: Second time cannot be earlier than first time.";
      toast.error(errorMessage, {
        position: "top-center",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
      setDifference(-1);
      return;
    }

    const differenceInMs = endTimeInMs - startTimeInMs;
    const differenceInHours = Math.ceil(differenceInMs / (1000 * 60 * 60));

    setDifference(differenceInHours);
  };
  return (
    <div className="p-4 px-12 max-w-full min-h-screen mx-auto bg-white">
      <div className=" rounded-md overflow-hidden my-7 h-96">
        <img className="object-cover w-full h-full" src={BgImg} />
      </div>
      <form className="p-1 flex flex-col sm:flex-row gap-4">
        <div className="flex flex-col gap-4 flex-1">
          <p className="font-medium">Parking Space Name:</p>
          <input
            disabled
            type="text"
            placeholder="Parking Space Name"
            className="border border-slate-400 p-3 rounded-lg"
            id="name"
            maxLength="62"
            minLength="5"
            value={formData.name || ""}
            required
          />
          <p className="font-medium">Location:</p>
          <input
            disabled
            type="text"
            placeholder="Location"
            className="border p-3 rounded-lg border-slate-400"
            id="location"
            value={formData.location || ""}
            required
          />
          <div className="flex gap-6 flex-wrap">
            <div className="flex gap-2 font-medium">Parking Type:</div>

            <div className="flex gap-2">
              <input
                disabled
                type="radio"
                id="closed"
                className="w-5 border border-slate-400 "
                checked={formData.type === "closed"}
              />
              <span>Closed</span>
            </div>
            <div className="flex gap-2">
              <input
                disabled
                type="radio"
                id="mixed"
                className="w-5 border border-slate-400"
                checked={formData.type === "mixed"}
              />
              <span>Mixed</span>
            </div>
            <div className="flex gap-2">
              <input
                disabled
                type="radio"
                id="open"
                className="w-5 border border-slate-400"
                checked={formData.type === "open"}
              />
              <span>Open</span>
            </div>
          </div>
          <div className="flex flex-wrap gap-6">
            <div className="flex flex-col sm:flex-row items-center gap-2">
              <p className="font-medium">Four Wheeler Capacity:</p>
              {formData.fourWheelerCapacity > 0 ? (
                <span>Available</span>
              ) : (
                <span>Not Available</span>
              )}
            </div>
          </div>
          <div className="flex gap-6 flex-wrap">
            <div className="flex gap-2">
              <span className="font-medium">Security Guard ?</span>
              <input
                disabled
                type="checkbox"
                id="security"
                className="w-5 border border-slate-400 "
                checked={formData.securityGuard || false}
              />
            </div>
            <div className="flex gap-2">
              <span className="font-medium">CCTV Surveillance ?</span>
              <input
                disabled
                type="checkbox"
                id="surveillance"
                className="w-5 border border-slate-400 "
                checked={formData.surveillanceCamera || false}
              />
            </div>
          </div>
          <div className="flex items-center font-medium gap-2">
            <p>
              Parking Rate <em>(Rs./hr)</em>:
            </p>
            <span>Rs. {formData.parkingRate}</span>
          </div>
        </div>
        <div className="flex flex-col flex-1 gap-4">
          <p className="font-medium">Opening time (hh : mm):</p>
          <input
            disabled
            type="text"
            placeholder="Opening time (hh : mm)"
            className="border border-slate-400  p-3 rounded-lg"
            id="openingTime"
            value={formData.openingHours || ""}
            required
          />
          <p className="font-medium">Closing time (hh : mm):</p>
          <input
            disabled
            type="text"
            placeholder="Closing time (hh : mm)"
            className="border border-slate-400  p-3 rounded-lg"
            id="closingTime"
            value={formData.closingHours || ""}
            required
          />
          <div className="flex gap-6 flex-wrap">
            <div className="flex gap-2">Parking Status</div>
            <div className="flex gap-2">
              <input
                disabled
                type="radio"
                id="Open"
                className="w-5 border border-slate-400 "
                checked={formData.isOpen === true}
              />
              <span>Open</span>
            </div>

            <div className="flex gap-2">
              <input
                disabled
                type="radio"
                id="Closed"
                className="w-5 border border-slate-400 "
                checked={formData.isOpen === false}
              />
              <span>Closed</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <p className="font-medium">Two Wheeler Capacity:</p>
            {formData.twoWheelerCapacity > 0 ? (
              <span>Available</span>
            ) : (
              <span>Not Available</span>
            )}
          </div>
          <div className="flex items-center font-medium gap-2">
            <p>EV Charging:</p>
            {formData.chargingPorts > 0 ? (
              <span>Available</span>
            ) : (
              <span>Not Available</span>
            )}
          </div>

          <div className="flex flex-row items-center gap-10">
            <p className="font-medium ">Booking Time:</p>
            <input
              onChange={handleStartTimeChange}
              type="time"
              id="startTime"
              value={startTime}
              className="w-40 border border-slate-400 rounded-md"
            />
            <span>to</span>
            <input
              onChange={handleEndTimeChange}
              type="time"
              id="endTime"
              value={EndTime}
              className="w-40 border border-slate-400 rounded-md "
            />
          </div>
        </div>
      </form>
      <div className="flex items-center flex-col">
        <div className="flex items-center font-medium gap-2 mt-8">
          <p>Total Charge:</p>
          {difference>0 ? <span>Rs. {difference * formData.parkingRate}/-</span> : <span>Rs. 0/-</span>}
        </div>
        <button  className="p-3 bg-slate-700 border-2 text-center border-slate-700 text-white w-full md:w-1/3 rounded-lg uppercase hover:opacity-95 disabled:opacity-80 mt-2">
          Book Now
        </button>
      </div>
    </div>
  );
}
