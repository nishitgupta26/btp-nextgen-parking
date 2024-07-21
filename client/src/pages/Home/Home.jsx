import React, { useEffect, useState } from "react";
import LocationAccess from "../../components/LocationAccess";
import Cookies from "universal-cookie";
import ParkingCard from "../../components/ParkingCard";
import Header from "../../components/Header";
import { useDispatch, useSelector } from "react-redux";
import { updateCoordinates } from "../../redux/User/userSlice";

export default function Home({ isOverlay, setOverlay }) {
  const dispatch = useDispatch();

  const cookies = new Cookies();
  const host = "https://next-gen-parking-backend.vercel.app/";
  const authtoken = cookies.get("access_token");

  const { latitude, longitude } = useSelector((state) => state.user);

  const [parkingSlots, setParkingSlots] = useState([]);

  const checkLocationPermission = async () => {
    const permissionStatus = await navigator.permissions.query({
      name: "geolocation",
    });

    return permissionStatus.state;
  };

  useEffect(() => {
    const intervalId = setInterval(() => {
      const checkAndClearCookies = async () => {
        const permissionState = await checkLocationPermission();
        if (permissionState === "denied") {
          dispatch(updateCoordinates({ latitude: null, longitude: null }));
        }
      };
      checkAndClearCookies();

      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          dispatch(updateCoordinates({ latitude, longitude }));
        },
        (error) => {
          console.error(error.message);
        }
      );
    }, 1000);

    return () => clearInterval(intervalId);
  }, []);

  useEffect(() => {
    if (!latitude && !longitude) {
      setOverlay(false);
      document.body.style.overflow = "hidden";
    } else {
      setOverlay(true);
      document.body.style.overflow = "auto";
    }

    return () => {
      document.body.style.overflow = "auto";
    };
  }, [latitude, longitude]);

  useEffect(() => {
    fetchParkingSlots();
    const intervalId = setInterval(fetchParkingSlots, 1000);

    return () => clearInterval(intervalId);
  }, []);

  const fetchParkingSlots = async () => {
    const combined = longitude + "_" + latitude;
    console.log(combined);
    const res = await fetch(`${host}/api/lots/getnearby/${combined}`, {
      method: "GET",
      headers: {
        "auth-token": authtoken,
      },
    });
    if (res.ok) {
      const data = await res.json();
      setParkingSlots(data);
    } else {
      console.log("Error");
    }
  };

  return (
    <div className="relative min-h-screen">
      <Header />
      <div
        className={`absolute h-screen flex justify-center items-center inset-0 bg-gray-800 bg-opacity-50 backdrop-filter backdrop-blur-lg ${
          !latitude && !longitude ? "z-40" : "hidden"
        }`}
      >
        <div className="z-50">
          <LocationAccess />
        </div>
      </div>
      <div className="mt-14 ml-4 mr-4 grid lg:grid-cols-4 md:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-10">
        {parkingSlots.map((lot) => (
          <ParkingCard key={lot.id} lot={lot} />
        ))}
      </div>
    </div>
  );
}
