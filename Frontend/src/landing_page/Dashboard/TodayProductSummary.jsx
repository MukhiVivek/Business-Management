import React, { useMemo } from "react";

const TodayProductSummary = ({ orders }) => {
    const summary = useMemo(() => {
        if (!orders || !Array.isArray(orders)) return [];

        const today = new Date().setHours(0, 0, 0, 0);

        const todayOrders = orders.filter((order) => {
            const orderDate = new Date(order.createdAt?.$date || order.createdAt).setHours(0, 0, 0, 0);
            return orderDate === today;
        });

        const productStats = {};

        todayOrders.forEach(order => {
            (order.items || []).forEach(item => {
                const name = item.name || "Unknown Product";
                if (!productStats[name]) {
                    productStats[name] = {
                        name: name,
                        totalQty: 0,
                        totalRevenue: 0,
                    };
                }
                productStats[name].totalQty += (Number(item.qty) || 0);
                productStats[name].totalRevenue += (Number(item.qty) || 0) * (Number(item.price) || 0);
            });
        });

        return Object.values(productStats).sort((a, b) => b.totalQty - a.totalQty);
    }, [orders]);

    const totalProductsSoldToday = summary.reduce((acc, curr) => acc + curr.totalQty, 0);
    const maxQty = summary.length > 0 ? summary[0].totalQty : 1;

    return (
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h3 className="text-xl font-black text-gray-800 tracking-tight">Today's Product Performance</h3>
                    <p className="text-gray-400 font-medium text-sm mt-1">
                        Total Items: <span className="text-indigo-600 font-bold">{totalProductsSoldToday}</span> items sold today
                    </p>
                </div>
                <div className="flex bg-indigo-50 p-1 rounded-xl">
                    <span className="text-[10px] font-black uppercase px-2 py-1 text-indigo-600">
                        Daily Summary
                    </span>
                </div>
            </div>

            <div className="space-y-4">
                {summary.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-12 text-gray-400">
                        <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4">
                            <svg className="w-8 h-8 opacity-20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                            </svg>
                        </div>
                        <p className="font-medium">No sales recorded today yet.</p>
                    </div>
                ) : (
                    summary.map((item, idx) => (
                        <div key={item.name} className="group relative">
                            <div className="flex items-center justify-between mb-2">
                                <div className="flex items-center gap-3">
                                    <span className={`flex items-center justify-center w-6 h-6 rounded-lg text-[10px] font-black ${idx === 0 ? 'bg-amber-100 text-amber-700' :
                                        idx === 1 ? 'bg-slate-100 text-slate-600' :
                                            idx === 2 ? 'bg-orange-50 text-orange-600' :
                                                'bg-gray-50 text-gray-400'
                                        }`}>
                                        {idx + 1}
                                    </span>
                                    <span className="font-bold text-gray-700 group-hover:text-indigo-600 transition-colors">
                                        {item.name}
                                    </span>
                                </div>
                                <div className="text-right">
                                    <span className="text-sm font-black text-gray-900">{item.totalQty}</span>
                                    <span className="ml-1 text-[10px] font-bold text-gray-400 uppercase">Qty</span>
                                </div>
                            </div>

                            <div className="relative h-2 w-full bg-gray-50 rounded-full overflow-hidden">
                                <div
                                    className={`absolute top-0 left-0 h-full rounded-full transition-all duration-1000 ease-out ${idx === 0 ? 'bg-gradient-to-r from-amber-400 to-amber-500 shadow-[0_0_8px_rgba(251,191,36,0.3)]' :
                                        'bg-gradient-to-r from-indigo-400 to-indigo-500'
                                        }`}
                                    style={{ width: `${(item.totalQty / maxQty) * 100}%` }}
                                />
                            </div>

                            <div className="flex justify-between mt-1 items-center">
                                <span className="text-[10px] font-bold text-gray-300 uppercase tracking-widest">
                                    Contribution: {Math.round((item.totalQty / (totalProductsSoldToday || 1)) * 100)}%
                                </span>
                                <span className="text-[10px] font-bold text-indigo-500">
                                    ₹{item.totalRevenue.toLocaleString()}
                                </span>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {summary.length > 0 && (
                <div className="mt-8 pt-6 border-t border-gray-100 flex items-center justify-between">
                    <div>
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none mb-1">Top Performer</p>
                        <h4 className="font-black text-gray-800">{summary[0].name}</h4>
                    </div>
                    <div className="text-right">
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none mb-1">Total Daily Revenue</p>
                        <h4 className="font-black text-indigo-600">₹{summary.reduce((acc, curr) => acc + curr.totalRevenue, 0).toLocaleString()}</h4>
                    </div>
                </div>
            )}
        </div>
    );
};

export default TodayProductSummary;
