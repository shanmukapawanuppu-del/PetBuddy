import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAdminAuth } from './AdminAuthContext';

const ProtectedRoute: React.FC = () => {
  const { isAuthenticated } = useAdminAuth();

  if (!isAuthenticated) {
    // Redirect them to the /admin/login page, but save the current location they were
    // trying to go to if we want to add redirect logic later
    return <Navigate to="/admin/login" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
