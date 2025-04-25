function IsLogged() {
    return ( 
        <ul className="text-sm">
        <li>
          <button className="block px-4 py-2 text-white hover:bg-gray-700 w-full text-left">
            Profile
          </button>
        </li>
        <li>
          <button className="block px-4 py-2 text-white hover:bg-gray-700 w-full text-left">
            My account
          </button>
        </li>
        <li>
          <button  className="block px-4 py-2 text-white hover:bg-gray-700 w-full text-left">
            Logout
          </button>
        </li>
      </ul>
     );
}

export default IsLogged;