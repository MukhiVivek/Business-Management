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
import Topnavbar from "./landing_page/includes/Sidebar/Topbar/Topnavbar";
import Payment from "./landing_page/payment/payment";
import AddPayment from "./landing_page/payment/addinvoicepayment";
import Purchase from "./landing_page/Purchase/Purchase";
import AddPurchase from "./landing_page/Purchase/AddPurchase";
import PurchaseDashboard from "./landing_page/Purchase/PurchaseDashboard";
import PurchasePayment from "./landing_page/Purchase/PurchasePayment";
import Vendors from "./landing_page/Purchase/Vendors";
import AddVendor from "./landing_page/Purchase/AddVendor";


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
          <Route path="/invoice" element={<Invoice />} />
          <Route path="/invoice/edit/:id" element={<Invoice />} />
          <Route path="/products" element={<Products />} />
          <Route path="/products/add" element={<AddProducts />} />
          <Route path="/orders" element={<Orders />} />
          <Route path="/customers" element={<Customers />} />
          <Route path="/customers/add" element={<Add_customer />} />
          <Route path="/payment" element={<Payment />} />
          <Route path="/payment/add" element={<AddPayment />} />
          <Route path="/purchase" element={<Purchase />} />
          <Route path="/purchase/dashboard" element={<PurchaseDashboard />} />
          <Route path="/purchase/add" element={<AddPurchase />} />
          <Route path="/purchase/edit/:id" element={<AddPurchase />} />
          <Route path="/purchase/payment" element={<PurchasePayment />} />
          <Route path="/vendors" element={<Vendors />} />
          <Route path="/vendors/add" element={<AddVendor />} />
          <Route path="/vendors/edit/:id" element={<AddVendor />} />

        </Routes>
      </div>
    </Router>
  );
}

export default App;