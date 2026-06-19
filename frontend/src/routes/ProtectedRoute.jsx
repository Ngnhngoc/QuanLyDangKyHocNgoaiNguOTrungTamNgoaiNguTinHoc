import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children, allowedRoles }) => {
  const user = JSON.parse(sessionStorage.getItem('auth_user') || sessionStorage.getItem('user') || 'null');
  const role = sessionStorage.getItem('auth_role') || user?.vaiTro;
  const token = sessionStorage.getItem('token');

  if (!user || !token) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.map(r => r.toLowerCase()).includes((role || '').toLowerCase())) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;
