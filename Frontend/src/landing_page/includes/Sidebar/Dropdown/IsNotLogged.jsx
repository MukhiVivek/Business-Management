import { useNavigate } from "react-router-dom";

function IsNotLogged() {

    const navigate = useNavigate();

    return ( 
      <ul className="text-sm">
      <li>
        <button onClick={()=> navigate('/')}  className="block px-4 py-2 text-white hover:bg-gray-700 w-full text-left">
          Login
        </button>
      </li>
      <li>
        <button onClick={()=> navigate('/signup')}  className="block px-4 py-2 text-white hover:bg-gray-700 w-full text-left">
          Register
        </button>
      </li>
    </ul>
     );
}

export default IsNotLogged;