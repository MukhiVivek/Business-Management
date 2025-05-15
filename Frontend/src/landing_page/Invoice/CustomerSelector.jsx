import React, { useState } from 'react';

function CustomerSelector({ onSelect, customerData }) {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredCustomers = customerData.filter(
    (c) =>
      c.name.toLowerCase().includes(searchTerm.toLowerCase())
      // Add more conditions for filtering if needed
  );

  return (
    <div className="p-4">
      <input
        type="text"
        placeholder="Search customer..."
        className="w-full px-3 py-2 mb-4 border border-gray-300 rounded"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      <ul className="divide-y divide-gray-300">
        {filteredCustomers.map((customer) => (
          <li
            key={customer.id} // Ensure each item has a unique key
            className="py-2 cursor-pointer hover:bg-gray-100 px-2"
            onClick={() => onSelect(customer)}
          >
            <p className="font-medium">{customer.name}</p>
            {/* Uncomment below to show additional customer info */}
            {/* <p className="text-sm text-gray-500">{customer.company}</p> */}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default CustomerSelector;
