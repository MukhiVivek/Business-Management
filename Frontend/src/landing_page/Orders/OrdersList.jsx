import React from "react";
import { BACKEND_URL } from "../../Config";

const OrdersList = ({ data }) => {
  // Checks all the row entries
  const handleSelectAll = (e) => {
    const checkboxes = document.querySelectorAll(
      'input[name="customerCheckbox"]'
    );
    checkboxes.forEach((checkbox) => {
      checkbox.checked = e.target.checked;
    });
  };

  function PDF(id) {
    console.log(id);
    window.open(`${BACKEND_URL}/api/v1/invoice/${id}/pdf`, "_blank");
    
  };

  return (
    <div className="orders">
      <table className="w-full border-t text-left rounded-sm">
        <thead className="bg-gray-50 text-center text-gray-500 uppercase text-xs  border-b border-l border-r dark:bg-gray-100">
          <tr>
            <th className="px-2 py-1 pl-2">
              <input
                type="checkbox"
                name="customerCheckbox"
                onChange={handleSelectAll}
              />
            </th>
            <th className="px-4 py-3">Order No</th>
            <th className="px-4 py-3">Date Created</th>
            <th className="px-4 py-3">Customer Name</th>
            <th className="px-4 py-3">Status</th>
            {/* <th className="px-4 py-3">Due Date</th> */}
            <th className="px-4 py-3">Amount</th>
          </tr>
        </thead>
        <tbody className="divide-y border-b border-l border-r text-center whitespace-nowrap">

          {data.map((order) => (
            <tr key={order.id} className="hover:bg-gray-50">
              <td className="px-2 py-1">
                <input type="checkbox" name="customerCheckbox" />
              </td>
              <td
                className="px-4 py-3 text-blue-500 cursor-pointer"
                onClick={PDF.bind(null, order._id)}
              >
                {order.invoice_number}
              </td>
              <td className="px-4 py-3">{new Date(order.createdAt).toLocaleDateString()}</td>
              <td className="px-4 py-3">{order.customer_id.name}</td>
              <td className="px-4 py-3">{order.status}</td>
              {/* <td className="px-4 py-3">{new Date(order.due_date).toLocaleDateString()}</td> */}
              <td className="px-4 py-3">{order.Subtotal}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default OrdersList;
