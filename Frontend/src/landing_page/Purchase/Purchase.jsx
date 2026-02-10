import React, { useState, useMemo } from "react";
import "../../App.css";
import { usePurchase } from "../../hooks/usePurchase";
import { Link } from "react-router-dom";
import PurchasePaymentModal from "./PurchasePaymentModal";
import { MdOutlinePayments } from "react-icons/md";

const Purchase = () => {
    const { data: purchaseData, refetch } = usePurchase();
    const [searchTerm, setSearchTerm] = useState("");
    const [filterType, setFilterType] = useState("all"); // "today", "unpaid", "all"
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 15;

    const [selectedPurchase, setSelectedPurchase] = useState(null);
    const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);

    const stats = useMemo(() => {
        if (!Array.isArray(purchaseData)) return { total: 0, pending: 0, count: 0 };
        return {
            total: purchaseData.reduce((sum, p) => sum + (p.Subtotal || 0), 0),
            pending: purchaseData.filter(p => (p.status || "Pending") !== "Paid").length,
            count: purchaseData.length
        };
    }, [purchaseData]);

    const filteredPurchases = useMemo(() => {
        if (!Array.isArray(purchaseData)) return [];
        return purchaseData.filter((purchase) => {
            // Status filter
            if (filterType === "unpaid" && (purchase.status || "Pending") === "Paid") return false;
            if (filterType === "today") {
                const today = new Date().toISOString().slice(0, 10);
                const pDate = new Date(purchase.purchase_date).toISOString().slice(0, 10);
                if (today !== pDate) return false;
            }

            // Search filter
            if (searchTerm) {
                const searchLower = searchTerm.toLowerCase();
                return (
                    String(purchase.purchase_number || "").toLowerCase().includes(searchLower) ||
                    String(purchase.vendor_id?.name || "").toLowerCase().includes(searchLower) ||
                    String(purchase.vendor_id?.company || "").toLowerCase().includes(searchLower)
                );
            }
            return true;
        });
    }, [purchaseData, searchTerm, filterType]);

    const totalPages = Math.ceil(filteredPurchases.length / itemsPerPage);
    const currentPurchases = useMemo(() => {
        const start = (currentPage - 1) * itemsPerPage;
        return filteredPurchases.slice(start, start + itemsPerPage);
    }, [filteredPurchases, currentPage]);

    const handleOpenPayment = (purchase) => {
        setSelectedPurchase(purchase);
        setIsPaymentModalOpen(true);
    };

    const handlePaymentSuccess = () => {
        refetch();
    };

    return (
        <div className="ml-14 p-6 min-h-screen bg-gray-50 flex flex-1 flex-col font-sans text-gray-800">
            {/* Header */}
            <div className="w-full mb-8 flex justify-between items-end">
                <div>
                    <h1 className="text-4xl font-black text-gray-900 tracking-tight">Purchase Management</h1>
                    <p className="text-gray-400 font-bold mt-1 uppercase tracking-widest text-[10px]">Track your inventory costs & vendor bills</p>
                </div>
                <div className="flex gap-3">
                    <Link to="/purchase/payment" className="px-6 py-2.5 bg-white border border-gray-200 rounded-2xl font-black text-gray-600 hover:bg-gray-50 transition-all text-sm shadow-sm">
                        View History
                    </Link>
                    <Link to="/purchase/add" className="px-6 py-2.5 bg-gray-900 text-white rounded-2xl font-black hover:bg-black transition-all text-sm shadow-xl flex items-center gap-2">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M12 4v16m8-8H4" /></svg>
                        Record Bill
                    </Link>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-gray-100">
                    <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center mb-4">
                        <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" /></svg>
                    </div>
                    <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Total Liability</div>
                    <div className="text-2xl font-black text-gray-900 mt-1">₹{stats.total?.toLocaleString()}</div>
                </div>
                <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-gray-100">
                    <div className="w-10 h-10 bg-orange-50 rounded-xl flex items-center justify-center mb-4">
                        <svg className="w-5 h-5 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 2m6-2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                    </div>
                    <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Pending Bills</div>
                    <div className="text-2xl font-black text-orange-600 mt-1">{stats.pending}</div>
                </div>
                <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-gray-100">
                    <div className="w-10 h-10 bg-green-50 rounded-xl flex items-center justify-center mb-4">
                        <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /></svg>
                    </div>
                    <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Completed Orders</div>
                    <div className="text-2xl font-black text-green-600 mt-1">{stats.count - stats.pending}</div>
                </div>
                <div className="bg-blue-600 p-6 rounded-[2rem] shadow-xl border border-blue-500 text-white">
                    <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center mb-4">
                        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>
                    </div>
                    <div className="text-[10px] font-black text-white/60 uppercase tracking-widest">Growth Index</div>
                    <div className="text-2xl font-black mt-1">+12.4%</div>
                </div>
            </div>

            {/* Control Bar */}
            <div className="bg-white p-4 rounded-3xl shadow-sm border border-gray-100 mb-6 flex flex-wrap gap-4 items-center justify-between">
                <div className="flex gap-2 bg-gray-50 p-1.5 rounded-2xl">
                    {["all", "today", "unpaid"].map((type) => (
                        <button
                            key={type}
                            onClick={() => setFilterType(type)}
                            className={`px-6 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${filterType === type ? "bg-white text-blue-600 shadow-sm" : "text-gray-400 hover:text-gray-600"}`}
                        >
                            {type}
                        </button>
                    ))}
                </div>

                <div className="relative flex-1 max-w-md">
                    <input
                        type="text"
                        placeholder="Search by Bill #, Vendor or Company..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-12 pr-4 py-3 bg-gray-50 border-none rounded-2xl text-sm font-bold focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                    />
                    <svg className="w-5 h-5 text-gray-300 absolute left-4 top-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                </div>
            </div>

            {/* Table Content */}
            <div className="bg-white rounded-[2.5rem] shadow-sm border border-gray-100 overflow-hidden flex-1 flex flex-col">
                <div className="overflow-auto flex-1 text-gray-800">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-gray-50/50">
                                <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Date / ID</th>
                                <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Vendor Details</th>
                                <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Amount Payable</th>
                                <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest text-center">Status</th>
                                <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {currentPurchases.map((purchase) => (
                                <tr key={purchase._id} className="border-t border-gray-50 hover:bg-gray-50/50 transition-colors group">
                                    <td className="px-8 py-5">
                                        <div className="text-xs font-black text-gray-900">{new Date(purchase.purchase_date).toLocaleDateString()}</div>
                                        <div className="text-[10px] font-bold text-blue-500 mt-1 uppercase tracking-tighter">#{purchase.purchase_number}</div>
                                    </td>
                                    <td className="px-8 py-5">
                                        <div className="text-sm font-black text-gray-800">{purchase.vendor_id?.name || "Unknown Vendor"}</div>
                                        <div className="text-[10px] text-gray-400 font-bold uppercase mt-0.5">{purchase.vendor_id?.company}</div>
                                    </td>
                                    <td className="px-8 py-5">
                                        <div className="text-sm font-black text-gray-900">₹{purchase.Subtotal?.toLocaleString()}</div>
                                        <div className="text-[10px] text-gray-400 font-bold mt-0.5">{purchase.items?.length || 0} Items linked</div>
                                    </td>
                                    <td className="px-8 py-5 text-center">
                                        <span className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest ${(purchase.status || "Pending") === "Paid" ? "bg-green-50 text-green-600" : "bg-orange-50 text-orange-600 border border-orange-100"
                                            }`}>
                                            {purchase.status || "Pending"}
                                        </span>
                                    </td>
                                    <td className="px-8 py-5 text-right">
                                        <div className="flex justify-end gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                                            {(purchase.status || "Pending") !== "Paid" && (
                                                <button
                                                    onClick={() => handleOpenPayment(purchase)}
                                                    className="p-2.5 bg-green-50 text-green-600 rounded-xl hover:bg-green-600 hover:text-white transition-all shadow-sm"
                                                    title="Add Payment"
                                                >
                                                    <MdOutlinePayments size={14} />
                                                </button>
                                            )}
                                            <Link to={`/purchase/edit/${purchase._id}`} className="p-2.5 bg-blue-50 text-blue-600 rounded-xl hover:bg-blue-600 hover:text-white transition-all shadow-sm" title="Edit Bill">
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                                            </Link>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {filteredPurchases.length === 0 && (
                        <div className="p-20 text-center flex flex-col items-center">
                            <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-4">
                                <svg className="w-10 h-10 text-gray-200" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" /></svg>
                            </div>
                            <h3 className="text-xl font-black text-gray-800">No Records Found</h3>
                            <p className="text-gray-400 font-bold text-xs mt-1 max-w-xs">We couldn't find any purchase records matching your current filters or search query.</p>
                        </div>
                    )}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                    <div className="px-8 py-6 bg-gray-50/50 border-t border-gray-100 flex justify-between items-center">
                        <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Page {currentPage} of {totalPages}</span>
                        <div className="flex gap-2">
                            <button
                                disabled={currentPage === 1}
                                onClick={() => setCurrentPage(p => p - 1)}
                                className="px-4 py-2 bg-white border border-gray-200 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-gray-50 transition-all disabled:opacity-30"
                            >
                                Previous
                            </button>
                            <button
                                disabled={currentPage === totalPages}
                                onClick={() => setCurrentPage(p => p + 1)}
                                className="px-4 py-2 bg-white border border-gray-200 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-gray-50 transition-all disabled:opacity-30"
                            >
                                Next
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {isPaymentModalOpen && (
                <PurchasePaymentModal
                    isOpen={isPaymentModalOpen}
                    onClose={() => setIsPaymentModalOpen(false)}
                    purchase={selectedPurchase}
                    onPaymentSuccess={handlePaymentSuccess}
                />
            )}
        </div>
    );
};

export default Purchase;
