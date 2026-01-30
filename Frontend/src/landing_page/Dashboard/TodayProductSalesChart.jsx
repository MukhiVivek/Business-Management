import React from "react";
import { PieChart } from "@mui/x-charts/PieChart";

const TodayProductSalesChart = ({ orders }) => {
    if (!orders || orders.length === 0) {
        return (
            <div className="bg-white p-6 rounded-lg shadow-sm h-full flex flex-col items-center justify-center">
                <h2 className="text-lg font-semibold mb-4 text-gray-800">Today's Sales by Type</h2>
                <p className="text-gray-500">No orders today</p>
            </div>
        );
    }

    const today = new Date().setHours(0, 0, 0, 0);

    // Filter today's orders
    const todayOrders = orders.filter((order) => {
        const orderDate = new Date(order.createdAt?.$date || order.createdAt).setHours(0, 0, 0, 0);
        return orderDate === today;
    });

    if (todayOrders.length === 0) {
        return (
            <div className="bg-white p-6 rounded-lg shadow-sm h-full flex flex-col items-center justify-center">
                <h2 className="text-lg font-semibold mb-4 text-gray-800">Today's Sales by Type</h2>
                <p className="text-gray-500 text-sm">No sales yet today</p>
            </div>
        );
    }

    // Group by product_type
    const typeSales = {};
    todayOrders.forEach((order) => {
        order.items.forEach((item) => {
            const type = item.product_id?.product_type || "Other";
            typeSales[type] = (typeSales[type] || 0) + (item.qty || 0);
        });
    });

    const chartData = Object.entries(typeSales).map(([label, value], index) => ({
        id: index,
        value,
        label,
    }));

    return (
        <div className="bg-white p-6 rounded-lg shadow-sm h-full hover:shadow-lg transition-all duration-300">
            <h2 className="text-lg font-semibold mb-4 text-gray-800">Today's Sales by Type (Most Sell)</h2>
            <div className="flex justify-center items-center">
                <PieChart
                    series={[
                        {
                            data: chartData,
                            innerRadius: 60,
                            outerRadius: 100,
                            paddingAngle: 5,
                            cornerRadius: 5,
                            startAngle: -90,
                            endAngle: 180,
                            cx: 100,
                            cy: 100,
                        },
                    ]}
                    width={350}
                    height={220}
                    slotProps={{
                        legend: {
                            direction: 'column',
                            position: { vertical: 'middle', horizontal: 'right' },
                            padding: 0,
                        },
                    }}
                />
            </div>
        </div>
    );
};

export default TodayProductSalesChart;
