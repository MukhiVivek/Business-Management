import '../../../App.css'

function CustomersList({customerdata}) {

  return (
    <div className="customers overflow-y-auto">
      <table className="w-full table-fixed border-t text-left">
        <thead className="bg-gray-50 text-gray-500 uppercase text-xs tracking-wider border-b dark:bg-gray-100">
          <tr>
            {/* <th className="px-4 py-3"><i className="fas fa-sliders-h"></i></th> */}
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
          {customerdata.map((customer) => (
            <tr key={customer.id }>
              {/* <td className="px-4 py-4"><input type="checkbox" /></td> */}
              <td className="px-4 py-4 text-blue-600 font-medium cursor-pointer">{customer.name}</td>
              <td className="px-4 py-4">{customer.company_name || '—'}</td>
              <td className="px-4 py-4">{customer.email || '—'}</td>
              <td className="px-4 py-4">+91 {customer.phone_number}</td>
              <td className="px-4 py-4">₹{customer.receivables || '0.00'}</td>
              <td className="px-4 py-4">₹{customer.unused_credits || '0.00'}</td>
              <td className="px-4 py-4"><i className="fas fa-eye cursor-pointer text-gray-600"></i></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default CustomersList
