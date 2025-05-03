import React, { useState, useRef, useEffect } from 'react';
import './Dropdown.css';
import IsLogged from './IsLogged';
import IsNotLogged from './IsNotLogged';


const Dropdown = () => {
  const buttonRef = useRef(null);

  const [isLoggedIn, setIsLoggedIn] = useState(false); // null = not yet checked

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setIsLoggedIn(true);
      console.log("Logged in");
    } else {
      setIsLoggedIn(false);
    }
  }, []);

  return (
    <li className="relative flex items-center">
      <button
        id="basic-button"
        aria-haspopup="true"
        className="w-8 h-8 flex items-center justify-center rounded-full text-white text-lg font-bold bg-gradient-to-r from-pink-500 to-yellow-500"
        ref={buttonRef}
      >
        A
      </button>


      <div className="absolute z-10 w-48 py-2 mt-1 bg-gray-800 rounded-md shadow-lg left-0 bottom-full transform -translate-y-1" aria-labelledby="basic-button"> {/* Dropdown menu */}
        {isLoggedIn ? <IsLogged /> : <IsNotLogged />}
      </div>

    </li>
  );
};



export default Dropdown;