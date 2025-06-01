import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Login from './components/Login';
import Signup from './components/Signup';
import AdminDashboard from './components/AdminDashboard';
import UserDashboard from './pages/UserDashboard';
import AdminRoute from './components/AdminRoute';
import AdminManageUsers from './pages/AdminManageUsers';
import "./index.css";
const App = () => {
  return (
    <Routes>
      {/* Default login route */}
      <Route path="/" element={<Login />} />

      {/* Signup route */}
      <Route path="/signup" element={<Signup />} />

      {/* Public user dashboard */}
      <Route path="/user-dashboard" element={<UserDashboard />} />

      {/* Admin route protected by token + role check */}
     <Route
  path="/admin-dashboard"
  element={
    <AdminRoute>
      <AdminDashboard />
    </AdminRoute>
  }
/>
<Route path="/admin/manage-users" element={<AdminManageUsers />} />
    </Routes>
  );
};

export default App;
