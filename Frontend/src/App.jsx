import { Route, BrowserRouter as Router, Routes, useLocation } from "react-router-dom";
import "./App.css";
import Add_customer from "./landing_page/Customers/Add_customer";
import Customers from "./landing_page/Customers/Customers";
import Dashboard from "./landing_page/Dashboard/Dashboard";
import Invoice from "./landing_page/Invoice/Invoice";
import SignIn from "./landing_page/LoginPag/SignIn";
import SignUp from "./landing_page/LoginPag/Signup";
import Orders from "./landing_page/Orders/Orders";
import AddProducts from "./landing_page/Products/AddProducts";
import Products from "./landing_page/Products/Products";
import Sidebar from "./landing_page/includes/Sidebar/Sidebar";
import Settings from "./landing_page/includes/Sidebar/Topbar/Settings";
import Topnavbar from "./landing_page/includes/Sidebar/Topbar/Topnavbar";

function App() {
  return (
    <Router>
      <Sidebar />
      <Topnavbar />
      <div className="App min-h-screen flex">
        <Routes>
          {/* Public routes */}
          <Route path="/signin" element={<SignIn />} />
          <Route path="/signup" element={<SignUp />} />

          {/* Protected routes */}
          <Route path="/" element={<Dashboard />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/invoice" element={<Invoice />} />
          <Route path="/products" element={<Products />} />
          <Route path="/products/add" element={<AddProducts />} />
          <Route path="/orders" element={<Orders />} />
          <Route path="/customers" element={<Customers />} />
          <Route path="/customers/add" element={<Add_customer />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;