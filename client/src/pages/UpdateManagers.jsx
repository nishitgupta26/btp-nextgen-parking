import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Cookies from "universal-cookie";

export default function UpdateManagers() {
  const host = "http://localhost:3001";
  const [managers, setManagers] = useState([]);
  const params = useParams();
  const cookies = new Cookies();
  const listingId = params.listingId;
  const [email, setEmail] = useState("");

  const fetchManagers = async () => {
    try {
      const authToken = cookies.get("access_token");
      const response = await fetch(
        `${host}/api/manager/getmanagers/${listingId}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "auth-token": authToken,
          },
        }
      );
      if (response.ok) {
        const data = await response.json();
        console.log(data);
        setManagers(data);
      } else {
        const errorMessage = await response.text();
        console.error(errorMessage);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchManagers();
  }, []);

  const handleManager = async (e) => {
    e.preventDefault();
    try {
      const authToken = cookies.get("access_token");
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
        await fetchManagers();
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

  const handleManagerDelete = async (managerId) => {
    try {
      const authToken = cookies.get("access_token");
      const response = await fetch(`${host}/api/manager/removemanager`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          "auth-token": authToken,
        },
        body: JSON.stringify({
          lotid: listingId,
          managerid: managerId,
        }),
      });
      if (response.ok) {
        const updatedManagers = managers.filter(
          (manager) => manager._id !== managerId
        );
        setManagers(updatedManagers);
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
    <div className="p-3 max-w-screen min-h-screen mx-auto">
      {managers.length > 0 ? (
        <div className="flex flex-col gap-4">
          <h1 className="text-center mt-7 text-2xl font-semibold">
            Your Managers
          </h1>
          {managers.map((manager) => (
            <div
              key={manager._id}
              className="border rounded-lg p-3 flex justify-between items-center gap-4"
            >
              <div className="flex flex-col">
                <p>{manager.name}</p>
              </div>

              <div className="flex flex-col item-center">
                <button
                  onClick={() => handleManagerDelete(manager._id)}
                  className="text-red-700 uppercase"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center mt-3">
          <p className="text-xl text-blue-700 font-semibold">No Managers</p>
        </div>
      )}

      <div className="mt-10 flex flex-col">
        <div className="text-center mt-3">
          <p className="text-xl text-blue-700 font-semibold">Add new manager</p>
        </div>

        <input
          onChange={(e) => setEmail(e.target.value)}
          type="text"
          placeholder="emailID of manager"
          className="border p-3 rounded-lg m-3"
          id="location"
        />

        <button
          onClick={handleManager}
          className="p-3 bg-slate-700 text-white rounded-lg uppercase hover:opacity-95 disabled:opacity-80 mt-2"
        >
          ADD THIS MANAGER
        </button>
      </div>
    </div>
  );
}
