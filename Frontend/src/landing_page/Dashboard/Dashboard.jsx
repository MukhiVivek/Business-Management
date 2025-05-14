import React from "react";
import './Dashboard.css'
import BarsDataset from "./BarChart/BarChart";
import LatestTransaction from "./LatestTransaction";

function Dashboard() {
    return ( 
        <>
        <div className="flex">
            {/* Sidebar is fixed, so add margin-left to the dashboard */}
            <div className="dashboard rounded-2xl min-h-screen w-full">
                

                {/* To collect & To pay */}
                <div className="section-1 flex justify-evenly py-6">
                    <h1 className="flex text-5xl">Dashboard</h1>
                    {/* To collect */}
                    <div className="to-collect flex bg-gray-100 text-black px-6 py-5 rounded-lg shadow-md">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="size-6">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M4.5 10.5 12 3m0 0 7.5 7.5M12 3v18" />
                        </svg>
                        <div className="flex justify-evenly">
                            <h1 className="text-xl text-left mx-10">To Collect</h1>
                            <p className="text-2xl">₹12003</p>
                        </div>
                    </div>

                    {/* To pay */}
                    <div className="to-pay flex bg-gray-100 text-black px-6 py-5 rounded-lg shadow-md">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 13.5 12 21m0 0-7.5-7.5M12 21V3" />
                        </svg>
                        <div className="flex justify-evenly">
                            <h1 className="text-xl text-left mx-10">To Pay</h1>
                            <p className="text-2xl">₹2100</p>
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