import React, { useState, useRef } from 'react';
import './Dropdown.css'; 

const Dropdown = () => {
  const [isOpen, setIsOpen] = useState(false);
  const buttonRef = useRef(null); 

  const handleClick = () => {
    setIsOpen(!isOpen);
  };

  const handleClose = () => {
    setIsOpen(false);
  };

  return (
    <li className="relative"> 
      <button
        id="basic-button"
        aria-haspopup="true"
        aria-expanded={isOpen ? 'true' : 'false'}
        onClick={handleClick}
        className="text-white text-xl flex" 
        ref={buttonRef} 
      >
        <img
          src="\public\vite.svg" // Replace with your image URL
          alt="Profile"
          className="rounded-full h-7 w-7 mr-1" // Adjust size as needed
        />
        User
      </button>
      {isOpen && (
        <div className="absolute z-10 w-48 py-2 mt-1 bg-gray-800 rounded-md shadow-lg left-0 bottom-full transform -translate-y-1" aria-labelledby="basic-button"> {/* Dropdown menu */}
          <ul className="text-sm">
            <li>
              <button onClick={handleClose} className="block px-4 py-2 text-white hover:bg-gray-700 w-full text-left">
                Profile
              </button>
            </li>
            <li>
              <button onClick={handleClose} className="block px-4 py-2 text-white hover:bg-gray-700 w-full text-left"> 
                My account
              </button>
            </li>
            <li>
              <button onClick={handleClose} className="block px-4 py-2 text-white hover:bg-gray-700 w-full text-left"> 
                Logout
              </button>
            </li>
          </ul>
        </div>
      )}
    </li>
  );
};

export default Dropdown;