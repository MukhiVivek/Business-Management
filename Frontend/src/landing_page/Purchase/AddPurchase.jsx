import React, { useEffect, useState } from "react";
import "../../App.css";
import PurchaseModal from "./PurchaseModal";
import VendorSelector from "./VendorSelector";
import { useVendor } from "../../hooks/useVendor";
import { useProduct } from "../../hooks/useProduct";
import axios from "axios";
import { BACKEND_URL } from "../../Config";
import { useParams, useNavigate } from "react-router-dom";

const AddPurchase = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const isEditMode = !!id;

    // State management
    const [isPopupOpen, setIsPopupOpen] = useState(false);
    const [selectedVendor, setSelectedVendor] = useState(null);
    const [items, setItems] = useState([{ id: 1, name: "", qty: 1, price: 0, sgst: 0, cgst: 0, igst: 0, tamount: 0, product_id: null }]);
    const [purchaseNo, setPurchaseNo] = useState("");
    const [purchaseDate, setPurchaseDate] = useState(new Date().toISOString().slice(0, 10));
    const [Subtotal, setSubtotal] = useState(0);
    const [activeItemId, setActiveItemId] = useState(null);
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [description, setDescription] = useState("");

    const { data: vendorData } = useVendor();
    const { data: products } = useProduct();

    useEffect(() => {
        if (isEditMode) {
            const fetchPurchase = async () => {
                try {
                    const res = await axios.get(`${BACKEND_URL}/api/v1/purchase/${id}`, {
                        headers: { token: localStorage.getItem("token") }
                    });
                    const data = res.data.data;
                    setPurchaseNo(data.purchase_number);
                    setPurchaseDate(new Date(data.purchase_date).toISOString().slice(0, 10));
                    setSelectedVendor(data.vendor_id);
                    setItems(data.items.map(item => ({
                        ...item,
                        id: item._id || Math.random()
                    })));
                    setSubtotal(data.Subtotal);
                    setDescription(data.description || "");
                } catch (error) {
                    console.error("Error fetching purchase:", error);
                    alert("Failed to fetch purchase data");
                }
            };
            fetchPurchase();
        } else {
            const fetchNextPurchaseNumber = async () => {
                try {
                    const token = localStorage.getItem("token");
                    if (!token) return;
                    const res = await axios.get(`${BACKEND_URL}/api/v1/purchase/next-number`, {
                        headers: { token }
                    });
                    if (res.data && res.data.nextNumber !== undefined) {
                        setPurchaseNo(res.data.nextNumber);
                    }
                } catch (error) {
                    console.error("Error fetching next purchase number:", error);
                }
            };
            fetchNextPurchaseNumber();
        }
    }, [id, isEditMode]);

    const handleVendorSelect = (vendor) => {
        setSelectedVendor(vendor);
        setIsPopupOpen(false);
    };

    const handleSelectProduct = (itemId, product) => {
        const updatedItems = items.map((item) => {
            if (item.id === itemId) {
                const tax = product.gst_tax_rate || 0;
                const halfTax = tax / 2;
                return {
                    ...item,
                    product_id: product._id,
                    name: product.name,
                    price: product.purchase_price || product.price || 0,
                    sgst: halfTax,
                    cgst: halfTax,
                    igst: 0,
                    tamount: (product.purchase_price || product.price || 0) * item.qty,
                };
            }
            return item;
        });
        setItems(updatedItems);
        setActiveItemId(null);
    };

    const handleItemChange = (itemId, field, value) => {
        if (field === "name") {
            setActiveItemId(itemId);
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
            if (item.id === itemId) {
                // Allow empty strings for typing
                const updatedItem = { ...item, [field]: value };

                // Recalculate derived fields
                if (field === "qty") {
                    const price = Number(updatedItem.price || 0);
                    const qty = Number(updatedItem.qty || 0);
                    updatedItem.tamount = price * qty;
                } else if (field === "price") {
                    const price = Number(updatedItem.price || 0);
                    const qty = Number(updatedItem.qty || 0);
                    updatedItem.tamount = price * qty;
                } else if (field === "tamount") {
                    const tamount = Number(updatedItem.tamount || 0);
                    const qty = Number(updatedItem.qty || 1); // Avoid division by zero
                    updatedItem.price = qty > 0 ? (tamount / qty).toFixed(2) : 0;
                }
                return updatedItem;
            }
            return item;
        });
        setItems(updatedItems);
    };

    const addItem = () => {
        setItems([...items, { id: Date.now(), name: "", qty: 1, price: 0, sgst: 0, cgst: 0, igst: 0, tamount: 0, product_id: null }]);
    };

    const removeItem = (itemId) => {
        if (items.length > 1) {
            setItems(items.filter((item) => item.id !== itemId));
        }
    };

    useEffect(() => {
        const calculateSubtotal = () => {
            const total = items.reduce((sum, item) => {
                const price = Number(item.price);
                const qty = Number(item.qty);
                const sgst = Number(item.sgst || 0);
                const cgst = Number(item.cgst || 0);
                const igst = Number(item.igst || 0);
                const taxableAmount = price * qty;
                const taxAmount = (taxableAmount * (sgst + cgst + igst)) / 100;
                return sum + taxableAmount + taxAmount;
            }, 0);
            setSubtotal(total);
        };
        calculateSubtotal();
    }, [items]);

    const submit = async () => {
        if (!selectedVendor) {
            alert("Please select a vendor");
            return;
        }
        try {
            const url = isEditMode
                ? `${BACKEND_URL}/api/v1/purchase/update/${id}`
                : `${BACKEND_URL}/api/v1/purchase/add`;

            const method = isEditMode ? 'put' : 'post';

            await axios[method](
                url,
                {
                    purchase_number: purchaseNo,
                    purchase_date: purchaseDate,
                    vendor_id: selectedVendor?._id,
                    Subtotal: Subtotal,
                    items: items,
                    description: description,
                    status: isEditMode ? undefined : "Pending"
                },
                {
                    headers: { token: localStorage.getItem("token") },
                }
            );

            alert(isEditMode ? "Purchase Successfully Updated" : "Purchase Successfully Added");
            navigate("/purchase");
        } catch (error) {
            console.error("Error submitting purchase:", error);
            alert(error.response?.data?.message || "Failed to submit purchase");
        }
    };

    return (
        <div className="pl-14 min-h-screen w-full bg-gray-50 flex flex-col">
            <div className="bg-white border-b border-gray-200 p-6 sticky top-0 z-30">
                <div className="flex justify-between items-center max-w-7xl mx-auto">
                    <h1 className="text-2xl font-black text-gray-900">{isEditMode ? "Edit Purchase Bill" : "Record New Purchase"}</h1>
                    <div className="flex gap-4">
                        <button onClick={() => navigate("/purchase")} className="px-6 py-2 border border-gray-200 rounded-xl font-bold text-gray-600 hover:bg-gray-50">Cancel</button>
                        <button onClick={submit} className="px-8 py-2 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 shadow-lg transition-all">{isEditMode ? "Update Bill" : "Save Bill"}</button>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto w-full p-6 space-y-6">
                {/* Vendor & Details */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex flex-col">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-sm font-black text-gray-400 uppercase tracking-widest">Vendor Information</h3>
                            <button
                                onClick={() => setIsPopupOpen(true)}
                                className="text-xs font-bold text-blue-600 hover:text-blue-800"
                            >
                                Change Vendor
                            </button>
                        </div>
                        {selectedVendor ? (
                            <div>
                                <div className="text-xl font-black text-gray-900">{selectedVendor.name}</div>
                                <div className="text-sm text-gray-500 font-medium mt-1">{selectedVendor.company}</div>
                                <div className="text-xs text-gray-400 mt-2">{selectedVendor.phone_number}</div>
                            </div>
                        ) : (
                            <button
                                onClick={() => setIsPopupOpen(true)}
                                className="mt-2 py-8 border-2 border-dashed border-gray-200 rounded-2xl text-gray-400 font-bold hover:border-blue-300 hover:text-blue-500 transition-all"
                            >
                                + Click to Select Vendor
                            </button>
                        )}
                    </div>

                    <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 grid grid-cols-2 gap-4 col-span-2">
                        <div className="space-y-2">
                            <label className="text-xs font-black text-gray-400 uppercase tracking-widest">Purchase Bill #</label>
                            <input
                                type="text"
                                value={purchaseNo}
                                onChange={(e) => setPurchaseNo(e.target.value)}
                                className="w-full p-3 bg-gray-50 border-none rounded-2xl font-black text-blue-600 text-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                placeholder="P-001"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-black text-gray-400 uppercase tracking-widest">Billing Date</label>
                            <input
                                type="date"
                                value={purchaseDate}
                                onChange={(e) => setPurchaseDate(e.target.value)}
                                className="w-full p-3 bg-gray-50 border-none rounded-2xl font-bold text-gray-700 focus:ring-2 focus:ring-blue-500 outline-none"
                            />
                        </div>
                    </div>
                </div>

                {/* Items Table */}
                <div className="bg-white rounded-3xl shadow-sm border border-gray-100">
                    <table className="w-full text-left border-collapse">
                        <thead className="bg-gray-50/80">
                            <tr>
                                <th className="px-6 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest w-12 text-center">#</th>
                                <th className="px-6 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest min-w-[250px]">Item Description</th>
                                <th className="px-6 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest w-34 text-center">Qty</th>
                                <th className="px-6 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest w-36 text-right">Price</th>
                                <th className="px-6 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest w-40 text-right">Total Amount</th>
                                <th className="px-6 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest w-40 text-right">Total (Incl. Tax)</th>
                                <th className="px-6 py-5 w-12"></th>
                            </tr>
                        </thead>
                        <tbody>
                            {items.map((item, index) => (
                                <tr key={item.id} className="border-t border-gray-100 group hover:bg-gray-50/50 transition-colors">
                                    <td className="px-6 py-4 text-xs font-black text-gray-400 text-center">{index + 1}</td>
                                    <td className="px-6 py-4 relative">
                                        <div className="flex flex-col">
                                            <input
                                                type="text"
                                                placeholder="Enter item name..."
                                                value={item.name}
                                                onChange={(e) => handleItemChange(item.id, "name", e.target.value)}
                                                onBlur={() => setTimeout(() => setActiveItemId(null), 200)}
                                                className="w-full bg-transparent border-none p-0 font-black text-gray-900 placeholder-gray-300 focus:ring-0 outline-none text-sm"
                                            />
                                            {activeItemId === item.id && filteredProducts.length > 0 && (
                                                <ul className="absolute z-50 w-full left-0 bg-white border border-gray-100 rounded-2xl bottom-full mb-2 max-h-60 overflow-y-auto shadow-2xl p-2 border border-blue-50">
                                                    {filteredProducts.map((p) => (
                                                        <li
                                                            key={p._id}
                                                            onClick={() => handleSelectProduct(item.id, p)}
                                                            className="p-3 hover:bg-blue-50 cursor-pointer rounded-xl flex justify-between items-center transition-colors mb-1 last:mb-0"
                                                        >
                                                            <div>
                                                                <div className="font-black text-gray-800 text-sm">{p.name}</div>
                                                                <div className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">In Stock: {p.stock || 0}</div>
                                                            </div>
                                                            <span className="text-blue-600 font-black text-sm">₹{p.purchase_price || p.price}</span>
                                                        </li>
                                                    ))}
                                                </ul>
                                            )}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <input
                                            type="number"
                                            value={item.qty}
                                            onChange={(e) => handleItemChange(item.id, "qty", e.target.value)}
                                            className="w-full bg-gray-50 border border-gray-100 rounded-2xl p-3 text-center font-black text-gray-900 focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none transition-all text-sm"
                                        />
                                    </td>
                                    <td className="px-6 py-4">
                                        <input
                                            type="number"
                                            value={item.price}
                                            onChange={(e) => handleItemChange(item.id, "price", e.target.value)}
                                            className="w-full bg-gray-50 border border-gray-100 rounded-2xl p-3 text-right font-black text-gray-900 focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none transition-all text-sm"
                                        />
                                    </td>
                                    <td className="px-6 py-4">
                                        <input
                                            type="number"
                                            value={item.tamount}
                                            onChange={(e) => handleItemChange(item.id, "tamount", e.target.value)}
                                            className="w-full bg-gray-50 border border-gray-100 rounded-2xl p-3 text-right font-black text-gray-900 focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none transition-all text-sm"
                                        />
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="font-black text-gray-900 text-sm">
                                            ₹{(Number(item.qty || 0) * Number(item.price || 0) * (1 + (Number(item.sgst || 0) + Number(item.cgst || 0) + Number(item.igst || 0)) / 100)).toFixed(2)}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        {items.length > 1 && (
                                            <button onClick={() => removeItem(item.id)} className="p-2 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all">
                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                                            </button>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    <div className="p-4 bg-gray-50/50">
                        <button onClick={addItem} className="flex items-center gap-2 text-blue-600 font-black text-xs hover:text-blue-800 transition-all uppercase tracking-widest">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M12 4v16m8-8H4" /></svg>
                            Add Another Item
                        </button>
                    </div>
                </div>

                {/* Footer info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-4">
                        <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
                            <label className="text-xs font-black text-gray-400 uppercase tracking-widest block mb-2">Notes & Description</label>
                            <textarea
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                placeholder="Add internal notes or bill terms..."
                                className="w-full bg-gray-50 border-none rounded-2xl p-4 text-sm font-medium text-gray-600 focus:ring-2 focus:ring-blue-500 outline-none resize-none"
                                rows="4"
                            ></textarea>
                        </div>
                    </div>
                    <div className="bg-gray-900 rounded-[2.5rem] p-8 text-white shadow-2xl flex flex-col justify-between">
                        <div>
                            <div className="flex justify-between items-center mb-6 border-b border-white/10 pb-4">
                                <span className="text-white/50 font-bold uppercase tracking-widest text-xs">Taxable Total</span>
                                <span className="font-black text-lg">₹{items.reduce((sum, i) => sum + (i.qty * i.price), 0).toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between items-center mb-6">
                                <span className="text-white/50 font-bold uppercase tracking-widest text-xs">GST Total</span>
                                <span className="font-black text-lg text-blue-400">+ ₹{(Subtotal - items.reduce((sum, i) => sum + (i.qty * i.price), 0)).toFixed(2)}</span>
                            </div>
                        </div>
                        <div className="flex justify-between items-end mt-4">
                            <div>
                                <div className="text-white/50 font-black uppercase tracking-[0.2em] text-[10px]">Grand Total Payable</div>
                                <div className="text-5xl font-black mt-2">₹{Subtotal.toFixed(2)}</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {isPopupOpen && (
                <PurchaseModal onClose={() => setIsPopupOpen(false)} title="Select Vendor">
                    <VendorSelector onSelect={handleVendorSelect} vendorData={vendorData} />
                </PurchaseModal>
            )}
        </div>
    );
};

export default AddPurchase;
