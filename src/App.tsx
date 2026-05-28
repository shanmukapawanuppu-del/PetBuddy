import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';

// Public Pages
import Home from './pages/Home';
import CaregiverListing from './pages/CaregiverListing';
import CaregiverProfile from './pages/CaregiverProfile';
import Booking from './pages/Booking';
import BookingSuccess from './pages/BookingSuccess';
import Auth from './pages/Auth';
import Features from './pages/Features';
import Testimonials from './pages/Testimonials';
import Service from './pages/Service';
import NotFound from './pages/NotFound';

// Admin Components & Pages
import { AdminAuthProvider } from './components/admin/AdminAuthContext';
import ProtectedRoute from './components/admin/ProtectedRoute';
import AdminSignup from './pages/admin/AdminSignup';
import AdminLogin from './pages/admin/AdminLogin';
import AdminForgotPassword from './pages/admin/AdminForgotPassword';
import AdminResetPassword from './pages/admin/AdminResetPassword';
import AdminDashboard from './pages/admin/AdminDashboard';
import { SitterDetails } from './pages/admin/SitterDetails';
import { OwnerDetails } from './pages/admin/OwnerDetails';

// Scroll Restoration UX Helper
const ScrollToTop: React.FC = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'instant' // Instant scroll reset on page transition
    });
  }, [pathname]);

  return null;
};

// Layout Wrappers
const PublicLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <>
    <Navbar />
    <main className="main-content-wrapper">
      {children}
    </main>
    <Footer />
  </>
);

const AdminLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <main className="main-content-wrapper" style={{ minHeight: '100vh' }}>
    {children}
  </main>
);

const App: React.FC = () => {
  return (
    <Router>
      <ScrollToTop />
      
      {/* Admin Auth Provider wraps all routes to allow global auth state if needed */}
      <AdminAuthProvider>
        <Routes>
          
          {/* Public Routes - Wrapped with Navbar/Footer */}
          <Route path="/" element={<Navigate to="/admin/login" replace />} />
          <Route path="/home" element={<PublicLayout><Home /></PublicLayout>} />
          <Route path="/caregivers" element={<PublicLayout><CaregiverListing /></PublicLayout>} />
          <Route path="/profile/:id" element={<PublicLayout><CaregiverProfile /></PublicLayout>} />
          <Route path="/book/:id" element={<PublicLayout><Booking /></PublicLayout>} />
          <Route path="/booking-success" element={<PublicLayout><BookingSuccess /></PublicLayout>} />
          <Route path="/login" element={<PublicLayout><Auth /></PublicLayout>} />
          <Route path="/signup" element={<PublicLayout><Auth /></PublicLayout>} />
          <Route path="/features" element={<PublicLayout><Features /></PublicLayout>} />
          <Route path="/testimonials" element={<PublicLayout><Testimonials /></PublicLayout>} />
          <Route path="/service" element={<PublicLayout><Service /></PublicLayout>} />

          {/* Admin Auth Routes - Unprotected, but with Admin Layout */}
          <Route path="/admin/signup" element={<AdminLayout><AdminSignup /></AdminLayout>} />
          <Route path="/admin/login" element={<AdminLayout><AdminLogin /></AdminLayout>} />
          <Route path="/admin/forgot-password" element={<AdminLayout><AdminForgotPassword /></AdminLayout>} />
          <Route path="/admin/reset-password" element={<AdminLayout><AdminResetPassword /></AdminLayout>} />

          {/* Admin Protected Routes */}
          <Route element={<ProtectedRoute />}>
            <Route path="/admin/dashboard" element={<AdminLayout><AdminDashboard /></AdminLayout>} />
            <Route path="/admin/sitters/:id" element={<AdminLayout><SitterDetails /></AdminLayout>} />
            <Route path="/admin/owners/:id" element={<AdminLayout><OwnerDetails /></AdminLayout>} />
          </Route>

          {/* Catch All */}
          <Route path="*" element={<PublicLayout><NotFound /></PublicLayout>} />
          
        </Routes>
      </AdminAuthProvider>

      {/* Global CSS Layout bindings */}
      <style>{`
        .main-content-wrapper {
          flex-grow: 1;
          display: flex;
          flex-direction: column;
        }
      `}</style>
    </Router>
  );
};

export default App;
