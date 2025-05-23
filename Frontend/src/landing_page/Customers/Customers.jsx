import Top from './Component/Top'
import CustomersList from './Component/CustomersList'
import '../../App.css'
import { useCustomer } from '../../hooks/useCustomer'

const Customers = () => {

  const {data:customerdata} = useCustomer();
  
  return (
    <div className='pl-12 customers flex justify-center rounded-lg w-full'>
      <div className="bg-gray-100 shadow-lg min-h-screen font-sans text-sm text-gray-900">
        <Top />
        <CustomersList />
      </div>
    </div>
  )
}

export default Customers;
