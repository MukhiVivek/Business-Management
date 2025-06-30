// PaymentStatus.jsx
import { useCustomer } from "../../hooks/useCustomer";

const PaymentStatus = () => {
  const { data } = useCustomer();

  const paymentData = data.map((customer) => ({
    "customer name": customer.name || "---",
    amount: customer.amount || 0,
    paid: customer.paid ? "Yes" : "No",
  }));

  return (
    <div className="font bg-white p-4 rounded-lg shadow-sm hover:shadow-lg transition-all duration-300">
      <h3 className="text-md font-semibold text-black mb-3">Payment Status</h3>
      <table className="w-full text-sm text-left">
        <thead className="bg-gray-50 text-gray-500 uppercase text-xs">
          <tr>
            <th className="px-3 py-2">Customer Name</th>
            <th className="px-3 py-2">Amount</th>
            <th className="px-3 py-2">Status</th>
          </tr>
        </thead>
        <tbody>
          {paymentData.slice(0, 5).map((item, idx) => (
            <tr key={idx} className="hover:bg-gray-50">
              <td className="px-3 py-2">{item["customer name"]}</td>
              <td className="px-3 py-2">{item.amount}</td>
              <td className="px-3 py-2">{item.paid}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default PaymentStatus;
