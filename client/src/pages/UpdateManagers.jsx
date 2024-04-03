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
      <div className="mt-10 flex flex-col">
        <div className="text-center mt-3">
          <h1 className="text-3xl font-semibold text-center mb-4">
            Add new manager
          </h1>
        </div>
        <div className="p-7 lg:px-40 flex flex-col gap-4 md:flex-row md:gap-8">
          <input
            onChange={(e) => setEmail(e.target.value)}
            type="text"
            placeholder="Enter E-Mail of manager"
            className="border border-slate-700 p-3 rounded-lg w-full md:w-3/4"
            id="location"
          />

          <button
            onClick={handleManager}
            className="p-3 bg-slate-700 text-white w-full md:w-1/4 rounded-lg uppercase hover:opacity-95 disabled:opacity-80"
          >
            ADD MANAGER
          </button>
        </div>
      </div>
      <div className="flex justify-center">
        {managers.length > 0 ? (
          <div className="flex flex-col w-full gap-4 px-8 lg:px-20">
            <h2 className="text-center mt-7 text-2xl font-semibold">
              Your Managers
            </h2>
            <div className="grid lg:grid-cols-4 md:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-10">
              {managers.map((manager) => (
                <div
                  key={manager._id}
                  className="border rounded-lg p-3 flex justify-between items-center gap-4"
                >
                  <div className="flex flex-col">
                    <p>{manager.name}</p>
                    {/* Need to be added bcz email is only unique attribute */}
                    {/* <p>{manager.email}</p> */}
                  </div>

                  <div className="flex flex-col item-center">
                    <button
                      onClick={() => handleManagerDelete(manager._id)}
                      className="bg-red-600 text-white p-1 px-2 w-full  mx-2 rounded-lg uppercase text-center hover:opacity-95"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="text-center  mt-3">
            <p className="text-xl text-blue-700 font-medium">
              No Manager Added
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
