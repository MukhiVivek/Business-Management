// ProductPieChart.jsx
import { PieChart } from '@mui/x-charts/PieChart';

const ProductPieChart = ({ products }) => {
  if (!products || products.length === 0) return <p>No data for chart</p>;

  // Group by product_type
  const grouped = products.reduce((acc, product) => {
    const type = product.product_type || "Unknown";
    acc[type] = (acc[type] || 0) + 1;
    return acc;
  }, {});

  // Format for PieChart
  const chartData = Object.entries(grouped).map(([label, value], index) => ({
    id: index,
    value,
    label,
  }));

  return (
    <div className="font font bg-white pt-3 rounded-lg shadow-sm hover:shadow-lg transition-all duration-300">
      <h2 className="text-lg font-semibold mx-12">Product Type Distribution</h2>
      <PieChart
        className='mx-12'
        series={[{ data: chartData }]}
        width={250}
        height={250}
      />
    </div>
  );
};

export default ProductPieChart;