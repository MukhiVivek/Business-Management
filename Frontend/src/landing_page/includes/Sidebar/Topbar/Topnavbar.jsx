import { MdOutlineLightMode, MdSettings } from "react-icons/md";
import { Link } from "react-router-dom";
import Dropdown from "../Dropdown/Dropdown";
import "../../../../App.css";
import { FaMagnet } from "react-icons/fa6";

const Topnavbar = () => {
  return (
    <div className="noto-sans sticky top-0 flex gap-x-2 justify-between h-12 w-full items-center  bg-gray-800 text-white px-4">

      <div className="flex justify-center items-center">
        <div className="text-3xl "><FaMagnet /></div>
        <h2 className="ml-2 text-2xl">Magnet - Your Business Management Tool</h2>
      </div>

      <div className="right flex">
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
        <div className="profile dropdown">
          <Dropdown />
        </div>
      </div>
    </div>
  );
};

export default Topnavbar;
