import { React, useState, useEffect } from "react";
import Cookies from "universal-cookie";
import { useNavigate, useParams } from "react-router-dom";

export default function UpdateListing() {
  const [formData, setFormData] = useState({});

  const host = "http://localhost:3001";
  const cookies = new Cookies();
  const navigate = useNavigate();
  const params = useParams();
  const [email, setEmail] = useState("");
  const listingId = params.listingId;

  useEffect(() => {
    const fetchListing = async () => {
      try {
        const listingId = params.listingId;
        const res = await fetch(`${host}/api/lots/getlot/${listingId}`);
        const data = await res.json();
        if (data.success === false) {
          console.log(data.message);
          return;
        }
        setFormData(data);
        console.log(formData);
      } catch (error) {
        console.error("Error fetching listing:", error);
      }
    };

    fetchListing();
  }, [params.listingId]);

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
      const response = await fetch(`${host}/api/lots/updatelot/${listingId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "auth-token": authToken,
        },
        body: JSON.stringify({
          ...formData,
          openingHours: formatTime(formData.openingHours),
          closingHours: formatTime(formData.closingHours),
        }),
      });
      if (response.ok) {
        const data = await response.json();
        // console.log(data);
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
    <div className="p-4 px-12 max-w-full min-h-screen mx-auto bg-white">
      <div className=" rounded-md p-1 my-7">
        <h1 className="text-3xl font-semibold text-center mb-4">
          Update Listing
        </h1>
      </div>
      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4">
        <div className="flex flex-col gap-4 flex-1">
          <p className="font-medium">Parking Space Name</p>
          <input
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
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
            onChange={(e) =>
              setFormData({ ...formData, location: e.target.value })
            }
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
                type="radio"
                id="closed"
                className="w-5 border border-slate-400 "
                onChange={(e) => setFormData({ ...formData, type: "closed" })}
                checked={formData.type === "closed"}
              />
              <span>Closed</span>
            </div>
            <div className="flex gap-2">
              <input
                type="radio"
                id="mixed"
                className="w-5 border border-slate-400"
                onChange={(e) => setFormData({ ...formData, type: "mixed" })}
                checked={formData.type === "mixed"}
              />
              <span>Mixed</span>
            </div>
            <div className="flex gap-2">
              <input
                type="radio"
                id="open"
                className="w-5 border border-slate-400"
                onChange={(e) => setFormData({ ...formData, type: "open" })}
                checked={formData.type === "open"}
              />
              <span>Open</span>
            </div>
          </div>
          <div className="flex flex-wrap gap-6">
            <div className="flex flex-col sm:flex-row items-center gap-2">
              <p className="font-medium">Four Wheeler Capacity:</p>
              <input
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    fourWheelerCapacity: e.target.value,
                  })
                }
                type="number"
                id="fourWheelerCapacity"
                // min="0"
                max="5000"
                required
                value={formData.fourWheelerCapacity || ""}
                className="p-3 border border-slate-400  rounded-lg"
              />
            </div>
          </div>
          <div className="flex gap-6 flex-wrap">
            <div className="flex gap-2">
              <span className="font-medium">Security Guard ?</span>
              <input
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    securityGuard: e.target.checked,
                  })
                }
                type="checkbox"
                id="security"
                className="w-5 border border-slate-400 "
                checked={formData.securityGuard || false}
              />
            </div>
            <div className="flex gap-2">
              <span className="font-medium">CCTV Surveillance ?</span>
              <input
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    surveillanceCamera: e.target.checked,
                  })
                }
                type="checkbox"
                id="surveillance"
                className="w-5 border border-slate-400 "
                checked={formData.surveillanceCamera || false}
              />
            </div>
            <div className="flex items-center font-medium gap-2">
              <p>Parking Rate:</p>
              <input
                onChange={(e) =>
                  setFormData({ ...formData, parkingRate: e.target.value })
                }
                type="number"
                id="parkingRate"
                value={formData.parkingRate || ""}
                required
                className="p-3 border border-slate-400  rounded-lg"
              />
            </div>
          </div>
        </div>
        <div className="flex flex-col flex-1 gap-4">
          <p className="font-medium">Opening time (hh : mm):</p>
          <input
            onChange={(e) =>
              setFormData({ ...formData, openingHours: e.target.value })
            }
            type="text"
            placeholder="Opening time (hh : mm)"
            className="border border-slate-400  p-3 rounded-lg"
            id="openingTime"
            value={formData.openingHours || ""}
            required
          />
          <p className="font-medium">Closing time (hh : mm):</p>
          <input
            onChange={(e) =>
              setFormData({ ...formData, closingHours: e.target.value })
            }
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
                type="radio"
                id="Open"
                className="w-5 border border-slate-400 "
                onChange={(e) => setFormData({ ...formData, isOpen: true })}
                checked={formData.isOpen === true}
              />
              <span>Open</span>
            </div>

            <div className="flex gap-2">
              <input
                type="radio"
                id="Closed"
                className="w-5 border border-slate-400 "
                onChange={(e) => setFormData({ ...formData, isOpen: false })}
                checked={formData.isOpen === false}
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
              placeholder="Two Wheeler Capacity"
              required
              value={formData.twoWheelerCapacity || ""}
              className="p-3 border border-slate-400  rounded-lg"
            />
          </div>
          <div className="flex items-center font-medium gap-2">
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
              value={formData.chargingPorts || ""}
              className="p-3 border rounded-lg border-slate-400"
            />
          </div>
        </div>
      </form>
      <div className="flex items-center flex-col">
        <button
          onClick={handleSubmit}
          className="p-3 bg-slate-700 border-2 border-slate-700 text-white w-full md:w-1/3 rounded-lg uppercase hover:opacity-95 disabled:opacity-80 mt-2"
        >
          UPDATE LISTING
        </button>
        <button
          onClick={() => navigate(`/update-managers/${listingId}`)}
          className="p-3 bg-white-700 border-2 border-slate-700 text-slate-700 w-full md:w-1/3 rounded-lg uppercase hover:bg-slate-700 hover:text-white hover:opacity-95 disabled:opacity-80 mt-2"
        >
          ADD/DELETE MANAGERS
        </button>
      </div>
    </div>
  );
}
