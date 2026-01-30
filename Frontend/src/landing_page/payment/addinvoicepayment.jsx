import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { BACKEND_URL } from "../../Config";

function AddPayment() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        payment_id: `PAY-${Math.floor(Math.random() * 1000000)}`,
        invoice_id: "",
        invoice_number: "", // Visual only
        amount: "",
        payment_method: "Cash",
        description: "",
        createdAt: new Date().toISOString().split("T")[0],
    });
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await axios.post(
                `${BACKEND_URL}/api/v1/payment/add`,
                {
                    ...formData,
                    createdAt: new Date(formData.createdAt)
                },
                {
                    headers: {
                        token: localStorage.getItem("token"),
                    },
                }
            );
            alert("Payment Successfully Added");
            navigate("/payment"); // Navigate to payment list
        } catch (error) {
            console.error(error);
            alert("Error adding payment: " + (error.response?.data?.message || error.message));
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="font ml-14 p-6 min-h-screen bg-gray-50">
            <div className="max-w-4xl mx-auto">
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-800">Add New Payment</h1>
                        <p className="text-gray-500 text-sm mt-1">Record a manual payment for an existing invoice.</p>
                    </div>
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                    <form onSubmit={handleSubmit} className="p-8 space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">Payment ID</label>
                                <input
                                    type="text"
                                    name="payment_id"
                                    value={formData.payment_id}
                                    onChange={handleChange}
                                    className="w-full border border-gray-200 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">Invoice ID (MongoDB ID)</label>
                                <input
                                    type="text"
                                    name="invoice_id"
                                    value={formData.invoice_id}
                                    onChange={handleChange}
                                    placeholder="Enter Invoice MongoDB ID"
                                    className="w-full border border-gray-200 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                                    required
                                />
                                <p className="text-[10px] text-gray-400 mt-1 italic">* Better to use the Pay button in Orders List</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">Amount</label>
                                <div className="relative">
                                    <span className="absolute left-4 top-2.5 text-gray-500">₹</span>
                                    <input
                                        type="number"
                                        name="amount"
                                        value={formData.amount}
                                        onChange={handleChange}
                                        className="w-full border border-gray-200 rounded-lg pl-8 pr-4 py-2.5 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                                        required
                                        step="0.01"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">Payment Date</label>
                                <input
                                    type="date"
                                    name="createdAt"
                                    value={formData.createdAt}
                                    onChange={handleChange}
                                    className="w-full border border-gray-200 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">Payment Method</label>
                                <select
                                    name="payment_method"
                                    value={formData.payment_method}
                                    onChange={handleChange}
                                    className="w-full border border-gray-200 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-blue-500 outline-none transition-all bg-white"
                                >
                                    <option value="Cash">Cash</option>
                                    <option value="Check">Check</option>
                                    <option value="UPI">UPI</option>
                                    <option value="Other">Other</option>
                                </select>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Description / Reference</label>
                            <textarea
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
                                rows="3"
                                className="w-full border border-gray-200 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-blue-500 outline-none transition-all resize-none"
                                placeholder="Enter payment details, bank transaction ID, etc."
                            ></textarea>
                        </div>

                        <div className="pt-4 flex justify-end gap-3">
                            <button
                                type="button"
                                onClick={() => navigate("/payment")}
                                className="px-6 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={loading}
                                className={`px-8 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold shadow-md shadow-blue-200 flex items-center gap-2 ${loading ? "opacity-70 cursor-not-allowed" : ""
                                    }`}
                            >
                                {loading && (
                                    <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                )}
                                {loading ? "Adding..." : "Add Payment"}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default AddPayment;
