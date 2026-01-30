import React, { useState } from "react";
import ProductsList from "./ProductsList";
import { useProduct } from "../../hooks/useProduct";
import { useNavigate } from "react-router-dom"

const Products = () => {

  const { data: products } = useProduct();
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const itemsPerPage = 25;

  const navigate = useNavigate();

  // Filter logic
  const filteredProducts = Array.isArray(products) ? products.filter(product =>
    String(product.name || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
    String(product.product_type || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
    String(product.description || "").toLowerCase().includes(searchTerm.toLowerCase())
  ) : [];

  // Calculate pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentProducts = filteredProducts.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1); // Reset to first page on search
  };

  return (
    <div className="ml-14 p-6 min-h-screen bg-gray-50 flex-1 block">
      {/* Header */}
      <div className="flex justify-between items-start mb-2 mt-1">
        <div className="flex gap-3">
          <input
            type="text"
            placeholder="🔍 Search (Name, Type, Desc)"
            className="pl-3 border-2 border-gray-400 bg-gray-100 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 w-64"
            value={searchTerm}
            onChange={handleSearch}
          />
          <h1 className="text-md mt-1">Total Count: {filteredProducts.length}</h1>
          <h1 className="text-md mt-1 font-medium text-gray-500 ml-2">
            (Showing {filteredProducts.length > 0 ? indexOfFirstItem + 1 : 0}-{Math.min(indexOfLastItem, filteredProducts.length)} of {filteredProducts.length})
          </h1>
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
        {filteredProducts.length === 0 ? (
          <div className="text-center py-10">
            <p className="text-gray-500 text-lg">No products found matching "{searchTerm}".</p>
          </div>
        ) : (
          <>
            <ProductsList data={currentProducts} />
            {/* Pagination Controls */}
            <div className="flex justify-center items-center gap-4 mt-6 mb-8">
              <button
                onClick={() => paginate(currentPage - 1)}
                disabled={currentPage === 1}
                className={`px-4 py-2 border rounded ${currentPage === 1 ? "bg-gray-200 text-gray-400 cursor-not-allowed" : "bg-white text-blue-500 hover:bg-blue-50 border-blue-500"
                  }`}
              >
                Previous
              </button>
              <span className="text-gray-700">
                Page {currentPage} of {totalPages}
              </span>
              <button
                onClick={() => paginate(currentPage + 1)}
                disabled={currentPage === totalPages || totalPages === 0}
                className={`px-4 py-2 border rounded ${currentPage === totalPages || totalPages === 0 ? "bg-gray-200 text-gray-400 cursor-not-allowed" : "bg-white text-blue-500 hover:bg-blue-50 border-blue-500"
                  }`}
              >
                Next
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Products;
