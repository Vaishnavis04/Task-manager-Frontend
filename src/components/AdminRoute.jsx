import React from 'react';
import { Navigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode'; // ✅ Correct for Vite

const AdminRoute = ({ children }) => {
  const token = localStorage.getItem('token');

  // 🚫 No token? Not logged in — go to Login
  if (!token) {
    return <Navigate to="/" />;
  }

  try {
    const decoded = jwtDecode(token);

    // ✅ Is Admin — allow access to admin dashboard
    if (decoded.role === 'admin') {
      return children;
    }

    // ❌ Is NOT Admin — go to user dashboard
    return <Navigate to="/user-dashboard" />;
  } catch (error) {
    console.error("Token decode failed:", error);
    return <Navigate to="/" />;
  }
};

export default AdminRoute;
