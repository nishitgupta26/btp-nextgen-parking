import React, { useEffect, useState } from "react";
import LocationAccess from "../components/LocationAccess";
import Header from "../components/Header";
import Cookies from 'universal-cookie';

export default function Home() {
  const cookies = new Cookies();

  const [latitude, setLatitude] = useState(cookies.get('latitude') || null);
  const [longitude, setLongitude] = useState(cookies.get('longitude') || null);

  const checkLocationPermission = async () => {
    const permissionStatus = await navigator.permissions.query({ name: 'geolocation' });
    return permissionStatus.state;
  }

  const func = (c, b) => {
    setLatitude(c);
    setLongitude(b);
    cookies.set('latitude', c);
    cookies.set('longitude', b);
  };

  useEffect(() => {
    const checkAndClearCookies = async () => {
      const permissionState = await checkLocationPermission();
      if (permissionState === 'denied') {
        // Clear cookies
        cookies.remove('latitude');
        cookies.remove('longitude');
        setLatitude(null);
        setLongitude(null);
      }
    };
    checkAndClearCookies();
  }, []);

  return (
    <div className="relative h-screen overflow-hidden">
      <Header />
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
      <div className="h-screen flex justify-center items-center">
        <h1 className="text-4xl text-center mt-8">Welcome to SmartPark</h1>
      </div>
    </div>
  );
}
