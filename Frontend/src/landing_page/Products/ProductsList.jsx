function ProductsList({data}) {
  return (
    <div className='products overflow-y-auto'>
        <table className="w-full table-fixed border-t text-left">
            <thead className="bg-gray-50 text-gray-500 uppercase text-xs tracking-wider border-b dark:bg-gray-100">
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
                {data.map((product) => (
                <tr className='hover:bg-gray-50 font-semibold'>
                    <td className="px-4 py-4"><input type="checkbox" /></td>
                    <td className="px-4 py-4">{product.name}</td>
                    <td className="px-4 py-4">{product.price}</td>
                    <td className='px-4 py-4'>{product.product_type}</td>
                    <td className="px-4 py-4">{product.description}</td>
                    <td className="px-4 py-4">{product.stock}</td>
                    <td className="px-4 py-4"><i className="fas fa-eye cursor-pointer text-gray-600"></i></td>
                </tr>
                ))}
            </tbody>
        </table>
    </div>
  )
}

export default ProductsList
