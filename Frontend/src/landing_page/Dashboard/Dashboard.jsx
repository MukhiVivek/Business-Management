import { useProduct } from "../../hooks/useProduct";
import { useCustomer } from "../../hooks/useCustomer";
import { useInvoice } from "../../hooks/useInvoice";
import "./../../App.css";
import Card from "./Card";
import PaymentStatus from "./PaymentStatus";
import OrderChart from "./OrderChart";
import ProductPieChart from "./ProductPieChart";

function Dashboard() {
  // Fetch data from API
  const { data: customerdata } = useCustomer();
  const { data: orders } = useInvoice();
  const { data: products } = useProduct();

  // Calculate total revenue from orders
  const totalRevenue = Array.isArray(orders)
    ? orders.reduce((acc, curr) => acc + (Number(curr?.Subtotal) || 0), 0)
    : 0;

  return (
    <div className="font ml-14 p-6 min-h-screen bg-gray-50">
      {/* Header */}
      <div className="flex justify-between items-start mb-5 mt-1">
        <div>
          <h1 className="text-xl font-semibold text-black">Dashboard</h1>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="font grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        <Card
          title="Total Customers"
          value={customerdata?.length || 0}
          color="indigo"
        />
        <Card title="Total Orders" value={orders?.length || 0} color="blue" />
        <Card
          title="Total Products"
          value={products?.length || 0}
          color="teal"
        />
        <Card
          title="Total Revenue"
          value={`₹${totalRevenue.toLocaleString()}`}
          color="green"
        />
      </div>

      <div className="font grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
        <div className="col-span-1">
          <PaymentStatus />
        </div>

        <div className="col-span-1 md:col-span-1 lg:col-span-2">
          <OrderChart />
        </div>

        {/* Pie Chart Section */}
        <div className="col-span-1">
          <ProductPieChart products={products} />
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
