import { React, useState, useEffect } from "react";
import Cookies from "universal-cookie";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";

export default function ViewListing() {
  const [formData, setFormData] = useState({});

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

  const handleApproveListing = async () => {
    try {
      const res = await fetch(`${host}/api/admin/approvelots`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "auth-token": cookies.get("access_token"),
        },
        body: JSON.stringify({ lotid: listingId }),
      });
      const data = await res.json();
      if (data.error) {
        console.log(data.error);
        return;
      }
    } catch (error) {
      console.error("Error approving listing:", error);
    }
  };

  const handleDisapproveListing = async () => {
    try {
      const res = await fetch(`${host}/api/admin/deletelot`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          "auth-token": cookies.get("access_token"),
        },
        body: JSON.stringify({ lotid: listingId }),
      });
      const data = await res.json();
      if (data.error) {
        console.log(data.error);
        return;
      }
    } catch (error) {
      console.error("Error disapproving listing:", error);
    }
  };

  return (
    <main className="p-3 max-w-4xl mx-auto">
      <h1 className="text-3xl font-semibold text-center my-7">
        Listing Details
      </h1>
      <form className="flex flex-col sm:flex-row gap-4">
        <div className="flex flex-col gap-4 flex-1">
          <input
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
                checked={formData.type === "closed"}
              />
              <span>Closed</span>
            </div>
            <div className="flex gap-2">
              <input
                type="radio"
                id="mixed"
                className="w-5"
                checked={formData.type === "mixed"}
              />
              <span>Mixed</span>
            </div>
            <div className="flex gap-2">
              <input
                type="radio"
                id="open"
                className="w-5"
                checked={formData.type === "open"}
              />
              <span>Open</span>
            </div>
          </div>
          <div className="flex flex-wrap gap-6">
            <div className="flex items-center gap-2">
              <input
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
                  type="checkbox"
                  id="security"
                  className="w-5"
                  checked={formData.securityGuard || false}
                />
                <span>securityGuard</span>
              </div>
              <div className="flex gap-2">
                <input
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
            type="text"
            placeholder="Opening time (hh : mm)"
            className="border p-3 rounded-lg"
            id="openingTime"
            value={formData.openingHours || ""}
            required
          />
          <input
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
                checked={formData.isOpen === true}
              />
              <span>Open</span>
            </div>

            <div className="flex gap-2">
              <input
                type="radio"
                id="Closed"
                className="w-5"
                checked={formData.isOpen === false}
              />
              <span>Closed</span>
            </div>
          </div>

          <Link
            to="/admin-profile"
            onClick={handleApproveListing}
            className="p-3 bg-slate-700 text-white rounded-lg uppercase hover:opacity-95 disabled:opacity-80 mt-2"
          >
            APPROVE LISTING
          </Link>

          <Link
            to="/admin-profile"
            onClick={handleDisapproveListing}
            className="p-3 bg-slate-700 text-white rounded-lg uppercase hover:opacity-95 disabled:opacity-80 mt-2"
          >
            DISAPPROVE LISTING
          </Link>
        </div>
      </form>
    </main>
  );
}
