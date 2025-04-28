import React from 'react'
import Top from './Component/Top'
import CustomersList from './Component/CustomersList'
import '../../App.css'

const Customers = () => {
  return (
    <div className='customers flex justify-center py-5 rounded-lg sm:rounded-lg'>
      <div className="bg-gray-100 shadow-lg min-h-screen font-sans text-sm text-gray-900">
        <Top />
        <CustomersList />
      </div>
    </div>
  )
}

export default Customers;
