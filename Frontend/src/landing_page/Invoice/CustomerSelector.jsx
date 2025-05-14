import React, { useState } from 'react';

// mock data for testing the search
const customerData = [ 
  {
    name: 'Danev',
    company: 'Danev Food ltd.',
    email: 'm',
    phone: '123456789',
  },
  {
    name: 'OSIYA HYPER RETAIL LIMITED',
    company: 'OSIYA HYPER RETAIL LIMITED',
    email: '',
    phone: '7096036829',
  },
  {
    name: 'Mukeshbhai',
    company: 'Kumar Gruh Udhyog',
    email: 'vivekmukhi07@gmail.com',
    phone: '8282822882'
  }
];

function CustomerSelector({ onSelect }) {
  const [searchTerm, setSearchTerm] = useState('');

  const filtered = customerData.filter(c =>
    c.name.toLowerCase().includes(searchTerm.toLowerCase())
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
        {filtered.map((customer, index) => (
          <li
            key={index}
            className="py-2 cursor-pointer hover:bg-gray-100 px-2"
            onClick={() => onSelect(customer)}
          >
            <p className="font-medium">{customer.name}</p>
            <p className="text-sm text-gray-500">{customer.company}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default CustomerSelector;