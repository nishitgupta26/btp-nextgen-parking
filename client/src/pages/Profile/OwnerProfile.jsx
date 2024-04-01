import React, { useState } from "react";
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
import { Link } from "react-router-dom";

export default function OwnerProfile() {
  const host = "http://localhost:3001";
  const { currentUser } = useSelector((state) => state.user);
  const { loading, error } = useSelector((state) => state.user);
  const cookies = new Cookies();
  const dispatch = useDispatch();
  const [formData, setformData] = useState({});
  const authtoken = cookies.get("access_token");
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const [showListingsError, setShowListingsError] = useState(false);
  const [userListings, setUserListings] = useState([]);
  const [showListings, setShowListings] = useState(true);
  //console.log(currentUser);

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

  const handleShowListings = async () => {
    try {
      setShowListingsError(false);
      const res = await fetch(`${host}/api/lots/getownerlots`, {
        method: "GET",
        headers: {
          "auth-token": authtoken,
        },
      });
      if (res.ok) {
        const data = await res.json();
        setUserListings(data);
        setShowListings(true);
      } else {
        setShowListingsError(true);
      }
    } catch (error) {
      setShowListingsError(true);
    }
  };

  const handleListingDelete = async (id) => {
    try {
      const res = await fetch(`${host}/api/lots/deletelot/${id}`, {
        method: "DELETE",
        headers: {
          "auth-token": authtoken,
        },
      });
      if (res.ok) {
        const data = await res.json();
        console.log(data);
        setUserListings(userListings.filter((listing) => listing._id !== id));
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleShowManagers = async () => {
    setShowListings(false);
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

        <button
          disabled={loading}
          className="bg-slate-700 text-white rounded-lg p-3 uppercase hover:opacity-95 disabled:opacity-80"
        >
          {loading ? "Loading..." : "Update Profile"}
        </button>
        <Link
          className="bg-green-700 text-white p-3 rounded-lg uppercase text-center hover:opacity-95"
          to={"/create-listing"}
        >
          Create Listing
        </Link>
      </form>
      <div className="flex justify-between mt-5">
        <span onClick={handleSignOut} className="text-red-700 cursor-pointer">
          Sign out
        </span>
      </div>

      <p className="text-red-700 mt-5">{error ? error : ""}</p>
      <p className="text-green-700 mt-5">
        {updateSuccess ? "User is updated successfully!" : ""}
      </p>

      <div className="flex justify-center mt-5">
        <button onClick={handleShowListings} className="text-green-700">
          Show Listings
        </button>
      </div>

      <p className="text-red-700 mt-5">
        {showListingsError ? "Error showing listings" : ""}
      </p>

      {showListings && userListings && userListings.length > 0 && (
        <div className="flex flex-col gap-4">
          <h1 className="text-center mt-7 text-2xl font-semibold">
            Your Listings
          </h1>
          {userListings.map((listing) => (
            <div
              key={listing._id}
              className="border rounded-lg p-3 flex justify-between items-center gap-4"
            >
              <div className="flex flex-col">
                <p>{listing.name}</p>
                <p>{listing.location}</p>
              </div>

              <div className="flex flex-col item-center">
                <button
                  onClick={() => handleListingDelete(listing._id)}
                  className="text-red-700 uppercase"
                >
                  Delete
                </button>
                <Link to={`/update-listing/${listing._id}`}>
                  <button className="text-green-700 uppercase">Edit</button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}

      {!showListings && (
        <div>
          <h1>Managers</h1>
        </div>
      )}
    </div>
  );
}
