import React from 'react'
import ProductsList from './ProductsList'

const Products = () => {
  return (
    <div className='pl-12 customers flex justify-center rounded-lg m-7'>
      <div className="bg-white w-full sm:rounded-lg shadow-lg text-sm">
        
        {/* Top Section */}
        <div className="flex items-center justify-between px-6 py-2">
            <div className="text-3xl font-semibold">
                All Products 
          </div>
            <div className="flex items-center gap-3">
                <button 
                className="bg-blue-600 font-bold hover:bg-blue-700 text-white px-4 py-2 rounded shadow-md hover:shadow-lg"
                onClick={() => window.location.href = '/products/add'}
                > 
                    + New
                </button>
            </div>
        </div>

        <ProductsList />
      </div>
    </div>
  )
}

export default Products
