import React from 'react'
import Top from './Component/Top'
import CustomersList from './Component/CustomersList'

const Customers = () => {
  return (
    <div className='flex'>
      <div className="mx-1 bg-white min-h-screen font-sans text-sm text-gray-900">
        <Top />
        <CustomersList />
      </div>
    </div>
  )
}

export default Customers;
