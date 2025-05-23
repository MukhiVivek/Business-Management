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
          
        </tbody>
      </table>
    </div>
  )
}

export default CustomersList
