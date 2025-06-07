import React from "react";
import ProductsList from "./ProductsList";
import { useProduct } from "../../hooks/useProduct";
import '../.././App.css';

const Products = () => {
  const { data: products } = useProduct();

  return (
    <div className="rounded-2xl min-h-screen ml-13 p-8 bg-white">
      <div class="flex justify-between items-start mb-8">
        <div>
          <h2 class="text-lg text-gray-500">Track Your</h2>
          <h1 class="text-2xl font-bold text-gray-800">Inventory</h1>
        </div>
        <div>
          <h1 class="text-xl font-semibold text-gray-700">Products</h1>
        </div>
      </div>
      <div className="products justify-center rounded-lg">
        {/* Product Section */}
        <div className="bg-white sm:rounded-lg shadow-lg text-sm">
          <div className="flex items-center justify-between px-6 py-2">
            <div className="text-3xl font-semibold">All Products</div>
            <div className="flex items-center gap-3">
              <button
                className="bg-blue-600 font-bold hover:bg-blue-700 text-white px-4 py-2 rounded shadow-md hover:shadow-lg"
                onClick={() => (window.location.href = "/products/add")}
              >
                + New
              </button>
            </div>
          </div>

          <ProductsList data={products} />
        </div>
      </div>
    </div>
  );
};

export default Products;
