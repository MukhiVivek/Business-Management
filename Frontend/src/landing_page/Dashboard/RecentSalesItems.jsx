import React, { useMemo } from "react";

const RecentSalesItems = ({ orders }) => {
    const recentItems = useMemo(() => {
        if (!orders || !Array.isArray(orders)) return [];

        // Flatten all items from all orders and attach order metadata
        const allItems = orders.flatMap((order) =>
            (order.items || []).map((item) => ({
                ...item,
                orderNo: order.invoice_number,
                customerName: order.customer_id?.name || "N/A",
                orderDate: new Date(order.createdAt),
                status: order.status
            }))
        );

        // Sort by date descending
        return allItems.sort((a, b) => b.orderDate - a.orderDate).slice(0, 7);
    }, [orders]);

    return (
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300">
            <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-bold text-gray-800">Recent Sales Items</h3>
                <span className="text-xs font-black uppercase tracking-tighter text-blue-600 bg-blue-50 px-3 py-1 rounded-full">
                    Live Feed
                </span>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full text-sm text-left border-separate border-spacing-y-2">
                    <thead>
                        <tr className="text-gray-400 font-bold text-xs uppercase tracking-widest">
                            <th className="px-4 py-2">Item Name</th>
                            <th className="px-4 py-2">Order #</th>
                            <th className="px-4 py-2">Qty</th>
                            <th className="px-4 py-2 text-right">Price</th>
                            <th className="px-4 py-2 text-right">Total</th>
                        </tr>
                    </thead>
                    <tbody>
                        {recentItems.length === 0 ? (
                            <tr>
                                <td colSpan="5" className="text-center py-10 text-gray-500">No items sold yet</td>
                            </tr>
                        ) : (
                            recentItems.map((item, idx) => (
                                <tr key={idx} className="bg-gray-50/50 hover:bg-gray-50 transition-colors group">
                                    <td className="px-4 py-3 rounded-l-xl">
                                        <div className="flex flex-col">
                                            <span className="font-bold text-gray-800 group-hover:text-blue-600 transition-colors">
                                                {item.name}
                                            </span>
                                            <span className="text-[10px] text-gray-400 font-medium">
                                                {item.customerName}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="px-4 py-3">
                                        <span className="bg-white border border-gray-200 px-2 py-1 rounded-lg text-xs font-mono font-bold text-gray-600">
                                            #{item.orderNo}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3">
                                        <span className="font-black text-gray-700">x{item.qty}</span>
                                    </td>
                                    <td className="px-4 py-3 text-right text-gray-500 font-medium">
                                        ₹{item.price?.toLocaleString()}
                                    </td>
                                    <td className="px-4 py-3 text-right rounded-r-xl">
                                        <span className="font-black text-blue-600">
                                            ₹{(item.qty * item.price).toLocaleString()}
                                        </span>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default RecentSalesItems;
