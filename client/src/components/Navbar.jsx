import React, { useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppContent } from "../context/AppContext";

import { assets } from '../assets/assets';
import { toast } from 'react-toastify';
import axios from 'axios';

const Navbar = () => {
  const navigate = useNavigate();
  const { userData, setUserData, setIsLoggedin, isLoggedin } = useContext(AppContent);
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  // Function to log out the user
  const logout = async () => {
    try {
      axios.defaults.withCredentials = true;
      const { data } = await axios.post(`${backendUrl}/api/auth/logout`);
      if (data.success) {
        setIsLoggedin(false);
        setUserData(null);
        localStorage.removeItem('authToken');
        navigate('/');
      }
    } catch (error) {
      toast.error('Error logging out.');
    }
  };

  // Function to send verification OTP
  const sendVerificationOtp = async () => {
    try {
      axios.defaults.withCredentials = true;
      const { data } = await axios.post(`${backendUrl}/api/auth/send-verify-otp`);
      if (data.success) {
        navigate('/email-verify');
        toast.success('Verification OTP sent successfully.');
      } else {
        toast.error(data.message || 'Failed to send verification OTP.'); 
      }
    } catch (error) {
      toast.error('Error sending OTP.');
    }
  };

  const toggleDropdown = () => {
    setDropdownVisible(!dropdownVisible);
  };

  const userInitial = userData?.name?.[0]?.toUpperCase() || ''; // Get the first letter of the username

  // UseEffect hook to watch userData changes and update the dropdown visibility accordingly
  useEffect(() => {
    console.log('User Data:', userData); // Log user data to see if isAccountVerified is being passed correctly
  }, [userData]);

  // Hide the dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest('.dropdown-container')) {
        setDropdownVisible(false); // Hide dropdown if click is outside
      }
    };

    document.addEventListener('click', handleClickOutside);

    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, []);

  return (
    <div className="w-full flex justify-between items-center p-4 sm:p-6 sm:px-24 absolute top-0">
      <img src={assets.logo} alt="Journey Hive Logo" className="w-28 sm:w-32" />
      {isLoggedin ? (
        <div className="relative dropdown-container">
          <div
            className="w-8 h-8 flex justify-center items-center rounded-full bg-black text-white text-lg font-bold cursor-pointer"
            onClick={toggleDropdown}
          >
            {userInitial} {/* Display initial of the username */}
          </div>

          {dropdownVisible && (
            <div className="absolute top-10 right-0 bg-white border rounded shadow-lg w-40 text-black">
              <ul className="list-none m-0 p-2 bg-gray-100 text-sm">
                {/* Show "Verify Email" only if isAccountVerified is false */}
                {userData && !userData.isAccountVerified && ( 
                  <li
                    onClick={sendVerificationOtp}
                    className="px-2 py-1 hover:bg-gray-200 cursor-pointer"
                  >
                    Verify Email
                  </li>
                )}
                <li
                  className="px-2 py-1 hover:bg-gray-200 cursor-pointer pr-10"
                  onClick={logout}
                >
                  Logout
                </li>
              </ul>
            </div>
          )}
        </div>
      ) : (
        <button
          onClick={() => navigate('/login')}
          className="flex items-center gap-2 border border-gray-500 rounded-full px-6 py-2 text-gray-800 hover:bg-gray-100 transition-all"
        >
          Login <img src={assets.arrow_icon} alt="Arrow Icon" />
        </button>
      )}
    </div>
  );
};

export default Navbar;
