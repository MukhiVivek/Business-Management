import React from "react";
import DeleteIcon from "../../components/DeleteIcon";
import { BACKEND_URL } from "../../Config";

const PaymentList = ({ data, refetch }) => {
  const deletePayment = (id) => {
    if (window.confirm("Are you sure you want to delete this payment record?")) {
      fetch(`${BACKEND_URL}/api/v1/payment/delete/${id}`, {
        method: "GET",
        headers: {
          token: localStorage.getItem("token"),
        },
      })
        .then((res) => res.json())
        .then(() => {
          refetch();
        })
        .catch((err) => console.error(err));
    }
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left border-collapse">
        <thead className="bg-gray-50 text-gray-500 uppercase text-xs font-semibold">
          <tr>
            <th className="px-6 py-4">Status</th>
            <th className="px-6 py-4">Date</th>
            <th className="px-6 py-4">Method</th>
            <th className="px-6 py-4">Description</th>
            <th className="px-6 py-4">Amount</th>
            <th className="px-6 py-4 text-center">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100 whitespace-nowrap">
          {data.map((payment) => (
            <tr key={payment._id} className="hover:bg-gray-50 transition-colors">
              <td className="px-6 py-4">
                <span className={`px-2 py-1 rounded-full text-xs font-semibold ${payment.status === "Completed" ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-700"
                  }`}>
                  {payment.status || "Completed"}
                </span>
              </td>
              <td className="px-6 py-4 text-sm text-gray-600">
                {new Date(payment.createdAt).toLocaleDateString()}
              </td>
              <td className="px-6 py-4 text-sm font-medium text-gray-700 uppercase">
                {payment.payment_method}
              </td>
              <td className="px-6 py-4 text-sm text-gray-500 max-w-xs truncate">
                {payment.description || "N/A"}
              </td>
              <td className="px-6 py-4 text-sm font-bold text-gray-900">
                ₹{Number(payment.amount).toLocaleString()}
              </td>
              <td className="px-6 py-4 text-center">
                <button
                  onClick={() => deletePayment(payment._id)}
                  className="text-red-500 hover:text-red-700 transition-colors"
                  title="Delete Payment"
                >
                  <DeleteIcon />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default PaymentList;
