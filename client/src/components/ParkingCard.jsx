import React from "react";
import BgImg from "../img/parkingSlotCardBg.png";
export default function ParkingCard() {
  return (
    <div>
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 w-full ">
        <div class="relative mx-auto w-full ">
          <a
            href="#"
            class="relative inline-block duration-300 ease-in-out transition-transform transform hover:-translate-y-2 w-full"
          >
            <div class="shadow-[0_3px_10px_rgb(0,0,0,0.2)] p-4 rounded-lg bg-white">
              <div class="flex justify-center relative rounded-lg overflow-hidden h-52">
                <div class="transition-transform duration-500 transform ease-in-out hover:scale-110 w-full">
                  <div class="absolute inset-0 bg-black ">
                    <img
                      src={BgImg}
                      alt="Parking Space"
                      class="w-full h-full object-cover"
                    />
                  </div>
                </div>
                <span class="absolute top-0 left-0 inline-flex mt-3 ml-3 px-3 py-2 rounded-lg z-10 bg-red-500 text-sm font-medium text-white select-none">
                  Featured
                </span>
              </div>

              <div class="mt-4">
                <h2
                  class="font-medium text-base md:text-lg text-gray-800 line-clamp-1"
                  title="New York"
                >
                  [Parking Space Name]
                </h2>
                <p
                  class="mt-2 text-sm text-gray-800 line-clamp-1"
                  title="New York, NY 10004, United States"
                >
                  [Parking Space Address]
                </p>
              </div>

              <div class="grid grid-cols-2 grid-rows-2 gap-4 mt-8">
                <p class="inline-flex flex-col text-gray-800">
                  <span class=" text-base font-semibold mt-2 xl:mt-0">
                    Covered/Open Parking
                  </span>
                  <span class="mt-2 xl:mt-0">Covered</span>
                </p>
                <p class="inline-flex flex-col text-gray-800">
                  <span class=" text-base font-semibold mt-2 xl:mt-0">
                    EV charging
                  </span>
                  <span class="mt-2 xl:mt-0">Yes</span>
                </p>
                <p class="inline-flex flex-col text-gray-800">
                  <span class=" text-base font-semibold mt-2 xl:mt-0">
                    Operating Hours
                  </span>
                  <span class="mt-2 xl:mt-0">[00:00] to [00:00]</span>
                </p>
                <p class="inline-flex flex-col text-gray-800">
                  <span class=" text-base font-semibold mt-2 xl:mt-0">
                    Camera Surveillance
                  </span>
                  <span class="mt-2 xl:mt-0">Yes/No</span>
                </p>
              </div>

              <div class="grid grid-cols-2 mt-8">
                <div class="flex items-center ">
                  <button
                    type="button"
                    class="shadow-[rgba(13,_38,_76,_0.19)_0px_9px_20px] text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center me-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                  >
                    <svg  xmlns="http://www.w3.org/2000/svg"  width="24"  height="24"  viewBox="0 0 18 21"  fill="none"  stroke="#ffffff"  stroke-width="2"  stroke-linecap="round"  stroke-linejoin="round" 
                      aria-hidden="true"  class="icon icon-tabler icons-tabler-outline icon-tabler-car-garage w-3.5 h-3.5 me-2">
                      <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
                      <path d="M5 20a2 2 0 1 0 4 0a2 2 0 0 0 -4 0" />
                      <path d="M15 20a2 2 0 1 0 4 0a2 2 0 0 0 -4 0" />
                      <path d="M5 20h-2v-6l2 -5h9l4 5h1a2 2 0 0 1 2 2v4h-2m-4 0h-6m-6 -6h15m-6 0v-5" />
                      <path d="M3 6l9 -4l9 4" />
                    </svg>
                    Book now
                  </button>
                </div>

                <div class="flex justify-end">
                  <p class="inline-block font-semibold text-primary whitespace-nowrap leading-tight rounded-xl">
                    <span class="text-lg uppercase text-semibold">₹ </span>
                    <span class="text-lg">3,200</span>
                  </p>
                </div>
              </div>
            </div>
          </a>
        </div>

        {/* ///////////auto */}
      </div>
    </div>
  );
}


