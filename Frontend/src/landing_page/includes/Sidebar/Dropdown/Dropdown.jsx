import React, { useState, useRef } from 'react';
import './Dropdown.css';
import IsLogged from './IsLogged';
import IsNotLogged from './IsNotLogged';






const Dropdown = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [logedIn, setLoggedIn] = useState(true); 
  const buttonRef = useRef(null);

  const handleClick = () => {
    setIsOpen(!isOpen);
    setLoggedIn(!logedIn); // Toggle logged-in state for demonstration
  };

  const handleClose = () => {
    setIsOpen(false);
  };

  
  return (
    <li className="relative flex items-center">
      <button
        id="basic-button"
        aria-haspopup="true"
        aria-expanded={isOpen ? 'true' : 'false'}
        onClick={handleClick}
        className="w-8 h-8 flex items-center justify-center rounded-full text-white text-lg font-bold bg-gradient-to-r from-pink-500 to-yellow-500"
        ref={buttonRef}
      >
        A
      </button>

      {isOpen && (
        <div className="absolute z-10 w-48 py-2 mt-1 bg-gray-800 rounded-md shadow-lg left-0 bottom-full transform -translate-y-1" aria-labelledby="basic-button"> {/* Dropdown menu */}
            {logedIn ? <IsLogged /> : <IsNotLogged />}
        </div>
      )}
    </li>
  );
};



export default Dropdown;