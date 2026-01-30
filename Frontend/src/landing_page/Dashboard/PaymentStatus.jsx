// PaymentStatus.jsx
import { useCustomer } from "../../hooks/useCustomer";

const PaymentStatus = () => {
  const { data } = useCustomer();

  const paymentData = data.map((customer) => ({
    name: customer.name || "---",
    balance: customer.balance || 0,
    status: (customer.balance || 0) < 0 ? "Owes" : "Clear",
  }));

  return (
    <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300 h-full">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-bold text-gray-800">Customer Balances</h3>
        <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">Top 5</span>
      </div>

      <div className="space-y-4">
        {paymentData.slice(0, 5).map((item, idx) => (
          <div key={idx} className="flex justify-between items-center p-3 rounded-2xl bg-gray-50/50 hover:bg-gray-50 transition-colors">
            <div className="flex flex-col">
              <span className="text-sm font-bold text-gray-800">{item.name}</span>
              <span className={`text-[10px] font-bold uppercase tracking-tighter ${item.status === 'Clear' ? 'text-green-500' : 'text-orange-500'}`}>
                {item.status}
              </span>
            </div>
            <div className="text-right">
              <span className={`text-sm font-black ${item.balance < 0 ? 'text-orange-600' : 'text-green-600'}`}>
                ₹{Math.abs(item.balance).toLocaleString()}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PaymentStatus;
