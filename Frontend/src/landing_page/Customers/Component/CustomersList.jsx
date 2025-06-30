import "../../../App.css";

function CustomersList({ customerdata }) {
  
  // Checks all the row entries
  const handleSelectAll = (e) => {
    const checkboxes = document.querySelectorAll(
      'input[name="customerCheckbox"]'
    );
    checkboxes.forEach((checkbox) => {
      checkbox.checked = e.target.checked;
    });
  };

  return (
    <div className="customers">
      <table className="w-full border-t text-left rounded-sm">
        <thead className="bg-gray-50 text-center text-gray-500 uppercase text-xs  border-b border-l border-r dark:bg-gray-100">
          <tr>
            <th className="px-2 py-1 pl-2">
              <input
                type="checkbox"
                name="customerCheckbox"
                onChange={handleSelectAll}
              />
            </th>
            <th className="px-4 py-3">Customer Name</th>
            <th className="px-4 py-3">Company Name</th>
            <th className="px-4 py-3">Email</th>
            <th className="px-4 py-3">Work Phone</th>
            <th className="px-4 py-3">Balance</th>
            <th className="px-4 py-3">Customer Type</th>
          </tr>
        </thead>
        <tbody className="divide-y border-b border-l border-r text-center whitespace-nowrap">        
          {customerdata.map((customer) => (
            <tr key={customer._id?.$oid || customer._id} className="hover:bg-gray-50">
              <td className="px-2 py-1">
                <input type="checkbox" name="customerCheckbox" />
              </td>
              <td className="px-4 py-3">{customer.name}</td>
              <td className="px-4 py-3">{customer.company}</td>
              <td className="px-4 py-3">{customer.email ? customer.email : "---"}</td>
              <td className="px-4 py-3">{customer.work_phone_number}</td>
              <td className="px-4 py-3">{customer.balance}</td>
              <td className="px-4 py-3">{customer.customer_type}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default CustomersList;
