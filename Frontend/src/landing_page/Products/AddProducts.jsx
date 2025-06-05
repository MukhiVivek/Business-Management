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
        try {
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
            product_name.current.value = "";
            product_price.current.value = "";
            product_type.current.value = "";
            product_description.current.value = "";
            product_stock.current.value = "";
        } catch (error) {
            console.error("Error adding product:", error);
            alert("Failed to add product. Please try again.");
        }
    }

    return (
        <div className="rounded-2xl min-h-screen ml-12 p-5 bg-white">
            <div className="flex justify-between items-start mb-5">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">
                        Product Details
                    </h1>
                </div>
                <div>
                    <h1 className="text-xl font-semibold text-gray-700">Products</h1>
                </div>
            </div>

            <div className="products justify-center rounded-lg">
                <div className="bg-white sm:rounded-lg shadow-lg text-sm">
                    <div className="p-6">

                        {/* product name */}
                        <div className="mb-4">
                            <label
                                htmlFor="productName"
                                className="block text-gray-700 text-base font-bold mb-1"
                            >
                                Product Name:
                            </label>
                            <input
                                id="productName"
                                type="text"
                                placeholder="Enter Product Name"
                                ref={product_name}
                                className="w-full border border-gray-300 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                        
                        {/* product price */}
                        <div className="mb-4">
                            <label
                                htmlFor="productPrice"
                                className="block text-gray-700 text-base font-bold mb-1"
                            >
                                Product Price:
                            </label>
                            <input
                                id="productPrice"
                                type="number"
                                placeholder="Enter Product Price"
                                ref={product_price}
                                className="w-full border border-gray-300 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>

                        {/* product type */}
                        <div className="mb-4">
                            <label
                                htmlFor="productType"
                                className="block text-gray-700 text-base font-bold mb-1"
                            >
                                Product Type:
                            </label>
                            <input
                                id="productType"
                                type="text"
                                placeholder="Enter Product Type (e.g., Electronic, Clothing, Food)"
                                ref={product_type}
                                className="w-full border border-gray-300 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>

                        {/* product description */}
                        <div className="mb-4">
                            <label
                                htmlFor="productDescription"
                                className="block text-gray-700 text-base font-bold mb-1"
                            >
                                Product Description:
                            </label>
                            <textarea
                                id="productDescription"
                                placeholder="Enter Product Description"
                                ref={product_description}
                                className="w-full border border-gray-300 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 h-24 resize-y" 
                            ></textarea>
                        </div>

                        {/* product stock */}
                        <div className="mb-6">
                            <label
                                htmlFor="productStock"
                                className="block text-gray-700 text-base font-bold mb-1"
                            >
                                Product Stock:
                            </label>
                            <input
                                id="productStock"
                                type="number"
                                placeholder="Enter Product Stock"
                                ref={product_stock}
                                className="w-full border border-gray-300 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>

                        {/* Add product button */}
                        <div className="flex justify-end">
                            <button
                                type="button"
                                onClick={submit}
                                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-lg shadow-md hover:shadow-lg transition duration-300 ease-in-out"
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