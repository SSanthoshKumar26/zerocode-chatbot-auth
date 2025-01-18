import React, { useContext, useEffect, useState } from "react";
import { AppContent } from '../context/AppContext'; // Correct import (AppContent instead of AppContext)
import { assets } from "../assets/assets";

const Header = () => {
  const { userData, loading } = useContext(AppContent); // Use AppContent here
  const [username, setUsername] = useState('Developer'); // Default username set to 'Developer'

  useEffect(() => {
    if (userData && userData.name) {
      setUsername(userData.name); // Update username when userData is available
    } else {
      setUsername('Developer'); // Fallback to 'Developer' when no userData
    }
  }, [userData]); // Re-run when userData changes

  if (loading) {
    return <div>Loading...</div>; // Optionally show a loading spinner or message
  }

  return (
    <div className="flex flex-col items-center mt-20 px-4 text-center text-gray-800">
      <img
        src={assets.header_img}
        alt="User Avatar"
        className="w-36 h-36 rounded-full mb-6"
      />
      
      <h1 className="flex items-center gap-2 text-xl sm:text-3xl font-medium mb-2">
        Hey {username}! {/* Display the username or default to 'Developer' */}
        <img src={assets.hand_wave} alt="Wave" className="w-8 aspect-square" />
      </h1>
      
      <h2 className="sm:text-5xl text-3xl font-semibold mb-4">
        Welcome to My Website
      </h2>
      
      <p className="mb-8 max-w-md">
        Let's start with a quick product tour, and we'll have you up and running in no time!
      </p>
      
      <button className="border border-gray-500 rounded-full px-8 py-2.5 hover:bg-gray-100 transition-all">
        Get Started
      </button>
    </div>
  );
};

export default Header;
