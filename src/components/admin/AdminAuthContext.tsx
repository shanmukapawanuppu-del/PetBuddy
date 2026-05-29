import React, { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { API_ROUTES } from '../../constants/apiConstants';

interface AdminUser {
  id: string;
  fullName: string;
  email: string;
}

interface AdminAuthContextType {
  isAdminRegistered: boolean;
  isAuthenticated: boolean;
  isLoadingAuth: boolean;
  adminUser: AdminUser | null;
  registerAdmin: (user: AdminUser, token: string) => void;
  loginAdmin: (user: AdminUser, token: string) => void;
  logoutAdmin: () => void;
  checkRegistrationStatus: () => void;
}

const AdminAuthContext = createContext<AdminAuthContextType | undefined>(undefined);

export const AdminAuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isAdminRegistered, setIsAdminRegistered] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoadingAuth, setIsLoadingAuth] = useState(true);
  const [adminUser, setAdminUser] = useState<AdminUser | null>(null);
  
  const navigate = useNavigate();

  const checkRegistrationStatus = async () => {
    try {
      const response = await fetch(API_ROUTES.AUTH.CHECK);
      if (response.ok) {
        const data = await response.json();
        console.log(data, "response")
        setIsAdminRegistered(data.registered);
        console.log(isAdminRegistered, "isAdminRegistered")
      }
    } catch (e) {
      console.error("Failed to check registration status", e);
    }
  };

  useEffect(() => {
    // Initial check for registration and session
    checkRegistrationStatus();

    const token = localStorage.getItem('petbuddy_admin_access_token');
    const storedAdmin = localStorage.getItem('petbuddy_admin_account');

    if (token && storedAdmin) {
      try {
        const user = JSON.parse(storedAdmin);
        setAdminUser(user);
        setIsAuthenticated(true);
      } catch (e) {
        console.error("Failed to parse admin data", e);
      }
    }
    
    setIsLoadingAuth(false);
  }, []);

  const registerAdmin = (user: AdminUser, token: string) => {
    localStorage.setItem('petbuddy_admin_account', JSON.stringify(user));
    localStorage.setItem('petbuddy_admin_access_token', token);
    localStorage.setItem('petbuddy_admin_refresh_token', 'mock_refresh_token_' + Date.now());
    
    setAdminUser(user);
    setIsAuthenticated(true);
    setIsAdminRegistered(true);
    
    // Redirect to dashboard automatically
    navigate('/admin/dashboard', { replace: true });
  };

  const loginAdmin = (user: AdminUser, token: string) => {
    localStorage.setItem('petbuddy_admin_account', JSON.stringify(user));
    localStorage.setItem('petbuddy_admin_access_token', token);
    localStorage.setItem('petbuddy_admin_refresh_token', 'mock_refresh_token_' + Date.now());
    
    setAdminUser(user);
    setIsAuthenticated(true);
    
    navigate('/admin/dashboard', { replace: true });
  };

  const logoutAdmin = async () => {
    try {
      await fetch(API_ROUTES.AUTH.LOGOUT, { method: 'POST' });
    } catch (e) {
      console.error("Failed to call logout API", e);
    }
    localStorage.removeItem('petbuddy_admin_access_token');
    localStorage.removeItem('petbuddy_admin_refresh_token');
    localStorage.removeItem('petbuddy_admin_account');
    
    setAdminUser(null);
    setIsAuthenticated(false);
    
    navigate('/admin/login', { replace: true });
  };

  return (
    <AdminAuthContext.Provider value={{
      isAdminRegistered,
      isAuthenticated,
      isLoadingAuth,
      adminUser,
      registerAdmin,
      loginAdmin,
      logoutAdmin,
      checkRegistrationStatus
    }}>
      {children}
    </AdminAuthContext.Provider>
  );
};

export const useAdminAuth = () => {
  const context = useContext(AdminAuthContext);
  if (context === undefined) {
    throw new Error('useAdminAuth must be used within an AdminAuthProvider');
  }
  return context;
};
