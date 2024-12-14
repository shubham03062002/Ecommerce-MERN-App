import React, { useState, useContext, useEffect } from "react";
import axios from "axios";

const AuthContext = React.createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    // Check if the user is logged in, or fetch user data from localStorage, etc.
    const userData = localStorage.getItem("user");
    if (userData) {
      setUser(JSON.parse(userData));
      setIsLoggedIn(true);
    }
  }, []);

  const login = async (email, password) => {
    try {
      const response = await axios.post("/api/login", { email, password });
      setUser(response.data.user);
      setIsLoggedIn(true);
      localStorage.setItem("user", JSON.stringify(response.data.user));
    } catch (error) {
      console.error("Error during login:", error);
    }
  };

  const logout = () => {
    setUser(null);
    setIsLoggedIn(false);
    localStorage.removeItem("user");
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, login, logout, user }}>
      {children}
    </AuthContext.Provider>
  );
};
