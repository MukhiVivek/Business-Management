function ProductsList({data}) {
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
            <tbody className="divide-y">
                <tr className='hover:bg-gray-50 font-semibold'>
                    <td className="px-4 py-4"><input type="checkbox" /></td>
                    <td className="px-4 py-4">SwamiNarayan Lot</td>
                    <td className="px-4 py-4">₹1000</td>
                    <td className='px-4 py-4'>Lot</td>
                    <td className="px-4 py-4">description of lot</td>
                    <td className="px-4 py-4">20</td>
                </tr>
            </tbody>
        </table>
    </div>
  )
}

export default ProductsList
