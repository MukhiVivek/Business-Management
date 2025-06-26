import { MdOutlineLightMode, MdSettings } from "react-icons/md";
import { Link } from "react-router-dom";
import Dropdown from "../Dropdown/Dropdown";

const Topnavbar = () => {

  return (
    <div className="sticky top-0 flex gap-x-2 justify-end h-12 w-full items-center  bg-gray-800 text-white px-4">

      {/* Theme Change */}
      <div className="theme flex w-8 h-8">
        <button className="cursor-pointer">
          <MdOutlineLightMode size={26} />
        </button>
      </div>

      {/* Settings */}
      <Link to="/settings">
        <div className="settings w-8 h-8">
          <button className="pt-1 cursor-pointer">
            <MdSettings size={25} />
          </button>
        </div>
      </Link>

      {/* User Login Register Dropdown Menu */}
      <div className="dropdown">
        <Dropdown />
      </div>
    </div>
  );
};

export default Topnavbar;
