import { Link, useNavigate } from "react-router-dom";
import { FaUserCircle } from "react-icons/fa";
import { useAuth } from "@/context/AuthContext";
import { useEffect, useState } from "react";


const Navbar = () => {
  const { state, dispatch } = useAuth();
  const { user } = state;
  const navigate = useNavigate();

  // State to toggle dropdown visibility
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);
  
  const handleLogout = () => {
    // Clear token and user data
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    // Update global state
    dispatch({ type: "LOGOUT" });

    // Navigate to login
    navigate("/login");
  };

  const toggleDropdown = () => {
    setDropdownVisible(!dropdownVisible);
  };

  return (
    <nav className={`bg-blue-600 text-white shadow-md sticky top-0 z-50 transition-shadow duration-300 ${
      isScrolled ? "shadow-lg" : "shadow-none"
    }`}>
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        {/* Logo */}
        <Link to="/">
        <div className="flex items-center space-x-3">
  <img
    src="./logo2.png"
    className="rounded-full"
    width={50}
    height={50}
    alt="Efficio Logo"
  />
  <span style={{ fontFamily: 'Roboto' }} className="text-2xl font-bold text-white">Efficio</span>
</div>

        </Link>

        {/* User Info or Login */}
        <div className="relative">
          <button
            onClick={toggleDropdown}
            className="flex items-center gap-2 focus:outline-none"
          >
            <FaUserCircle className="w-6 h-6" />
           {/** {user && <span>@{user.username}</span>} */}
            
          </button>

          {/* Dropdown Menu */}
          {dropdownVisible && user && (
            <div className="absolute flex flex-col items-center right-0 mt-2 w-40 bg-white text-black rounded shadow-lg">
              <div className="p-2  border-b border-b-blue-700">
                <p className="text-sm font-medium">Logged in as:</p>
                <p className="text-sm text-blue-700 font-bold">@{user.username}</p>
              </div>
              <hr className="my-1" />
              <button
                onClick={handleLogout}
                className="w-full px-4 shadow-sm py-2 text-center font-bold text-sm text-blue-700 hover:bg-gray-100"
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
