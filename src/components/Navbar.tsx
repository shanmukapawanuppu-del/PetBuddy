import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { PawPrint, Menu, X } from 'lucide-react';

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on route change
  const toggleMenu = () => setIsOpen(!isOpen);

  const isActive = (path: string) => {
    return location.pathname === path ? 'active-link' : '';
  };

  return (
    <>
      <header className={`navbar-header ${scrolled ? 'scrolled' : ''}`}>
        <div className="container nav-container">
          <Link to="/home" className="logo-area">
            <div className="logo-icon-wrapper animate-float">
              <PawPrint className="logo-icon" size={24} />
            </div>
            <span className="logo-text">Pet<span className="accent-text">Buddy</span></span>
          </Link>

          <nav className="desktop-nav">
            <Link to="/home" className={`nav-link ${isActive('/home')}`}>Home</Link>
            <Link to="/caregivers" className={`nav-link ${isActive('/caregivers')}`}>Find Caregivers</Link>
            <Link to="/features" className={`nav-link ${isActive('/features')}`}>Features</Link>
<Link to="/testimonials" className={`nav-link ${isActive('/testimonials')}`}>Reviews</Link>
<Link to="/service" className={`nav-link ${isActive('/service')}`}>Service</Link>
<Link to="/admin/bookings" className={`nav-link ${isActive('/admin/bookings')}`}>Bookings</Link>
<Link to="/login" className={`nav-link ${isActive('/login')}`}>Login</Link>
{/* <Link to="/login" className={`nav-link ${isActive('/login')}`}>Login / Signup</Link> */}
<Link to="/caregivers" className="btn btn-primary btn-nav">
  Find a Pet Sitter
</Link>
          </nav>

          <button className="mobile-toggle" onClick={toggleMenu} aria-label="Toggle Menu">
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </header>

      {/* Mobile Drawer */}
      <div className={`mobile-drawer ${isOpen ? 'open' : ''}`}>
        <nav className="mobile-nav">
          <Link to="/home" className={`mobile-link ${isActive('/home')}`}>Home</Link>
          <Link to="/caregivers" className={`mobile-link ${isActive('/caregivers')}`}>Find Caregivers</Link>
          <Link to="/features" className={`mobile-link ${isActive('/features')}`} onClick={() => setIsOpen(false)}>Features</Link>
          <Link to="/testimonials" className={`mobile-link ${isActive('/testimonials')}`} onClick={() => setIsOpen(false)}>Reviews</Link>
          <Link to="/service" className={`mobile-link ${isActive('/service')}`} onClick={() => setIsOpen(false)}>Service</Link>
          <Link to="/login" className={`mobile-link ${isActive('/login')}`} onClick={() => setIsOpen(false)}>Login / Signup</Link>
          <Link to="/caregivers" className="btn btn-primary mobile-cta-btn">
            Find a Pet Sitter
          </Link>
        </nav>
      </div>

      {/* Navbar CSS Styles inside JS component to avoid styling pollution, matching responsive principles */}
      <style>{`
        .navbar-header {
          position: sticky;
          top: 0;
          left: 0;
          right: 0;
          z-index: 100;
          background-color: rgba(250, 249, 246, 0.8);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          border-bottom: 1px solid transparent;
          transition: var(--transition);
          height: 80px;
          display: flex;
          align-items: center;
        }
        
        @media (prefers-color-scheme: dark) {
          .navbar-header {
            background-color: rgba(11, 15, 25, 0.8);
          }
        }
        
        .navbar-header.scrolled {
          background-color: var(--bg-card);
          box-shadow: var(--shadow-md);
          border-color: var(--border);
          height: 70px;
        }
        
        .nav-container {
          display: flex;
          align-items: center;
          justify-content: space-between;
          width: 100%;
        }
        
        .logo-area {
          display: flex;
          align-items: center;
          gap: 10px;
          font-weight: 800;
          font-size: 1.45rem;
          color: var(--text-heading);
        }
        
        .logo-icon-wrapper {
          background: linear-gradient(135deg, var(--primary), #0ea5e9);
          color: white;
          padding: 8px;
          border-radius: var(--radius-md);
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 4px 10px rgba(13, 148, 136, 0.2);
        }
        
        .logo-text {
          letter-spacing: -0.5px;
        }
        
        .accent-text {
          color: var(--primary);
        }
        
        .desktop-nav {
          display: flex;
          align-items: center;
          gap: 28px;
        }
        
        .nav-link {
          font-weight: 600;
          font-size: 0.95rem;
          color: var(--text-main);
          padding: 6px 0;
          position: relative;
          display: flex;
          align-items: center;
          gap: 6px;
        }
        
        .nav-link::after {
          content: '';
          position: absolute;
          bottom: 0;
          left: 0;
          width: 0;
          height: 2px;
          background-color: var(--primary);
          transition: var(--transition-fast);
        }
        
        .nav-link:hover {
          color: var(--primary);
        }
        
        .nav-link:hover::after {
          width: 100%;
        }
        
        .active-link {
          color: var(--primary);
        }
        
        .active-link::after {
          width: 100%;
        }
        
        .btn-nav {
          padding: 10px 20px;
          font-size: 0.9rem;
        }
        
        .mobile-toggle {
          display: none;
          background: none;
          border: none;
          color: var(--text-heading);
          cursor: pointer;
          padding: 6px;
          border-radius: var(--radius-sm);
          transition: var(--transition-fast);
        }
        
        .mobile-toggle:hover {
          background-color: var(--border);
        }
        
        /* Mobile Drawer */
        .mobile-drawer {
          position: fixed;
          top: 80px;
          left: 0;
          right: 0;
          bottom: 0;
          background-color: var(--bg-card);
          z-index: 99;
          transform: translateY(-100%);
          opacity: 0;
          visibility: hidden;
          transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
          padding: 40px 24px;
          border-top: 1px solid var(--border);
          box-shadow: var(--shadow-xl);
        }
        
        .mobile-drawer.open {
          transform: translateY(0);
          opacity: 1;
          visibility: visible;
        }
        
        .mobile-nav {
          display: flex;
          flex-direction: column;
          gap: 24px;
          align-items: center;
        }
        
        .mobile-link {
          font-weight: 700;
          font-size: 1.25rem;
          color: var(--text-heading);
          transition: var(--transition-fast);
        }
        
        .mobile-link:hover {
          color: var(--primary);
        }
        
        .mobile-cta-btn {
          width: 100%;
          max-width: 280px;
          margin-top: 16px;
        }
        
        @media (max-width: 768px) {
          .desktop-nav {
            display: none;
          }
          .mobile-toggle {
            display: block;
          }
        }
      `}</style>
    </>
  );
};

export default Navbar;
