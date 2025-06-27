import "../../App.css";
import OrdersList from "./OrdersList";
import { useNavigate } from "react-router-dom";

const Orders = () => {

  const navigate = useNavigate();

  return (
    <div className="pl-18 pt-2 pr-9 min-h-screen customers block rounded-lg w-full">
      {/* Header */}
      <div className="flex justify-between items-start mb-2 mt-1">
        <div className="flex gap-3">
          <input
            type="text"
            placeholder="🔍 Search"
            className="pl-3 border-2 border-gray-400 bg-gray-100 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <h1 className="text-md mt-1">Total Count: 0</h1>
        </div>
        <div>
          <h1 className="text-xl font-semibold text-gray-700">Orders</h1>
        </div>
      </div>
      <div className="min-h-screen font-sans text-sm">
        {/* Order List Table */}
        <div className="flex justify-between items-center">
          <h1 className="text-xl font-semibold">Orders List</h1>
          <div className="flex items-center gap-2">
            <button
              className="hover:bg-blue-700 bg-blue-600 hover:shadow-5xl px-2 text-white mb-2 shadow-md cursor-pointer"
              onClick={() => navigate("/orders/add")}
            >
              <h1 className="text-[17px] py-1">✚ New</h1>
            </button>
          </div>
        </div>
        <OrdersList />
      </div>
    </div>
  );
};

export default Orders;
