import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { BACKEND_URL } from "../../Config";
import { FaTrash } from "react-icons/fa";

function Purchase() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [aiJson, setAiJson] = useState("");
    const [billNumber, setBillNumber] = useState("");
    const [billDate, setBillDate] = useState(new Date().toISOString().split('T')[0]);
    const [items, setItems] = useState([{ product_id: "", quantity: "", purchase_price: "" }]);
    const navigate = useNavigate();

    useEffect(() => {
        fetchProducts();
    }, []);

    async function fetchProducts() {
        try {
            const response = await axios.get(`${BACKEND_URL}/api/v1/product/data`, {
                headers: {
                    token: localStorage.getItem("token"),
                },
            });
            setProducts(response.data.data);
            setLoading(false);
        } catch (error) {
            console.error("Error fetching products:", error);
            setLoading(false);
        }
    }

    const addItem = () => {
        setItems([...items, { product_id: "", quantity: "", purchase_price: "" }]);
    };

    const removeItem = (index) => {
        const newItems = items.filter((_, i) => i !== index);
        setItems(newItems.length ? newItems : [{ product_id: "", quantity: "", purchase_price: "" }]);
    };

    const updateItem = (index, field, value) => {
        const newItems = [...items];
        newItems[index][field] = value;
        setItems(newItems);
    };

    async function submit() {
        const validItems = items.filter(item => item.product_id && item.quantity > 0);

        if (validItems.length === 0) {
            alert("Please add at least one valid product");
            return;
        }

        const payload = {
            items: validItems,
            bill_number: billNumber,
            date: billDate,
        };

        try {
            await axios.post(`${BACKEND_URL}/api/v1/purchase/add-bill`, payload, {
                headers: {
                    token: localStorage.getItem("token"),
                },
            });
            alert("Purchase items added and stock updated");
            navigate("/purchase");
        } catch (error) {
            console.error(error);
            alert(error.response?.data?.message || "Error adding purchase");
        }
    }

    const handleAiPaste = () => {
        try {
            const data = JSON.parse(aiJson);
            setBillNumber(data.bill_number || "");
            if (data.date) setBillDate(new Date(data.date).toISOString().split('T')[0]);

            const extractedItems = data.items || [];
            const newItems = extractedItems.map(item => {
                const matched = products.find(p => p.name.toLowerCase() === item.name.toLowerCase());
                return {
                    product_id: matched ? matched._id : "",
                    quantity: item.quantity || "",
                    purchase_price: item.purchase_price_per_unit || item.purchase_price || "",
                };
            });

            if (newItems.length > 0) {
                setItems(newItems);
            }
            setAiJson("");
            alert("Form populated from AI data. Please verify product matches before submitting.");
        } catch (e) {
            alert("Invalid JSON format. Please paste the exact JSON from AI.");
        }
    };

    if (loading) return <div className="pl-18 pt-2">Loading...</div>;

    return (
        <div className="pl-18 pt-2 pr-9 min-h-screen block rounded-lg w-full bg-gray-50">
            <div className="flex justify-between items-center mb-6 mt-1">
                <h1 className="text-2xl font-bold text-gray-800">New Purchase Bill</h1>
                <div className="flex gap-4">
                    <input
                        type="text"
                        value={billNumber}
                        onChange={(e) => setBillNumber(e.target.value)}
                        placeholder="Bill Number"
                        className="border border-gray-300 px-3 py-2 bg-white rounded-sm"
                    />
                    <input
                        type="date"
                        value={billDate}
                        onChange={(e) => setBillDate(e.target.value)}
                        className="border border-gray-300 px-3 py-2 bg-white rounded-sm"
                    />
                </div>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                {/* Items Table */}
                <div className="xl:col-span-2 border p-6 bg-white shadow-sm rounded-md">
                    <h2 className="text-lg font-semibold mb-4 border-b pb-2">Purchase Items</h2>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left mb-4">
                            <thead>
                                <tr className="text-gray-500 uppercase text-xs font-semibold">
                                    <th className="pb-2">Product</th>
                                    <th className="pb-2 w-24">Qty</th>
                                    <th className="pb-2 w-32">Purchase Price</th>
                                    <th className="pb-2 w-12 text-center"></th>
                                </tr>
                            </thead>
                            <tbody className="divide-y">
                                {items.map((item, index) => (
                                    <tr key={index}>
                                        <td className="py-3 pr-4">
                                            <select
                                                value={item.product_id}
                                                onChange={(e) => updateItem(index, "product_id", e.target.value)}
                                                className="w-full border border-gray-200 px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
                                            >
                                                <option value="">Select a Product</option>
                                                {products.map((p) => (
                                                    <option key={p._id} value={p._id}>
                                                        {p.name}
                                                    </option>
                                                ))}
                                            </select>
                                        </td>
                                        <td className="py-3 pr-4">
                                            <input
                                                type="number"
                                                value={item.quantity}
                                                onChange={(e) => updateItem(index, "quantity", e.target.value)}
                                                placeholder="0"
                                                className="w-full border border-gray-200 px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
                                            />
                                        </td>
                                        <td className="py-3">
                                            <input
                                                type="number"
                                                value={item.purchase_price}
                                                onChange={(e) => updateItem(index, "purchase_price", e.target.value)}
                                                placeholder="0.00"
                                                className="w-full border border-gray-200 px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
                                            />
                                        </td>
                                        <td className="py-3 text-center">
                                            <button
                                                onClick={() => removeItem(index)}
                                                className="text-red-400 hover:text-red-600 transition"
                                            >
                                                <FaTrash />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    <div className="flex justify-between items-center mt-4">
                        <button
                            onClick={addItem}
                            className="text-blue-600 hover:text-blue-800 font-medium text-sm flex items-center gap-1"
                        >
                            + Add Another Item
                        </button>
                        <button
                            onClick={submit}
                            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2.5 px-8 rounded shadow-lg transition transform active:scale-95"
                        >
                            Save Purchase Bill
                        </button>
                    </div>
                </div>

                {/* AI Extraction Tool */}
                <div className="xl:col-span-1">
                    <div className="border p-5 bg-blue-50 shadow-sm border-blue-100 rounded-md">
                        <h2 className="text-lg font-semibold mb-2 text-blue-900 flex items-center gap-2">
                            <span className="animate-pulse">✨</span> AI Bill Extraction
                        </h2>
                        <p className="text-xs text-blue-700 mb-4 leading-relaxed">
                            Paste the JSON output from your Vision AI here to automatically map all items from the supplier invoice.
                        </p>

                        <textarea
                            value={aiJson}
                            onChange={(e) => setAiJson(e.target.value)}
                            placeholder='Paste JSON here...'
                            className="w-full h-64 border border-blue-200 p-3 mb-4 font-mono text-xs shadow-inner bg-white focus:ring-2 focus:ring-blue-400 outline-none"
                        ></textarea>

                        <button
                            onClick={handleAiPaste}
                            className="w-full bg-blue-800 hover:bg-blue-900 text-white font-bold py-3 px-4 rounded shadow transition active:scale-95"
                        >
                            Extract All Items
                        </button>

                        <div className="mt-6 p-3 bg-white border border-blue-100 rounded text-[10px] text-gray-500 space-y-2">
                            <p><strong>Required Format:</strong></p>
                            <pre className="bg-gray-50 p-2 overflow-x-auto">
                                {`{
  "bill_number": "...",
  "items": [
    {
      "name": "...",
      "quantity": 0,
      "purchase_price": 0
    }
  ]
}`}
                            </pre>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Purchase;
