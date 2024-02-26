import React, { useEffect, useState } from 'react';

export default function Home() {
  const [latitude, setLatitude] = useState(null);
  const [longitude, setLongitude] = useState(null);
  const [geolocationError, setGeolocationError] = useState(null);

  const getGeolocation = () => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        position => {
          setLatitude(position.coords.latitude);
          setLongitude(position.coords.longitude);
          localStorage.setItem('latitude', position.coords.latitude);
          localStorage.setItem('longitude', position.coords.longitude);
          console.log("Latitude:", position.coords.latitude);
          console.log("Longitude:", position.coords.longitude);
        },
        error => {
          setGeolocationError(error.message);
          console.error("Error getting geolocation:", error);
        }
      );
    } else {
      setGeolocationError("Geolocation is not supported by this browser.");
      console.error("Geolocation is not supported by this browser.");
    }
  };

  useEffect(() => {
    const isGeolocationStored = () => {
      return localStorage.getItem('latitude') && localStorage.getItem('longitude');
    };

    // Check if geolocation is stored or request geolocation access
    if (!isGeolocationStored()) {
      getGeolocation();
    } else {
      setLatitude(localStorage.getItem('latitude'));
      setLongitude(localStorage.getItem('longitude'));
    }

    // Add event listener to monitor page changes and reloads
    window.addEventListener('DOMContentLoaded', getGeolocation);
    window.addEventListener('beforeunload', getGeolocation);

    return () => {
      window.removeEventListener('DOMContentLoaded', getGeolocation);
      window.removeEventListener('beforeunload', getGeolocation);
    };
  }, []);

  return (
    <div>
      {latitude && longitude ? (
        <div>
          <p>Latitude: {latitude}</p>
          <p>Longitude: {longitude}</p>
        </div>
      ) : (
        <p>{geolocationError || "Fetching geolocation..."}</p>
      )}
    </div>
  );
}
