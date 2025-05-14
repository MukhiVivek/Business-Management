import { useRef } from "react";

function AddProducts() {
    const product_name = useRef();
    const product_price = useRef();
    const product_type = useRef();
    const product_description = useRef();
    const product_stock = useRef();

    function submit() { }

    return (
        <div className="flex min-h-screen pl-25 bg-white px-6 py-5 mx-auto">
            <div className="w-full">
                <h1 className="text-3xl font-semibold mb-6">Add Product</h1>

                {/* product form */}
                <div className="mb-4">
                    <div className="border rounded-2xl p-4">
                        {/* product name */}
                        <div className="mb-4">
                            <label className="block mb-1">Product Name:</label>
                            <input
                                type="text"
                                placeholder="Enter your Product Name"
                                ref={product_name}
                                className="w-full border border-gray-300 px-4 py-2 rounded-2xl"
                            />
                        </div>

                        {/* product price */}
                        <div className="mb-4">
                            <label className="block mb-1">Product Price:</label>
                            <input
                                type="number"
                                placeholder="Enter Product Price"
                                ref={product_price}
                                className="w-full border border-gray-300 px-4 py-2 rounded-2xl"
                            />
                        </div>

                        {/* product type */}
                        <div className="mb-4">
                            <label className="block mb-1">Product Type:</label>
                            <input
                                type="text"
                                placeholder="Enter Product Type"
                                ref={product_type}
                                className="w-full border border-gray-300 px-4 py-2 rounded-2xl"
                            />
                        </div>

                        {/* product description */}
                        <div className="mb-4">
                            <label className="block mb-1">Product Description:</label>
                            <input
                                type="text"
                                placeholder="Enter Product Description"
                                ref={product_description}
                                className="w-full border border-gray-300 px-4 py-2 rounded-2xl"
                            />
                        </div>

                        {/* product stock */}
                        <div className="mb-4">
                            <label className="block mb-1">Product Stock:</label>
                            <input
                                type="number"
                                placeholder="Enter Product Stock"
                                ref={product_stock}
                                className="w-full border border-gray-300 px-4 py-2 rounded-2xl"
                            />
                        </div>

                        {/* Add product button */}
                        <div className="mt-4">
                            <button
                                type="submit"
                                onClick={submit}
                                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 mx-auto rounded-xl"
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
