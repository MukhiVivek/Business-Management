import React, { useState } from "react";
import Top from "./Component/Top.tsx";
import CustomersList from "./Component/CustomersList";
import "../../App.css";
import { useCustomer } from "../../hooks/useCustomer";

const Customers = () => {
  const { data: customerdata } = useCustomer();
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 25;

  // Calculate pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentCustomers = customerdata ? customerdata.slice(indexOfFirstItem, indexOfLastItem) : [];
  const totalPages = customerdata ? Math.ceil(customerdata.length / itemsPerPage) : 0;

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

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
          <h1 className="text-md mt-1">Total Count: {customerdata ? customerdata.length : 0}</h1>
          <h1 className="text-md mt-1 font-medium text-gray-500 ml-2">
            (Showing {customerdata?.length > 0 ? indexOfFirstItem + 1 : 0}-{Math.min(indexOfLastItem, customerdata?.length || 0)} of {customerdata?.length || 0})
          </h1>
        </div>
        <div>
          <h1 className="text-xl font-semibold text-gray-700">Customers</h1>
        </div>
      </div>
      <div className="min-h-screen font-sans text-sm">
        <Top />
        {/* Error Fallback */}
        {!customerdata || customerdata.length === 0 ? (
          <p>No customers found.</p>
        ) : (
          <>
            <CustomersList customerdata={currentCustomers} />
            {/* Pagination Controls */}
            <div className="flex justify-center items-center gap-4 mt-6 mb-8">
              <button
                onClick={() => paginate(currentPage - 1)}
                disabled={currentPage === 1}
                className={`px-4 py-2 border rounded ${currentPage === 1 ? "bg-gray-200 text-gray-400 cursor-not-allowed" : "bg-white text-blue-500 hover:bg-blue-50 border-blue-500"
                  }`}
              >
                Previous
              </button>
              <span className="text-gray-700">
                Page {currentPage} of {totalPages}
              </span>
              <button
                onClick={() => paginate(currentPage + 1)}
                disabled={currentPage === totalPages || totalPages === 0}
                className={`px-4 py-2 border rounded ${currentPage === totalPages || totalPages === 0 ? "bg-gray-200 text-gray-400 cursor-not-allowed" : "bg-white text-blue-500 hover:bg-blue-50 border-blue-500"
                  }`}
              >
                Next
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Customers;
