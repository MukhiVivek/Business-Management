import React, { useState, useEffect } from "react";
import { BACKEND_URL } from "../../Config";
import DeleteIcon from "../../components/DeleteIcon";
import EditIcon from "../../components/EditIcon";
import { Link } from "react-router-dom";
import PaymentModal from "./PaymentModal";
import { MdOutlinePayments } from "react-icons/md";
import { FaWhatsapp } from "react-icons/fa";

const OrdersList = ({ data, refetch, onSelectionChange }) => {
  const [selectedIds, setSelectedIds] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [sharingOrderId, setSharingOrderId] = useState(null);

  // Notify parent when selection changes
  useEffect(() => {
    if (onSelectionChange) onSelectionChange(selectedIds);
  }, [selectedIds, onSelectionChange]);

  // Reset selection when data changes (e.g. page change)
  useEffect(() => {
    setSelectedIds([]);
  }, [data]);

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedIds(data.map((order) => order._id));
    } else {
      setSelectedIds([]);
    }
  };

  const handleToggle = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const allChecked = data.length > 0 && selectedIds.length === data.length;
  const someChecked = selectedIds.length > 0 && selectedIds.length < data.length;

  function PDF(id) {
    window.open(`${BACKEND_URL}/api/v1/invoice/${id}/pdf`, "_blank");
  }

  const sendWhatsApp = async (order) => {
    const phone = order.customer_id?.phone_number;
    if (!phone) {
      alert("No phone number found for this customer.");
      return;
    }

    const cleanPhone = String(phone).replace(/\D/g, "");
    const pdfUrl = `${BACKEND_URL}/api/v1/invoice/${order._id}/pdf`;
    const message = `Hello ${order.customer_id?.name || "Customer"},\n\nYour invoice #${order.invoice_number} is ready.\nTotal Amount: \u20b9${order.Subtotal?.toLocaleString()}\nStatus: ${order.status}\n\nThank you for your business!`;

    setSharingOrderId(order._id);
    try {
      const response = await fetch(pdfUrl);
      const blob = await response.blob();
      const file = new File([blob], `Invoice_${order.invoice_number}.pdf`, { type: "application/pdf" });

      if (navigator.canShare && navigator.canShare({ files: [file] })) {
        await navigator.share({
          title: `Invoice #${order.invoice_number}`,
          text: message,
          files: [file],
        });
      } else {
        const blobUrl = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = blobUrl;
        a.download = `Invoice_${order.invoice_number}.pdf`;
        a.click();
        URL.revokeObjectURL(blobUrl);

        const encodedMessage = encodeURIComponent(
          message + `\n\n(Invoice PDF downloaded to your device - please attach it manually)`
        );
        setTimeout(() => {
          window.open(`https://wa.me/${cleanPhone}?text=${encodedMessage}`, "_blank");
        }, 500);
      }
    } catch (err) {
      console.error("WhatsApp share failed:", err);
      const encodedMessage = encodeURIComponent(message + `\n\nDownload Invoice: ${pdfUrl}`);
      window.open(`https://wa.me/${cleanPhone}?text=${encodedMessage}`, "_blank");
    } finally {
      setSharingOrderId(null);
    }
  };

  function deleteinvoice(invoice_number, id) {
    let value = window.confirm(
      `Are you sure you want to delete invoice number ${invoice_number}?`
    );
    if (value) {
      fetch(`${BACKEND_URL}/api/v1/invoice/delete/${id}`, {
        method: "GET",
        headers: {
          token: localStorage.getItem("token"),
        },
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
                checked={allChecked}
                ref={(el) => {
                  if (el) el.indeterminate = someChecked;
                }}
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
            <tr
              key={order._id}
              className={`hover:bg-gray-50 ${selectedIds.includes(order._id) ? "bg-blue-50" : ""
                }`}
            >
              <td className="px-2 py-1">
                <input
                  type="checkbox"
                  name="customerCheckbox"
                  checked={selectedIds.includes(order._id)}
                  onChange={() => handleToggle(order._id)}
                />
              </td>
              <td
                className="px-4 py-3 text-blue-500 cursor-pointer font-medium"
                onClick={PDF.bind(null, order._id)}
              >
                {order.invoice_number}
              </td>
              <td className="px-4 py-3">
                {new Date(order.createdAt).toLocaleDateString()}
              </td>
              <td className="px-4 py-3">{order.customer_id?.name || "N/A"}</td>
              <td className="px-4 py-3">
                <span
                  className={`px-2 py-1 rounded-full text-xs font-semibold ${order.status === "Paid"
                    ? "bg-green-100 text-green-700"
                    : "bg-yellow-100 text-yellow-700"
                    }`}
                >
                  {order.status}
                </span>
              </td>
              <td className="px-4 py-3">{order.Subtotal?.toLocaleString()}</td>
              <td className="py-3 px-4 flex justify-center items-center gap-3">
                <button
                  onClick={() => sendWhatsApp(order)}
                  disabled={sharingOrderId === order._id}
                  className="text-green-600 hover:text-green-800 transition-colors disabled:opacity-50 disabled:cursor-wait"
                  title="Send via WhatsApp"
                >
                  {sharingOrderId === order._id ? (
                    <svg
                      className="animate-spin h-5 w-5 text-green-600"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8v8H4z"
                      />
                    </svg>
                  ) : (
                    <FaWhatsapp size={20} />
                  )}
                </button>
                {order.status !== "Paid" && (
                  <button
                    onClick={() => handleOpenPaymentModal(order)}
                    className="text-blue-500 hover:text-blue-700 transition-colors"
                    title="Record Payment"
                  >
                    <MdOutlinePayments size={20} />
                  </button>
                )}
                <Link
                  to={`/invoice/edit/${order._id}`}
                  className="text-indigo-500 hover:text-indigo-700 transition-colors"
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
