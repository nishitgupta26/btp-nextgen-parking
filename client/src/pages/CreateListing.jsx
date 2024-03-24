import {React, useState} from 'react';

export default function CreateListing() {
    const [parkingType, setParkingType] = useState("Closed");
    const [status, setStatus] = useState("Open");

  return (
    <main className='p-3 max-w-4xl mx-auto'>
      <h1 className='text-3xl font-semibold text-center my-7'>
        Create a Listing
      </h1>
      <form className='flex flex-col sm:flex-row gap-4'>
        <div className='flex flex-col gap-4 flex-1'>
          <input
            type='text'
            placeholder='Name'
            className='border p-3 rounded-lg'
            id='name'
            maxLength='62'
            minLength='5'
            required
          />
          <input
            type='text'
            placeholder='location'
            className='border p-3 rounded-lg'
            id='location'
            required
          />
          <div className='flex gap-6 flex-wrap'>
            <div className='flex gap-2'>
                Parking Type: 
            </div>

            <div className='flex gap-2'>
              <input type='radio' id='closed' className='w-5' onChange = {(e) => setParkingType("Closed")} checked = {parkingType === "Closed"}/>
              <span>Closed</span>
            </div>
            <div className='flex gap-2'>
              <input type='radio' id='mixed' className='w-5' onChange = {(e) => setParkingType("Mixed")} checked = {parkingType === "Mixed"}/>
              <span>Mixed</span>
            </div>
            <div className='flex gap-2'>
              <input type='radio' id='open' className='w-5' onChange = {(e) => setParkingType("Open")} checked = {parkingType === "Open"}/>
              <span>Open</span>
            </div>
          </div>
          <div className='flex flex-wrap gap-6'>
            <div className='flex items-center gap-2'>
              <input
                type='number'
                id='twoWheelerCapacity'
                min='0'
                max='1000'
                required
                className='p-3 border border-gray-300 rounded-lg'
              />
              <p>twoWheelerCapacity</p>
            </div>
            <div className='flex items-center gap-2'>
              <input
                type='number'
                id='fourWheelerCapacity'
                min='0'
                max='1000'
                required
                className='p-3 border border-gray-300 rounded-lg'
              />
              <p>fourWheelerCapacity</p>
              <input
                type='number'
                id='chargingPorts'
                min='0'
                max='1000'
                required
                className='p-3 border border-gray-300 rounded-lg'
              />
              <p>chargingPorts</p>
            </div>

            <div className='flex gap-6 flex-wrap'>
            <div className='flex gap-2'>
              <input type='checkbox' id='security' className='w-5' />
              <span>securityGuard</span>
            </div>
            <div className='flex gap-2'>
              <input type='checkbox' id='surveillance' className='w-5' />
              <span>surveillanceCamera</span>
            </div>
            </div>
          </div>
        </div>
        <div className="flex flex-col flex-1 gap-4">
            <div className='flex items-center gap-2'>
              <input
                type='number'
                id='parkingRate'
                defaultValue={30}
                required
                className='p-3 border border-gray-300 rounded-lg'
              />
              <div className='flex flex-col items-center'>
                <p>parking Rate</p>
                <span className='text-xs'>(per hour in Rs)</span>
              </div>
            </div>

            <input
                type='text'
                placeholder='Opening time(hh : mm)'
                className='border p-3 rounded-lg'
                id='openingTime'
                required
            />
            <input
                type='text'
                placeholder='Closing time(hh : mm)'
                className='border p-3 rounded-lg'
                id='closingTime'
                required
            />

        <div className='flex gap-6 flex-wrap'>
            <div className='flex gap-2'>
                Parking Status 
            </div>
            <div className='flex gap-2'>
              <input type='radio' id='Open' className='w-5' onChange = {(e) => setStatus("Open")} checked = {status === "Open"}/>
              <span>Open</span>
            </div>

            <div className='flex gap-2'>
              <input type='radio' id='Closed' className='w-5' onChange = {(e) => setStatus("Closed")} checked = {status === "Closed"}/>
              <span>Closed</span>
            </div>
            <button className='p-3 bg-slate-700 text-white rounded-lg uppercase hover:opacity-95 disabled:opacity-80'>Create Listing</button>
          </div>
       </div>
      </form>
    </main>
  );
}