import React, { createContext, useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";

// Create context with default values
export const AppContent = createContext({
  backendUrl: "",
  isLoggedin: false,
  setIsLoggedin: () => {},
  userData: null,
  setUserData: () => {},
  loading: true,
});

export const AppContentProvider = ({ children }) => {
  const backendUrl = import.meta.env.VITE_BACKEND_URL || "";

  const [isLoggedin, setIsLoggedin] = useState(
    localStorage.getItem("isLoggedin") === "true"
  );
  const [userData, setUserData] = useState(
    JSON.parse(localStorage.getItem("userData")) || null
  );
  const [loading, setLoading] = useState(true);

  // Function to verify auth status using token
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
        await fetchUserData(token);
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

  // Function to fetch user profile data
  const fetchUserData = async (token) => {
    try {
      const { data } = await axios.get(`${backendUrl}/api/auth/user`, {
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

  // On component mount, check auth
  useEffect(() => {
    getAuthState();
  }, []);

  // Persist login state in localStorage
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

  return (
    <AppContent.Provider value={value}>
      {loading ? (
        <div className="flex justify-center items-center h-screen">
          <p className="text-xl font-semibold">Loading app...</p>
        </div>
      ) : (
        children
      )}
    </AppContent.Provider>
  );
};
