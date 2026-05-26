import React, { useEffect, useState } from 'react';
import { LogOut, Users, LayoutDashboard, Search, Eye, Ban, Trash2, CheckCircle, XCircle, FileText, Info, Filter } from 'lucide-react';
import { useAdminAuth } from '../../components/admin/AdminAuthContext';
import { Link } from 'react-router-dom';
import './AdminDashboard.css';
import { UserManagement } from './UserManagement';
const mockOwners = [
  { id: 'O1', avatar: 'A', fullName: 'Alice Johnson', email: 'alice@example.com', phone: '+1 555-0101', date: '2025-01-12', pets: 2, bookings: 5, status: 'Active', city: 'New York', state: 'NY' },
  { id: 'O2', avatar: 'B', fullName: 'Bob Smith', email: 'bob.smith@example.com', phone: '+1 555-0202', date: '2025-02-15', pets: 1, bookings: 12, status: 'Active', city: 'San Francisco', state: 'CA' },
  { id: 'O3', avatar: 'C', fullName: 'Carol White', email: 'carol@example.com', phone: '+1 555-0103', date: '2025-03-20', pets: 3, bookings: 1, status: 'Blocked', city: 'Dallas', state: 'TX' },
];

const mockSitters = [
  { id: 'S1', avatar: 'E', fullName: 'Emma Wilson', email: 'emma@example.com', phone: '+1 555-0201', address: '123 Park Ave, NY', date: '2025-01-10', verifStatus: 'Verified', availStatus: 'Available', city: 'New York', state: 'NY' },
  { id: 'S2', avatar: 'F', fullName: 'Frank Thomas', email: 'frank@example.com', phone: '+1 555-0202', address: '456 Oak St, SF', date: '2025-04-12', verifStatus: 'Pending', availStatus: 'Unavailable', city: 'San Francisco', state: 'CA' },
  { id: 'S3', avatar: 'G', fullName: 'Grace Lee', email: 'grace.l@example.com', phone: '+1 555-0203', address: '789 Pine Rd, TX', date: '2025-03-01', verifStatus: 'Rejected', availStatus: 'Unavailable', city: 'Dallas', state: 'TX' },
];

// Helper to style status badges
const getBadgeStyle = (status: string) => {
  switch (status) {
    case 'Active':
    case 'Verified':
    case 'Available':
      return { bg: 'rgba(16, 185, 129, 0.15)', color: 'var(--success)' };
    case 'Blocked':
    case 'Rejected':
    case 'Unavailable':
      return { bg: 'rgba(239, 68, 68, 0.15)', color: 'var(--danger)' };
    case 'Pending':
      return { bg: 'rgba(245, 158, 11, 0.15)', color: 'var(--secondary-hover)' };
    default:
      return { bg: '#e2e8f0', color: '#64748b' };
  }
};

// Helper to style status filter pills dynamically
const getStatusPillStyle = (status: string, isActive: boolean): React.CSSProperties => {
  const baseStyle: React.CSSProperties = {
    padding: '8px 16px',
    borderRadius: '20px',
    border: '1.5px solid var(--border)',
    backgroundColor: 'white',
    color: 'var(--text-main)',
    fontWeight: '600',
    fontSize: '0.85rem',
    cursor: 'pointer',
    transition: 'all 0.2s ease-in-out',
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
  };

  if (!isActive) return baseStyle;

  switch (status) {
    case 'Pending':
      return {
        ...baseStyle,
        border: '1.5px solid var(--secondary)',
        backgroundColor: 'rgba(245, 158, 11, 0.12)',
        color: 'var(--secondary-hover)',
        boxShadow: '0 2px 8px rgba(245, 158, 11, 0.2)',
      };
    case 'Verified':
    case 'Active':
      return {
        ...baseStyle,
        border: '1.5px solid var(--success)',
        backgroundColor: 'rgba(16, 185, 129, 0.12)',
        color: 'var(--success)',
        boxShadow: '0 2px 8px rgba(16, 185, 129, 0.2)',
      };
    case 'Rejected':
      return {
        ...baseStyle,
        border: '1.5px solid var(--danger)',
        backgroundColor: 'rgba(239, 68, 68, 0.12)',
        color: 'var(--danger)',
        boxShadow: '0 2px 8px rgba(239, 68, 68, 0.2)',
      };
    case 'Blocked':
      return {
        ...baseStyle,
        border: '1.5px solid var(--text-muted)',
        backgroundColor: 'rgba(100, 116, 139, 0.12)',
        color: 'var(--text-muted)',
        boxShadow: '0 2px 8px rgba(100, 116, 139, 0.2)',
      };
    case 'All':
    default:
      return {
        ...baseStyle,
        border: '1.5px solid var(--primary)',
        backgroundColor: 'var(--primary-light)',
        color: 'var(--primary)',
        boxShadow: '0 2px 8px rgba(13, 148, 136, 0.2)',
      };
  }
};

