import ProductsList from "./ProductsList";
import { useProduct } from "../../hooks/useProduct";
import { useNavigate } from "react-router-dom"

const Products = () => {

  const { data: products } = useProduct();

  const navigate = useNavigate();

  return (
    <div className="pl-18 pt-2 pr-9 min-h-screen block rounded-lg w-full">
      {/* Header */}
      <div className="flex justify-between items-start mb-2 mt-1">
        <div className="flex gap-3">
          <input
            type="text"
            placeholder="🔍 Search"
            className="pl-3 border-2 border-gray-400 bg-gray-100 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <h1 className="text-md mt-1">Total Count: {products.length}</h1>
        </div>
        <div>
          <h1 className="text-xl font-semibold text-gray-700">Products</h1>
        </div>
      </div>
      <div className="min-h-screen font-sans text-sm">
        <div className="flex justify-between items-center">
          <h1 className="text-xl font-semibold">Products List</h1>
          <div className="flex items-center gap-2">
            <button
              className="hover:bg-blue-700 bg-blue-600 hover:shadow-5xl px-2 text-white mb-2 shadow-md cursor-pointer"
              onClick={() => navigate("/products/add")}
            >
              <h1 className="text-[17px] py-1">✚ New</h1>
            </button>
          </div>
        </div>
        {!products || products.length === 0 ? (
          <p>No Products found.</p>
        ) : (
          <ProductsList data={products} />
        )}
      </div>
    </div>
  );
};

export default Products;
