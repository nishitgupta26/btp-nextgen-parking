import React, { useEffect, useState } from "react";
import LocationAccess from "../../components/LocationAccess";
import Cookies from "universal-cookie";
import ParkingCard from "../../components/ParkingCard";
import Header from "../../components/Header";

export default function Home({ isOverlay, setOverlay }) {
  const cookies = new Cookies();
  const host = "http://localhost:3001";
  const authtoken = cookies.get("access_token");
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
    const [parkingSlots, setparkingSlots] = useState([]);

  // // useEffect to fetch all parking lots
  useEffect(() => {
    const fetchParkingSlots = async () => {
      const res = await fetch(`${host}/api/lots/getlots`, {
        method: "GET",
        headers: {
          "auth-token": authtoken,
        },
      });
      if (res.ok) {
        const data = await res.json();
        setparkingSlots(data);
        console.log(data);
      } else {
        console.log("Error");
      }
    };
  
    fetchParkingSlots();
  }, []);
  


  return (
    <div className="relative min-h-screen">
      <Header />
      <div
        className={`absolute h-screen flex justify-center items-center inset-0 bg-gray-800 bg-opacity-50 backdrop-filter backdrop-blur-lg ${
          !latitude && !longitude ? "z-40" : "hidden"
        }`}
      ><div className="z-50">
        <LocationAccess a={func} />
    </div></div>
      {/* {!latitude && !longitude && (
        <div className="absolute left-64  h-2/5 w-3/5 z-20">
          <div className="">
            <LocationAccess a={func} />
          </div>
        </div>
      )} */}
      <div className="mt-14 ml-4 mr-4 grid lg:grid-cols-4 md:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-10">
        {/* <h1 className="text-4xl text-center mt-8">Welcome to SmartPark</h1> */}
        {parkingSlots.map((lot) => (
          <ParkingCard key={lot.id} lot={lot} />
        ))}
      </div>
    </div>
  );
}
