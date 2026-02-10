import React, { useState } from "react";
import { BACKEND_URL } from "../../Config";

const PurchasePaymentModal = ({ isOpen, onClose, purchase, onPaymentSuccess }) => {
    if (!isOpen || !purchase) return null;

    const [amount, setAmount] = useState(purchase.Subtotal || 0);
    const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
    const [method, setMethod] = useState("Cash");
    const [reference, setReference] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const response = await fetch(`${BACKEND_URL}/api/v1/purchase-payment/add`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    token: localStorage.getItem("token"),
                },
                body: JSON.stringify({
                    amount_paid: Number(amount),
                    payment_mode: method,
                    purchase_id: purchase._id,
                    vendor_id: purchase.vendor_id?._id || purchase.vendor_id,
                    payment_date: new Date(date),
                    reference_number: reference,
                }),
            });

            const data = await response.json();

            if (response.ok) {
                // Also update the purchase status to Paid if amount matches
                if (Number(amount) >= purchase.Subtotal) {
                    await fetch(`${BACKEND_URL}/api/v1/purchase/update/${purchase._id}`, {
                        method: "PUT",
                        headers: {
                            "Content-Type": "application/json",
                            token: localStorage.getItem("token"),
                        },
                        body: JSON.stringify({ status: "Paid" }),
                    });
                }

                alert("Payment recorded successfully");
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
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 backdrop-blur-sm transition-all duration-300">
            <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden transform transition-all scale-100 animate-in fade-in zoom-in duration-200">
                <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-8 py-6 flex justify-between items-center text-white">
                    <div>
                        <h2 className="text-2xl font-black tracking-tight">Record Payment</h2>
                        <p className="text-blue-100 text-[10px] font-bold uppercase tracking-widest mt-0.5">Settle Vendor Bill</p>
                    </div>
                    <button onClick={onClose} className="p-2 bg-white/10 rounded-xl hover:bg-white/20 transition-all">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-8 space-y-6">
                    <div className="flex justify-between items-center p-4 bg-blue-50 rounded-2xl border border-blue-100 mb-2">
                        <div>
                            <span className="text-[10px] font-black text-blue-400 uppercase tracking-widest block">Bill Number</span>
                            <span className="text-lg font-black text-blue-700">#{purchase.purchase_number}</span>
                        </div>
                        <div className="text-right">
                            <span className="text-[10px] font-black text-blue-400 uppercase tracking-widest block">Total Payable</span>
                            <span className="text-lg font-black text-blue-700">₹{purchase.Subtotal?.toLocaleString()}</span>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <div>
                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-2 ml-1">Payment Amount</label>
                            <div className="relative">
                                <span className="absolute left-4 top-1/2 -translate-y-1/2 font-black text-gray-400">₹</span>
                                <input
                                    type="number"
                                    value={amount}
                                    onChange={(e) => setAmount(e.target.value)}
                                    className="w-full bg-gray-50 border-none rounded-2xl pl-8 pr-4 py-4 font-black text-gray-700 focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none transition-all placeholder:text-gray-300 text-lg"
                                    required
                                    step="0.01"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-2 ml-1">Payment Date</label>
                                <input
                                    type="date"
                                    value={date}
                                    onChange={(e) => setDate(e.target.value)}
                                    className="w-full bg-gray-50 border-none rounded-2xl px-4 py-4 font-bold text-gray-700 focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none transition-all cursor-pointer"
                                    required
                                />
                            </div>
                            <div>
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-2 ml-1">Payment Mode</label>
                                <select
                                    value={method}
                                    onChange={(e) => setMethod(e.target.value)}
                                    className="w-full bg-gray-50 border-none rounded-2xl px-4 py-4 font-bold text-gray-700 focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none transition-all cursor-pointer appearance-none"
                                >
                                    <option value="Cash">Cash</option>
                                    <option value="Check">Check</option>
                                    <option value="UPI">UPI</option>
                                    <option value="Bank Transfer">Bank Transfer</option>
                                </select>
                            </div>
                        </div>

                        <div>
                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-2 ml-1">Reference Number / Notes</label>
                            <input
                                type="text"
                                value={reference}
                                onChange={(e) => setReference(e.target.value)}
                                className="w-full bg-gray-50 border-none rounded-2xl px-4 py-4 font-bold text-gray-700 focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none transition-all placeholder:text-gray-300"
                                placeholder="Ref ID, Bank Name, etc."
                            />
                        </div>
                    </div>

                    <div className="pt-4 flex gap-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 px-6 py-4 border-2 border-gray-100 text-gray-400 rounded-2xl hover:bg-gray-50 hover:text-gray-600 transition-all font-black text-xs uppercase tracking-widest"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className={`flex-[2] px-6 py-4 bg-blue-600 text-white rounded-2xl hover:bg-blue-700 shadow-xl shadow-blue-200 transition-all font-black text-xs uppercase tracking-widest flex items-center justify-center gap-3 ${loading ? "opacity-70 cursor-not-allowed" : ""}`}
                        >
                            {loading && (
                                <svg className="animate-spin h-4 w-4 text-white" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                            )}
                            {loading ? "Processing..." : "Confirm Settlement"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default PurchasePaymentModal;
