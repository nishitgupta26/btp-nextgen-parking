import React, { useState } from "react";
import { useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import Cookies from "universal-cookie";
import BgImg from "../img/parkingSlotCardBg.png";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ParkingBox from "../components/ParkingBox";
import { useDispatch, useSelector } from "react-redux";
import { updateCoordinates } from "../redux/User/userSlice";

export default function BookParking() {
  const [formData, setFormData] = useState({});
  const [difference, setDifference] = useState("");
  const [startTime, setStartTime] = useState("");
  const [EndTime, setEndTime] = useState("");
  const [vehicleType, setVehicleType] = useState("fourWheeler");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [pin, setPin] = useState("");
  const [vehicleNumber, setVehicleNumber] = useState("");
  const host = "http://localhost:3001";
  const cookies = new Cookies();
  const navigate = useNavigate();
  const params = useParams();
  const listingId = params.listingId;
  const dispatch = useDispatch();
  const [booked, setBooked] = useState(false);

  const { latitude, longitude } = useSelector((state) => state.user);

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
      } catch (error) {
        console.error("Error fetching listing:", error);
      }
    };

    fetchListing();
  }, [listingId]);

  const d = new Date();
  const hr = d.getHours();
  const min = d.getMinutes();

  const handleStartTimeChange = (e) => {
    const selectedTime = e.target.value;
    const currentTime = new Date();
    const selectedHour = parseInt(selectedTime.split(":")[0]);
    const selectedMinute = parseInt(selectedTime.split(":")[1]);

    const currentHour = currentTime.getHours();
    const currentMinute = currentTime.getMinutes();

    const timeDifference =
      (selectedHour - currentHour) * 60 + (selectedMinute - currentMinute);

    if (timeDifference > 30) {
      const errorMessage =
        "Cannot book parking more than 30 minutes in advance.";
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
      return;
    }

    setStartTime(e.target.value);
    calculateDifference(e.target.value, EndTime);
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
      const errorMessage =
        "Error: Second time cannot be earlier than first time.";
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
  useEffect(() => {
    console.log(vehicleType);
  }, [vehicleType]);

  const parkingBoxesFourWheeler = Array.from(
    { length: formData.fourWheelerCapacity },
    (_, index) => (
      <ParkingBox key={index} index={index} booked={formData.availableSpots} />
    )
  );
  const parkingBoxesTwoWheeler = Array.from(
    { length: formData.twoWheelerCapacity },
    (_, index) => (
      <ParkingBox
        key={index}
        index={index}
        booked={formData.availableSpotsTwoWheeler}
      />
    )
  );

  useEffect(() => {
    const parkingBoxesFourWheeler = Array.from(
      { length: formData.fourWheelerCapacity },
      (_, index) => (
        <ParkingBox
          key={index}
          index={index}
          booked={formData.availableSpots}
        />
      )
    );
  }, [formData.availableSpots]);

  useEffect(() => {
    const parkingBoxesTwoWheeler = Array.from(
      { length: formData.twoWheelerCapacity },
      (_, index) => (
        <ParkingBox
          key={index}
          index={index}
          booked={formData.availableSpotsTwoWheeler}
        />
      )
    );
  }, [formData.availableSpotsTwoWheeler]);

  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
  };

  const closeModal = (e) => {
    if (e.target.className === "modal-overlay") {
      setIsModalOpen(false);
    }
  };

  function convertToISO(timeString) {
    // Parse the time string into hours and minutes
    const [hours, minutes] = timeString.split(":").map(Number);

    // Create a Date object with today's date and the provided hours and minutes
    const date = new Date();
    date.setHours(hours);
    date.setMinutes(minutes);

    // Format the Date object to ISO 8601 format
    return date.toISOString();
  }

  const handleBookng = async (e) => {
    e.preventDefault();
    if (pin !== "12345") {
      toast.error("Invalid Pin", {
        position: "top-center",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
      return;
    }

    try {
      const authToken = cookies.get("access_token");
      const startISO = convertToISO(startTime);
      const endISO = convertToISO(EndTime);

      const response = await fetch(`${host}/api/booking/bookslot`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "auth-token": authToken,
        },
        body: JSON.stringify({
          lotId: listingId,
          checkIn: startISO,
          checkOut: endISO,
          vehicleNumber,
          vehicleType,
          parkingRate: formData.parkingRate,
        }),
      });
      if (response.ok) {
        const data = await response.json();
        console.log(data);
        setBooked(true);
        toast.success("Parking booked successfully", {
          position: "top-center",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });
      } else {
        const errorMessage = await response.text();
        console.error(errorMessage);
      }
    } catch (error) {
      console.log(error);
    }

    setIsModalOpen(false);
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
            <span className="capitalize">{formData.type}</span>
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
          <div className="flex gap-4 flex-wrap flex-col">
            <div className="flex gap-2">
              <span className="font-medium">Security Guard : </span>
              {formData.securityGuard ? (
                <span className="">Available </span>
              ) : (
                <span className="">Not Available</span>
              )}
            </div>
            <div className="flex gap-2">
              <span className="font-medium">CCTV Surveillance :</span>
              {formData.surveillanceCamera ? (
                <span className="">Available </span>
              ) : (
                <span className="">Not Available</span>
              )}
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
            <div className="flex gap-2 font-medium">Parking Status:</div>
            {formData.isOpen ? (
              <span className="capitalize">Open</span>
            ) : (
              <span className="capitalize">Closed</span>
            )}
          </div>
          <div className="flex items-center gap-2">
            <p className="font-medium">Two Wheeler Capacity:</p>
            {formData.twoWheelerCapacity > 0 ? (
              <span>Available</span>
            ) : (
              <span>Not Available</span>
            )}
          </div>
          <div className="flex items-center gap-2">
            <p className="font-medium">EV Charging:</p>
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
          <div className="flex flex-row items-center gap-6">
            <p className="font-medium ">Vehicle Type:</p>
            <input
              onChange={(e) => setVehicleType(e.target.value)}
              type="radio"
              id="fourWheeler"
              value="fourWheeler"
              className="w-5 border border-slate-400 rounded-md"
              checked={vehicleType === "fourWheeler"}
            />
            <span>Four Wheeler</span>
            <input
              onChange={(e) => setVehicleType(e.target.value)}
              type="radio"
              id="twoWheeler"
              value="twoWheeler"
              className="w-5 border border-slate-400 rounded-md "
              checked={vehicleType === "twoWheeler"}
            />
            <span>Two Wheeler</span>
          </div>
        </div>
      </form>
      <div className="flex flex-col justify-center items-center mt-8">
        <p className="font-medium text-xl">Parking Lot Chart</p>
        <div className="flex flex-wrap gap-3 p-3 mt-6 max-h-80 overflow-auto flex-row border-2 border-gray-500 rounded-lg">
          {vehicleType === "fourWheeler"
            ? parkingBoxesFourWheeler
            : parkingBoxesTwoWheeler}
        </div>
      </div>
      <div className="flex items-center flex-col">
        <div className="flex items-center font-medium gap-2 mt-8">
          <p>Total Charge:</p>
          {difference >= 0 && vehicleType === "fourWheeler" ? (
            <span>Rs. {difference * formData.parkingRate}/-</span>
          ) : (
            <span></span>
          )}
          {difference >= 0 && vehicleType === "twoWheeler" ? (
            <span>Rs. {(difference * formData.parkingRate) / 2}/-</span>
          ) : (
            <span></span>
          )}
        </div>
        <button
          onClick={toggleModal}
          className="p-3 bg-slate-700 border-2 text-center border-slate-700 text-white w-full md:w-1/3 rounded-lg uppercase hover:opacity-95 disabled:opacity-80 mt-2"
        >
          {booked ? `Your booking is confirmed` : `Book Now`}
        </button>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div
            className="absolute inset-0 bg-gray-500 opacity-75 modal-overlay"
            onClick={closeModal}
          ></div>
          <div className="relative bg-white rounded-lg p-8 modal">
            <p
              className="absolute top-0 right-0 cursor-pointer text-gray-500 hover:text-gray-700 text-xl font-bold mr-2 mt-1"
              onClick={toggleModal}
            >
              X
            </p>
            <p className="text-xl font-semibold mb-4">Enter Vehicle Number</p>
            <input
              onChange={(e) => {
                setVehicleNumber(e.target.value);
              }}
              type="text"
              placeholder="Ex: RJ14AA0000"
              className="border border-gray-300 p-2 rounded-md mb-4 w-full"
            />

            <p className="text-xl font-semibold mb-4">Enter Pin for payment</p>
            <input
              onChange={(e) => {
                setPin(e.target.value);
              }}
              type="text"
              placeholder="Pin"
              className="border border-gray-300 p-2 rounded-md mb-4 w-full"
            />
            <button
              onClick={handleBookng}
              className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
            >
              Pay & Book
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
