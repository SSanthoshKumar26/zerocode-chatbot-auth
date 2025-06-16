import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';
import { AppContent } from '../context/AppContext';
import { assets } from "../assets/assets";

import test_img from '../assets/header_img.png'; // Adjust path if needed


const Header = () => {
  const { userData, loading, isLoggedin } = useContext(AppContent);
  const [greeting, setGreeting] = useState('Hello there!');
  const navigate = useNavigate();

  useEffect(() => {
    if (isLoggedin && userData?.name) {
      setGreeting(`Hey ${userData.name}!`);
    } else {
      setGreeting('Hello there!');
    }
  }, [userData, isLoggedin]);

  if (loading) return <div>Loading...</div>;

  return (
    <div className="flex flex-col items-center mt-20 px-4 text-center text-gray-800">
    <img src={test_img} alt="Test"     className="w-36 h-36 rounded-full mb-6" />
    
      <h1 className="flex items-center gap-2 text-xl sm:text-3xl font-medium mb-2">
        {greeting} <img src={assets.hand_wave} alt="Wave" className="w-8 aspect-square" />
      </h1>
      <h2 className="sm:text-5xl text-3xl font-semibold mb-4">Welcome to Qube</h2>
      <p className="mb-8 max-w-md">
        {isLoggedin 
          ? "Let's start with a quick product tour!" 
          : "Join us to unlock all features!"}
      </p>
      <button
        onClick={() => navigate(isLoggedin ? "/chat" : "/login")}
        className={`rounded-full px-8 py-2.5 transition-all ${
          isLoggedin 
            ? "border border-gray-500 hover:bg-gray-100" 
            : "bg-blue-500 text-white hover:bg-blue-600"
        }`}
      >
        {isLoggedin ? "Start Chat" : "Login to Chat"}
      </button>
    </div>
  );
};

export default Header;