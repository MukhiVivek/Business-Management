import React, { useState, useEffect } from "react";
import axios from "axios";
import { BACKEND_URL } from "../../Config";
import "../../App.css";
import { useNavigate } from "react-router-dom";

const PurchasePayment = () => {
    const [payments, setPayments] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    const fetchPayments = async () => {
        try {
            const res = await axios.get(`${BACKEND_URL}/api/v1/purchase-payment`, {
                headers: { token: localStorage.getItem("token") }
            });
            setPayments(res.data.data);
            setLoading(false);
        } catch (error) {
            console.error("Error fetching payments", error);
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPayments();
    }, []);

    return (
        <div className="ml-14 p-6 min-h-screen bg-gray-50 flex-1 flex flex-col font-sans">
            <div className="w-full mb-8 flex justify-between items-end">
                <div>
                    <h1 className="text-4xl font-black text-gray-900 tracking-tight">Purchase Payments</h1>
                    <p className="text-gray-400 font-bold mt-1 uppercase tracking-widest text-[10px]">History of settlements with your vendors</p>
                </div>
                <button
                    onClick={() => navigate("/purchase")}
                    className="px-6 py-2.5 bg-white border border-gray-200 rounded-2xl font-black text-gray-600 hover:bg-gray-50 transition-all text-sm shadow-sm"
                >
                    Back to Purchases
                </button>
            </div>

            <div className="bg-white rounded-[2.5rem] shadow-sm border border-gray-100 overflow-hidden flex-1">
                <table className="w-full text-left border-collapse">
                    <thead className="bg-gray-50/50">
                        <tr>
                            <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Payment Date</th>
                            <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Vendor Information</th>
                            <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Applied to Bill</th>
                            <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Amount Settled</th>
                            <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Payment Method</th>
                        </tr>
                    </thead>
                    <tbody>
                        {payments.map((payment) => (
                            <tr key={payment._id} className="border-t border-gray-50 hover:bg-gray-50/50 transition-colors group">
                                <td className="px-8 py-5">
                                    <div className="text-sm font-black text-gray-700">
                                        {new Date(payment.payment_date).toLocaleDateString()}
                                    </div>
                                    <div className="text-[10px] text-gray-400 font-bold mt-0.5">REF: {payment.reference_number || "DIRECT"}</div>
                                </td>
                                <td className="px-8 py-5 text-sm font-bold text-gray-800">
                                    <div className="font-black">{payment.vendor_id?.name}</div>
                                    <div className="text-[10px] text-gray-400 uppercase tracking-tighter">{payment.vendor_id?.company}</div>
                                </td>
                                <td className="px-8 py-5">
                                    <span className="text-xs font-black text-blue-600 bg-blue-50 px-3 py-1 rounded-full">
                                        #{payment.purchase_id?.purchase_number}
                                    </span>
                                </td>
                                <td className="px-8 py-5">
                                    <div className="text-sm font-black text-gray-900 italic">₹{payment.amount_paid?.toLocaleString()}</div>
                                </td>
                                <td className="px-8 py-5">
                                    <div className="text-[10px] font-black text-gray-500 uppercase tracking-[0.1em] flex items-center gap-1.5">
                                        <div className="w-1.5 h-1.5 rounded-full bg-blue-500"></div>
                                        {payment.payment_mode}
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {payments.length === 0 && !loading && (
                    <div className="p-20 text-center flex flex-col items-center">
                        <div className="w-16 h-16 bg-gray-50 rounded-2xl flex items-center justify-center mb-4">
                            <svg className="w-8 h-8 text-gray-100" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
                        </div>
                        <h3 className="text-lg font-black text-gray-800">No Payment History</h3>
                        <p className="text-xs text-gray-400 font-bold mt-1">Settlement records will appear here once you process vendor payments.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default PurchasePayment;
