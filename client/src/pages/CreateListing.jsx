import { React, useState } from "react";
import Cookies from "universal-cookie";
import { useNavigate } from "react-router-dom";

export default function CreateListing() {
  const [parkingType, setParkingType] = useState("Closed");
  const [status, setStatus] = useState("Open");
  const [formData, setFormData] = useState({});

  const host = "http://localhost:3001";
  const cookies = new Cookies();
  const navigate = useNavigate();

  const formatTime = (timeString) => {
    // Split the time string into hours and minutes
    const [hours, minutes] = timeString.split(":");
    // Ensure hours and minutes are two digits
    const formattedHours = hours.padStart(2, "0");
    const formattedMinutes = minutes.padStart(2, "0");
    // Return formatted time
    return `${formattedHours}:${formattedMinutes}`;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const authToken = cookies.get("access_token");
      const response = await fetch(`${host}/api/lots/addlot`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "auth-token": authToken,
        },
        body: JSON.stringify({
          ...formData,
          type: parkingType.toLowerCase(),
          isOpen: status === "Open",
          surveillanceCamera: formData.surveillanceCamera === "on",
          securityGuard: formData.securityGuard === "on",
          openingHours: formatTime(formData.openingTime),
          closingHours: formatTime(formData.closingTime),
        }),
      });
      if (response.ok) {
        const data = await response.json();
        console.log(data);
        navigate("/owner-profile");
      } else {
        const errorMessage = await response.text();
        console.error(errorMessage);
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="p-4 max-w-full min-h-screen mx-auto bg-[#F9FAFB]">
      <div className=" rounded-md p-1 my-7">
        <h1 className="text-3xl font-semibold text-center underline underline-offset-4 decoration-[#252e37]">Create a New Listing </h1>
      </div>
      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4">
        <div className="flex flex-col gap-4 flex-1">
          <p className="font-medium">Parking Space Name</p>
          <input
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            type="text"
            placeholder="Parking Space Name"
            className="border p-3 rounded-lg  shadow-inner"
            id="name"
            maxLength="62"
            minLength="5"
            required
          />

          <p className="font-medium">Location:</p>
          <input
            onChange={(e) =>
              setFormData({ ...formData, location: e.target.value })
            }
            type="text"
            placeholder="Location"
            className="border p-3 rounded-lg  shadow-inner"
            id="location"
            required
          />

          <div className="flex gap-6 flex-wrap">
            <div className="flex gap-2 font-medium">Parking Type:</div>

            <div className="flex gap-2">
              <input
                type="radio"
                id="closed"
                className="w-5  shadow-inner"
                onChange={(e) => setParkingType("Closed")}
                checked={parkingType === "Closed"}
              />
              <span>Closed</span>
            </div>
            <div className="flex gap-2">
              <input
                type="radio"
                id="mixed"
                className="w-5  shadow-inner"
                onChange={(e) => setParkingType("Mixed")}
                checked={parkingType === "Mixed"}
              />
              <span>Mixed</span>
            </div>
            <div className="flex gap-2">
              <input
                type="radio"
                id="open"
                className="w-5  shadow-inner"
                onChange={(e) => setParkingType("Open")}
                checked={parkingType === "Open"}
              />
              <span>Open</span>
            </div>
          </div>
          <div className="flex flex-wrap gap-6">
            <div className="flex items-center gap-2">
              <p>Four Wheeler Capacity:</p>
              <input
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    fourWheelerCapacity: e.target.value,
                  })
                }
                type="number"
                id="fourWheelerCapacity"
                placeholder="Four Wheeler Capacity"
                // min="0"
                max="5000"
                required
                className="p-3 border border-gray-300 rounded-lg  shadow-inner"
              />
            </div>
          </div>
          <div className="flex gap-6 flex-wrap">
              <div className="flex gap-2">
              <span className="font-medium">Security Guard ?</span>
                <input
                  onChange={(e) =>
                    setFormData({ ...formData, securityGuard: e.target.value })
                  }
                  type="checkbox"
                  id="security"
                  className="w-5"
                />
              </div>
              <div className="flex gap-2">
                
              <span className="font-medium">CCTV Surveillance ?</span>
                <input
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      surveillanceCamera: e.target.value,
                    })
                  }
                  type="checkbox"
                  id="surveillance"
                  className="w-5"
                />
              </div>
            </div>
        </div>
        <div className="flex flex-col flex-1 gap-4">
          <p className="font-medium">Opening time (hh : mm):</p>
          <input
            onChange={(e) =>
              setFormData({ ...formData, openingTime: e.target.value })
            }
            type="time"
            placeholder="Opening time (hh : mm)"
            className="border p-3 rounded-lg  shadow-inner"
            id="openingTime"
            required
          />

          <p className="font-medium">Closing time (hh : mm):</p>
          <input
            onChange={(e) =>
              setFormData({ ...formData, closingTime: e.target.value })
            }
            type="time"
            placeholder="Closing time (hh : mm)"
            className="border p-3 rounded-lg  shadow-inner"
            id="closingTime"
            required
          />

          <div className="flex gap-6 flex-wrap">
            <div className="flex gap-2">Parking Status</div>
            <div className="flex gap-2">
              <input
                type="radio"
                id="Open"
                className="w-5  shadow-inner"
                onChange={(e) => setStatus("Open")}
                checked={status === "Open"}
              />
              <span>Open</span>
            </div>

            <div className="flex gap-2">
              <input
                type="radio"
                id="Closed"
                className="w-5  shadow-inner"
                onChange={(e) => setStatus("Closed")}
                checked={status === "Closed"}
              />
              <span>Closed</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <p className="font-medium">Two Wheeler Capacity:</p>
            <input
              onChange={(e) =>
                setFormData({
                  ...formData,
                  twoWheelerCapacity: e.target.value,
                })
              }
              type="number"
              id="twoWheelerCapacity"
              // min="0"
              max="5000"
              placeholder="Two Wheeler Capacity:"
              required
              className="p-3 border border-gray-300 rounded-lg  shadow-inner"
            />
          </div>

          <div className="flex items-center gap-2">
            <p>No. of EV Charging Ports:</p>
            <input
              onChange={(e) =>
                setFormData({ ...formData, chargingPorts: e.target.value })
              }
              type="number"
              id="chargingPorts"
              // min="0"
              max="5000"
              required
              className="p-3 border border-gray-300 rounded-lg  shadow-inner"
            />
          </div>
        </div>
      </form>

      <button className="p-3 min-w-full my-7 shadow-inner bg-slate-700 text-white rounded-lg uppercase hover:opacity-95 disabled:opacity-80">
        Create Listing
      </button>
    </div>
  );
}
