import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAdminAuth } from './AdminAuthContext';
import { Loader2 } from 'lucide-react';

const ProtectedRoute: React.FC = () => {
  const { isAuthenticated, isLoadingAuth } = useAdminAuth();

  if (isLoadingAuth) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', width: '100vw', backgroundColor: 'var(--bg-main)' }}>
        <Loader2 className="spin" size={48} color="var(--primary)" />
      </div>
    );
  }

  if (!isAuthenticated) {
    // Redirect them to the /admin/login page, but save the current location they were
    // trying to go to if we want to add redirect logic later
    return <Navigate to="/admin/login" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
