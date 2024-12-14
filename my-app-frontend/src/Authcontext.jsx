// Update the AuthContext to store user data
import { createContext, useState, useContext } from "react";

const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  const login = (userData) => {
    setUser(userData); // Save user info in the state
  };

  const logout = () => {
    setUser(null); // Clear user info on logout
    localStorage.removeItem("token"); // Clear the token from localStorage
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
