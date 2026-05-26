import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';

interface AdminUser {
  id: string;
  fullName: string;
  email: string;
}

interface AdminAuthContextType {
  isAdminRegistered: boolean;
  isAuthenticated: boolean;
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
  const [adminUser, setAdminUser] = useState<AdminUser | null>(null);
  
  const navigate = useNavigate();

  const checkRegistrationStatus = () => {
    // Check if an admin is already registered in local storage mock DB
    const storedAdmin = localStorage.getItem('petbuddy_admin_account');
    setIsAdminRegistered(!!storedAdmin);
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
    localStorage.setItem('petbuddy_admin_access_token', token);
    localStorage.setItem('petbuddy_admin_refresh_token', 'mock_refresh_token_' + Date.now());
    
    setAdminUser(user);
    setIsAuthenticated(true);
    
    navigate('/admin/dashboard', { replace: true });
  };

  const logoutAdmin = () => {
    localStorage.removeItem('petbuddy_admin_access_token');
    localStorage.removeItem('petbuddy_admin_refresh_token');
    
    setAdminUser(null);
    setIsAuthenticated(false);
    
    navigate('/admin/login', { replace: true });
  };

  return (
    <AdminAuthContext.Provider value={{
      isAdminRegistered,
      isAuthenticated,
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
