import { FaMoneyBillTransfer } from "react-icons/fa6";
import { CiBoxes } from "react-icons/ci";
import { FaHome } from "react-icons/fa";
import { IoPersonSharp } from "react-icons/io5";
import { Link } from "react-router-dom";
import { LuBaggageClaim } from "react-icons/lu";
import "./Sidebar.css";
import { LiaFileInvoiceDollarSolid } from "react-icons/lia";
import { FaCartArrowDown } from "react-icons/fa";
import Logo from "../../../assets/Logo.png";


const Sidebar = () => {
  // Navigation items with SVG icons and Path
  const navItems = [
    {
      path: "/dashboard",
      label: "Dashboard",
      icon: <FaHome className="text-2xl" />,
    },
    {
      path: "/invoice",
      label: "Invoice",
      icon: <LiaFileInvoiceDollarSolid className="text-2xl" />,
    },
    {
      path: "/orders",
      label: "Orders",
      icon: <LuBaggageClaim className="text-2xl" />
    },
    {
      path: "/products",
      label: "Products",
      icon: <CiBoxes className="text-2xl" />
    },
    {
      path: "/customers",
      label: "Customers",
      icon: <IoPersonSharp className="text-2xl" />
    },
    {
      path: "/vendors",
      label: "Vendors",
      icon: <IoPersonSharp className="text-2xl" />
    },
    {
      path: "/payment",
      label: "Payment",
      icon: <FaMoneyBillTransfer className="text-2xl" />
    },
    {
      path: "/purchase",
      label: "Purchase",
      icon: <FaCartArrowDown className="text-2xl" />
    }

  ];

  return (
    <div
      className={`sidebar fixed left-0 top-0 h-screen flex flex-col flex-shrink-0 items-center justify-center bg-gray-800 text-white transition-all duration-300 w-13`}
    >
      {/* Logo */}
      <div className="logo mb-4">
        <img src={Logo} alt="Logo" className="w-8 h-8" />
      </div>

      {/* Navigation Links */}
      <ul className="nav mb-auto">
        {navItems.map(({ path, icon, label }) => (
          <li key={path} className="nav-item flex items-center gap-2 py-2">
            <Link to={path} className="flex items-center rounded-md p-2 gap-2">
              {icon}
            </Link>
          </li>
        ))}
      </ul>

      <hr />
    </div>
  );
};

export default Sidebar;
