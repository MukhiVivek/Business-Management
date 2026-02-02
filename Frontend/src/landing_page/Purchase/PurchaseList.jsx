import axios from "axios";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { BACKEND_URL } from "../../Config";
import { IoAdd } from "react-icons/io5";

function PurchaseList() {
    const [purchases, setPurchases] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchPurchases();
    }, []);

    async function fetchPurchases() {
        try {
            const response = await axios.get(`${BACKEND_URL}/api/v1/purchase/data`, {
                headers: {
                    token: localStorage.getItem("token"),
                },
            });

            // Grouping by Bill Number on frontend for a cleaner view
            const grouped = response.data.data.reduce((acc, curr) => {
                const billKey = curr.bill_number || "No Bill #";
                if (!acc[billKey]) {
                    acc[billKey] = {
                        bill_number: billKey,
                        date: curr.purchase_date,
                        items: [],
                        total_amount: 0
                    };
                }
                acc[billKey].items.push(curr);
                acc[billKey].total_amount += (curr.purchase_price * curr.quantity);
                return acc;
            }, {});

            setPurchases(Object.values(grouped));
            setLoading(false);
        } catch (error) {
            console.error("Error fetching purchases:", error);
            setLoading(false);
        }
    }

    if (loading) return <div className="pl-18 pt-2">Loading...</div>;

    return (
        <div className="pl-18 pt-2 pr-9 min-h-screen block rounded-lg w-full bg-gray-50">
            <div className="flex justify-between items-center mb-6 mt-1">
                <h1 className="text-2xl font-bold text-gray-800">Purchase Bills</h1>
                <Link
                    to="/purchase/add"
                    className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded shadow transition"
                >
                    <IoAdd className="text-xl" /> New Purchase
                </Link>
            </div>

            <div className="bg-white rounded-md shadow-sm border border-gray-200 overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-gray-50 border-b">
                        <tr className="text-gray-500 uppercase text-xs font-semibold">
                            <th className="px-6 py-4">Date</th>
                            <th className="px-6 py-4">Bill Number</th>
                            <th className="px-6 py-4">Products</th>
                            <th className="px-6 py-4 text-right">Total Amount</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {purchases.length === 0 ? (
                            <tr>
                                <td colSpan="4" className="px-6 py-10 text-center text-gray-400">
                                    No purchase records found.
                                </td>
                            </tr>
                        ) : (
                            purchases.map((bill, idx) => (
                                <tr key={idx} className="hover:bg-gray-50 transition">
                                    <td className="px-6 py-4 text-sm text-gray-600">
                                        {new Date(bill.date).toLocaleDateString()}
                                    </td>
                                    <td className="px-6 py-4 font-medium text-gray-800">
                                        {bill.bill_number}
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-600">
                                        <div className="flex flex-col gap-1">
                                            {bill.items.map((item, i) => (
                                                <span key={i} className="inline-block bg-blue-50 text-blue-700 px-2 py-0.5 rounded-sm text-[11px]">
                                                    {item.product_id?.name} x {item.quantity}
                                                </span>
                                            ))}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-right font-semibold text-gray-900">
                                        ₹{bill.total_amount.toFixed(2)}
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default PurchaseList;
