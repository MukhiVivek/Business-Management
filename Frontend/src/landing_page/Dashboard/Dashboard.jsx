import React from "react";
import './Dashboard.css'
import BarsDataset from "./BarChart/BarChart";

function Dashboard() {
    return ( 
        <>
        <div className="dashboard p-3 m-3 rounded-2xl">
            <h1 className="text-4xl">Dashboard</h1>
            <div className="bars-dataset flex justify-center w-full h-full">
                <BarsDataset/>
            </div>
        </div>
        </>
     );
}

export default Dashboard ;