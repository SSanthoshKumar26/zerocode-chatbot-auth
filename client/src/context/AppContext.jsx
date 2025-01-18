import React, { createContext, useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";

// Exporting AppContent instead of AppContext
export const AppContent = createContext();

export const AppContentProvider = ({ children }) => {
  const backendUrl = import.meta.env.VITE_BACKEND_URL || ""; // Ensure URL is defined
  axios.defaults.withCredentials = true;

  const [isLoggedin, setIsLoggedin] = useState(localStorage.getItem("isLoggedin") === "true");
  const [userData, setUserData] = useState(JSON.parse(localStorage.getItem("userData")) || null);
  const [loading, setLoading] = useState(true);

  const getAuthState = async () => {
    try {
      const token = localStorage.getItem("authToken");
      if (!token) {
        setIsLoggedin(false);
        setUserData(null);
        return;
      }

      const { data } = await axios.get(`${backendUrl}/api/auth/is-auth`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (data.success) {
        setIsLoggedin(true);
        await fetchUserData(token); // Fetch user data after successful auth check
      } else {
        setIsLoggedin(false);
        setUserData(null);
      }
    } catch (error) {
      handleAuthError(error, "Failed to verify authentication.");
    } finally {
      setLoading(false);
    }
  };

  const fetchUserData = async (token) => {
    try {
      const { data } = await axios.get(`${backendUrl}/api/user/data`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (data.success) {
        setUserData(data.userData);
      } else {
        toast.error(data.message || "Failed to fetch user data.");
      }
    } catch (error) {
      handleAuthError(error, "Failed to fetch user data.");
    }
  };

  const handleAuthError = (error, defaultMessage) => {
    const errorMessage = error.response?.data?.message || defaultMessage;
    toast.error(errorMessage);
    setIsLoggedin(false);
    setUserData(null);
  };

  useEffect(() => {
    if (!userData && loading) {
      getAuthState(); // Only call getAuthState if userData is null
    } else {
      setLoading(false); // If userData is available, stop loading
    }
  }, [userData, loading]);

  useEffect(() => {
    if (isLoggedin && userData) {
      localStorage.setItem("isLoggedin", "true");
      localStorage.setItem("userData", JSON.stringify(userData));
      if (userData.token) {
        localStorage.setItem("authToken", userData.token);
      }
    } else {
      localStorage.removeItem("isLoggedin");
      localStorage.removeItem("userData");
      localStorage.removeItem("authToken");
    }
  }, [isLoggedin, userData]);

  const value = {
    backendUrl,
    isLoggedin,
    setIsLoggedin,
    userData,
    setUserData,
    loading,
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return <AppContent.Provider value={value}>{children}</AppContent.Provider>;
};
