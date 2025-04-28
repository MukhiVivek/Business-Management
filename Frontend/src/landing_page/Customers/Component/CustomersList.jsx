import '../../../App.css'

function CustomersList() {
  return (

    <div className="customers overflow-x-auto">
      <table className="min-w-full table-auto border-t text-left">
        <thead className="bg-gray-50 text-gray-500 uppercase text-xs tracking-wider border-b dark:bg-gray-100">
          <tr>
            <th className="px-4 py-3">
              <i className="fas fa-sliders-h"></i>
            </th>
            <th className="px-4 py-3">Name <i className="fas fa-sort text-xs ml-1"></i></th>
            <th className="px-4 py-3">Company Name</th>
            <th className="px-4 py-3">Email</th>
            <th className="px-4 py-3">Work Phone</th>
            <th className="px-4 py-3">Receivables (BCY)</th>
            <th className="px-4 py-3">Unused Credits (BCY)</th>
            <th className="px-4 py-3"><i className="fas fa-search"></i></th>
          </tr>
        </thead>
        <tbody className="divide-y">
          <tr className="hover:bg-gray-50">
            <td className="px-4 py-4">
              <input type="checkbox" />
            </td>
            <td className="px-4 py-4 text-blue-600 font-medium cursor-pointer">Danev</td>
            <td className="px-4 py-4">Danev</td>
            <td className="px-4 py-4"></td>
            <td className="px-4 py-4"></td>
            <td className="px-4 py-4">₹0.00</td>
            <td className="px-4 py-4">₹0.00</td>
            <td className="px-4 py-4"></td>
          </tr>
          <tr className="hover:bg-gray-50">
            <td className="px-4 py-4">
              <input type="checkbox" />
            </td>
            <td className="px-4 py-4 text-blue-600 font-medium cursor-pointer">OSIYA HYPER RETAIL LIMITED</td>
            <td className="px-4 py-4">OSIYA HYPER RETAIL LIMITED</td>
            <td className="px-4 py-4"></td>
            <td className="px-4 py-4">7096036829</td>
            <td className="px-4 py-4">₹0.00</td>
            <td className="px-4 py-4">₹0.00</td>
            <td className="px-4 py-4"></td>
          </tr>
        </tbody>
      </table>
    </div>
  )
}

export default CustomersList