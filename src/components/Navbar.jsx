import React, { useContext, useState, useEffect, useRef } from "react";
import { assets } from "../assets/assets";
import { useNavigate } from "react-router-dom";
import { AppContent } from "../context/AppContext";
import { toast } from "react-toastify";
import axios from "axios";

const Navbar = () => {
  const navigate = useNavigate();
  const { setIsLoggedin, userData, backendUrl, setUserData } =
    useContext(AppContent);

  const logout = async () => {
    try {
      axios.defaults.withCredentials = true;
      const { data } = await axios.post(backendUrl + "/api/auth/logout");
      if (data.success) {
        setIsLoggedin(false);
        setUserData(false);
        toast.success(data.message);
        navigate("/");
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const sendVerificationOtp = async () => {
    try {
      axios.defaults.withCredentials = true;

      const { data } = await axios.post(
        backendUrl + "/api/auth/send-verify-otp"
      );
      if (data.success) {
        navigate("/email-verify");
        toast.success(data.message);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef(null);

  // Close menu when clicked outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsMenuOpen(false); // Close the menu if clicked outside
      }
    };

    // Add event listener for clicks outside the menu
    document.addEventListener("click", handleClickOutside);

    // Clean up the event listener
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  // Handle click to toggle menu on mobile
  const handleMenuClick = (e) => {
    e.stopPropagation(); // Prevent event from bubbling up
    setIsMenuOpen(!isMenuOpen); // Toggle the menu state
  };

  return (
    <div className="w-full flex justify-between items-center p-4 sm:p-6 sm:px-24 absolute top-0">
      <img
        src={assets.logo}
        onClick={() => navigate("/")}
        alt=" "
        className="w-28 sm:w-32 cursor-pointer"
      />
      {userData ? (
        <div
          className="w-8 h-8 flex justify-center cursor-pointer items-center rounded-full bg-gray-700 text-white relative group"
          onClick={handleMenuClick} // Click here to toggle the menu
        >
          {userData.name[0].toUpperCase()}
          <div
            ref={menuRef}
            className={`absolute ${isMenuOpen ? "block" : "hidden"} group-hover:block top-0 right-0 z-10 text-black rounded pt-10`}
          >
            <ul className="list-none m-0 p-2 bg-gray-100 text-sm">
              {!userData.isAccountVerified && (
                <li
                  onClick={(e) => {
                    e.stopPropagation(); // Prevent closing the menu when clicking here
                    sendVerificationOtp();
                  }}
                  className="py-1 px-2 hover:bg-gray-200 cursor-pointer"
                >
                  Verify email
                </li>
              )}
              <li
                onClick={(e) => {
                  e.stopPropagation(); // Prevent closing the menu when clicking here
                  logout();
                }}
                className="py-1 px-2 hover:bg-gray-200 cursor-pointer pr-11"
              >
                Logout
              </li>
            </ul>
          </div>
        </div>
      ) : (
        <button
          onClick={() => navigate("/login")}
          className="flex items-center gap-2 border cursor-pointer border-gray-500 rounded-full px-6 py-2 text-gray-800 hover:bg-gray-100 transition-all"
        >
          Login
        </button>
      )}
    </div>
  );
};

export default Navbar;
