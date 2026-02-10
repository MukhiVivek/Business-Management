import React, { useState } from 'react';

const VendorSelector = ({ onSelect, vendorData }) => {
    const [searchTerm, setSearchTerm] = useState("");

    const filteredVendors = vendorData.filter(vendor =>
        vendor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        vendor.company?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="p-4">
            <input
                type="text"
                placeholder="Search vendor by name or company..."
                className="w-full p-3 border border-gray-200 rounded-xl mb-4 focus:ring-2 focus:ring-blue-500 outline-none"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
            />
            <div className="max-h-[400px] overflow-y-auto">
                <table className="w-full">
                    <thead className="sticky top-0 bg-white border-b border-gray-100">
                        <tr>
                            <th className="text-left p-3 text-xs font-bold text-gray-400 uppercase">Vendor Name</th>
                            <th className="text-left p-3 text-xs font-bold text-gray-400 uppercase">Company</th>
                            <th className="text-right p-3 text-xs font-bold text-gray-400 uppercase">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredVendors.map((vendor) => (
                            <tr key={vendor._id} className="border-b border-gray-50 hover:bg-blue-50 transition-colors">
                                <td className="p-3 font-bold text-gray-800">{vendor.name}</td>
                                <td className="p-3 text-gray-600">{vendor.company}</td>
                                <td className="p-3 text-right">
                                    <button
                                        onClick={() => onSelect(vendor)}
                                        className="bg-blue-600 text-white px-4 py-1.5 rounded-lg text-sm font-bold hover:bg-blue-700 transition-all"
                                    >
                                        Select
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {filteredVendors.length === 0 && (
                    <div className="p-10 text-center text-gray-400 font-medium">No vendors found</div>
                )}
            </div>
        </div>
    );
};

export default VendorSelector;
