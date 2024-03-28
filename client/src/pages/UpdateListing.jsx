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
      const listingId = params.listingId;
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

  const handleManager = async (e) => {
    e.preventDefault();
    try {
      const authToken = cookies.get("access_token");
      const listingId = params.listingId;
      const response = await fetch(`${host}/api/manager/addmanager`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "auth-token": authToken,
        },
        body: JSON.stringify({
          lotid: listingId,
          manageremail: email,
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
    <main className="p-3 max-w-4xl mx-auto">
      <h1 className="text-3xl font-semibold text-center my-7">
        Update Listing
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
            value={formData.name || ""}
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
            value={formData.location || ""}
            required
          />
          <div className="flex gap-6 flex-wrap">
            <div className="flex gap-2">Parking Type:</div>

            <div className="flex gap-2">
              <input
                type="radio"
                id="closed"
                className="w-5"
                onChange={(e) => setFormData({ ...formData, type: "closed" })}
                checked={formData.type === "closed"}
              />
              <span>Closed</span>
            </div>
            <div className="flex gap-2">
              <input
                type="radio"
                id="mixed"
                className="w-5"
                onChange={(e) => setFormData({ ...formData, type: "mixed" })}
                checked={formData.type === "mixed"}
              />
              <span>Mixed</span>
            </div>
            <div className="flex gap-2">
              <input
                type="radio"
                id="open"
                className="w-5"
                onChange={(e) => setFormData({ ...formData, type: "open" })}
                checked={formData.type === "open"}
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
                value={formData.twoWheelerCapacity || ""}
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
                value={formData.fourWheelerCapacity || ""}
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
                value={formData.chargingPorts || ""}
                className="p-3 border border-gray-300 rounded-lg"
              />
              <p>chargingPorts</p>
            </div>

            <div className="flex gap-6 flex-wrap">
              <div className="flex gap-2">
                <input
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      securityGuard: e.target.checked,
                    })
                  }
                  type="checkbox"
                  id="security"
                  className="w-5"
                  checked={formData.securityGuard || false}
                />
                <span>securityGuard</span>
              </div>
              <div className="flex gap-2">
                <input
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      surveillanceCamera: e.target.checked,
                    })
                  }
                  type="checkbox"
                  id="surveillance"
                  className="w-5"
                  checked={formData.surveillanceCamera || false}
                />
                <span>surveillanceCamera</span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <input
                onChange={(e) =>
                  setFormData({ ...formData, parkingRate: e.target.value })
                }
                type="number"
                id="parkingRate"
                value={formData.parkingRate || ""}
                required
                className="p-3 border border-gray-300 rounded-lg"
              />
              <div className="flex flex-col items-center">
                <p>parking Rate</p>
                <span className="text-xs">(per hour in Rs)</span>
              </div>
            </div>
          </div>
        </div>
        <div className="flex flex-col flex-1 gap-4 ml-6">
          <input
            onChange={(e) =>
              setFormData({ ...formData, openingHours: e.target.value })
            }
            type="text"
            placeholder="Opening time (hh : mm)"
            className="border p-3 rounded-lg"
            id="openingTime"
            value={formData.openingHours || ""}
            required
          />
          <input
            onChange={(e) =>
              setFormData({ ...formData, closingHours: e.target.value })
            }
            type="text"
            placeholder="Closing time (hh : mm)"
            className="border p-3 rounded-lg"
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
                className="w-5"
                onChange={(e) => setFormData({ ...formData, isOpen: true })}
                checked={formData.isOpen === true}
              />
              <span>Open</span>
            </div>

            <div className="flex gap-2">
              <input
                type="radio"
                id="Closed"
                className="w-5"
                onChange={(e) => setFormData({ ...formData, isOpen: false })}
                checked={formData.isOpen === false}
              />
              <span>Closed</span>
            </div>
          </div>

          <div className="text-center mt-3">
            <p className="text-xl text-blue-700 font-semibold">
              Add new manager
            </p>
          </div>

          <input
            onChange={(e) => setEmail(e.target.value)}
            type="text"
            placeholder="emailID of manager"
            className="border p-3 rounded-lg"
            id="location"
          />

          <button
            onClick={handleManager}
            className="p-3 bg-slate-700 text-white rounded-lg uppercase hover:opacity-95 disabled:opacity-80 mt-2"
          >
            ADD THIS MANAGER
          </button>

          <button className="p-3 bg-slate-700 text-white rounded-lg uppercase hover:opacity-95 disabled:opacity-80 mt-2">
            Update Listing
          </button>
        </div>
      </form>
    </main>
  );
}
