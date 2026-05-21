import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';

// Pages
import Home from './pages/Home';
import CaregiverListing from './pages/CaregiverListing';
import CaregiverProfile from './pages/CaregiverProfile';
import Booking from './pages/Booking';
import BookingSuccess from './pages/BookingSuccess';
import Login from './pages/Login';
import Signup from './pages/Signup';

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

const App: React.FC = () => {
  return (
    <Router>
      <ScrollToTop />
      
      {/* Global SPA Layout */}
      <Navbar />
      
      <main className="main-content-wrapper">
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/home" element={<Home />} />
          <Route path="/caregivers" element={<CaregiverListing />} />
          <Route path="/profile/:id" element={<CaregiverProfile />} />
          <Route path="/book/:id" element={<Booking />} />
          <Route path="/booking-success" element={<BookingSuccess />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
        </Routes>
      </main>

      <Footer />

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
