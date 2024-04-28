import React from "react";
import BgImg from "../img/parkingSlotCardBg.png";
import plugIcon from "../img/plug-icon.png";
import { useNavigate } from "react-router-dom";
import locIcon from "../img/location-icon.png";
export default function ParkingCard({ lot }) {
  const clienthost = "http://localhost:5173";
  const navigate = useNavigate();
  return (
    <>
      {/* <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 w-full "> */}
      <div className="relative mx-auto w-full ">
        <a
          href={`${clienthost}/book-parking/${lot._id}`}
          className="relative inline-block duration-300 ease-in-out transition-transform transform hover:-translate-y-2 w-full"
        >
          <div className="border border-slate-400 rounded-lg bg-white overflow-hidden">
            <div className="flex justify-center relative rounded-none overflow-hidden h-52">
              <div className="transition-transform duration-500 transform ease-in-out hover:scale-110 w-full">
                <div className="absolute inset-0 bg-black ">
                  <img
                    src={BgImg}
                    alt="Parking Space"
                    className="w-full h-full object-cover rounded-none"
                  />
                </div>
              </div>
              {/* <span className="absolute top-0 left-0 inline-flex mt-3 ml-3 px-3 py-2 rounded-lg z-10 bg-red-500 text-sm font-medium text-white select-none">
                  Featured
                </span> */}
              {lot.chargingPorts !== 0 && (
                <div className="absolute top-0 left-0 inline-flex mt-3 ml-3 px-2 py-1 rounded-lg z-10 bg-white text-sm font-semibold border-2 border-green-600 text-green-600 select-none">
                  <div className="flex flex-row items-center justify-center gap-1">
                    <span className="">EV</span>
                    <img className="items-center w-4 h-4" src={plugIcon} />
                  </div>
                </div>
              )}
            </div>
            <div className="m-3">
              <div className="mt-4 flex flex-col justify-between items-left">
                {/* <h2 className="font-medium text-base md:text-lg text-gray-800 mr-16"> */}
                {/* {lot.name} */}
                {/* Raja Ram Parkings Ayodhya
                </h2>
                <p className="text-sm text-gray-800">
                  {lot.location}
                </p> */}

                <h2 className="font-medium text-base md:text-lg text-gray-800 ">
                  {lot.name}
                </h2>
                <div className="flex flex-row items-center mt-3">
                  <img
                    src={locIcon}
                    alt="Location Icon"
                    className="w-6 h-6 mr-4"
                  />

                  <p className="text-sm text-gray-800">{lot.location}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 grid-rows-2 gap-4 mt-4">
                <p className="inline-flex flex-col text-gray-800">
                  <span className=" text-sm font-medium mt-2 xl:mt-0">
                    Type of Parking
                  </span>
                  <span className="text-sm text-slate-600 mt-2 xl:mt-0">
                    {lot.type}
                  </span>
                </p>
                {/* <p className="inline-flex flex-col text-gray-800">
                  <span className=" text-base font-semibold mt-2 xl:mt-0">
                    Security Guard
                  </span>
                  <span className="mt-2 xl:mt-0">{lot.chargingPorts!==0 ?  "Yes" : "No"}</span>
                </p> */}
                <p className="inline-flex flex-col text-gray-800">
                  <span className=" text-sm font-medium  mt-2 xl:mt-0">
                    Operating Hours
                  </span>
                  <span className="text-sm text-slate-600 mt-2 xl:mt-0">
                    {lot.openingHours} to {lot.closingHours}
                  </span>
                </p>
                <p className="inline-flex flex-col text-gray-800">
                  <span className=" text-sm font-medium  mt-2 xl:mt-0">
                    Camera Surveillance
                  </span>
                  <span className="text-sm text-slate-600 mt-2 xl:mt-0">
                    {lot.surveillanceCamera ? "Yes" : "No"}
                  </span>
                </p>
              </div>

              <div className="grid grid-cols-2 mt-8 items-center">
                <div className="flex items-center ">
                  <button
                    onClick={() => navigate(`/book-parking/${lot._id}`)}
                    type="button"
                    className=" text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center me-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 18 21"
                      fill="none"
                      stroke="#ffffff"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      aria-hidden="true"
                      className="icon icon-tabler icons-tabler-outline icon-tabler-car-garage w-3.5 h-3.5 me-2"
                    >
                      <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                      <path d="M5 20a2 2 0 1 0 4 0a2 2 0 0 0 -4 0" />
                      <path d="M15 20a2 2 0 1 0 4 0a2 2 0 0 0 -4 0" />
                      <path d="M5 20h-2v-6l2 -5h9l4 5h1a2 2 0 0 1 2 2v4h-2m-4 0h-6m-6 -6h15m-6 0v-5" />
                      <path d="M3 6l9 -4l9 4" />
                    </svg>
                    Book now
                  </button>
                </div>

                <div className="flex justify-end">
                  <p className="inline-block font-semibold text-primary whitespace-nowrap leading-tight rounded-xl">
                    <span className="text-lg uppercase text-semibold">₹ </span>
                    <span className="text-lg">{lot.parkingRate}</span>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </a>
      </div>
      {/* </div> */}
    </>
  );
}
