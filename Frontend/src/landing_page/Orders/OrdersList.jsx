import React, { useState } from "react";
import { BACKEND_URL } from "../../Config";
import DeleteIcon from "../../components/DeleteIcon";
import EditIcon from "../../components/EditIcon";
import { Link } from "react-router-dom";
import PaymentModal from "./PaymentModal";
import { MdOutlinePayments } from "react-icons/md";

const OrdersList = ({ data, refetch }) => {
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

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

  function deleteinvoice(invoice_number, id) {
    let value = window.confirm(
      `Are you sure you want to delete invoice number ${invoice_number}?`
    );
    if (value) {
      fetch(`${BACKEND_URL}/api/v1/invoice/delete/${id}`, {
        method: "GET",
        headers: {
          "token": localStorage.getItem("token")
        }
      })
        .then((response) => response.json())
        .then((data) => {
          console.log("Success:", data);
          refetch();
        })
        .catch((error) => {
          console.error("Error:", error);
        });
    }
  }

  const handleOpenPaymentModal = (order) => {
    setSelectedOrder(order);
    setIsModalOpen(true);
  };

  const handlePaymentSuccess = () => {
    // Optionally trigger a data refetch instead of reload
    refetch();
  };

  return (
    <div className="orders">
      <table className="w-full border-t text-left rounded-sm font">
        <thead className="bg-gray-50 text-center text-gray-500 uppercase text-xs border-b border-l border-r dark:bg-gray-100">
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
            <th className="px-4 py-3">Payment Status</th>
            <th className="px-4 py-3">Amount</th>
            <th className="px-4 py-3 text-center">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y border-b border-l border-r text-center whitespace-nowrap">
          {data.map((order) => (
            <tr key={order._id} className="hover:bg-gray-50">
              <td className="px-2 py-1">
                <input type="checkbox" name="customerCheckbox" />
              </td>
              <td
                className="px-4 py-3 text-blue-500 cursor-pointer font-medium"
                onClick={PDF.bind(null, order._id)}
              >
                {order.invoice_number}
              </td>
              <td className="px-4 py-3">{new Date(order.createdAt).toLocaleDateString()}</td>
              <td className="px-4 py-3">{order.customer_id?.name || "N/A"}</td>
              <td className="px-4 py-3">
                <span className={`px-2 py-1 rounded-full text-xs font-semibold ${order.status === "Paid" ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"
                  }`}>
                  {order.status}
                </span>
              </td>
              <td className="px-4 py-3">₹{order.Subtotal?.toLocaleString()}</td>
              <td className="py-3 px-4 flex justify-center items-center gap-3">
                {order.status !== "Paid" && (
                  <button
                    onClick={() => handleOpenPaymentModal(order)}
                    className="text-green-500 hover:text-green-700 transition-colors"
                    title="Record Payment"
                  >
                    <MdOutlinePayments size={20} />
                  </button>
                )}
                <Link
                  to={`/invoice/edit/${order._id}`}
                  className="text-blue-500 hover:text-blue-700 transition-colors"
                  title="Edit Invoice"
                >
                  <EditIcon />
                </Link>
                <button
                  className="text-red-500 hover:text-red-700 transition-colors"
                  onClick={deleteinvoice.bind(null, order.invoice_number, order._id)}
                  title="Delete Invoice"
                >
                  <DeleteIcon />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {isModalOpen && (
        <PaymentModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          order={selectedOrder}
          onPaymentSuccess={handlePaymentSuccess}
        />
      )}
    </div>
  );
};

export default OrdersList;
