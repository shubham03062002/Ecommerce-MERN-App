import React from 'react';
import { Navigate } from 'react-router-dom';
import axios from 'axios';

const ProtectedRoute = ({ children, adminOnly = false }) => {
  const token = localStorage.getItem(adminOnly ? 'admintoken' : 'token'); // Get the correct token

  // Redirect to the appropriate login page if no token exists
  if (!token) {
    return <Navigate to={adminOnly ? '/login-admin' : '/login'} replace />;
  }

  // Optionally, verify the token with a backend call (synchronous logic for simplicity here)
  const verifyToken = async () => {
    try {
      const response = await axios.post(
        `http://localhost:5000/${adminOnly ? 'admin' : 'user'}/verify-token`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data.valid) {
        return children; // Allow access if the token is valid
      }
    } catch (error) {
      console.error('Token verification failed:', error);
      localStorage.removeItem(adminOnly ? 'admintoken' : 'token'); // Remove invalid token
      return <Navigate to={adminOnly ? '/login-admin' : '/login'} replace />;
    }
  };

  // Render children if token is assumed valid (without backend check)
  return children;
};

export default ProtectedRoute;
