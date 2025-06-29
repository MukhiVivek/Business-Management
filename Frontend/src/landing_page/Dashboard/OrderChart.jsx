import React from "react";
import { BarChart } from "@mui/x-charts/BarChart";
import { useInvoice } from "../../hooks/useInvoice";

function groupOrdersByMonth(data) {
  const monthMap = new Map();

  data.forEach((invoice) => {
    const rawDate = invoice.createdAt?.$date || invoice.createdAt;
    if (!rawDate) return;

    const date = new Date(rawDate);
    if (isNaN(date)) return;

    const month = date.toLocaleString("default", { month: "short" }); // "Jan", etc.
    monthMap.set(month, (monthMap.get(month) || 0) + 1);
  });

  const monthsInOrder = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
  ];

  return monthsInOrder.map((month) => ({
    month,
    count: monthMap.get(month) || 0,
  }));
}

const OrderChart = () => {
  const { data } = useInvoice();

  const grouped = groupOrdersByMonth(data).slice(0, 13); // Jan–Jun
  const xLabels = grouped.map((entry) => entry.month);
  const yValues = grouped.map((entry) => Number(entry.count));

  const isValid =
    xLabels.length === yValues.length &&
    xLabels.length > 0 &&
    yValues.every((val) => typeof val === "number" && !isNaN(val));

  return (
    <div className="font bg-white pt-6 rounded-lg shadow-sm hover:shadow-lg transition-all duration-300">
      <div className="w-full max-w-[900px] mx-10">
        <h2 className="text-xl mb-4 font-semibold">Monthly Orders</h2>

        {isValid ? (
          <BarChart
            xAxis={[{ data: xLabels, scaleType: "band" }]}
            series={[{ data: yValues, label: "Orders" }]}
            height={300}
          />
        ) : (
          <p className="text-center text-gray-500">No valid chart data available</p>
        )}
      </div>
    </div>
  );
};

export default OrderChart;