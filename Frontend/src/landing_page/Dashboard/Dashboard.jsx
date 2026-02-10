import { useProduct } from "../../hooks/useProduct";
import { useCustomer } from "../../hooks/useCustomer";
import { useInvoice } from "../../hooks/useInvoice";
import { useProfit } from "../../hooks/useProfit";
import "./../../App.css";
import Card from "./Card";
import PaymentStatus from "./PaymentStatus";
import RevenueLineChart from "./RevenueLineChart";
import TodayProductSalesChart from "./TodayProductSalesChart";
import RecentSalesItems from "./RecentSalesItems";

function Dashboard() {
  // Fetch data from API
  const { data: customerdata } = useCustomer();
  const { data: orders } = useInvoice();
  const { data: products } = useProduct();
  const { data: profitData } = useProfit();

  const today = new Date().setHours(0, 0, 0, 0);

  // Filter today's orders
  const todayOrders = Array.isArray(orders)
    ? orders.filter((order) => {
      const orderDate = new Date(order.createdAt?.$date || order.createdAt).setHours(0, 0, 0, 0);
      return orderDate === today;
    })
    : [];

  // Calculate today's revenue
  const todayRevenue = todayOrders.reduce((acc, curr) => acc + (Number(curr?.Subtotal) || 0), 0);

  // Calculate total revenue
  const totalRevenue = Array.isArray(orders)
    ? orders.reduce((acc, curr) => acc + (Number(curr?.Subtotal) || 0), 0)
    : 0;

  return (
    <div className="font ml-14 p-6 min-h-screen bg-gray-50 flex-1">
      {/* Header */}
      <div className="flex justify-between items-start mb-8 mt-1">
        <div>
          <h1 className="text-3xl font-black text-gray-900 tracking-tight">Analytics Dashboard</h1>
          <p className="text-gray-500 font-medium mt-1">Real-time business performance & inventory tracking.</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="font grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card
          title="Today Revenue"
          value={`₹${todayRevenue.toLocaleString()}`}
          color="indigo"
          description="Earning from today's sales"
        />
        <Card
          title="Today Orders"
          value={todayOrders.length}
          color="blue"
          description="Quantity of orders placed today"
        />
        <Card
          title="Today Profit"
          value={`₹${(profitData?.todayProfit || 0).toLocaleString()}`}
          color="teal"
          description="Net earnings after costs"
        />
        <Card
          title="Total Products"
          value={products?.length || 0}
          color="green"
          description="Available in inventory"
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
        <div className="lg:col-span-2">
          <RevenueLineChart orders={orders} />
        </div>
        <div className="col-span-1">
          <TodayProductSalesChart orders={orders} />
        </div>
      </div>

      {/* Data Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pb-10">
        {/* Recent Items Sold (The "Lost/Last Item Table") */}
        <div className="lg:col-span-2">
          <RecentSalesItems orders={orders} />
        </div>

        {/* Payment Status */}
        <div className="lg:col-span-1">
          <PaymentStatus />
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
