import axios from "axios";
import { useRef, useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { BACKEND_URL } from "../../Config";
import PurchaseModal from "../Purchase/PurchaseModal";

function AddProducts() {
  const navigate = useNavigate();
  const { id } = useParams();
  const product_name = useRef();
  const product_price = useRef();
  const product_type = useRef();
  const product_description = useRef();
  const product_stock = useRef();
  const product_gst = useRef();
  const product_unit = useRef();
  const product_purchase_price = useRef();
  const product_packet_size = useRef();
  const product_box_size = useRef();
  const product_mrp = useRef();

  const [isBulkPopupOpen, setIsBulkPopupOpen] = useState(false);
  const [bulkJson, setBulkJson] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    if (id) {
      const fetchProduct = async () => {
        try {
          const res = await axios.get(`${BACKEND_URL}/api/v1/product/${id}`, {
            headers: { token: localStorage.getItem("token") }
          });
          const pd = res.data.product;
          if (pd) {
            if (product_name.current) product_name.current.value = pd.name || "";
            if (product_price.current) product_price.current.value = pd.price || "";
            if (product_type.current) product_type.current.value = pd.product_type || "Premium";
            if (product_description.current) product_description.current.value = pd.description || "";
            if (product_stock.current) product_stock.current.value = pd.stock || 0;
            if (product_gst.current) product_gst.current.value = pd.gst_tax_rate || 0;
            if (product_unit.current) product_unit.current.value = pd.measuring_unit || "PCS";
            if (product_purchase_price.current) product_purchase_price.current.value = pd.tax_purchase_price || 0;
            if (product_packet_size.current) product_packet_size.current.value = pd.packet_size || 0;
            if (product_box_size.current) product_box_size.current.value = pd.box_size || 0;
            if (product_mrp.current) product_mrp.current.value = pd.mrp || 0;
          }
        } catch (error) {
          console.error("Error fetching product", error);
        }
      };
      fetchProduct();
    }
  }, [id]);

  async function submit() {
    if (!product_name.current.value.trim()) {
      alert("Product name is required");
      return;
    }

    if (!product_price.current.value || isNaN(product_price.current.value)) {
      alert("Valid price is required");
      return;
    }

    try {
      const payload = {
        name: product_name.current.value.trim(),
        price: Number(product_price.current.value),
        purchase_price: Number(product_purchase_price.current.value || 0),
        product_type: product_type.current.value,
        description: product_description.current.value.trim(),
        stock: Number(product_stock.current.value),
        gst_tax_rate: Number(product_gst.current.value),
        measuring_unit: product_unit.current.value,
        packet_size: Number(product_packet_size.current.value || 0),
        box_size: Number(product_box_size.current.value || 0),
        mrp: Number(product_mrp.current.value || 0),
      };

      if (id) {
        await axios.put(
          `${BACKEND_URL}/api/v1/product/update/${id}`,
          payload,
          {
            headers: {
              token: localStorage.getItem("token"),
            },
          }
        );
        alert("Product Successfully Updated");
      } else {
        await axios.post(
          `${BACKEND_URL}/api/v1/product/add`,
          payload,
          {
            headers: {
              token: localStorage.getItem("token"),
            },
          }
        );
        alert("Product Successfully Added");
      }
      navigate("/products");
    } catch (error) {
      console.error(error);
      alert(
        error.response?.data?.message || "Failed to add product. Try again."
      );
    }
  }

  async function handleBulkAdd() {
    try {
      const parsedData = JSON.parse(bulkJson);
      const productsToAdd = Array.isArray(parsedData) ? parsedData : [parsedData];

      if (productsToAdd.length === 0) {
        alert("No products found in JSON");
        return;
      }

      setIsProcessing(true);
      let successCount = 0;

      for (const p of productsToAdd) {
        try {
          await axios.post(
            `${BACKEND_URL}/api/v1/product/add`,
            {
              name: p.name || "Unnamed Product",
              price: Number(p.price || 0),
              purchase_price: Number(p.purchase_price || 0),
              product_type: p.category || p.product_type || "Premium",
              description: p.description || "",
              stock: Number(p.stock || 0),
              gst_tax_rate: Number(p.gst || p.gst_tax_rate || 0),
              measuring_unit: p.unit || p.measuring_unit || "PCS",
              packet_size: Number(p.packet_size || 0),
              box_size: Number(p.box_size || 0),
              mrp: Number(p.mrp || 0),
            },
            {
              headers: {
                token: localStorage.getItem("token"),
              },
            }
          );
          successCount++;
        } catch (err) {
          console.error(`Failed to add product: ${p.name}`, err);
        }
      }

      alert(`${successCount} out of ${productsToAdd.length} products successfully added.`);
      setIsBulkPopupOpen(false);
      setBulkJson("");
      if (successCount > 0) navigate("/products");
    } catch (error) {
      alert("Invalid JSON format. Please check your data.");
    } finally {
      setIsProcessing(false);
    }
  }

  return (
    <div className="pl-18 pt-2 pr-9 min-h-screen block rounded-lg w-full">
      {/* Header */}
      <div className="flex justify-between items-start mb-2 mt-1">
        <div className="flex gap-3">
          {/* Ignore this d */}
        </div>
        <div>
          <h1 className="text-xl font-semibold text-gray-700">{id ? "Edit Product" : "Products"}</h1>
        </div>
        <button
          onClick={() => setIsBulkPopupOpen(true)}
          className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-4 rounded transition-colors flex items-center gap-2"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
          Bulk Add (JSON)
        </button>
      </div>
      <div className="w-full">
        <h1 className="text-xl font-semibold mb-3">{id ? "Edit Product" : "Add Product"}</h1>

        {/* product form */}
        <div className="mb-4">
          <div className="border p-4">
            {/* product name */}
            <div className="mb-4">
              <label className="block mb-1">Product Name:</label>
              <input
                type="text"
                placeholder="Enter your Product Name"
                ref={product_name}
                className="w-full border border-gray-300 px-4 py-2"
              />
            </div>

            {/* Product description */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4 mb-4">
              <div>
                <label className="block mb-1">MRP :</label>
                <input
                  type="text"
                  placeholder="Enter MRP"
                  ref={product_mrp}
                  className="w-full border border-gray-300 px-4 py-2"
                />
              </div>

              {/* Product State */}
              <div>
                <label className="block mb-1">Sales Price :</label>
                <input
                  type="text"
                  placeholder="Enter Selling Price"
                  ref={product_price}
                  className="w-full border border-gray-300 px-4 py-2"
                />
              </div>

              <div>
                <label className="block mb-1">Purchase Price :</label>
                <input
                  type="text"
                  placeholder="Enter Purchase Price"
                  ref={product_purchase_price}
                  className="w-full border border-gray-300 px-4 py-2"
                />
              </div>

              {/* GST Tax Rate */}
              <div>
                <label className="block mb-1">GST Tax Rate(%)</label>
                <select
                  className="w-full border border-gray-300 px-4 py-2"
                  ref={product_gst}
                >
                  <option value="0">0%</option>
                  <option value="5">5%</option>
                  <option value="12">12%</option>
                  <option value="18">18%</option>
                  <option value="28">28%</option>
                </select>
              </div>

              <div>
                <label className="block mb-1">Measuring Unit :</label>
                <select
                  className="w-full border border-gray-300 px-4 py-2"
                  ref={product_unit}
                >
                  <option value="KG">KG</option>
                  <option value="PCS">PCS</option>
                  <option value="Box">Box</option>
                  <option value="Packet">Packet</option>
                </select>
              </div>

              <div>
                <label className="block mb-1">Category :</label>
                <select
                  className="w-full border border-gray-300 px-4 py-2"
                  ref={product_type}
                >
                  <option value="Flour">Flour</option>
                  <option value="Farali">Farali</option>
                  <option value="Instant">Instant</option>
                  <option value="Premium">Premium</option>
                  <option value="Spices">Spices</option>
                  <option value="Whole">Whole</option>
                  <option value="Hing">Hing</option>
                  <option value="Papad">Papad</option>
                </select>
              </div>
            </div>

            {/* product description */}
            <div className="mb-4">
              <label className="block mb-1">Product Description:</label>
              <input
                type="text"
                placeholder="Enter Product Description"
                ref={product_description}
                className="w-full border border-gray-300 px-4 py-2"
              />
            </div>

            {/* size and stock */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div>
                <label className="block mb-1">Packet Size:</label>
                <input
                  type="number"
                  placeholder="Enter Packet Size"
                  ref={product_packet_size}
                  className="w-full border border-gray-300 px-4 py-2"
                />
              </div>
              <div>
                <label className="block mb-1">Box Size:</label>
                <input
                  type="number"
                  placeholder="Enter Box Size"
                  ref={product_box_size}
                  className="w-full border border-gray-300 px-4 py-2"
                />
              </div>
              <div>
                <label className="block mb-1">Product Stock:</label>
                <input
                  type="number"
                  placeholder="Enter Product Stock"
                  ref={product_stock}
                  className="w-full border border-gray-300 px-4 py-2"
                />
              </div>
            </div>

            {/* Add product button */}
            <div className="mt-4">
              <button
                type="button"
                onClick={submit}
                className="bg-blue-600 cursor-pointer hover:bg-blue-700 text-white font-semibold py-2 px-4 mx-auto"
              >
                {id ? "Update Product" : "Add Product"}
              </button>
            </div>
          </div>
        </div>
      </div>
      {isBulkPopupOpen && (
        <PurchaseModal onClose={() => setIsBulkPopupOpen(false)} title="Bulk Add Products via JSON">
          <div className="p-6">
            <div className="mb-4">
              <label className="block text-sm font-semibold text-gray-700 mb-2 uppercase tracking-wider">Paste Products JSON</label>
              <textarea
                value={bulkJson}
                onChange={(e) => setBulkJson(e.target.value)}
                placeholder='[
  { "name": "New Product", "price": 1000, "purchase_price": 800, "stock": 50, "gst": 18 },
  { "name": "Another Item", "price": 500, "stock": 100 }
]'
                className="w-full h-64 p-4 bg-gray-50 border border-gray-200 rounded-lg font-mono text-sm focus:ring-2 focus:ring-blue-500 outline-none resize-none"
              ></textarea>
              <div className="mt-3 p-3 bg-indigo-50 rounded border border-indigo-100 italic text-[11px] text-indigo-700">
                Note: Fields accepted are name, price, purchase_price, stock, gst, category, unit, description.
              </div>
            </div>
            <div className="flex gap-4">
              <button
                onClick={handleBulkAdd}
                disabled={isProcessing}
                className={`flex-1 py-3 ${isProcessing ? 'bg-gray-400' : 'bg-indigo-600 hover:bg-indigo-700'} text-white rounded font-bold transition-all uppercase tracking-widest text-xs`}
              >
                {isProcessing ? "Adding..." : "Add All Products"}
              </button>
              <button
                onClick={() => setIsBulkPopupOpen(false)}
                className="flex-1 py-3 bg-gray-100 text-gray-600 rounded font-bold hover:bg-gray-200 transition-all uppercase tracking-widest text-xs"
              >
                Cancel
              </button>
            </div>
          </div>
        </PurchaseModal>
      )}
    </div>
  );
}

export default AddProducts;
