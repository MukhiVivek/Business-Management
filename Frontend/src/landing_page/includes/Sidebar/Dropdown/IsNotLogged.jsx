function IsNotLogged() {
    return ( 
      <ul className="text-sm">
      <li>
        <button  className="block px-4 py-2 text-white hover:bg-gray-700 w-full text-left">
          Login
        </button>
      </li>
      <li>
        <button  className="block px-4 py-2 text-white hover:bg-gray-700 w-full text-left">
          Register
        </button>
      </li>
    </ul>
     );
}

export default IsNotLogged;