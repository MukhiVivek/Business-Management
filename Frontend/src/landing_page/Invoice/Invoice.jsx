import React, { useEffect, useState } from "react";
import "./../../App.css";
import Modal from "./Modal";
import CustomerSelector from "./CustomerSelector";
import { useCustomer } from "../../hooks/useCustomer";
import { useProduct } from "../../hooks/useProduct";
import axios from "axios";
import { BACKEND_URL } from "../../Config";
import { useParams, useNavigate } from "react-router-dom";

const Invoice = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = !!id;

  const handleCreateInvoice = async (data) => {
    try {
      window.open(`${BACKEND_URL}/api/v1/invoice/${data.data.id}/pdf`, "_blank");
    } catch (error) {
      console.error('Error creating invoice:', error);
    }
  };

  // state management for customer popup
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState(null);

  // customer function
  const handleCustomerClick = (customer) => {
    setSelectedCustomer(customer);
    setIsPopupOpen(false);
  };

  const [items, setItems] = useState([{ id: 1, name: "", qty: 1, price: 0, sgst: 0, cgst: 0, igst: 0, taxprice: 0, tprice: 0, product_id: null }]);
  const [invoiceNo, setInvoiceNo] = useState(0 | selectedCustomer?.invoice);
  const [invoiceDate, setInvoiceDate] = useState(
    new Date().toISOString().slice(0, 10)
  );
  const [Subtotal, setSubtotal] = useState(0);
  const [activeItemId, setActiveItemId] = useState(null);
  const [filteredProducts, setFilteredProducts] = useState([]);

  const { data: customerdata } = useCustomer();
  const { data: products } = useProduct();

  useEffect(() => {
    if (isEditMode) {
      const fetchInvoice = async () => {
        try {
          const res = await axios.get(`${BACKEND_URL}/api/v1/invoice/${id}`, {
            headers: {
              token: localStorage.getItem("token")
            }
          });
          const data = res.data.data;
          setInvoiceNo(data.invoice_number);
          setInvoiceDate(new Date(data.invoice_date).toISOString().slice(0, 10));
          setSelectedCustomer(data.customer_id);
          setItems(data.items.map(item => ({
            ...item,
            id: item.id || Math.random() // Ensure we have a unique ID for React keys
          })));
          setSubtotal(data.Subtotal);
        } catch (error) {
          console.error("Error fetching invoice:", error);
          alert("Failed to fetch invoice data");
        }
      };
      fetchInvoice();
    } else {
      const fetchNextInvoiceNumber = async () => {
        try {
          const token = localStorage.getItem("token");
          if (!token) return;
          const res = await axios.get(`${BACKEND_URL}/api/v1/invoice/next-number`, {
            headers: { token }
          });
          if (res.data && res.data.nextNumber !== undefined) {
            setInvoiceNo(res.data.nextNumber);
          }
        } catch (error) {
          console.error("Error fetching next invoice number:", error);
        }
      };
      fetchNextInvoiceNumber();
    }
  }, [id, isEditMode]);

  const handleSelectProduct = (id, product) => {
    const updatedItems = items.map((item) => {
      if (item.id === id) {
        // Assume SGST + CGST for now (50/50 split) if it's not 0
        const tax = product.gst_tax_rate || 0;
        const halfTax = tax / 2;
        const qty = item.qty || 1;
        const basicPrice = Number((product.price / (1 + (tax / 100))).toFixed(2));
        const taxAmountPerUnit = product.price - basicPrice;

        return {
          ...item,
          product_id: product._id,
          name: product.name,
          price: basicPrice,
          sgst: halfTax,
          cgst: halfTax,
          igst: 0,
          taxprice: item.tprice,
          tprice: product.price || 0,
        };
      }
      return item;
    });
    setItems(updatedItems);
    setActiveItemId(null);
  };

  const handleItemChange = (id, field, value) => {
    if (field === "name") {
      setActiveItemId(id);
      if (value.trim() === "") {
        setFilteredProducts([]);
      } else {
        const filtered = products.filter((p) =>
          p.name.toLowerCase().includes(value.toLowerCase())
        );
        setFilteredProducts(filtered);
      }
    }

    const updatedItems = items.map((item) => {
      if (item.id === id) {
        const updatedItem = { ...item, [field]: value };

        // Recalculate price if tprice changes
        if (field === "tprice") {
          const totalTaxRate =
            Number(updatedItem.sgst || 0) +
            Number(updatedItem.cgst || 0) +
            Number(updatedItem.igst || 0);
          const price = value / (1 + totalTaxRate / 100);
          updatedItem.price = Number(price.toFixed(2));
        }

        // Always recalculate taxprice
        const currentQty = Number(updatedItem.qty || 0);
        const currentPrice = Number(updatedItem.price || 0);
        const currentTaxRate =
          Number(updatedItem.sgst || 0) +
          Number(updatedItem.cgst || 0) +
          Number(updatedItem.igst || 0);

        updatedItem.taxprice = Number((currentQty * currentPrice * currentTaxRate / 100).toFixed(2));

        if (field === "price") {
          updatedItem.price = Number(Number(value).toFixed(2));
          // Recalculate tprice (price + tax)
          updatedItem.tprice = Number((currentPrice * (1 + currentTaxRate / 100)).toFixed(2));
        }

        return updatedItem;
      }
      return item;
    });
    setItems(updatedItems);
  };

  const addItem = () => {
    setItems([...items, { id: items.length + 1, name: "", qty: 1, price: 0, sgst: 0, cgst: 0, igst: 0, taxprice: 0, tprice: 0, product_id: null }]);
  };

  const removeItem = (id) => {
    setItems(items.filter((item) => item.id !== id));
  };

  useEffect(() => {
    const calculateSubtotal = (items) => {
      setSubtotal(
        items.reduce((sum, item) => {
          const qty = Number(item.qty);
          const price = Number(item.price);
          const sgst = Number(item.sgst);
          const cgst = Number(item.cgst);
          const igst = Number(item.igst);
          const gstprice = price + (price * (sgst + cgst + igst) / 100);
          return sum + qty * gstprice;
        }, 0)
      );
    };
    calculateSubtotal(items);
  }, [items]);

  useEffect(() => {
    const handleKeyDown = (event) => {
      // Shortcut for Add Item: Command + 9 (Mac) or Ctrl + 9 (Windows/Linux)
      if ((event.metaKey || event.ctrlKey) && event.key === '9') {
        event.preventDefault();
        addItem();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [addItem]);

  const submit = async () => {
    try {
      const url = isEditMode
        ? `${BACKEND_URL}/api/v1/invoice/update/${id}`
        : `${BACKEND_URL}/api/v1/invoice/add`;

      const method = isEditMode ? 'put' : 'post';

      const res = await axios[method](
        url,
        {
          invoice_number: invoiceNo,
          invoice_date: invoiceDate,
          customer_id: selectedCustomer?._id,
          Subtotal: Subtotal,
          items: items,
        },
        {
          headers: {
            token: localStorage.getItem("token"),
          },
        }
      );

      console.log("Invoice Response:", res.data);
      alert(isEditMode ? "Invoice Successfully Updated" : "Invoice Successfully Added");

      if (isEditMode) {
        navigate("/orders");
      } else {
        handleCreateInvoice(res);
      }
    } catch (error) {
      console.error("Error submitting invoice:", error);
      alert(error.response?.data?.message || "Failed to submit invoice");
    }
  };


  return (
    <div className=" invoice pl-12 min-h-screen w-full mx-auto">
      <div className="flex min-h-screen">
        <div className="w-full mx-auto ">
          <div className="bg-white overflow-hidden">
            {/* Client Informationn */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6  border-b border-gray-200">
              <div className="space-y-3 p-6 border-r-1 border-gray-200">
                <div className="text-lg flex justify-between font-semibold text-gray-800 border-b border-gray-200 pb-2">
                  <h2 className=" ">Bill To</h2>
                  {/* Search Customer Button here */}
                  <button
                    type="button"
                    onClick={() => setIsPopupOpen(true)}
                    className="rounded-md  justify-end text-sm px-2 ml-1 pml-2 cursor-pointer bg-blue-600 hover:bg-blue-800 text-white"
                  >
                    Select Customer
                  </button>
                </div>
                <h4 className="text-sm">
                  Customer : <b>{selectedCustomer?.name} </b>{" "}
                </h4>

                {isPopupOpen && (
                  <Modal onClose={() => setIsPopupOpen(false)} title="Select Customer">
                    <CustomerSelector
                      onSelect={handleCustomerClick}
                      customerData={customerdata}
                    />
                  </Modal>
                )}
              </div>
              <div className="space-y-3 p-6 border-r-1 border-gray-200">
                <h2 className="text-lg font-semibold text-gray-800 border-b border-gray-200 pb-2">
                  Ship To
                </h2>
                <h5 className="text-sm">
                  Phone Name : <b> {selectedCustomer?.phone_number} </b>
                </h5>
                <h5 className="text-sm">
                  Address :{" "}
                  <b>
                    {selectedCustomer &&
                      selectedCustomer?.customer_billing_address
                        ?.street_addres &&
                      selectedCustomer?.customer_billing_address
                        ?.street_addres +
                      " , " +
                      selectedCustomer?.customer_billing_address?.area +
                      " , " +
                      selectedCustomer?.customer_billing_address?.city +
                      " , " +
                      selectedCustomer?.customer_billing_address?.state +
                      "-" +
                      selectedCustomer?.customer_billing_address
                        ?.pincode}{" "}
                  </b>
                </h5>
              </div>

              {/* Invoice Details */}
              <div className="flex  md:flex-col justify-between p-6 border-b border-gray-200">
                <div className="flex items-center mb-4 md:mb-0">
                  <label className="font-semibold text-gray-700 mr-2">
                    Invoice No:
                  </label>
                  <input
                    type="number"
                    value={invoiceNo}
                    onChange={(e) => setInvoiceNo(Number(e.target.value))}
                    className="border border-gray-300 p-2 rounded-md w-24 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                  />
                </div>
                <div className="flex items-center">
                  <label className="font-semibold text-gray-700 mr-2">
                    Invoice Date:
                  </label>
                  <input
                    type="date"
                    value={invoiceDate}
                    onChange={(e) => setInvoiceDate(e.target.value)}
                    className="border border-gray-300 p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-800 focus:border-transparent transition"
                  />
                </div>
              </div>
            </div>

            {/* Items Table */}
            <div className="p-6">
              <div className="">
                <table className="w-full border-collapse rounded-md ">
                  <thead>
                    <tr className="bg-gray-100 text-gray-800">
                      <th className="p-3 border-b border-indigo-100 text-left w-12">
                        #
                      </th>
                      <th className="p-3 border-b border-indigo-100 text-left">
                        Items
                      </th>
                      <th className="p-3 border-b border-indigo-100 text-center w-20">
                        QTY
                      </th>
                      <th className="p-3 border-b border-indigo-100 text-right w-33">
                        Price/Item
                      </th>
                      <th className="p-2 border-b border-indigo-100 text-right w-32">
                        SGST
                      </th>
                      <th className="p-2 border-b border-indigo-100 text-right w-32">
                        CGST
                      </th>
                      <th className="p-2 border-b border-indigo-100 text-right w-32">
                        IGST
                      </th>
                      <th className="p-3 border-b border-indigo-100 text-right w-32">
                        T.Price
                      </th>
                      <th className="p-3 border-b border-indigo-100 text-right w-32">
                        Amount
                      </th>
                      <th className="p-3 border-b border-indigo-100 text-right w-32">
                        Tax Price(₹)
                      </th>
                      <th className="p-3 border-b border-indigo-100 w-16"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {items.map((item, index) => (
                      <tr
                        key={item.id}
                        className="border-b border-gray-100 hover:bg-gray-50"
                      >
                        <td className="p-3 text-gray-600">{index + 1}</td>
                        <td className="p-3 relative">
                          <input
                            type="text"
                            placeholder="Item Name"
                            value={item.name}
                            onChange={(e) =>
                              handleItemChange(item.id, "name", e.target.value)
                            }
                            onBlur={() => setTimeout(() => setActiveItemId(null), 200)}
                            className="border border-gray-300 p-2 w-sm rounded-md focus:outline-none focus:ring-2 focus:ring-gray-800 focus:border-transparent transition"
                          />
                          {activeItemId === item.id && filteredProducts.length > 0 && (
                            <ul className="absolute z-50 w-full left-0 bg-white border border-gray-300 rounded-md mt-1 max-h-60 overflow-y-auto shadow-2xl">
                              {filteredProducts.map((p) => (
                                <li
                                  key={p._id}
                                  onClick={() => handleSelectProduct(item.id, p)}
                                  className="p-3 hover:bg-gray-100 cursor-pointer border-b last:border-0 flex justify-between"
                                >
                                  <span className="font-medium">{p.name}</span>
                                  <span className="text-gray-500 text-sm">₹{p.price}</span>
                                </li>
                              ))}
                            </ul>
                          )}
                        </td>
                        <td className="p-3">
                          <input
                            type="number"
                            min="1"
                            value={item.qty}
                            onChange={(e) =>
                              handleItemChange(
                                item.id,
                                "qty",
                                Number(e.target.value)
                              )
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
                              handleItemChange(
                                item.id,
                                "price",
                                Number(e.target.value)
                              )
                            }
                            className="border border-gray-300 p-2 w-16 rounded-md text-right focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
                          />
                        </td>
                        <td>
                          <input
                            type="number"
                            min="0"
                            value={item.sgst}
                            onChange={(e) =>
                              handleItemChange(
                                item.id,
                                "sgst",
                                Number(e.target.value)
                              )
                            }
                            className="border border-gray-300 p-2 w-16 rounded-md text-right focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
                          />
                        </td>
                        <td>
                          <input
                            type="number"
                            min="0"
                            value={item.cgst}
                            onChange={(e) =>
                              handleItemChange(
                                item.id,
                                "cgst",
                                Number(e.target.value)
                              )
                            }
                            className="border border-gray-300 p-2 w-16 rounded-md text-right focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
                          />
                        </td>
                        <td>
                          <input
                            type="number"
                            min="0"
                            value={item.igst}
                            onChange={(e) =>
                              handleItemChange(
                                item.id,
                                "igst",
                                Number(e.target.value)
                              )
                            }
                            className="border border-gray-300 p-2 w-16 rounded-md text-right focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
                          />
                        </td>
                        <td>
                          <input
                            type="number"
                            min="0"
                            value={item.tprice}
                            onChange={(e) =>
                              handleItemChange(
                                item.id,
                                "tprice",
                                Number(e.target.value)
                              )
                            }
                            className="border border-gray-300 p-2 w-16 rounded-md text-right focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
                          />
                        </td>
                        <td>
                          <div className="flex p-2 border border-gray-300 w-27 rounded-lg ml-6">
                            ₹ {(item.qty * item.price).toFixed(2)}
                          </div>
                        </td>
                        <td>
                          <div className="flex p-2 border border-gray-300 w-27 rounded-lg ml-6 ">
                            ₹ {item.taxprice?.toFixed(2) || "0.00"}
                          </div>
                        </td>
                        <td className="p-3 text-center">
                          {items.length > 1 && (
                            <button
                              onClick={() => removeItem(item.id)}
                              className="text-gray-500 hover:text-gray-700 focus:outline-none"
                              aria-label="Remove item"
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-5 w-5"
                                viewBox="0 0 20 20"
                                fill="currentColor"
                              >
                                <path
                                  fillRule="evenodd"
                                  d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                                  clipRule="evenodd"
                                />
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
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 mr-1"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z"
                    clipRule="evenodd"
                  />
                </svg>
                Add Item
              </button>
            </div>

            {/* Total */}
            <div className="bg-gray-50 p-6 border-t border-gray-200">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold text-gray-800">
                  Subtotal:
                </h3>
                <h3 className="text-xl font-bold text-gray-700">
                  ₹ {Subtotal.toFixed(2)}
                </h3>
              </div>
            </div>

            {/* Download/Update Button */}
            <div className="text-center p-6 bg-gray-50 border-gray-200">
              <button
                onClick={submit}
                className=" cursor-pointer bg-blue-600 text-white px-8 py-3 rounded-md hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition shadow-md"
              >
                {isEditMode ? "Update Invoice" : "Download Invoice"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Invoice;
