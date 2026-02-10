import React, { useMemo } from "react";
import { usePurchase } from "../../hooks/usePurchase";
import { Link } from "react-router-dom";

const PurchaseDashboard = () => {
    const { data: purchases } = usePurchase();

    const stats = useMemo(() => {
        if (!Array.isArray(purchases)) return { total: 0, count: 0, pending: 0 };
        return {
            total: purchases.reduce((sum, p) => sum + (p.Subtotal || 0), 0),
            count: purchases.length,
            pending: purchases.filter(p => p.status === "Pending").length
        };
    }, [purchases]);

    return (
        <div className="ml-14 p-6 min-h-screen bg-gray-50 flex-1">
            <h1 className="text-3xl font-extrabold text-gray-900 mb-8">Purchase Dashboard</h1>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                    <div className="text-gray-500 text-sm font-bold uppercase tracking-wider">Total Purchases</div>
                    <div className="text-3xl font-black text-gray-900 mt-2">₹{stats.total?.toFixed(2)}</div>
                </div>
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                    <div className="text-gray-500 text-sm font-bold uppercase tracking-wider">Total Orders</div>
                    <div className="text-3xl font-black text-blue-600 mt-2">{stats.count}</div>
                </div>
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                    <div className="text-gray-500 text-sm font-bold uppercase tracking-wider">Pending Bills</div>
                    <div className="text-3xl font-black text-yellow-600 mt-2">{stats.pending}</div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                    <h3 className="text-lg font-bold mb-4">Quick Actions</h3>
                    <div className="grid grid-cols-2 gap-4">
                        <Link to="/purchase/add" className="p-4 bg-blue-50 text-blue-700 rounded-xl font-bold text-center hover:bg-blue-100 transition-colors">
                            + New Purchase Bill
                        </Link>
                        <Link to="/purchase" className="p-4 bg-gray-50 text-gray-700 rounded-xl font-bold text-center hover:bg-gray-100 transition-colors">
                            View Records
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PurchaseDashboard;