const AdminDashboard: React.FC = () => {
  const { adminUser, logoutAdmin } = useAdminAuth();

  const [currentView, setCurrentView] = useState<'dashboard' | 'users' | 'bookings' | 'payments' | 'settings'>('dashboard');
  const [greeting, setGreeting] = useState('');
  const [activeTab, setActiveTab] = useState<'owners' | 'sitters'>('sitters');
  const [ownerSearch, setOwnerSearch] = useState('');
  const [sitterSearch, setSitterSearch] = useState('');


  
  // Applied Advanced Filter states
  const [appliedSitterFilter, setAppliedSitterFilter] = useState('All');
  const [appliedSitterSort, setAppliedSitterSort] = useState('newest');
  const [appliedSitterCity, setAppliedSitterCity] = useState('All');
  const [appliedSitterState, setAppliedSitterState] = useState('All');

  const [appliedOwnerFilter, setAppliedOwnerFilter] = useState('All');
  const [appliedOwnerSort, setAppliedOwnerSort] = useState('newest');
  const [appliedOwnerCity, setAppliedOwnerCity] = useState('All');
  const [appliedOwnerState, setAppliedOwnerState] = useState('All');

  // Temp (Draft) Filter states inside popup
  const [tempSitterFilter, setTempSitterFilter] = useState('All');
  const [tempSitterSort, setTempSitterSort] = useState('newest');
  const [tempSitterCity, setTempSitterCity] = useState('All');
  const [tempSitterState, setTempSitterState] = useState('All');

  const [tempOwnerFilter, setTempOwnerFilter] = useState('All');
  const [tempOwnerSort, setTempOwnerSort] = useState('newest');
  const [tempOwnerCity, setTempOwnerCity] = useState('All');
  const [tempOwnerState, setTempOwnerState] = useState('All');

  const [showSitterFilterSelect, setShowSitterFilterSelect] = useState(false);
  const [showOwnerFilterSelect, setShowOwnerFilterSelect] = useState(false);

  // Dynamic filter options
  const sitterCities = ['All', ...Array.from(new Set(mockSitters.map(s => s.city).filter(Boolean)))];
  const sitterStates = ['All', ...Array.from(new Set(mockSitters.map(s => s.state).filter(Boolean)))];

  const ownerCities = ['All', ...Array.from(new Set(mockOwners.map(o => o.city).filter(Boolean)))];
  const ownerStates = ['All', ...Array.from(new Set(mockOwners.map(o => o.state).filter(Boolean)))];

  // Active filter counts
  const ownerFilterCount = 
    (appliedOwnerFilter !== 'All' ? 1 : 0) + 
    (appliedOwnerSort !== 'newest' ? 1 : 0) + 
    (appliedOwnerCity !== 'All' ? 1 : 0) + 
    (appliedOwnerState !== 'All' ? 1 : 0);

  const sitterFilterCount = 
    (appliedSitterFilter !== 'All' ? 1 : 0) + 
    (appliedSitterSort !== 'newest' ? 1 : 0) + 
    (appliedSitterCity !== 'All' ? 1 : 0) + 
    (appliedSitterState !== 'All' ? 1 : 0);

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting('Good Morning');
    else if (hour < 18) setGreeting('Good Afternoon');
    else setGreeting('Good Evening');
  }, []);

  const handleLogout = () => {
    if (window.confirm('Are you sure you want to log out?')) {
      logoutAdmin();
    }
  };

  // Filtered and Sorted Owners
  const filteredOwners = mockOwners
    .filter(o => {
      const matchesSearch = o.fullName.toLowerCase().includes(ownerSearch.toLowerCase()) ||
        o.email.toLowerCase().includes(ownerSearch.toLowerCase()) ||
        o.phone.includes(ownerSearch);
      const matchesFilter = appliedOwnerFilter === 'All' || o.status === appliedOwnerFilter;
      const matchesCity = appliedOwnerCity === 'All' || o.city === appliedOwnerCity;
      const matchesState = appliedOwnerState === 'All' || o.state === appliedOwnerState;
      return matchesSearch && matchesFilter && matchesCity && matchesState;
    })
    .sort((a, b) => {
      if (appliedOwnerSort === 'newest') return new Date(b.date).getTime() - new Date(a.date).getTime();
      if (appliedOwnerSort === 'oldest') return new Date(a.date).getTime() - new Date(b.date).getTime();
      if (appliedOwnerSort === 'name-asc') return a.fullName.localeCompare(b.fullName);
      if (appliedOwnerSort === 'name-desc') return b.fullName.localeCompare(a.fullName);
      return 0;
    });

  // Filtered and Sorted Sitters
  const filteredSitters = mockSitters
    .filter(s => {
      const matchesSearch = s.fullName.toLowerCase().includes(sitterSearch.toLowerCase()) ||
        s.email.toLowerCase().includes(sitterSearch.toLowerCase()) ||
        s.phone.includes(sitterSearch);
      const matchesFilter = appliedSitterFilter === 'All' || s.verifStatus === appliedSitterFilter;
      const matchesCity = appliedSitterCity === 'All' || s.city === appliedSitterCity;
      const matchesState = appliedSitterState === 'All' || s.state === appliedSitterState;
      return matchesSearch && matchesFilter && matchesCity && matchesState;
    })
    .sort((a, b) => {
      if (appliedSitterSort === 'newest') return new Date(b.date).getTime() - new Date(a.date).getTime();
      if (appliedSitterSort === 'oldest') return new Date(a.date).getTime() - new Date(b.date).getTime();
      if (appliedSitterSort === 'name-asc') return a.fullName.localeCompare(b.fullName);
      if (appliedSitterSort === 'name-desc') return b.fullName.localeCompare(a.fullName);
      return 0;
    });

  const sitterCounts = {
    total: mockSitters.length,
    pending: mockSitters.filter(s => s.verifStatus === 'Pending').length,
    verified: mockSitters.filter(s => s.verifStatus === 'Verified').length,
    rejected: mockSitters.filter(s => s.verifStatus === 'Rejected').length,
  };

  const ownerCounts = {
    total: mockOwners.length,
    active: mockOwners.filter(o => o.status === 'Active').length,
    blocked: mockOwners.filter(o => o.status === 'Blocked').length,
    pets: mockOwners.reduce((acc, curr) => acc + curr.pets, 0),
  };

  // Reusable style objects
  const badgeBase = { padding: '4px 8px', borderRadius: '12px', fontSize: '0.8rem', fontWeight: '700' };
  const avatarStyle = { width: '40px', height: '40px', borderRadius: '50%', backgroundColor: 'var(--primary-light)', color: 'var(--primary)', display: 'grid', placeItems: 'center', fontWeight: 'bold' };

  // const labelStyle = { color: 'var(--text-muted)', fontSize: '0.9rem', fontWeight: '600', marginBottom: '8px' };
  // const valueStyle = { fontSize: '1.8rem', fontWeight: 'bold', margin: 0 };
  const searchInputStyle = { width: '100%', padding: '10px 12px 10px 36px', borderRadius: '8px', border: '1px solid var(--border)', fontSize: '0.95rem', background: 'white' };
  // const filterSelectStyle = { padding: '8px 12px', borderRadius: '8px', border: '1px solid var(--border)', fontSize: '0.95rem', background: 'white', fontWeight: '600', color: 'var(--text-heading)' };
  const tableContainerStyle = { backgroundColor: 'white', borderRadius: '12px', border: '1px solid var(--border)', overflow: 'hidden' };
  const theadStyle = { backgroundColor: 'var(--bg-main)', borderBottom: '1px solid var(--border)' };
  const rowStyle = { borderBottom: '1px solid var(--border)' };
  const cellStyle: React.CSSProperties = { padding: '12px 16px', textAlign: 'left' };
  const noDataStyle: React.CSSProperties = { padding: '32px', textAlign: 'center', color: 'var(--text-muted)' };
  const iconBtnStyle = { background: 'none', border: 'none', cursor: 'pointer', padding: '4px' };
  const tabButton = (active: boolean) => ({
    padding: '8px 16px', border: 'none', borderBottom: active ? '2px solid var(--primary)' : '2px solid transparent', background: 'transparent', color: active ? 'var(--primary)' : 'var(--text-muted)', fontWeight: active ? '600' : '500', cursor: 'pointer'
  })

  const navItems = [
    { id: 'dashboard', name: 'Dashboard', path: '/admin/dashboard', icon: LayoutDashboard },
    { id: 'users', name: 'Users', path: '#', icon: Users },
  ];

  return (
    <div className="admin-wrapper">
        {/* Sidebar */}
        <aside className="admin-sidebar">
          <div style={{ padding: '24px', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ color: 'var(--primary)' }}>Pet</span>Buddy
            </h2>
            <p style={{ fontSize: '0.8rem', color: '#94a3b8', marginTop: '4px' }}>Admin Portal</p>
          </div>
          <nav style={{ padding: '16px 0', flex: 1 }}>
            {navItems.map(item => {
              const isActive = currentView === item.id;
              const Icon = item.icon;
              return (
                <Link
                  key={item.name}
                  to="#"
                  onClick={(e) => {
                    e.preventDefault();
                    setCurrentView(item.id as any);
                  }}
                  style={{
                    display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 24px',
                    backgroundColor: isActive ? 'rgba(255,255,255,0.1)' : 'transparent',
                    color: isActive ? 'white' : '#cbd5e1', textDecoration: 'none', transition: 'all 0.2s',
                    borderLeft: isActive ? '4px solid var(--primary)' : '4px solid transparent'
                  }}
                >
                  <Icon size={20} />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </nav>
          {/* Sidebar Profile Card */}
          <div style={{ padding: '20px 24px', borderTop: '1px solid rgba(255,255,255,0.08)', display: 'flex', alignItems: 'center', gap: '14px' }}>
            <div style={{ 
              width: '44px', height: '44px', borderRadius: '50%', 
              backgroundColor: 'var(--primary)', color: 'white', 
              display: 'grid', placeItems: 'center', fontWeight: '800', 
              fontSize: '1.1rem', flexShrink: 0,
              boxShadow: '0 4px 12px rgba(13, 148, 136, 0.3)'
            }}>
              {adminUser?.fullName?.charAt(0).toUpperCase()}
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontWeight: '700', color: 'white', fontSize: '0.95rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {adminUser?.fullName}
              </div>
              <div style={{ fontSize: '0.78rem', color: '#94a3b8', marginTop: '2px', fontWeight: '500' }}>
                Administrator
              </div>
            </div>
          </div>

          {/* Sign Out Button Wrapper */}
          <div style={{ padding: '0 24px 28px 24px' }}>
            <button 
              onClick={handleLogout} 
              style={{
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', 
                width: '100%', padding: '12px',
                backgroundColor: 'rgba(239, 68, 68, 0.05)', color: '#fca5a5', 
                border: '1.5px solid rgba(239, 68, 68, 0.25)',
                borderRadius: '12px', cursor: 'pointer', transition: 'all 0.2s ease', 
                fontWeight: '700', fontSize: '0.9rem'
              }}
              onMouseOver={e => { 
                e.currentTarget.style.backgroundColor = 'rgba(239, 68, 68, 0.12)'; 
                e.currentTarget.style.color = '#ef4444';
                e.currentTarget.style.borderColor = 'rgba(239, 68, 68, 0.5)';
              }}
              onMouseOut={e => { 
                e.currentTarget.style.backgroundColor = 'rgba(239, 68, 68, 0.05)'; 
                e.currentTarget.style.color = '#fca5a5';
                e.currentTarget.style.borderColor = 'rgba(239, 68, 68, 0.25)';
              }}
            >
              <LogOut size={16} /> Sign Out
            </button>
          </div>
        </aside>

        {/* Main Content */}
        <main className="admin-main">
          
        <div style={{ padding: '32px', flex: 1 }}>
          <h1 style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--text-heading)' }}>{greeting}, {adminUser?.fullName.split(' ')[0]}!</h1>
          <p style={{ color: 'var(--text-muted)', marginBottom: '24px' }}>Here's what's happening in your platform today.</p>

          {/* Tabs */}
          {currentView === 'dashboard' && (
            <>
              {/* Tabs */}
              <div style={{ display: 'flex', gap: '12px', marginBottom: '24px' }}>
                <button onClick={() => setActiveTab('sitters')} style={tabButton(activeTab === 'sitters')}>Pet Sitters</button>
                <button onClick={() => setActiveTab('owners')} style={tabButton(activeTab === 'owners')}>Pet Owners</button>
              </div>

              {activeTab === 'owners' && (
                <>
                  {/* Summary Cards Grid */}
                  <div className="grid-4" style={{ marginBottom: '32px' }}>
                    <div className="owner-card card-total-owners">
                      <p className="card-label">Total Pet Owners</p>
                      <h3 className="card-value">{ownerCounts.total}</h3>
                    </div>
                    <div className="owner-card card-active-owners">
                      <p className="card-label">Active Owners</p>
                      <h3 className="card-value">{ownerCounts.active}</h3>
                    </div>
                    <div className="owner-card card-blocked-owners">
                      <p className="card-label">Blocked Owners</p>
                      <h3 className="card-value">{ownerCounts.blocked}</h3>
                    </div>
                    <div className="owner-card card-pets-owners">
                      <p className="card-label">Registered Pets</p>
                      <h3 className="card-value">{ownerCounts.pets}</h3>
                    </div>
                  </div>

                  {/* Search & Filter Container aligned to the right */}
                  <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: '12px', marginBottom: '16px', marginTop: '16px', position: 'relative' }}>
                    <div style={{ position: 'relative', width: '300px' }}>
                      <Search size={18} color="var(--text-muted)" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
                      <input
                        type="text"
                        placeholder="Search Name, Email, Phone..."
                        value={ownerSearch}
                        onChange={e => setOwnerSearch(e.target.value)}
                        style={{ ...searchInputStyle, paddingLeft: '36px' }}
                      />
                    </div>
                    
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <button 
                        onClick={() => {
                          if (!showOwnerFilterSelect) {
                            setTempOwnerFilter(appliedOwnerFilter);
                            setTempOwnerSort(appliedOwnerSort);
                            setTempOwnerCity(appliedOwnerCity);
                            setTempOwnerState(appliedOwnerState);
                          }
                          setShowOwnerFilterSelect(!showOwnerFilterSelect);
                        }} 
                        style={{
                          display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 18px',
                          backgroundColor: showOwnerFilterSelect || ownerFilterCount > 0 ? 'var(--primary-light)' : 'white',
                          border: '1.5px solid var(--border)', borderRadius: '20px', cursor: 'pointer',
                          fontWeight: '600', color: showOwnerFilterSelect || ownerFilterCount > 0 ? 'var(--primary)' : 'var(--text-main)',
                          transition: 'all 0.2s ease-in-out',
                          boxShadow: showOwnerFilterSelect ? '0 2px 8px rgba(13, 148, 136, 0.15)' : 'none'
                        }}
                      >
                        <Filter size={18} />
                        <span>Filter</span>
                        {ownerFilterCount > 0 && (
                          <span style={{
                            backgroundColor: 'var(--primary)', color: 'white',
                            borderRadius: '50%', width: '20px', height: '20px',
                            display: 'grid', placeItems: 'center', fontSize: '0.75rem', fontWeight: 'bold'
                          }}>
                            {ownerFilterCount}
                          </span>
                        )}
                      </button>
                      
                      {showOwnerFilterSelect && (
                        <div className="animate-scale" style={{
                          position: 'absolute', right: 0, top: '54px',
                          width: '340px', backgroundColor: 'rgba(255, 255, 255, 0.98)', 
                          backdropFilter: 'blur(20px)',
                          border: '1.5px solid rgba(13, 148, 136, 0.15)',
                          borderRadius: '20px', 
                          boxShadow: '0 20px 40px -10px rgba(15, 23, 42, 0.15), 0 10px 20px -10px rgba(13, 148, 136, 0.1)',
                          padding: '24px',
                          zIndex: 100, display: 'flex', flexDirection: 'column', gap: '18px',
                          textAlign: 'left'
                        }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border)', paddingBottom: '12px', marginBottom: '4px' }}>
                            <span style={{ fontWeight: '800', color: 'var(--text-heading)', fontSize: '1rem', letterSpacing: '-0.3px' }}>Advanced Filters</span>
                            {ownerFilterCount > 0 && (
                              <button 
                                type="button"
                                onClick={() => {
                                  setTempOwnerFilter('All');
                                  setTempOwnerSort('newest');
                                  setTempOwnerCity('All');
                                  setTempOwnerState('All');
                                  setAppliedOwnerFilter('All');
                                  setAppliedOwnerSort('newest');
                                  setAppliedOwnerCity('All');
                                  setAppliedOwnerState('All');
                                }}
                                style={{ background: 'none', border: 'none', color: 'var(--danger)', fontSize: '0.8rem', fontWeight: '700', cursor: 'pointer', transition: 'color 0.2s' }}
                                onMouseOver={e => e.currentTarget.style.color = 'var(--danger-hover, #dc2626)'}
                                onMouseOut={e => e.currentTarget.style.color = 'var(--danger)'}
                              >
                                Clear All
                              </button>
                            )}
                          </div>

                          {/* Status */}
                          <div>
                            <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: '700', color: 'var(--text-muted)', marginBottom: '8px', letterSpacing: '0.8px', textTransform: 'uppercase' }}>Status</label>
                            <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                              {['All', 'Active', 'Blocked'].map(status => {
                                const isActive = tempOwnerFilter === status;
                                return (
                                  <button
                                    key={status}
                                    type="button"
                                    onClick={() => setTempOwnerFilter(status)}
                                    style={getStatusPillStyle(status, isActive)}
                                  >
                                    {status}
                                  </button>
                                );
                              })}
                            </div>
                          </div>

                          {/* Sort By */}
                          <div>
                            <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: '700', color: 'var(--text-muted)', marginBottom: '6px', letterSpacing: '0.8px', textTransform: 'uppercase' }}>Sort By</label>
                            <select 
                              value={tempOwnerSort} 
                              onChange={e => setTempOwnerSort(e.target.value)} 
                              style={{ width: '100%', padding: '10px 14px', borderRadius: '12px', border: '1.5px solid var(--border)', background: '#fafafa', fontWeight: '600', color: 'var(--text-heading)', outline: 'none', fontSize: '0.9rem', cursor: 'pointer', transition: 'border-color 0.2s' }}
                            >
                              <option value="newest">Reg. Date: Newest First</option>
                              <option value="oldest">Reg. Date: Oldest First</option>
                              <option value="name-asc">Name: A to Z</option>
                              <option value="name-desc">Name: Z to A</option>
                            </select>
                          </div>

                          {/* City */}
                          <div>
                            <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: '700', color: 'var(--text-muted)', marginBottom: '6px', letterSpacing: '0.8px', textTransform: 'uppercase' }}>City</label>
                            <select 
                              value={tempOwnerCity} 
                              onChange={e => setTempOwnerCity(e.target.value)} 
                              style={{ width: '100%', padding: '10px 14px', borderRadius: '12px', border: '1.5px solid var(--border)', background: '#fafafa', fontWeight: '600', color: 'var(--text-heading)', outline: 'none', fontSize: '0.9rem', cursor: 'pointer', transition: 'border-color 0.2s' }}
                            >
                              {ownerCities.map(city => (
                                <option key={city} value={city}>{city === 'All' ? 'All Cities' : city}</option>
                              ))}
                            </select>
                          </div>

                          {/* State */}
                          <div>
                            <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: '700', color: 'var(--text-muted)', marginBottom: '6px', letterSpacing: '0.8px', textTransform: 'uppercase' }}>State</label>
                            <select 
                              value={tempOwnerState} 
                              onChange={e => setTempOwnerState(e.target.value)} 
                              style={{ width: '100%', padding: '10px 14px', borderRadius: '12px', border: '1.5px solid var(--border)', background: '#fafafa', fontWeight: '600', color: 'var(--text-heading)', outline: 'none', fontSize: '0.9rem', cursor: 'pointer', transition: 'border-color 0.2s' }}
                            >
                              {ownerStates.map(st => (
                                <option key={st} value={st}>{st === 'All' ? 'All States' : st}</option>
                              ))}
                            </select>
                          </div>

                          <div style={{ display: 'flex', gap: '8px', marginTop: '6px' }}>
                            <button 
                              type="button"
                              onClick={() => {
                                setAppliedOwnerFilter(tempOwnerFilter);
                                setAppliedOwnerSort(tempOwnerSort);
                                setAppliedOwnerCity(tempOwnerCity);
                                setAppliedOwnerState(tempOwnerState);
                                setShowOwnerFilterSelect(false);
                              }}
                              className="btn btn-primary"
                              style={{ flex: 1, padding: '12px', borderRadius: '12px', fontSize: '0.95rem' }}
                            >
                              Apply Filters
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Owners Table */}
                  <div className="card" style={tableContainerStyle}>
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                      <thead style={theadStyle}>
                        <tr>
                          <th style={cellStyle}>Owner</th>
                          <th style={cellStyle}>Contact</th>
                          <th style={cellStyle}>Reg. Date</th>
                          <th style={cellStyle}>Activity</th>
                          <th style={cellStyle}>Status</th>
                          <th style={{ ...cellStyle, textAlign: 'right' }}>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredOwners.map(owner => (
                          <tr key={owner.id} style={rowStyle}>
                            <td style={cellStyle}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                <div style={avatarStyle}>{owner.avatar}</div>
                                <span style={{ fontWeight: '600', color: 'var(--text-heading)' }}>{owner.fullName}</span>
                              </div>
                            </td>
                            <td style={cellStyle}>
                              <div style={{ fontSize: '0.9rem', color: 'var(--text-heading)' }}>{owner.email}</div>
                              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{owner.phone}</div>
                            </td>
                            <td style={cellStyle}>{owner.date}</td>
                            <td style={cellStyle}>
                              <div style={{ fontSize: '0.9rem' }}><strong>{owner.pets}</strong> Pets</div>
                              <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{owner.bookings} Bookings</div>
                            </td>
                            <td style={cellStyle}>
                              <span style={{ ...badgeBase, ...getBadgeStyle(owner.status) }}>{owner.status}</span>
                            </td>
                            <td style={{ ...cellStyle, textAlign: 'right' }}>
                              <button onClick={() => console.log('View', owner.id)} style={iconBtnStyle}><Eye size={18} /></button>
                              <button onClick={() => console.log('Toggle block', owner.id)} style={iconBtnStyle}>
                                {owner.status === 'Active' ? <Ban size={18} color="var(--danger)" /> : <Ban size={18} color="var(--success)" />}
                              </button>
                              <button onClick={() => console.log('Delete', owner.id)} style={iconBtnStyle}><Trash2 size={18} color="var(--danger)" /></button>
                            </td>
                          </tr>
                        ))}
                        {filteredOwners.length === 0 && (
                          <tr><td colSpan={6} style={noDataStyle}>No pet owners found.</td></tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </>
              )}

              {activeTab === 'sitters' && (
                <>
                  {/* Summary Cards Grid */}
                  <div className="grid-4" style={{ marginBottom: '32px' }}>
                    <div className="sitter-card card-total">
                      <p className="card-label">Total Sitters</p>
                      <h3 className="card-value">{sitterCounts.total}</h3>
                    </div>
                    <div className="sitter-card card-pending">
                      <p className="card-label">Pending Sitters</p>
                      <h3 className="card-value">{sitterCounts.pending}</h3>
                    </div>
                    <div className="sitter-card card-verified">
                      <p className="card-label">Verified Sitters</p>
                      <h3 className="card-value">{sitterCounts.verified}</h3>
                    </div>
                    <div className="sitter-card card-rejected">
                      <p className="card-label">Rejected Sitters</p>
                      <h3 className="card-value">{sitterCounts.rejected}</h3>
                    </div>
                  </div>

                  {/* Search & Filter Container aligned to the right */}
                  <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: '12px', marginBottom: '16px', position: 'relative' }}>
                    <div style={{ position: 'relative', width: '300px' }}>
                      <Search size={18} color="var(--text-muted)" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
                      <input
                        type="text"
                        placeholder="Search Name, Email, Phone..."
                        value={sitterSearch}
                        onChange={e => setSitterSearch(e.target.value)}
                        style={{ ...searchInputStyle, paddingLeft: '36px' }}
                      />
                    </div>
                    
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <button 
                        onClick={() => {
                          if (!showSitterFilterSelect) {
                            setTempSitterFilter(appliedSitterFilter);
                            setTempSitterSort(appliedSitterSort);
                            setTempSitterCity(appliedSitterCity);
                            setTempSitterState(appliedSitterState);
                          }
                          setShowSitterFilterSelect(!showSitterFilterSelect);
                        }} 
                        style={{
                          display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 18px',
                          backgroundColor: showSitterFilterSelect || sitterFilterCount > 0 ? 'var(--primary-light)' : 'white',
                          border: '1.5px solid var(--border)', borderRadius: '20px', cursor: 'pointer',
                          fontWeight: '600', color: showSitterFilterSelect || sitterFilterCount > 0 ? 'var(--primary)' : 'var(--text-main)',
                          transition: 'all 0.2s ease-in-out',
                          boxShadow: showSitterFilterSelect ? '0 2px 8px rgba(13, 148, 136, 0.15)' : 'none'
                        }}
                      >
                        <Filter size={18} />
                        <span>Filter</span>
                        {sitterFilterCount > 0 && (
                          <span style={{
                            backgroundColor: 'var(--primary)', color: 'white',
                            borderRadius: '50%', width: '20px', height: '20px',
                            display: 'grid', placeItems: 'center', fontSize: '0.75rem', fontWeight: 'bold'
                          }}>
                            {sitterFilterCount}
                          </span>
                        )}
                      </button>
                      
                      {showSitterFilterSelect && (
                        <div className="animate-scale" style={{
                          position: 'absolute', right: 0, top: '54px',
                          width: '340px', backgroundColor: 'rgba(255, 255, 255, 0.98)', 
                          backdropFilter: 'blur(20px)',
                          border: '1.5px solid rgba(13, 148, 136, 0.15)',
                          borderRadius: '20px', 
                          boxShadow: '0 20px 40px -10px rgba(15, 23, 42, 0.15), 0 10px 20px -10px rgba(13, 148, 136, 0.1)',
                          padding: '24px',
                          zIndex: 100, display: 'flex', flexDirection: 'column', gap: '18px',
                          textAlign: 'left'
                        }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border)', paddingBottom: '12px', marginBottom: '4px' }}>
                            <span style={{ fontWeight: '800', color: 'var(--text-heading)', fontSize: '1rem', letterSpacing: '-0.3px' }}>Advanced Filters</span>
                            {sitterFilterCount > 0 && (
                              <button 
                                type="button"
                                onClick={() => {
                                  setTempSitterFilter('All');
                                  setTempSitterSort('newest');
                                  setTempSitterCity('All');
                                  setTempSitterState('All');
                                  setAppliedSitterFilter('All');
                                  setAppliedSitterSort('newest');
                                  setAppliedSitterCity('All');
                                  setAppliedSitterState('All');
                                }}
                                style={{ background: 'none', border: 'none', color: 'var(--danger)', fontSize: '0.8rem', fontWeight: '700', cursor: 'pointer', transition: 'color 0.2s' }}
                                onMouseOver={e => e.currentTarget.style.color = 'var(--danger-hover, #dc2626)'}
                                onMouseOut={e => e.currentTarget.style.color = 'var(--danger)'}
                              >
                                Clear All
                              </button>
                            )}
                          </div>

                          {/* Status */}
                          <div>
                            <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: '700', color: 'var(--text-muted)', marginBottom: '8px', letterSpacing: '0.8px', textTransform: 'uppercase' }}>Status</label>
                            <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                              {['All', 'Pending', 'Verified', 'Rejected', 'Blocked'].map(status => {
                                const isActive = tempSitterFilter === status;
                                return (
                                  <button
                                    key={status}
                                    type="button"
                                    onClick={() => setTempSitterFilter(status)}
                                    style={getStatusPillStyle(status, isActive)}
                                  >
                                    {status}
                                  </button>
                                );
                              })}
                            </div>
                          </div>

                          {/* Sort By */}
                          <div>
                            <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: '700', color: 'var(--text-muted)', marginBottom: '6px', letterSpacing: '0.8px', textTransform: 'uppercase' }}>Sort By</label>
                            <select 
                              value={tempSitterSort} 
                              onChange={e => setTempSitterSort(e.target.value)} 
                              style={{ width: '100%', padding: '10px 14px', borderRadius: '12px', border: '1.5px solid var(--border)', background: '#fafafa', fontWeight: '600', color: 'var(--text-heading)', outline: 'none', fontSize: '0.9rem', cursor: 'pointer', transition: 'border-color 0.2s' }}
                            >
                              <option value="newest">Reg. Date: Newest First</option>
                              <option value="oldest">Reg. Date: Oldest First</option>
                              <option value="name-asc">Name: A to Z</option>
                              <option value="name-desc">Name: Z to A</option>
                            </select>
                          </div>

                          {/* City */}
                          <div>
                            <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: '700', color: 'var(--text-muted)', marginBottom: '6px', letterSpacing: '0.8px', textTransform: 'uppercase' }}>City</label>
                            <select 
                              value={tempSitterCity} 
                              onChange={e => setTempSitterCity(e.target.value)} 
                              style={{ width: '100%', padding: '10px 14px', borderRadius: '12px', border: '1.5px solid var(--border)', background: '#fafafa', fontWeight: '600', color: 'var(--text-heading)', outline: 'none', fontSize: '0.9rem', cursor: 'pointer', transition: 'border-color 0.2s' }}
                            >
                              {sitterCities.map(city => (
                                <option key={city} value={city}>{city === 'All' ? 'All Cities' : city}</option>
                              ))}
                            </select>
                          </div>

                          {/* State */}
                          <div>
                            <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: '700', color: 'var(--text-muted)', marginBottom: '6px', letterSpacing: '0.8px', textTransform: 'uppercase' }}>State</label>
                            <select 
                              value={tempSitterState} 
                              onChange={e => setTempSitterState(e.target.value)} 
                              style={{ width: '100%', padding: '10px 14px', borderRadius: '12px', border: '1.5px solid var(--border)', background: '#fafafa', fontWeight: '600', color: 'var(--text-heading)', outline: 'none', fontSize: '0.9rem', cursor: 'pointer', transition: 'border-color 0.2s' }}
                            >
                              {sitterStates.map(st => (
                                <option key={st} value={st}>{st === 'All' ? 'All States' : st}</option>
                              ))}
                            </select>
                          </div>

                          <div style={{ display: 'flex', gap: '8px', marginTop: '6px' }}>
                            <button 
                              type="button"
                              onClick={() => {
                                setAppliedSitterFilter(tempSitterFilter);
                                setAppliedSitterSort(tempSitterSort);
                                setAppliedSitterCity(tempSitterCity);
                                setAppliedSitterState(tempSitterState);
                                setShowSitterFilterSelect(false);
                              }}
                              className="btn btn-primary"
                              style={{ flex: 1, padding: '12px', borderRadius: '12px', fontSize: '0.95rem' }}
                            >
                              Apply Filters
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Sitters Table */}
                  <div className="card" style={tableContainerStyle}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '1000px' }}>
                      <thead style={theadStyle}>
                        <tr>
                          <th style={cellStyle}>Sitter</th>
                          <th style={cellStyle}>Contact / Address</th>
                          <th style={cellStyle}>Verification</th>
                          <th style={cellStyle}>Availability</th>
                          <th style={{ ...cellStyle, textAlign: 'right' }}>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredSitters.map(sitter => (
                          <tr key={sitter.id} style={rowStyle}>
                            <td style={cellStyle}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                <div style={avatarStyle}>{sitter.avatar}</div>
                                <div>
                                  <div style={{ fontWeight: '600', color: 'var(--text-heading)' }}>{sitter.fullName}</div>
                                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Reg: {sitter.date}</div>
                                </div>
                              </div>
                            </td>
                            <td style={cellStyle}>
                              <div style={{ fontSize: '0.9rem', color: 'var(--text-heading)' }}>{sitter.email}</div>
                              <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{sitter.phone}</div>
                              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '2px' }}>{sitter.address}</div>
                            </td>
                            <td style={cellStyle}>
                              <span style={{ ...badgeBase, ...getBadgeStyle(sitter.verifStatus), display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                                {sitter.verifStatus === 'Pending' && <Info size={14} />}
                                {sitter.verifStatus === 'Verified' && <CheckCircle size={14} />}
                                {sitter.verifStatus === 'Rejected' && <XCircle size={14} />}
                                {sitter.verifStatus}
                              </span>
                            </td>
                            <td style={cellStyle}>
                              <span style={{ ...badgeBase, ...getBadgeStyle(sitter.availStatus) }}>{sitter.availStatus}</span>
                            </td>
                            <td style={{ ...cellStyle, textAlign: 'right' }}>
                              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
                                {sitter.verifStatus === 'Pending' && (
                                  <>
                                    <button onClick={() => console.log('Approve', sitter.id)} style={iconBtnStyle}><CheckCircle size={20} color="var(--success)" /></button>
                                    <button onClick={() => console.log('Reject', sitter.id)} style={iconBtnStyle}><XCircle size={20} color="var(--danger)" /></button>
                                    <button onClick={() => console.log('Request Info', sitter.id)} style={iconBtnStyle}><FileText size={20} color="var(--secondary)" /></button>
                                  </>
                                )}
                                <button onClick={() => console.log('View', sitter.id)} style={iconBtnStyle}><Eye size={20} /></button>
                                <button onClick={() => console.log('Block', sitter.id)} style={iconBtnStyle}><Ban size={20} /></button>
                              </div>
                            </td>
                          </tr>
                        ))}
                        {filteredSitters.length === 0 && (
                          <tr><td colSpan={5} style={noDataStyle}>No pet sitters found.</td></tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </>
              )}
            </>
          )}

          {currentView === 'users' && (
            <UserManagement getStatusPillStyle={getStatusPillStyle} getBadgeStyle={getBadgeStyle} />
          )}
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
