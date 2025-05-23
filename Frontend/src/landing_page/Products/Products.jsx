import React from 'react'
import ProductsList from './ProductsList'
import { useProduct } from '../../hooks/useProduct';

const Products = () => {

   const {data:products} = useProduct();
  
  return (
    <div className='pl-12 customers flex justify-center rounded-lg w-full'>
      <div className="bg-gray-50 shadow-lg min-h-screen font-sans text-sm text-gray-900">
        
        {/* Top Section of Products */}
        <div className="flex items-center justify-between border-b px-6 py-4">
            <div className="text-3xl font-semibold">
                All Products 
          </div>
            <div className="flex items-center gap-3">
                <button 
                className="bg-blue-600 font-bold hover:bg-blue-700 text-white px-4 py-2 rounded"
                onClick={() => window.location.href = '/products/add'}
                > 
                    + New
                </button>
            </div>
        </div>

        <ProductsList data={products} />
      </div>
    </div>
  )
}

export default Products
