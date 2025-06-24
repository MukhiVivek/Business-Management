import React, { useState, useRef, useEffect } from 'react';
import './Dropdown.css';
import IsLogged from './IsLogged';
import IsNotLogged from './IsNotLogged';

const Dropdown = () => {
  const buttonRef = useRef(null);
  const [isOpen, setIsOpen] = useState(false);

  const [isLoggedIn, setIsLoggedIn] = useState(false); // null = not yet checked

  const [profileName, setProfileName] = useState('P');

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setIsLoggedIn(true);
      const userName = 'John Doe';
      const intials = userName
      .split(" ")
      .map((name)=>name[0])
      .join("");
      setProfileName(intials)
    } else {
      setIsLoggedIn(false);
    }
  }, []);

  return (
    <li className="relative flex items-center">
      <button
        id="basic-button"
        aria-haspopup="true"
        className="w-8 h-8 flex items-center justify-center rounded-full text-lg border-2 bg-white text-fuchsia-900 font-semibold cursor-pointer"
        ref={buttonRef}
        onClick={() => setIsOpen(!isOpen)}
      >
        {profileName}
      </button>
      {isOpen && (
        <div className="absolute z-10 w-30 py-2 mt-1 bg-gray-800 rounded-md shadow-lg right-0 top-10 botton-20" aria-labelledby="basic-button"> 
        {/* Dropdown menu */}
        {isLoggedIn ? <IsLogged /> : <IsNotLogged />}
      </div>
      )}
    </li>
  );
};



export default Dropdown;