import { React, useState } from "react";
import Cookies from "universal-cookie";

export default function CreateListing() {
  const [parkingType, setParkingType] = useState("Closed");
  const [status, setStatus] = useState("Open");
  const [formData, setFormData] = useState({});
  const host = "http://localhost:3001";
  const cookies = new Cookies();

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
          openingHours: formatTime(formData.openingTime),
          closingHours: formatTime(formData.closingTime),
        }),
      });
      if (response.ok) {
        const data = await response.json();
        console.log(data);
      } else {
        const errorMessage = await response.text();
        console.error(errorMessage);
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <main className="p-3 max-w-4xl mx-auto">
      <h1 className="text-3xl font-semibold text-center my-7">
        Create a Listing
      </h1>
      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4">
        <div className="flex flex-col gap-4 flex-1">
          <input
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            type="text"
            placeholder="Name"
            className="border p-3 rounded-lg"
            id="name"
            maxLength="62"
            minLength="5"
            required
          />
          <input
            onChange={(e) =>
              setFormData({ ...formData, location: e.target.value })
            }
            type="text"
            placeholder="location"
            className="border p-3 rounded-lg"
            id="location"
            required
          />
          <div className="flex gap-6 flex-wrap">
            <div className="flex gap-2">Parking Type:</div>

            <div className="flex gap-2">
              <input
                type="radio"
                id="closed"
                className="w-5"
                onChange={(e) => setParkingType("Closed")}
                checked={parkingType === "Closed"}
              />
              <span>Closed</span>
            </div>
            <div className="flex gap-2">
              <input
                type="radio"
                id="mixed"
                className="w-5"
                onChange={(e) => setParkingType("Mixed")}
                checked={parkingType === "Mixed"}
              />
              <span>Mixed</span>
            </div>
            <div className="flex gap-2">
              <input
                type="radio"
                id="open"
                className="w-5"
                onChange={(e) => setParkingType("Open")}
                checked={parkingType === "Open"}
              />
              <span>Open</span>
            </div>
          </div>
          <div className="flex flex-wrap gap-6">
            <div className="flex items-center gap-2">
              <input
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    twoWheelerCapacity: e.target.value,
                  })
                }
                type="number"
                id="twoWheelerCapacity"
                min="0"
                max="5000"
                required
                className="p-3 border border-gray-300 rounded-lg"
              />
              <p>twoWheelerCapacity</p>
            </div>
            <div className="flex items-center gap-2">
              <input
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    fourWheelerCapacity: e.target.value,
                  })
                }
                type="number"
                id="fourWheelerCapacity"
                min="0"
                max="5000"
                required
                className="p-3 border border-gray-300 rounded-lg"
              />
              <p>fourWheelerCapacity</p>
              <input
                onChange={(e) =>
                  setFormData({ ...formData, chargingPorts: e.target.value })
                }
                type="number"
                id="chargingPorts"
                min="0"
                max="5000"
                required
                className="p-3 border border-gray-300 rounded-lg"
              />
              <p>chargingPorts</p>
            </div>

            <div className="flex gap-6 flex-wrap">
              <div className="flex gap-2">
                <input
                  onChange={(e) =>
                    setFormData({ ...formData, securityGuard: e.target.value })
                  }
                  type="checkbox"
                  id="security"
                  className="w-5"
                />
                <span>securityGuard</span>
              </div>
              <div className="flex gap-2">
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
                <span>surveillanceCamera</span>
              </div>
            </div>
          </div>
        </div>
        <div className="flex flex-col flex-1 gap-4">
          <div className="flex items-center gap-2">
            <input
              onChange={(e) =>
                setFormData({ ...formData, parkingRate: e.target.value })
              }
              type="number"
              id="parkingRate"
              defaultValue={30}
              required
              className="p-3 border border-gray-300 rounded-lg"
            />
            <div className="flex flex-col items-center">
              <p>parking Rate</p>
              <span className="text-xs">(per hour in Rs)</span>
            </div>
          </div>

          <input
            onChange={(e) =>
              setFormData({ ...formData, openingTime: e.target.value })
            }
            type="text"
            placeholder="Opening time (hh : mm)"
            className="border p-3 rounded-lg"
            id="openingTime"
            required
          />
          <input
            onChange={(e) =>
              setFormData({ ...formData, closingTime: e.target.value })
            }
            type="text"
            placeholder="Closing time (hh : mm)"
            className="border p-3 rounded-lg"
            id="closingTime"
            required
          />

          <div className="flex gap-6 flex-wrap">
            <div className="flex gap-2">Parking Status</div>
            <div className="flex gap-2">
              <input
                type="radio"
                id="Open"
                className="w-5"
                onChange={(e) => setStatus("Open")}
                checked={status === "Open"}
              />
              <span>Open</span>
            </div>

            <div className="flex gap-2">
              <input
                type="radio"
                id="Closed"
                className="w-5"
                onChange={(e) => setStatus("Closed")}
                checked={status === "Closed"}
              />
              <span>Closed</span>
            </div>
            <button className="p-3 bg-slate-700 text-white rounded-lg uppercase hover:opacity-95 disabled:opacity-80">
              Create Listing
            </button>
          </div>
        </div>
      </form>
    </main>
  );
}
