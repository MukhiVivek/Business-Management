import React, { useState, useEffect } from "react";
import axios from "axios";
import { BACKEND_URL } from "../../Config";
import { useNavigate, useParams } from "react-router-dom";
import { IoArrowBackOutline, IoSaveSharp } from "react-icons/io5";

const AddVendor = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const isEditMode = !!id;

    const [vendor, setVendor] = useState({
        name: "",
        company: "",
        work_phone_number: "",
        phone_number: "",
        vendor_type: "Business",
        display_name: "",
        email: "",
        location: "",
        vendor_billing_address: {
            street_address: "",
            state: "",
            pincode: "",
            city: "",
            area: "",
        },
        gst: "",
    });

    useEffect(() => {
        if (isEditMode) {
            const fetchVendor = async () => {
                try {
                    const res = await axios.get(`${BACKEND_URL}/api/v1/vendor/${id}`, {
                        headers: { token: localStorage.getItem("token") }
                    });
                    setVendor(res.data.data);
                } catch (error) {
                    console.error("Error fetching vendor:", error);
                }
            };
            fetchVendor();
        }
    }, [id, isEditMode]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        if (name.includes('.')) {
            const [parent, child] = name.split('.');
            setVendor(prev => ({
                ...prev,
                [parent]: {
                    ...prev[parent],
                    [child]: value
                }
            }));
        } else {
            setVendor(prev => ({ ...prev, [name]: value }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const url = isEditMode
                ? `${BACKEND_URL}/api/v1/vendor/update/${id}`
                : `${BACKEND_URL}/api/v1/vendor/add`;

            await axios[isEditMode ? 'put' : 'post'](url, vendor, {
                headers: { token: localStorage.getItem("token") }
            });

            alert(isEditMode ? "Vendor updated successfully!" : "Vendor added successfully!");
            navigate("/vendors");
        } catch (error) {
            console.error("Error saving vendor:", error);
            alert("Failed to save vendor details");
        }
    };

    return (
        <div className="pl-14 min-h-screen w-full bg-gray-50 flex flex-col font-sans">
            {/* Header */}
            <div className="bg-white border-b border-gray-200 p-6 sticky top-0 z-30">
                <div className="flex justify-between items-center max-w-5xl mx-auto">
                    <div className="flex items-center gap-4">
                        <button onClick={() => navigate("/vendors")} className="p-2.5 bg-gray-50 rounded-xl text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-all">
                            <IoArrowBackOutline size={20} />
                        </button>
                        <div>
                            <h1 className="text-2xl font-black text-gray-900">{isEditMode ? "Edit Vendor" : "Add New Vendor"}</h1>
                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] mt-0.5">Supplier Directory</p>
                        </div>
                    </div>
                    <button
                        onClick={handleSubmit}
                        className="px-8 py-3 bg-blue-600 text-white rounded-2xl font-black hover:bg-blue-700 shadow-lg shadow-blue-200 flex items-center gap-3 transition-all transform hover:-translate-y-0.5"
                    >
                        <IoSaveSharp size={18} />
                        {isEditMode ? "Update Vendor" : "Save Vendor"}
                    </button>
                </div>
            </div>

            <div className="max-w-5xl mx-auto w-full p-8 space-y-8">
                {/* Form Sections */}
                <form onSubmit={handleSubmit} className="space-y-8 pb-12">

                    {/* Basic Info Section */}
                    <div className="bg-white rounded-[2.5rem] p-10 shadow-sm border border-gray-100">
                        <div className="flex items-center gap-4 mb-8">
                            <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600">
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                            </div>
                            <div>
                                <h3 className="text-lg font-black text-gray-900">Basic Information</h3>
                                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">General vendor details</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-6">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest pl-1">Primary Contact Name</label>
                                <input
                                    type="text"
                                    name="name"
                                    value={vendor.name}
                                    onChange={handleInputChange}
                                    className="w-full p-4 bg-gray-50 border-none rounded-2xl font-bold text-gray-700 focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none transition-all placeholder:text-gray-300"
                                    placeholder="e.g. John Doe"
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest pl-1">Company Name</label>
                                <input
                                    type="text"
                                    name="company"
                                    value={vendor.company}
                                    onChange={handleInputChange}
                                    className="w-full p-4 bg-gray-50 border-none rounded-2xl font-bold text-gray-700 focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none transition-all placeholder:text-gray-300"
                                    placeholder="e.g. Acme Corp"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest pl-1">Email Address</label>
                                <input
                                    type="email"
                                    name="email"
                                    value={vendor.email}
                                    onChange={handleInputChange}
                                    className="w-full p-4 bg-gray-50 border-none rounded-2xl font-bold text-gray-700 focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none transition-all placeholder:text-gray-300"
                                    placeholder="vendor@example.com"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest pl-1">Phone Number</label>
                                <input
                                    type="number"
                                    name="phone_number"
                                    value={vendor.phone_number}
                                    onChange={handleInputChange}
                                    className="w-full p-4 bg-gray-50 border-none rounded-2xl font-bold text-gray-700 focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none transition-all placeholder:text-gray-300"
                                    placeholder="+91 00000 00000"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest pl-1">Vendor Type</label>
                                <select
                                    name="vendor_type"
                                    value={vendor.vendor_type}
                                    onChange={handleInputChange}
                                    className="w-full p-4 bg-gray-50 border-none rounded-2xl font-bold text-gray-700 focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none transition-all appearance-none cursor-pointer"
                                >
                                    <option value="Business">Business</option>
                                    <option value="Individual">Individual</option>
                                </select>
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest pl-1">GST Number</label>
                                <input
                                    type="text"
                                    name="gst"
                                    value={vendor.gst}
                                    onChange={handleInputChange}
                                    className="w-full p-4 bg-gray-50 border-none rounded-2xl font-bold text-gray-700 focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none transition-all placeholder:text-gray-300 uppercase"
                                    placeholder="22AAAAA0000A1Z5"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Address Section */}
                    <div className="bg-white rounded-[2.5rem] p-10 shadow-sm border border-gray-100">
                        <div className="flex items-center gap-4 mb-8">
                            <div className="w-12 h-12 bg-purple-50 rounded-2xl flex items-center justify-center text-purple-600">
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                            </div>
                            <div>
                                <h3 className="text-lg font-black text-gray-900">Address Details</h3>
                                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Office or Billing location</p>
                            </div>
                        </div>

                        <div className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest pl-1">Street Address</label>
                                <input
                                    type="text"
                                    name="vendor_billing_address.street_address"
                                    value={vendor.vendor_billing_address.street_address}
                                    onChange={handleInputChange}
                                    className="w-full p-4 bg-gray-50 border-none rounded-2xl font-bold text-gray-700 focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none transition-all placeholder:text-gray-300"
                                    placeholder="Building/Street name"
                                />
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest pl-1">City</label>
                                    <input
                                        type="text"
                                        name="vendor_billing_address.city"
                                        value={vendor.vendor_billing_address.city}
                                        onChange={handleInputChange}
                                        className="w-full p-4 bg-gray-50 border-none rounded-2xl font-bold text-gray-700 focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none transition-all placeholder:text-gray-300"
                                        placeholder="City"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest pl-1">State</label>
                                    <input
                                        type="text"
                                        name="vendor_billing_address.state"
                                        value={vendor.vendor_billing_address.state}
                                        onChange={handleInputChange}
                                        className="w-full p-4 bg-gray-50 border-none rounded-2xl font-bold text-gray-700 focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none transition-all placeholder:text-gray-300"
                                        placeholder="State"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest pl-1">Pincode</label>
                                    <input
                                        type="number"
                                        name="vendor_billing_address.pincode"
                                        value={vendor.vendor_billing_address.pincode}
                                        onChange={handleInputChange}
                                        className="w-full p-4 bg-gray-50 border-none rounded-2xl font-bold text-gray-700 focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none transition-all placeholder:text-gray-300"
                                        placeholder="000 000"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                </form>
            </div>
        </div>
    );
};

export default AddVendor;
