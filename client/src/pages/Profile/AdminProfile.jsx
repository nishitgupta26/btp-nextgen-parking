import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  updateUserStart,
  updateUserSuccess,
  updateUserFailure,
  signOutUserStart,
  signOutUserSuccess,
  signOutUserFailure,
} from "../../redux/User/userSlice.js";
import Cookies from "universal-cookie";
import { useNavigate } from "react-router-dom";

export default function AdminProfile() {
  const host = "http://localhost:3001";
  const { currentUser } = useSelector((state) => state.user);
  const cookies = new Cookies();
  const dispatch = useDispatch();
  const [formData, setformData] = useState({});
  const authtoken = cookies.get("access_token");
  //console.log(currentUser);
  const [pendingListings, setPendingListings] = useState([]);
  const [showListingsError, setShowListingsError] = useState(false);
  const navigate = useNavigate();
  const [showListings, setShowListings] = useState(false);

  const handleSignOut = async () => {
    try {
      dispatch(signOutUserStart());
      cookies.remove("access_token");
      dispatch(signOutUserSuccess());
    } catch (error) {
      dispatch(signOutUserFailure(error.message));
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      dispatch(updateUserStart());
      const res = await fetch(`${host}/api/auth/updateuser`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "auth-token": authtoken, // Use the correct header name and format for the token
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      console.log(data);
      if (data.error) {
        dispatch(updateUserFailure(data.error));
        return;
      }

      dispatch(updateUserSuccess(data));
      setUpdateSuccess(true);
    } catch (error) {
      dispatch(updateUserFailure(error.message));
    }
  };

  const showPendingListings = async () => {
    try {
      setShowListings(true);
      const authtoken = cookies.get("access_token");
      const res = await fetch(`${host}/api/admin/showpending`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "auth-token": authtoken,
        },
      });
      const data = await res.json();
      console.log(data);
      if (data.error) {
        setShowListingsError(data.error);
        return;
      }
      setPendingListings(data);
    } catch (error) {
      setShowListingsError(error.message);
    }
  };

  return (
    <div className="p-3 max-w-lg mx-auto">
      <h1 className="text-3xl font-semibold text-center my-7">Profile</h1>
      <form onSubmit={handleUpdate} className="flex flex-col gap-4">
        <input
          onChange={(e) => setformData({ ...formData, name: e.target.value })}
          type="text"
          placeholder="username"
          id="username"
          className="border p-3 rounded-lg"
        />

        <input
          onChange={(e) => setformData({ ...formData, email: e.target.value })}
          type="email"
          placeholder="email"
          id="email"
          className="border p-3 rounded-lg"
        />

        <input
          onChange={(e) =>
            setformData({ ...formData, password: e.target.value })
          }
          type="text"
          placeholder="password"
          id="password"
          className="border p-3 rounded-lg"
        />

        <button className="bg-slate-700 text-white rounded-lg p-3 uppercase hover:opacity-95 disabled:opacity-80">
          update
        </button>
      </form>
      <div className="flex justify-between mt-5">
        <span onClick={handleSignOut} className="text-red-700 cursor-pointer">
          Sign out
        </span>
      </div>

      <div className="flex justify-center mt-5">
        <button onClick={showPendingListings} className="text-green-700">
          Show Pending Listings
        </button>
      </div>

      {showListings && pendingListings.length > 0 && (
        <div className="flex flex-col gap-4">
          <h1 className="text-center mt-7 text-2xl font-semibold">
            Listings for Approval
          </h1>
          {pendingListings.map((pendingListing) => (
            <div
              key={pendingListing._id}
              className="border rounded-lg p-3 flex justify-between items-center gap-4"
            >
              <div className="flex flex-col">
                <p>{pendingListing.name}</p>
              </div>

              <div className="flex flex-col item-center">
                <button
                  onClick={() =>
                    navigate(`/view-listing/${pendingListing._id}`)
                  }
                  className="text-red-700 uppercase"
                >
                  View details
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
