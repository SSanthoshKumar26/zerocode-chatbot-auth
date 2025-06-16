import React, { useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppContent } from "../context/AppContext";
import { toast } from 'react-toastify';
import axios from 'axios';
import { FiLogOut, FiUser, FiChevronDown } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';

const Navbar = () => {
  const navigate = useNavigate();
  const { userData, setUserData, setIsLoggedin, isLoggedin } = useContext(AppContent);
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  const logout = async () => {
    try {
      const { data } = await axios.post(`${backendUrl}/api/auth/logout`, {}, {
        withCredentials: true
      });
      if (data.success) {
        setIsLoggedin(false);
        setUserData(null);
        localStorage.removeItem('authToken');
        toast.success('Logged out successfully');
        navigate('/');
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error logging out');
    }
  };

  const toggleDropdown = () => setDropdownVisible(!dropdownVisible);

  const userInitial = userData?.name?.[0]?.toUpperCase() || '';

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest('.dropdown-container')) {
        setDropdownVisible(false);
      }
    };
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  return (
    <div className="w-full flex justify-between items-center p-4 sm:p-6 sm:px-24 absolute top-0 z-50">
      <motion.div 
        whileHover={{ scale: 1.05 }}
        className="text-2xl font-bold cursor-pointer bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"
        onClick={() => navigate('/')}
      >
        Qube
      </motion.div>

      {isLoggedin ? (
        <div className="relative dropdown-container">
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center gap-2 cursor-pointer"
            onClick={toggleDropdown}
          >
            <div className="w-10 h-10 flex justify-center items-center rounded-full bg-gradient-to-br from-blue-500 to-purple-500 text-white text-lg font-bold shadow-md">
              {userInitial || <FiUser />}
            </div>
            <motion.div
              animate={{ rotate: dropdownVisible ? 180 : 0 }}
              transition={{ duration: 0.2 }}
            >
              <FiChevronDown />
            </motion.div>
          </motion.div>

          <AnimatePresence>
            {dropdownVisible && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="absolute top-14 right-0 bg-white border border-gray-200 rounded-lg shadow-xl w-48 overflow-hidden"
              >
                <div className="p-4 border-b border-gray-100">
                  <p className="font-medium text-gray-800 truncate">{userData?.name || 'User'}</p>
                  <p className="text-sm text-gray-500 truncate">{userData?.email}</p>
                </div>
                <motion.button
                  whileHover={{ backgroundColor: '#f3f4f6' }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full flex items-center gap-3 px-4 py-3 text-left text-red-500 hover:bg-gray-100 transition-colors"
                  onClick={logout}
                >
                  <FiLogOut />
                  <span>Logout</span>
                </motion.button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      ) : (
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => navigate('/login')}
          className="flex items-center gap-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-full px-6 py-2 shadow-md hover:shadow-lg transition-all"
        >
          <span>Login</span>
          <motion.span 
            animate={{ x: [0, 4, 0] }}
            transition={{ repeat: Infinity, duration: 1.5 }}
          >
            →
          </motion.span>
        </motion.button>
      )}
    </div>
  );
};

export default Navbar;