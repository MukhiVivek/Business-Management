import React from "react";
import "./Dashboard.css";
import BarsDataset from "./BarChart/BarChart";
import LatestTransaction from "./LatestTransaction";

function Dashboard() {
  return (
    <div className="flex">

      {/* Main Content  */}
      <div className="dashboard rounded-2xl min-h-screen w-full ml-11 p-5">

        {/* Header */}
        <div className="flex justify-between items-start mb-8">
          <div>
            <h2 className="text-md text-gray-500">Welcome Back!</h2>
            <h1 className="text-xl font-bold text-gray-800">Dhyan</h1>
          </div>
          <div>
            <h1 className="text-lg font-semibold text-gray-700">Dashboard</h1>
          </div>
        </div>

        {/* Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
            
          {/* To Collect */}
          <div className="bg-green-100 border border-green-300 rounded-xl p-6 shadow-sm flex justify-between items-center">
            <div>
              <h2 className="text-gray-600 text-lg font-medium">To Collect</h2>
            </div>
            <div className="text-2xl font-semibold text-green-700">₹10,789</div>
          </div>

          {/* To Pay */}
          <div className="bg-red-100 border border-red-300 rounded-xl p-6 shadow-sm flex justify-between items-center">
            <div>
              <h2 className="text-gray-600 text-lg font-medium">To Pay</h2>
            </div>
            <div className="text-2xl font-semibold text-red-700">₹14,156</div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-8">
          <LatestTransaction />
          <BarsDataset />
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
