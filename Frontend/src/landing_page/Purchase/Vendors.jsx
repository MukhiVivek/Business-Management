import React, { useState, useMemo } from "react";
import "../../App.css";
import { useVendor } from "../../hooks/useVendor";
import { Link } from "react-router-dom";
import { IoPersonAddSharp } from "react-icons/io5";

const Vendors = () => {
    const { data: vendorData, refetch } = useVendor();
    const [searchTerm, setSearchTerm] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 15;

    const filteredVendors = useMemo(() => {
        if (!Array.isArray(vendorData)) return [];
        return vendorData.filter((vendor) => {
            if (searchTerm) {
                const searchLower = searchTerm.toLowerCase();
                return (
                    String(vendor.name || "").toLowerCase().includes(searchLower) ||
                    String(vendor.company || "").toLowerCase().includes(searchLower) ||
                    String(vendor.email || "").toLowerCase().includes(searchLower)
                );
            }
            return true;
        });
    }, [vendorData, searchTerm]);

    const totalPages = Math.ceil(filteredVendors.length / itemsPerPage);
    const currentVendors = useMemo(() => {
        const start = (currentPage - 1) * itemsPerPage;
        return filteredVendors.slice(start, start + itemsPerPage);
    }, [filteredVendors, currentPage]);

    return (
        <div className="ml-14 p-6 min-h-screen bg-gray-50 flex flex-1 flex-col font-sans">
            {/* Header */}
            <div className="w-full mb-8 flex justify-between items-end">
                <div>
                    <h1 className="text-4xl font-black text-gray-900 tracking-tight">Vendors</h1>
                    <p className="text-gray-400 font-bold mt-1 uppercase tracking-widest text-[10px]">Manage your suppliers & business partners</p>
                </div>
                <Link to="/vendors/add" className="px-6 py-2.5 bg-blue-600 text-white rounded-2xl font-black hover:bg-blue-700 transition-all text-sm shadow-xl flex items-center gap-2">
                    <IoPersonAddSharp className="text-lg" />
                    Add Vendor
                </Link>
            </div>

            {/* Selector Bar */}
            <div className="bg-white p-4 rounded-3xl shadow-sm border border-gray-100 mb-6 flex flex-wrap gap-4 items-center justify-between">
                <div className="relative flex-1 max-w-md">
                    <input
                        type="text"
                        placeholder="Search by Name, Company or Email..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-12 pr-4 py-3 bg-gray-50 border-none rounded-2xl text-sm font-bold focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                    />
                    <svg className="w-5 h-5 text-gray-300 absolute left-4 top-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                </div>
            </div>

            {/* Table Content */}
            <div className="bg-white rounded-[2.5rem] shadow-sm border border-gray-100 overflow-hidden flex-1 flex flex-col">
                <div className="overflow-auto flex-1">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-gray-50/50">
                                <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Vendor Name</th>
                                <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Company</th>
                                <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Contact Info</th>
                                <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Balance</th>
                                <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {currentVendors.map((vendor) => (
                                <tr key={vendor._id} className="border-t border-gray-50 hover:bg-gray-50/50 transition-colors group">
                                    <td className="px-8 py-5">
                                        <div className="text-sm font-black text-gray-900">{vendor.name}</div>
                                        <div className="text-[10px] font-bold text-blue-500 mt-1 uppercase tracking-tighter">{vendor.vendor_type || "SUPPLIER"}</div>
                                    </td>
                                    <td className="px-8 py-5">
                                        <div className="text-sm font-black text-gray-800">{vendor.company || "Individual"}</div>
                                        <div className="text-[10px] text-gray-400 font-bold uppercase mt-0.5">{vendor.location}</div>
                                    </td>
                                    <td className="px-8 py-5">
                                        <div className="text-[13px] font-black text-gray-900">{vendor.phone_number}</div>
                                        <div className="text-[10px] text-gray-400 font-bold mt-0.5">{vendor.email}</div>
                                    </td>
                                    <td className="px-8 py-5">
                                        <div className={`text-sm font-black ${vendor.balance > 0 ? "text-red-500" : "text-green-600"}`}>
                                            ₹{vendor.balance?.toLocaleString()}
                                        </div>
                                    </td>
                                    <td className="px-8 py-5 text-right">
                                        <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <Link to={`/vendors/edit/${vendor._id}`} className="p-2 bg-blue-50 text-blue-600 rounded-xl hover:bg-blue-600 hover:text-white transition-all">
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                                            </Link>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {filteredVendors.length === 0 && (
                        <div className="p-20 text-center flex flex-col items-center">
                            <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-4">
                                <svg className="w-10 h-10 text-gray-200" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                            </div>
                            <h3 className="text-xl font-black text-gray-800">No Vendors Found</h3>
                            <p className="text-gray-400 font-bold text-xs mt-1 max-w-xs">Whops! We couldn't find any vendor matching your criteria.</p>
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
        </div>
    );
};

export default Vendors;
