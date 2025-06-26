import { useNavigate } from "react-router-dom";
import React from "react";

const Top = () => {

    const navigate = useNavigate();

    return (
        <div className="flex justify-between items-center">
            <h1 className="text-xl font-semibold">Customers List</h1>
            <div className="flex items-center gap-2">
                <button
                    className="hover:bg-blue-700 bg-blue-600 hover:shadow-5xl px-2 text-white mb-2 shadow-md cursor-pointer"
                    onClick={() => navigate("/customers/add")}
                >
                    <h1 className="text-[17px] py-1">✚ New</h1>
                </button>
            </div>
        </div>
    );
};

export default Top;
