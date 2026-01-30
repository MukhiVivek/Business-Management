import React, { useState } from "react";
import { BACKEND_URL } from "../../Config";

const PaymentModal = ({ isOpen, onClose, order, onPaymentSuccess }) => {
    if (!isOpen || !order) return null;

    const [paymentId, setPaymentId] = useState(`PAY-${Math.floor(Math.random() * 1000000)}`);
    const [amount, setAmount] = useState(order.Subtotal || 0);
    const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
    const [method, setMethod] = useState("Cash");
    const [description, setDescription] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const response = await fetch(`${BACKEND_URL}/api/v1/payment/add`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    token: localStorage.getItem("token"),
                },
                body: JSON.stringify({
                    amount,
                    payment_method: method,
                    invoice_id: order._id,
                    description: description || `Payment for Invoice #${order.invoice_number}`,
                    createdAt: new Date(date),
                    payment_id: paymentId,
                }),
            });

            const data = await response.json();

            if (response.ok) {
                onPaymentSuccess();
                onClose();
            } else {
                alert(data.message || "Something went wrong");
            }
        } catch (error) {
            console.error("Error:", error);
            alert("Failed to record payment");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 font">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden transform transition-all">
                <div className="bg-blue-600 px-6 py-4 flex justify-between items-center text-white">
                    <h2 className="text-xl font-bold">Record Payment</h2>
                    <button onClick={onClose} className="hover:text-gray-200 transition-colors">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Invoice No</label>
                            <input
                                type="text"
                                value={`#${order.invoice_number}`}
                                disabled
                                className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-gray-500 cursor-not-allowed"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Payment ID</label>
                            <input
                                type="text"
                                value={paymentId}
                                onChange={(e) => setPaymentId(e.target.value)}
                                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all text-gray-800"
                                required
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Amount to Pay</label>
                        <div className="relative">
                            <span className="absolute left-3 top-2 text-gray-500">₹</span>
                            <input
                                type="number"
                                value={amount}
                                onChange={(e) => setAmount(e.target.value)}
                                className="w-full border border-gray-300 rounded-lg pl-8 pr-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all text-gray-800"
                                required
                                step="0.01"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Payment Date</label>
                            <input
                                type="date"
                                value={date}
                                onChange={(e) => setDate(e.target.value)}
                                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all text-gray-800"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Payment Method</label>
                            <select
                                value={method}
                                onChange={(e) => setMethod(e.target.value)}
                                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all text-gray-800"
                            >
                                <option value="Cash">Cash</option>
                                <option value="Check">Check</option>
                                <option value="UPI">UPI</option>
                                <option value="Other">Other</option>
                            </select>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Reference/Description</label>
                        <textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            className="w-full border border-gray-300 rounded-lg px-3 py-2 h-20 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all resize-none text-gray-800"
                            placeholder="Bank details, UPI ID, etc."
                        ></textarea>
                    </div>

                    <div className="pt-4 flex gap-3">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className={`flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium flex items-center justify-center ${loading ? "opacity-70 cursor-not-allowed" : ""
                                }`}
                        >
                            {loading ? (
                                <svg className="animate-spin h-5 w-5 mr-3 text-white" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                            ) : null}
                            {loading ? "Processing..." : "Confirm Payment"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default PaymentModal;
