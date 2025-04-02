import React, { useState } from "react";
import './../../App.css';

const Invoice = () => {
  const [items, setItems] = useState([{ id: 1, name: "", qty: 1, price: 0 }]);
  const [invoiceNo, setInvoiceNo] = useState(71);
  const [invoiceDate, setInvoiceDate] = useState("2025-04-02");

  const handleItemChange = (id, field, value) => {
    const updatedItems = items.map((item) =>
      item.id === id ? { ...item, [field]: value } : item
    );
    setItems(updatedItems);
  };

  const addItem = () => {
    setItems([...items, { id: items.length + 1, name: "", qty: 1, price: 0 }]);
  };

  const removeItem = (id) => {
    setItems(items.filter((item) => item.id !== id));
  };

  const calculateSubtotal = () =>
    items.reduce((sum, item) => sum + item.qty * item.price, 0);

  return (
    <div className="flex-1">
        <div className="invoice p-1 m-2 rounded-2xl ml-64 md:ml-64 min-h-screen w-full max-w-13xl">
                <div className="flex min-h-screen">
            <div className="w-full max-w-10xl mx-auto pl-20 p-6">
                <div className="bg-white shadow-lg rounded-lg overflow-hidden">
                {/* Header */}
                <div className="bg-gray-800 text-white p-5">
                    <h1 className="text-2xl font-bold">Invoice</h1>
                    <p className="text-indigo-100">Your Business Name</p>
                </div>

                {/* Client Informationn */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 border-b border-gray-200">
                    <div className="space-y-3">
                    <h2 className="text-lg font-semibold text-gray-800 border-b border-gray-200 pb-2">Bill To</h2>
                    <input
                        type="text"
                        placeholder="Customer Name"
                        className="border border-gray-300 p-2 w-full rounded-md focus:outline-none focus:ring-2 focus:ring-gray-800 focus:border-transparent transition"
                    />
                    <input
                        type="text"
                        placeholder="Phone Number"
                        className="border border-gray-300 p-2 w-full rounded-md focus:outline-none focus:ring-2 focus:ring-gray-800 focus:border-transparent transition"
                    />
                    </div>
                    <div className="space-y-3">
                    <h2 className="text-lg font-semibold text-gray-800 border-b border-gray-200 pb-2">Ship To</h2>
                    <input
                        type="text"
                        placeholder="Customer Name"
                        className="border border-gray-300 p-2 w-full rounded-md focus:outline-none focus:ring-2 focus:ring-gray-800 focus:border-transparent transition"
                    />
                    <input
                        type="text"
                        placeholder="Phone Number"
                        className="border border-gray-300 p-2 w-full rounded-md focus:outline-none focus:ring-2 focus:ring-gray-800 focus:border-transparent transition"
                    />
                    </div>
                </div>

                {/* Invoice Details */}
                <div className="flex flex-col md:flex-row justify-between p-6 border-b border-gray-200">
                    <div className="flex items-center mb-4 md:mb-0">
                    <label className="font-semibold text-gray-700 mr-2">Invoice No:</label>
                    <input
                        type="number"
                        value={invoiceNo}
                        onChange={(e) => setInvoiceNo(e.target.value)}
                        className="border border-gray-300 p-2 rounded-md w-20 focus:outline-none focus:ring-2 focus:ring-gray-800 focus:border-transparent transition"
                    />
                    </div>
                    <div className="flex items-center">
                    <label className="font-semibold text-gray-700 mr-2">Invoice Date:</label>
                    <input
                        type="date"
                        value={invoiceDate}
                        onChange={(e) => setInvoiceDate(e.target.value)}
                        className="border border-gray-300 p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-800 focus:border-transparent transition"
                    />
                    </div>
                </div>

                {/* Items Table */}
                <div className="p-6">
                    <div className="overflow-x-auto">
                    <table className="w-full border-collapse rounded-md ">
                        <thead>
                        <tr className="bg-gray-100 text-gray-800">
                            <th className="p-3 border-b border-indigo-100 text-left w-12">#</th>
                            <th className="p-3 border-b border-indigo-100 text-left">Items</th>
                            <th className="p-3 border-b border-indigo-100 text-center w-20">QTY</th>
                            <th className="p-3 border-b border-indigo-100 text-right w-33">Price/Item (₹)</th>
                            <th className="p-3 border-b border-indigo-100 text-right w-32">Amount (₹)</th>
                            <th className="p-3 border-b border-indigo-100 w-16"></th>
                        </tr>
                        </thead>
                        <tbody>
                        {items.map((item, index) => (
                            <tr key={item.id} className="border-b border-gray-100 hover:bg-gray-50">
                            <td className="p-3 text-gray-600">{index + 1}</td>
                            <td className="p-3">
                                <input
                                type="text"
                                placeholder="Item Name"
                                value={item.name}
                                onChange={(e) =>
                                    handleItemChange(item.id, "name", e.target.value)
                                }
                                className="border border-gray-300 p-2 w-full rounded-md focus:outline-none focus:ring-2 focus:ring-gray-800 focus:border-transparent transition"
                                />
                            </td>
                            <td className="p-3">
                                <input
                                type="number"
                                min="1"
                                value={item.qty}
                                onChange={(e) =>
                                    handleItemChange(item.id, "qty", Number(e.target.value))
                                }
                                className="border border-gray-300 p-2 w-16 rounded-md text-center focus:outline-none focus:ring-2 focus:ring-gray-800 focus:border-transparent transition"
                                />
                            </td>
                            <td className="p-3">
                                <input
                                type="number"
                                min="0"
                                value={item.price}
                                onChange={(e) =>
                                    handleItemChange(item.id, "price", Number(e.target.value))
                                }
                                className="border border-gray-300 p-2 w-24 rounded-md text-right focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
                                />
                            </td>
                            <div className="flex p-2 border border-gray-300 w-27 rounded-lg ml-6 mt-3">
                                <td>
                                     ₹ {(item.qty * item.price).toFixed(2)}
                                </td>
                            </div>
                            <td className="p-3 text-center">
                                {items.length > 1 && (
                                <button
                                    onClick={() => removeItem(item.id)}
                                    className="text-gray-500 hover:text-gray-700 focus:outline-none"
                                    aria-label="Remove item"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                                    </svg>
                                </button>
                                )}
                            </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                    </div>

                    <button
                    onClick={addItem}
                    className="mt-4 flex items-center text-gray-600 hover:text-gray-800 focus:outline-none transition"
                    >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
                    </svg>
                    Add Item
                    </button>
                </div>

                {/* Total */}
                <div className="bg-gray-50 p-6 border-t border-gray-200">
                    <div className="flex justify-between items-center">
                    <h3 className="text-lg font-semibold text-gray-800">Subtotal:</h3>
                    <h3 className="text-xl font-bold text-gray-700">₹ {calculateSubtotal().toFixed(2)}</h3>
                    </div>
                </div>

                {/* Download Button */}
                <div className="text-center p-6 bg-gray-50 border-gray-200">
                    <button className="bg-gray-800 text-white px-8 py-3 rounded-md hover:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition shadow-md">
                    Download Invoice
                    </button>
                </div>
                </div>
            </div>
            </div>
        </div>
    </div>
  );
};

export default Invoice;