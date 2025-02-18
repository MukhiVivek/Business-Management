import './App.css'
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom'
import Sidebar from './landing_page/includes/Sidebar/Sidebar';
import Dashboard from './landing_page/Dashboard/Dashboard';
import Products from './landing_page/Products/Products'
import Customers from './landing_page/Customers/Customers'
import Orders from './landing_page/Orders/Orders'

function App() {
  return (
    <Router>
      <div className="App flex min-h-screen bg-gray-100">
        <Sidebar/>
        <div className="main-content flex-1 overflow-y-auto">
          <Routes>
            <Route exact path='/' element={<Dashboard/>} />
            <Route exact path='/dashboard' element={<Dashboard/>} />
            <Route exact path='/products' element={<Products/>} />
            <Route exact path='/orders' element={<Orders/>} />
            <Route exact path='/customers' element={<Customers/>} />
          </Routes>
        </div>
      </div>
    </Router>
  )
}

export default App;
