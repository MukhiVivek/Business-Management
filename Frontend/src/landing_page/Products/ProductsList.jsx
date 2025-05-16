import React from 'react'

function ProductsList() {
  return (
    <div className='products overflow-y-auto sm-rounded-lg'>
        <table className="w-full text-black text-left">
            <thead className="bg-white text-gray-500 uppercase text-xs tracking-wider dark:bg-gray-100">
                <tr>
                    <th className="px-4 py-3"><i className="fas fa-sliders-h"></i></th>
                    <th className="px-4 py-3">Name <i className="fas fa-sort text-xs ml-1"></i></th>
                    <th className="px-4 py-3">Price</th>
                    <th className='px-4 py-3'>Type</th>
                    <th className="px-4 py-3">Description</th>
                    <th className="px-4 py-3">Stock</th>
                    <th className="px-4 py-3"><i className="fas fa-search"></i></th>
                </tr>
            </thead>
            <tbody>
                <tr className='hover:bg-gray-50'>
                    <td className="px-4 py-4"><input type="checkbox" /></td>
                    <td className="px-4 text-blue-600 font-medium py-4">Swaminarayan Lot</td>
                    <td className="px-4 py-4 font-semibold">₹1000</td>
                    <td className='px-4 py-4'>Wheat</td>
                    <td className="px-4 py-4">description of lot</td>
                    <td className="px-4 py-4 font-semibold">20</td>
                </tr>
                <tr className='hover:bg-gray-50'>
                    <td className="px-4 py-4"><input type="checkbox" /></td>
                    <td className="px-4 font-medium text-blue-600 py-4">Farali Chips</td>
                    <td className="px-4 py-4 font-semibold">₹590</td>
                    <td className='px-4 py-4'>Nasto</td>
                    <td className="px-4 py-4">Description</td>
                    <td className="px-4 py-4 font-semibold">35</td>
                </tr>
            </tbody>
        </table>
    </div>
  )
}

export default ProductsList
