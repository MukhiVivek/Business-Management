import React, { useState, useMemo } from "react";
import "../../App.css";
import { useInvoice } from "../../hooks/useInvoice";
import OrdersList from "./OrdersList";

const Orders = () => {
  const { data: invoiceData, refetch } = useInvoice();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("today"); // "today", "all"
  const [currentPage, setCurrentPage] = useState(1);
  const [sortOrder, setSortOrder] = useState("none"); // "none", "asc", "desc"
  const itemsPerPage = 25;

  const today = new Date().setHours(0, 0, 0, 0);

  const filteredOrders = useMemo(() => {
    if (!Array.isArray(invoiceData)) return [];
    return invoiceData.filter((order) => {
      const orderDate = new Date(order.createdAt).setHours(0, 0, 0, 0);

      // Date filter
      if (filterType === "today" && orderDate !== today) return false;

      // Search filter
      if (searchTerm) {
        const searchLower = searchTerm.toLowerCase();
        return (
          String(order.invoice_number || "").toLowerCase().includes(searchLower) ||
          String(order.customer_id?.name || "").toLowerCase().includes(searchLower) ||
          String(order.Subtotal || "").includes(searchLower)
        );
      }

      return true;
    }).sort((a, b) => {
      if (sortOrder === "asc") return (a.Subtotal || 0) - (b.Subtotal || 0);
      if (sortOrder === "desc") return (b.Subtotal || 0) - (a.Subtotal || 0);
      return 0;
    });
  }, [invoiceData, filterType, searchTerm, today, sortOrder]);

  // Calculate pagination
  const totalPages = Math.ceil(filteredOrders.length / itemsPerPage);
  const currentOrders = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredOrders.slice(start, start + itemsPerPage);
  }, [filteredOrders, currentPage]);

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const handleFilterChange = (type) => {
    setFilterType(type);
    setCurrentPage(1);
  };

  return (
    <div className="font ml-14 p-6 min-h-screen bg-gray-50 flex flex-col flex-1">
      {/* Header */}
      <div className="w-full mb-8">
        <div className="flex justify-between items-end">
          <div>
            <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Orders</h1>
            <p className="text-gray-500 mt-2 font-medium">
              Showing <span className="text-blue-600 font-bold">{filterType === 'today' ? "Today's" : "All"}</span> orders
            </p>
          </div>
        </div>
      </div>

      {/* Control Bar */}
      <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 mb-6 flex flex-wrap gap-4 items-center justify-between">
        <div className="flex gap-4 items-center flex-1 min-w-[300px]">
          <div className="flex bg-gray-100 p-1 rounded-xl">
            <button
              onClick={() => handleFilterChange("today")}
              className={`px-6 py-2 text-sm font-bold rounded-lg transition-all ${filterType === "today" ? "bg-white text-blue-600 shadow-sm" : "text-gray-500 hover:text-gray-700"
                }`}
            >
              Today
            </button>
            <button
              onClick={() => handleFilterChange("all")}
              className={`px-6 py-2 text-sm font-bold rounded-lg transition-all ${filterType === "all" ? "bg-white text-blue-600 shadow-sm" : "text-gray-500 hover:text-gray-700"
                }`}
            >
              All Time
            </button>
          </div>

          <div className="relative flex-1">
            <input
              type="text"
              placeholder="Search by order #, customer name or price..."
              value={searchTerm}
              onChange={handleSearch}
              className="w-full pl-11 pr-4 py-2.5 bg-gray-50 border border-transparent rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all font-medium"
            />
            <svg className="w-5 h-5 text-gray-400 absolute left-4 top-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>

          <div className="flex bg-gray-100 p-1 rounded-xl">
            <select
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value)}
              className="bg-transparent text-sm font-bold text-gray-500 px-3 py-2 outline-none cursor-pointer"
            >
              <option value="none">Price: Default</option>
              <option value="asc">Price: Low to High</option>
              <option value="desc">Price: High to Low</option>
            </select>
          </div>
        </div>
      </div>

      {/* Table Container */}
      <div className="flex-1 bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden flex flex-col">
        <div className="px-8 py-6 border-b border-gray-50 flex justify-between items-center">
          <h2 className="text-xl font-bold text-gray-800">Order Management</h2>
          <span className="bg-blue-50 text-blue-700 px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-tighter">
            {filteredOrders.length} orders
          </span>
        </div>

        <div className="flex-1 overflow-auto">
          {filteredOrders.length === 0 ? (
            <div className="p-20 text-center flex flex-col items-center">
              <div className="bg-gray-50 p-6 rounded-full mb-4">
                <svg className="w-12 h-12 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-gray-800">No orders found</h3>
              <p className="text-gray-500 mt-1 max-w-sm">Try changing your filters or checking a different date.</p>
            </div>
          ) : (
            <OrdersList data={currentOrders} refetch={refetch} />
          )}
        </div>

        {/* Modern Pagination */}
        {totalPages > 1 && (
          <div className="px-8 py-4 bg-gray-50 border-t border-gray-100 flex justify-between items-center">
            <span className="text-xs font-bold text-gray-500">
              Page {currentPage} of {totalPages}
            </span>
            <div className="flex gap-2">
              <button
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className={`px-4 py-2 text-xs font-bold rounded-lg transition-all ${currentPage === 1 ? "text-gray-300 cursor-not-allowed" : "bg-white text-blue-600 shadow-sm hover:bg-gray-50"
                  }`}
              >
                Previous
              </button>
              <button
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className={`px-4 py-2 text-xs font-bold rounded-lg transition-all ${currentPage === totalPages ? "text-gray-300 cursor-not-allowed" : "bg-white text-blue-600 shadow-sm hover:bg-gray-50"
                  }`}
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Orders;

