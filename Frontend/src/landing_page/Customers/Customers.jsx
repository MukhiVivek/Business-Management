import '../../App.css'

const Customers = () => {
  return (
    <div className='ml-19 customers flex justify-center rounded-lg m-7'>
      <div className="bg-white w-full sm:rounded-lg shadow-lg text-sm">

        {/* Top Section */}
        <div className="flex items-center border-b justify-between px-6 py-2">
          <h1 className="text-3xl font-semibold text-gray-900">
            All Customers
          </h1>
          <div className="flex items-center gap-3">
            <button
              className="bg-blue-600 font-bold hover:bg-blue-700 text-white px-4 py-2 rounded"
              onClick={() => window.location.href = '/customers/add'}
            >
              + New
            </button>
          </div>
        </div>

        {/* Customer section */}
        <div className="overflow-x-auto sm:rounded-lg">
          <table className="w-full text-sm text-left text-black">
            <caption className="p-5 text-lg font-semibold text-left text-gray-900 bg-white">
              Customer List
            </caption>
            <thead className="text-xs uppercase bg-gray-50 text-gray-600">
              <tr>
                <th className="px-4 py-3"><i className="fas fa-sliders-h"></i></th>
                <th className="px-4 py-3">
                  Name <i className="fas fa-sort text-xs ml-1"></i>
                </th>
                <th className="px-4 py-3">Company Name</th>
                <th className="px-4 py-3">Email</th>
                <th className="px-4 py-3">Work Phone</th>
                <th className="px-4 py-3">Receivables (BCY)</th>
                <th className="px-4 py-3">Unused Credits (BCY)</th>
                <th className="px-4 py-3"><i className="fas fa-search"></i></th>
              </tr>
            </thead>
            <tbody>
              <tr className="bg-white hover:bg-gray-50">
                <td className="px-4 py-4"><input type="checkbox" /></td>
                <td className="px-4 py-4 text-blue-600 font-medium cursor-pointer">Danev</td>
                <td className="px-4 py-4">Danev</td>
                <td className="px-4 py-4">m</td>
                <td className="px-4 py-4">123456789</td>
                <td className="px-4 py-4 font-semibold text-gray-900">₹0.00</td>
                <td className="px-4 py-4 font-semibold text-gray-900">₹0.00</td>
                <td className="px-4 py-4"></td>
              </tr>
              <tr className="bg-white hover:bg-gray-50">
                <td className="px-4 py-4"><input type="checkbox" /></td>
                <td className="px-4 py-4 text-blue-600 font-medium cursor-pointer">OSIYA HYPER RETAIL LIMITED</td>
                <td className="px-4 py-4">OSIYA HYPER RETAIL LIMITED</td>
                <td className="px-4 py-4"></td>
                <td className="px-4 py-4">7096036829</td>
                <td className="px-4 py-4 font-semibold text-gray-900">₹0.00</td>
                <td className="px-4 py-4 font-semibold text-gray-900">₹0.00</td>
                <td className="px-4 py-4"></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default Customers;
