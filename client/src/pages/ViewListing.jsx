import { React, useState, useEffect } from "react";
import Cookies from "universal-cookie";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

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
      // console.log(data);
      toast.success("Listing Approved Successfully", {
        position: "top-center",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
      if (data.error) {
        console.log(data.error);
        toast.error(data.error, {
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
    } catch (error) {
      console.error("Error approving listing", error);
      toast.error("Error in approving listing", {
        position: "top-center",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
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
      toast.info("Listing Dispproved", {
        position: "top-center",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
      if (data.error) {
        console.log(data.error);
        toast.error(data.error, {
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
    } catch (error) {
      console.error("Error disapproving listing", error);
      toast.error("Error disapproving listing", {
        position: "top-center",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
    }
  };

  return (
    <div className="p-4 px-12 max-w-full min-h-screen mx-auto bg-white">
      <div className=" rounded-md p-1 my-7">
        <h1 className="text-3xl font-semibold text-center mb-4">
          Listing Details
        </h1>
      </div>
      <form className="flex flex-col sm:flex-row gap-4">
        <div className="flex flex-col gap-4 flex-1">
          <p className="font-medium">Parking Space Name</p>
          <input
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
                checked={formData.type === "closed"}
              />
              <span>Closed</span>
            </div>
            <div className="flex gap-2">
              <input
                type="radio"
                id="mixed"
                className="w-5 border border-slate-400"
                checked={formData.type === "mixed"}
              />
              <span>Mixed</span>
            </div>
            <div className="flex gap-2">
              <input
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
              <input
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
                type="checkbox"
                id="security"
                className="w-5 border border-slate-400 "
                checked={formData.securityGuard || false}
              />
            </div>
            <div className="flex gap-2">
              <span className="font-medium">CCTV Surveillance ?</span>
              <input
                type="checkbox"
                id="surveillance"
                className="w-5 border border-slate-400 "
                checked={formData.surveillanceCamera || false}
              />
            </div>
            <div className="flex items-center font-medium gap-2">
              <p>Parking Rate:</p>
              <input
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
            type="text"
            placeholder="Opening time (hh : mm)"
            className="border border-slate-400  p-3 rounded-lg"
            id="openingTime"
            value={formData.openingHours || ""}
            required
          />
          <p className="font-medium">Closing time (hh : mm):</p>
          <input
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
                checked={formData.isOpen === true}
              />
              <span>Open</span>
            </div>

            <div className="flex gap-2">
              <input
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
            <input
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
          <Link
            to="/admin-profile"
            onClick={handleApproveListing}
            className="p-3 bg-slate-700 border-2 text-center border-slate-700 text-white w-full md:w-1/3 rounded-lg uppercase hover:opacity-95 disabled:opacity-80 mt-2"
          >
            APPROVE LISTING
          </Link>

          <Link
            to="/admin-profile"
            onClick={handleDisapproveListing}
            className="p-3 bg-white-700 border-2 text-center border-slate-700 text-slate-700 w-full md:w-1/3 rounded-lg uppercase hover:bg-red-700 hover:text-white hover:opacity-95 disabled:opacity-80 mt-2"
          >
            DISAPPROVE LISTING
          </Link>
        </div>
    </div>
  );
}
