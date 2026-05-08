import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaWhatsapp } from "react-icons/fa";
import { BACKEND_URL } from "../../Config";

const OrderToInvoiceList = ({ data, refetch }) => {
  const navigate = useNavigate();
  const [sharingOrderId, setSharingOrderId] = useState(null);

  const handleSelectAll = (e) => {
    const checkboxes = document.querySelectorAll(
      'input[name="customerCheckbox"]'
    );
    checkboxes.forEach((checkbox) => {
      checkbox.checked = e.target.checked;
    });
  };

  const sendWhatsApp = async (order) => {
    const phone = order.customerPhone || order.customer_id?.phone_number;
    if (!phone) {
      alert("No phone number found for this customer.");
      return;
    }

    const cleanPhone = String(phone).replace(/\D/g, "");
    const pdfUrl = `${BACKEND_URL}/api/v1/invoice/${order._id}/pdf`;
    const message = `Hello ${order.customerName || order.customer_id?.name || "Customer"},\n\nWe have received your order #${order.invoice_number}.\nTotal Amount: \u20b9${(order.subtotal || order.total)?.toLocaleString()}\nStatus: ${order.status || 'pending'}\n\nThank you for choosing us!`;

    setSharingOrderId(order._id);
    try {
      // Fetch PDF as blob
      const response = await fetch(pdfUrl);
      const blob = await response.blob();
      const file = new File([blob], `Order_${order.invoice_number}.pdf`, { type: "application/pdf" });

      // Try Web Share API (works on mobile browsers)
      if (navigator.canShare && navigator.canShare({ files: [file] })) {
        await navigator.share({
          title: `Order #${order.invoice_number}`,
          text: message,
          files: [file],
        });
      } else {
        // Desktop fallback: download PDF + open WhatsApp with message
        const blobUrl = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = blobUrl;
        a.download = `Order_${order.invoice_number}.pdf`;
        a.click();
        URL.revokeObjectURL(blobUrl);

        const encodedMessage = encodeURIComponent(message + `\n\n(Invoice PDF downloaded to your device - please attach it manually)`);
        setTimeout(() => {
          window.open(`https://wa.me/${cleanPhone}?text=${encodedMessage}`, "_blank");
        }, 500);
      }
    } catch (err) {
      console.error("WhatsApp share failed:", err);
      // Final fallback: just open WhatsApp with text
      const encodedMessage = encodeURIComponent(message + `\n\nDownload Invoice: ${pdfUrl}`);
      window.open(`https://wa.me/${cleanPhone}?text=${encodedMessage}`, "_blank");
    } finally {
      setSharingOrderId(null);
    }
  };

  const handleConvert = (order) => {
    const customer = order.customer_id || {
      name: order.customerName || "",
      phone_number: order.customerPhone || "",
      customer_billing_address: ""
    };

    const prefillData = {
      customer: customer,
      items: order.items.map((item, index) => ({
        id: index + 1,
        name: item.name,
        qty: item.qty,
        price: item.price,
        product_id: item.product_id
      })),
      subtotal: order.subtotal || order.total
    };

    navigate("/invoice", { state: { prefillData } });
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
            <th className="px-4 py-3">Total Amount</th>
            <th className="px-4 py-3">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y border-b border-l border-r text-center whitespace-nowrap">
          {data.map((order) => (
            <tr key={order._id} className="hover:bg-gray-50">
              <td className="px-2 py-1">
                <input type="checkbox" name="customerCheckbox" />
              </td>
              <td
                className="px-4 py-3 font-medium text-blue-600"
              >
                {order.invoice_number}
              </td>
              <td className="px-4 py-3">{new Date(order.createdAt).toLocaleDateString()}</td>
              <td className="px-4 py-3">{order.customerName || order.customer_id?.name || "N/A"}</td>
              <td className="px-4 py-3">
                <span className={`px-2 py-1 rounded-full text-xs font-semibold ${order.status === "paid" ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"
                  }`}>
                  {order.status || 'pending'}
                </span>
              </td>
              <td className="px-4 py-3">₹{order.total?.toLocaleString() || order.subtotal?.toLocaleString()}</td>
              <td className="py-3 px-4 flex justify-center items-center gap-3">
                <button
                  onClick={() => sendWhatsApp(order)}
                  disabled={sharingOrderId === order._id}
                  className="text-green-600 hover:text-green-800 transition-colors disabled:opacity-50 disabled:cursor-wait"
                  title="Send via WhatsApp"
                >
                  {sharingOrderId === order._id ? (
                    <svg className="animate-spin h-5 w-5 text-green-600" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                    </svg>
                  ) : (
                    <FaWhatsapp size={20} />
                  )}
                </button>
                <button
                  onClick={() => handleConvert(order)}
                  className="bg-blue-600 text-white px-3 py-1.5 rounded-md text-xs font-bold hover:bg-blue-700 transition"
                >
                  Convert to Invoice
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default OrderToInvoiceList;
