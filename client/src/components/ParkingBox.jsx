import React from 'react'

export default function ParkingBox({index,booked}) {
  return (
  <div className='flex'>
    <div className={`flex justify-center items-center w-10 h-10 rounded-lg border-2 border-slate-400 text-white ${index>=booked ? "bg-green-500" :"bg-red-500"}`}>
        {index+1}
    </div>
  </div>
  )
}
