import axios from "axios";
import { useRef } from "react";
import { BACKEND_URL } from "../../Config";

function AddProducts() {
  const product_name = useRef();
  const product_price = useRef();
  const product_type = useRef();
  const product_description = useRef();
  const product_stock = useRef();

  async function submit() {
    await axios.post(
      BACKEND_URL + "/api/v1/product/add",
      {
        name: product_name.current.value,
        price: product_price.current.value,
        product_type: product_type.current.value,
        description: product_description.current.value,
        stock: product_stock.current.value,
      },
      {
        headers: {
          token: localStorage.getItem("token"),
        },
      }
    );
    alert("Product Successfully Added");
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

            {/* product price */}
            <div className="mb-4">
              <label className="block mb-1">Product Price:</label>
              <input
                type="number"
                placeholder="Enter Product Price"
                ref={product_price}
                className="w-full border border-gray-300 px-4 py-2"
              />
            </div>

            {/* product type */}
            <div className="mb-4">
              <label className="block mb-1">Product Type:</label>
              <input
                type="text"
                placeholder="Enter Product Type"
                ref={product_type}
                className="w-full border border-gray-300 px-4 py-2"
              />
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
                type="submit"
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
