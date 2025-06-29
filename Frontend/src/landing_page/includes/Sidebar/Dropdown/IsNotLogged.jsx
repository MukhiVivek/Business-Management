import { useNavigate } from "react-router-dom";
import { HiUserAdd } from "react-icons/hi";
import { FaSignInAlt } from "react-icons/fa";

function IsNotLogged() {

    const navigate = useNavigate();

    return ( 
      <ul className="text-sm">
      <li>
        <button onClick={()=> navigate('/signin')}  className="block px-4 py-2 text-white hover:bg-gray-700 w-full text-left cursor-pointer">
          <FaSignInAlt className="inline mb-1 mr-2" size={17}/> Login
        </button>
      </li>
      <li>
        <button onClick={()=> navigate('/signup')}  className="block px-4 py-2 text-white hover:bg-gray-700 w-full text-left cursor-pointer">
          <HiUserAdd className="inline mb-1 mr-2" size={17}/> Register
        </button>
      </li>
    </ul>
     );
}

export default IsNotLogged;