import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { PawPrint, ChevronLeft, ChevronRight, LogOut } from 'lucide-react';
import { useAdminAuth } from './AdminAuthContext';
import { adminSidebarNavItems } from '../../constants/adminNav';
import './PremiumSidebar.css';

interface PremiumSidebarProps {
  activeId: string;
}

const PremiumSidebar: React.FC<PremiumSidebarProps> = ({ activeId }) => {
  const { adminUser, logoutAdmin } = useAdminAuth();
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(() => {
    const saved = localStorage.getItem('petbuddy_admin_sidebar_expanded');
    return saved ? JSON.parse(saved) : false;
  });

  const toggleSidebar = () => {
    const newState = !isSidebarExpanded;
    setIsSidebarExpanded(newState);
    localStorage.setItem('petbuddy_admin_sidebar_expanded', JSON.stringify(newState));
  };

  const handleLogout = async () => {
    try {
      await logoutAdmin();
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <aside className="premium-sidebar" style={{ width: isSidebarExpanded ? '280px' : '88px' }}>
      <div className="sidebar-header">
        <div className="brand-logo">
          <PawPrint size={28} color="white" />
        </div>
        {isSidebarExpanded && (
          <span className="brand-text">
            <span className="brand-text-pet">Pet</span>
            <span className="brand-text-buddy">Buddy</span>
          </span>
        )}
        <button onClick={toggleSidebar} className="toggle-btn">
          {isSidebarExpanded ? <ChevronLeft size={18} /> : <ChevronRight size={18} />}
        </button>
      </div>
      <nav className="sidebar-nav">
        {adminSidebarNavItems.map(item => {
          const isActive = item.id === activeId;
          const Icon = item.icon;
          return (
            <Link key={item.id} to={item.path} className={`nav-item ${isActive ? 'active' : ''}`} title={!isSidebarExpanded ? item.name : undefined}>
              <Icon size={22} className="nav-icon" />
              {isSidebarExpanded && <span className="nav-text">{item.name}</span>}
            </Link>
          );
        })}
      </nav>
      <div className="sidebar-footer">
        {/* <Link to="/admin/profile" style={{ textDecoration: 'none', color: 'inherit' }}> */}
        <div className="profile-section" title={!isSidebarExpanded ? adminUser?.fullName : undefined}>
          <div className="profile-avatar">{adminUser?.fullName?.charAt(0).toUpperCase()}</div>
          {isSidebarExpanded && <span className="profile-name">{adminUser?.fullName}</span>}
        </div>
        {/* </Link> */}
        <button onClick={handleLogout} className="logout-btn" title={!isSidebarExpanded ? "Sign Out" : undefined}>
          <LogOut size={22} className="nav-icon" />
          {isSidebarExpanded && <span className="nav-text">Sign Out</span>}
        </button>
      </div>
    </aside>
  );
};

export default PremiumSidebar;
