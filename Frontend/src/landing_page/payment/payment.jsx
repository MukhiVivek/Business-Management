import React, { useState, useMemo } from "react";
import "../../App.css";
import { usePayment } from "../../hooks/usePayment";
import PaymentList from "./paymentlist";
import { BACKEND_URL } from "../../Config";

const Payment = () => {
    const { data, refetch } = usePayment();
    const [searchTerm, setSearchTerm] = useState("");
    const [filterType, setFilterType] = useState("today"); // "today", "all"
    const [methodFilter, setMethodFilter] = useState("all");

    const today = new Date().setHours(0, 0, 0, 0);

    const filteredData = useMemo(() => {
        return data.filter((payment) => {
            const paymentDate = new Date(payment.createdAt).setHours(0, 0, 0, 0);

            // Date filter
            if (filterType === "today" && paymentDate !== today) return false;

            // Method filter
            if (methodFilter !== "all" && payment.payment_method?.toLowerCase() !== methodFilter.toLowerCase()) return false;

            // Search term
            if (searchTerm) {
                const searchLower = searchTerm.toLowerCase();
                return (
                    payment.description?.toLowerCase().includes(searchLower) ||
                    payment.payment_method?.toLowerCase().includes(searchLower) ||
                    payment.amount?.toString().includes(searchLower)
                );
            }

            return true;
        });
    }, [data, filterType, methodFilter, searchTerm, today]);

    const totalFilteredAmount = filteredData.reduce((acc, curr) => acc + (Number(curr.amount) || 0), 0);

    const handleSettleAll = async () => {
        if (!window.confirm("This will mark ALL currently pending invoices as 'Paid' and record them as cash payments. Do you want to proceed?")) return;

        try {
            const response = await fetch(`${BACKEND_URL}/api/v1/payment/settle-all`, {
                method: "POST",
                headers: {
                    token: localStorage.getItem("token")
                }
            });
            const resData = await response.json();
            if (response.ok) {
                alert(resData.message);
                refetch();
            } else {
                alert(resData.message || "Failed to settle invoices");
            }
        } catch (error) {
            console.error(error);
            alert("Error settling invoices");
        }
    };

    return (
        <div className="font ml-14 p-6 min-h-screen bg-gray-50 flex flex-col flex-1">
            {/* Header Section */}
            <div className="w-full mb-8">
                <div className="flex justify-between items-end">
                    <div>
                        <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Payments</h1>
                        <p className="text-gray-500 mt-2 font-medium">
                            Showing <span className="text-blue-600">{filterType === 'today' ? "Today's" : "All"}</span> transactions
                        </p>
                    </div>
                    <div className="flex gap-4 items-center">
                        <button
                            onClick={handleSettleAll}
                            className="bg-orange-50 text-orange-600 px-4 py-2 rounded-xl text-xs font-bold border border-orange-100 hover:bg-orange-100 transition-colors"
                        >
                            Settle All Pending
                        </button>
                        <div className="bg-white px-6 py-3 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-end">
                            <span className="text-[10px] uppercase tracking-wider text-gray-400 font-bold">Total Collection</span>
                            <span className="text-2xl font-black text-green-600">₹{totalFilteredAmount.toLocaleString()}</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Control Bar */}
            <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 mb-6 flex flex-wrap gap-4 items-center justify-between">
                <div className="flex gap-4 items-center flex-1 min-w-[300px]">
                    {/* Date Filter Toggle */}
                    <div className="flex bg-gray-100 p-1 rounded-xl">
                        <button
                            onClick={() => setFilterType("today")}
                            className={`px-6 py-2 text-sm font-bold rounded-lg transition-all ${filterType === "today" ? "bg-white text-blue-600 shadow-sm" : "text-gray-500 hover:text-gray-700"
                                }`}
                        >
                            Today
                        </button>
                        <button
                            onClick={() => setFilterType("all")}
                            className={`px-6 py-2 text-sm font-bold rounded-lg transition-all ${filterType === "all" ? "bg-white text-blue-600 shadow-sm" : "text-gray-500 hover:text-gray-700"
                                }`}
                        >
                            All Time
                        </button>
                    </div>

                    {/* Search Box */}
                    <div className="relative flex-1">
                        <input
                            type="text"
                            placeholder="Search by amount, method, or notes..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-11 pr-4 py-2.5 bg-gray-50 border border-transparent rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all font-medium"
                        />
                        <svg className="w-5 h-5 text-gray-400 absolute left-4 top-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                    </div>
                </div>

                <div className="flex gap-4 items-center">
                    <select
                        value={methodFilter}
                        onChange={(e) => setMethodFilter(e.target.value)}
                        className="bg-white border border-gray-200 rounded-xl px-4 py-2.5 text-sm font-bold text-gray-700 focus:ring-2 focus:ring-blue-500 outline-none cursor-pointer"
                    >
                        <option value="all">All Methods</option>
                        <option value="cash">Cash</option>
                        <option value="upi">UPI</option>
                        <option value="check">Check</option>
                        <option value="other">Other</option>
                    </select>
                </div>
            </div>

            {/* Main Table Container */}
            <div className="flex-1 bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden flex flex-col">
                <div className="px-8 py-6 border-b border-gray-50 flex justify-between items-center bg-white">
                    <h2 className="text-xl font-bold text-gray-800">Transaction History</h2>
                    <span className="bg-blue-50 text-blue-700 px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-tighter">
                        {filteredData.length} records found
                    </span>
                </div>
                <div className="overflow-y-auto overflow-x-hidden flex-1 p-0">
                    {filteredData.length === 0 ? (
                        <div className="p-20 text-center flex flex-col items-center">
                            <div className="bg-gray-50 p-6 rounded-full mb-4">
                                <svg className="w-12 h-12 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                            </div>
                            <h3 className="text-lg font-bold text-gray-800">No transactions match your filters</h3>
                            <p className="text-gray-500 mt-1 max-w-sm">Try adjusting your date range or search keywords.</p>
                        </div>
                    ) : (
                        <PaymentList data={filteredData} refetch={refetch} />
                    )}
                </div>
            </div>
        </div>
    );
};

export default Payment;

