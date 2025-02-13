import React from 'react';

const Sidebar = () => {
  return (
    <div className="flex flex-col flex-shrink-0 p-3 w-64 bg-gray-800 text-white"> 
      <a href="/" className="flex items-center text-white text-decoration-none">
        <span className="text-2xl ml-15">Business</span> 
      </a>
      <hr className="my-3" />
      <ul className="nav nav-pills flex-col mb-auto">
        <li className="nav-item">
          <a href="#" className="nav-link active" aria-current="page">
            Home
          </a>
        </li>
        <li className="nav-item">
          <a href="#" className="nav-link text-white">
            Dashboard
          </a>
        </li>
        <li className="nav-item">
          <a href="#" className="nav-link text-white">
            Orders
          </a>
        </li>
        <li className="nav-item">
          <a href="#" className="nav-link text-white">
            Products
          </a>
        </li>
        <li className="nav-item">
          <a href="#" className="nav-link text-white">
            Customers
          </a>
        </li>
      </ul>
      <hr className="my-4" />
      <div className="dropdown">
        <a
          href="#"
          className="flex items-center text-white text-decoration-none dropdown-toggle"
          data-bs-toggle="dropdown" // If using Bootstrap JS for dropdown
          aria-expanded="false"
        >
          <img
            src="https://github.com/mdo.png"
            alt=""
            width="32"
            height="32"
            className="rounded-circle me-2"
          />
          <strong>mdo</strong>
        </a>
        <ul className="dropdown-menu dropdown-menu-dark text-small shadow">
          <li>
            <a className="dropdown-item" href="#">
              New project...
            </a>
          </li>
          <li>
            <a className="dropdown-item" href="#">
              Settings
            </a>
          </li>
          <li>
            <a className="dropdown-item" href="#">
              Profile
            </a>
          </li>
          <li>
            <hr className="dropdown-divider" />
          </li>
          <li>
            <a className="dropdown-item" href="#">
              Sign out
            </a>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Sidebar;