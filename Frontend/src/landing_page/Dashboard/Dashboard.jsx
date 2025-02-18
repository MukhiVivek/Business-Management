import React from "react";
import './Dashboard.css'
import BarsDataset from "./BarChart/BarChart";
import LatestTransaction from "./LatestTransaction";

function Dashboard() {
    return ( 
        <>
        <div className="flex">
            {/* Sidebar is fixed, so add margin-left to the dashboard */}
            <div className="dashboard p-3 m-3 rounded-2xl ml-64 md:ml-64 min-h-screen w-full">

                {/* Dashboard and Chat Support */}
                <div className="top flex justify-between">
                    <h1 className="text-4xl rounded-lg">Dashboard</h1>

                    {/* Chat Support Button */}
                    <button className="bg-gray-100 shadow-md text-black p-2 rounded-lg flex gap-2">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M8.625 9.75a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H8.25m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H12m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0h-.375m-13.5 3.01c0 1.6 1.123 2.994 2.707 3.227 1.087.16 2.185.283 3.293.369V21l4.184-4.183a1.14 1.14 0 0 1 .778-.332 48.294 48.294 0 0 0 5.83-.498c1.585-.233 2.708-1.626 2.708-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0 0 12 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018Z" />
                        </svg>
                    Chat Support
                    </button>
                </div>

                {/* To collect & To pay */}
                <div className="section-1 flex justify-evenly py-6">
                    {/* To collect */}
                    <div className="to-collect flex bg-gray-100 text-black px-6 py-5 rounded-lg shadow-md">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="size-6">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M4.5 10.5 12 3m0 0 7.5 7.5M12 3v18" />
                        </svg>
                        <div className="flex justify-evenly">
                            <h1 className="text-xl text-left mx-10">To Collect</h1>
                            <p className="text-2xl">$123</p>
                        </div>
                    </div>

                    {/* To pay */}
                    <div className="to-pay flex bg-gray-100 text-black px-6 py-5 rounded-lg shadow-md">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 13.5 12 21m0 0-7.5-7.5M12 21V3" />
                        </svg>
                        <div className="flex justify-evenly">
                            <h1 className="text-xl text-left mx-10">To Pay</h1>
                            <p className="text-2xl">$200</p>
                        </div>
                    </div>
                </div>

                {/* Latest Transaction & BarChart */}
                <div className="section-2 flex justify-evenly">
                    <div className="latest-transaction py-2 w-1/2">
                        <LatestTransaction/>
                    </div>

                    <div className="bars-dataset flex justify-center w-1/3">
                        <BarsDataset/>
                    </div>
                </div>

            </div>
        </div>
        </>
     );
}

export default Dashboard ;