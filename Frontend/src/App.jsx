import './App.css'
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom'
import Sidebar from './landing_page/includes/Sidebar/Sidebar';
import Dashboard from './landing_page/Dashboard/Dashboard';
import Products from './landing_page/Products/Products'
import Customers from './landing_page/Customers/Customers'
import Orders from './landing_page/Orders/Orders'
import Invoice from './landing_page/Invoice/Invoice';
import Add_customer from './landing_page/Customers/Add_customer';
import SignIn from './landing_page/LoginPag/SignIn';
import SignUp from './landing_page/LoginPag/Signup';
import AddProducts from './landing_page/Products/AddProducts';
import Topnavbar from './landing_page/includes/Sidebar/Topbar/Topnavbar';

function App() {
  return (
    <Router>
      <div className="App min-h-screen">
        <Topnavbar />
        <Sidebar/>
        <div className='bg-gray-100 min-h-screen '>
          <Routes>
            <Route exact path='/' element={<SignIn />} />
            <Route exact path='/signin' element={<SignIn />} />
            <Route exact path='/signup' element={<SignUp/>} />
            <Route exact path='/invoice' element={<Invoice/>} />
            <Route exact path='/dashboard' element={<Dashboard/>} />

            <Route exact path='/products' element={<Products/>} />
            <Route exact path='/products/add' element={<AddProducts/>} />
            
            <Route exact path='/orders' element={<Orders/>} />

            <Route exact path='/customers' element={<Customers/>} />

            {/* Sub Pages */}
            <Route exact path='/customers/add' element={<Add_customer/>} />

          </Routes>
        </div>
      </div>
    </Router>
  )
}

export default App;
