import React, { useState } from "react";
import { LineChart } from "@mui/x-charts/LineChart";

const RevenueLineChart = ({ orders }) => {
    const [view, setView] = useState("weekly"); // "weekly" or "monthly"

    if (!orders || orders.length === 0) {
        return (
            <div className="bg-white p-6 rounded-lg shadow-sm h-full flex flex-col items-center justify-center">
                <h2 className="text-lg font-semibold mb-4 text-gray-800">Revenue Overview</h2>
                <p className="text-gray-500">No data available</p>
            </div>
        );
    }

    const prepareWeeklyData = () => {
        const today = new Date();
        const last7Days = [];
        for (let i = 6; i >= 0; i--) {
            const d = new Date();
            d.setDate(today.getDate() - i);
            last7Days.push({
                date: d.toLocaleDateString("default", { weekday: "short" }),
                fullDate: d.setHours(0, 0, 0, 0),
                revenue: 0,
            });
        }

        orders.forEach((order) => {
            const orderDate = new Date(order.createdAt?.$date || order.createdAt).setHours(0, 0, 0, 0);
            const day = last7Days.find((d) => d.fullDate === orderDate);
            if (day) {
                day.revenue += Number(order.Subtotal) || 0;
            }
        });

        return {
            xLabels: last7Days.map((d) => d.date),
            data: last7Days.map((d) => d.revenue),
        };
    };

    const prepareMonthlyData = () => {
        const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        const currentYear = new Date().getFullYear();
        const monthlyRevenue = months.map((month) => ({ month, revenue: 0 }));

        orders.forEach((order) => {
            const date = new Date(order.createdAt?.$date || order.createdAt);
            if (date.getFullYear() === currentYear) {
                const monthIndex = date.getMonth();
                monthlyRevenue[monthIndex].revenue += Number(order.Subtotal) || 0;
            }
        });

        return {
            xLabels: monthlyRevenue.map((m) => m.month),
            data: monthlyRevenue.map((m) => m.revenue),
        };
    };

    const { xLabels, data } = view === "weekly" ? prepareWeeklyData() : prepareMonthlyData();

    return (
        <div className="bg-white p-6 rounded-lg shadow-sm h-full hover:shadow-lg transition-all duration-300">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-lg font-semibold text-gray-800">Revenue Trend ({view === 'weekly' ? 'Last 7 Days' : 'Monthly'})</h2>
                <div className="flex bg-gray-100 p-1 rounded-lg">
                    <button
                        onClick={() => setView("weekly")}
                        className={`px-4 py-1.5 text-xs font-medium rounded-md transition-all ${view === "weekly" ? "bg-white text-indigo-600 shadow-sm" : "text-gray-500 hover:text-gray-700"
                            }`}
                    >
                        Weekly
                    </button>
                    <button
                        onClick={() => setView("monthly")}
                        className={`px-4 py-1.5 text-xs font-medium rounded-md transition-all ${view === "monthly" ? "bg-white text-indigo-600 shadow-sm" : "text-gray-500 hover:text-gray-700"
                            }`}
                    >
                        Monthly
                    </button>
                </div>
            </div>

            <div className="w-full">
                <LineChart
                    xAxis={[{ scaleType: "point", data: xLabels }]}
                    series={[
                        {
                            data: data,
                            label: "Revenue",
                            area: true,
                            color: "#4f46e5", // indigo-600
                            showMark: true,
                        },
                    ]}
                    height={300}
                    margin={{ left: 60, right: 30, top: 30, bottom: 30 }}
                />
            </div>
        </div>
    );
};

export default RevenueLineChart;
