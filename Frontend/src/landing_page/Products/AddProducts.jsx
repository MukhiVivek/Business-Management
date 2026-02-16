import axios from "axios";
import { useRef } from "react";
import { BACKEND_URL } from "../../Config";

function AddProducts() {
  const product_name = useRef();
  const product_price = useRef();
  const product_type = useRef();
  const product_description = useRef();
  const product_stock = useRef();
  const product_gst = useRef();
  const product_unit = useRef();
  const product_purchase_price = useRef();

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
      await axios.post(
        `${BACKEND_URL}/api/v1/product/add`,
        {
          name: product_name.current.value.trim(),
          price: Number(product_price.current.value),
          purchase_price: Number(product_purchase_price.current.value || 0),
          product_type: product_type.current.value,
          description: product_description.current.value.trim(),
          stock: Number(product_stock.current.value),
          gst_tax_rate: Number(product_gst.current.value),
          measuring_unit: product_unit.current.value,
        },
        {
          headers: {
            token: localStorage.getItem("token"),
          },
        }
      );
      alert("Product Successfully Added");
      navigate("/products");
    } catch (error) {
      console.error(error);
      alert(
        error.response?.data?.message || "Failed to add product. Try again."
      );
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
          <h1 className="text-xl font-semibold text-gray-700">Products</h1>
        </div>
      </div>
      <div className="w-full">
        <h1 className="text-xl font-semibold mb-3">Add Product</h1>

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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4 mb-4">
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

            {/* product stock */}
            <div className="mb-4">
              <label className="block mb-1">Product Stock:</label>
              <input
                type="number"
                placeholder="Enter Product Stock"
                ref={product_stock}
                className="w-full border border-gray-300 px-4 py-2"
              />
            </div>

            {/* Add product button */}
            <div className="mt-4">
              <button
                type="button"
                onClick={submit}
                className="bg-blue-600 cursor-pointer hover:bg-blue-700 text-white font-semibold py-2 px-4 mx-auto"
              >
                Add Product
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AddProducts;
