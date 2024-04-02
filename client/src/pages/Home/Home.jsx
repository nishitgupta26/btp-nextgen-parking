import React, { useEffect, useState } from "react";
import LocationAccess from "../../components/LocationAccess";
import Header from "../../components/Header";
import Cookies from "universal-cookie";
import ParkingCard from "../../components/ParkingCard";
import { useLayoutEffect } from "react";

export default function Home({ isOverlay, setOverlay }) {
  const cookies = new Cookies();

  const [latitude, setLatitude] = useState(cookies.get("latitude") || null);
  const [longitude, setLongitude] = useState(cookies.get("longitude") || null);

  const checkLocationPermission = async () => {
    const permissionStatus = await navigator.permissions.query({
      name: "geolocation",
    });

    return permissionStatus.state;
  };

  const func = (c, b) => {
    setLatitude(c);
    setLongitude(b);
    cookies.set("latitude", c);
    cookies.set("longitude", b);
  };

  useEffect(() => {
    const checkAndClearCookies = async () => {
      const permissionState = await checkLocationPermission();
      if (permissionState === "denied") {
        // Clear cookies
        cookies.remove("latitude");
        cookies.remove("longitude");
        setLatitude(null);
        setLongitude(null);
      }
    };
    checkAndClearCookies();
  }, []);

  useEffect(() => {
    // Disable scrolling when overlay is rendered
    if (!latitude && !longitude) {
      setOverlay(false);
      document.body.style.overflow = "hidden";
    } 
    else {
      setOverlay(true);
      document.body.style.overflow = "auto";
    }

    return () => {
      // Re-enable scrolling when component unmounts
      document.body.style.overflow = "auto";
    };
  }, [latitude, longitude]);
  // code to fetch parkingslots data from backend
  //   const [parkingSlots, setparkingSlots] = useState([]);

  // // useEffect to fetch all parking lots
  // useEffect(() =>{
  //   fetch(`${import.meta.env.MONGO_URI}/api/lots/getlots`)
  //   .then(res => res.json())
  //   .then(data => setparkingSlots(data))
  // }, []);

  // Dummy data for parking slots
  const parkingSlots = [
    {
      id: 1,
      parkingSpaceName: "space 1",
      location: "Location 1",
      type: "Covered",
      chargingPorts: 8,
      openingHours: "8:00",
      closingHours: "20:00",
      surveillanceCamera: "Yes",
      parkingRate: 30,
    },
    {
      id: 2,
      parkingSpaceName: "space 2",
      location: "Location 2",
      type: "Mixed",
      chargingPorts: 0,
      openingHours: "9:00",
      closingHours: "2:00",
      surveillanceCamera: "No",
      parkingRate: 40,
    },
    {
      id: 3,
      parkingSpaceName: "space 3",
      location: "Location 3",
      type: "open",
      chargingPorts: 8,
      openingHours: "8:00",
      closingHours: "20:00",
      surveillanceCamera: "Yes",
      parkingRate: 60,
    },
    {
      id: 4,
      parkingSpaceName: "space 4",
      location: "Location 4",
      type: "Mixed",
      chargingPorts: 4,
      openingHours: "9:00",
      closingHours: "2:00",
      surveillanceCamera: "No",
      parkingRate: 35,
    },
    {
      id: 5,
      parkingSpaceName: "space 5",
      location: "Location 5",
      type: "Covered",
      chargingPorts: 8,
      openingHours: "8:00",
      closingHours: "20:00",
      surveillanceCamera: "Yes",
      parkingRate: 15,
    },
    {
      id: 6,
      parkingSpaceName: "space 6",
      location: "Location 6",
      type: "open",
      chargingPorts: 0,
      openingHours: "9:00",
      closingHours: "2:00",
      surveillanceCamera: "No",
      parkingRate: 25,
    },
    {
      id: 7,
      parkingSpaceName: "space 7",
      location: "Location 7",
      type: "open",
      chargingPorts: 8,
      openingHours: "8:00",
      closingHours: "20:00",
      surveillanceCamera: "Yes",
      parkingRate: 45,
    },
    {
      id: 8,
      parkingSpaceName: "space 8",
      location: "Location 8",
      type: "Mixed",
      chargingPorts: 0,
      openingHours: "9:00",
      closingHours: "2:00",
      surveillanceCamera: "No",
      parkingRate: 20,
    },
  ];

  return (
    <div className="relative min-h-screen">
      {/* <Header /> */}
      <div
        className={`absolute inset-0 bg-gray-800 bg-opacity-50 backdrop-filter backdrop-blur-lg ${
          !latitude && !longitude ? "z-10" : "hidden"
        }`}
      ></div>
      {!latitude && !longitude && (
        <div className="relative left-64  h-2/5 w-3/5 z-20">
          <div className="">
            <LocationAccess a={func} />
          </div>
        </div>
      )}
      <div className="mt-14 ml-4 mr-4 grid lg:grid-cols-4 md:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-10">
        {/* <h1 className="text-4xl text-center mt-8">Welcome to SmartPark</h1> */}
        {parkingSlots.map((lot) => (
          <ParkingCard key={lot.id} lot={lot} />
        ))}
      </div>
    </div>
  );
}
