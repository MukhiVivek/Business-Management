import Top from './Component/Top.tsx'
import CustomersList from './Component/CustomersList'
import '../../App.css'
import { useCustomer } from '../../hooks/useCustomer'
import { FaHandshake } from "react-icons/fa6";

const Customers = () => {

  const {data:customerdata} = useCustomer();
  
  return (
    <div className='pl-18 pt-2 pr-9 min-h-screen customers block rounded-lg w-full'>

      {/* Header */}
        <div className="flex justify-between items-start mb-2 mt-1">
          <div className='flex gap-3'>
            <input
              type="text"
              placeholder="🔍 Search"
              className="pl-3 border-2 border-gray-400 bg-gray-100 text-gray-700 focus:outline-none focus:ring-2 rounded-md focus:ring-blue-500"
            />
            {/* <FaHandshake size={30} className='inline'/> */}
            <h1 className='text-md mt-1'>Count: {customerdata.length}</h1>
          </div>
          <div>
            <h1 className="text-xl font-semibold text-gray-700">Customers</h1>
          </div>
        </div>
      <div className="min-h-screen font-sans text-sm text-gray-900">
        <Top />
        <CustomersList />
      </div>
    </div>
  )
}

export default Customers;
