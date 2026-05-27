import React, { useEffect, useState, useRef } from 'react';
import { LogOut, Users, LayoutDashboard, Search, Eye, Ban, Trash2, CheckCircle, XCircle, FileText, Info, Filter, PawPrint, ChevronLeft, ChevronRight, AlertCircle } from 'lucide-react';
import { useAdminAuth } from '../../components/admin/AdminAuthContext';
import { Link, useNavigate } from 'react-router-dom';
import './AdminDashboard.css';
import { UserManagement } from './UserManagement';
import { SitterDetails } from './SitterDetails';
import { API_ROUTES } from '../../constants/apiConstants';

// Helper to style status badges
const getBadgeStyle = (status: string) => {
  if (!status) return { bg: '#e2e8f0', color: '#64748b' };
  const normalized = status.toUpperCase();
  switch (normalized) {
    case 'ACTIVE':
    case 'VERIFIED':
    case 'APPROVED':
    case 'AVAILABLE':
      return { bg: 'rgba(16, 185, 129, 0.15)', color: 'var(--success)' };
    case 'REJECTED':
    case 'UNAVAILABLE':
      return { bg: 'rgba(239, 68, 68, 0.15)', color: 'var(--danger)' };
    case 'BLOCKED':
      return { bg: 'rgba(220, 38, 38, 0.15)', color: '#dc2626' }; // Dark Red for Blocked
    case 'PENDING':
      return { bg: 'rgba(245, 158, 11, 0.15)', color: 'var(--secondary-hover)' };
    case 'INACTIVE':
      return { bg: 'rgba(124, 58, 237, 0.15)', color: '#7c3aed' }; // Purple for Inactive
    default:
      return { bg: 'rgba(100, 116, 139, 0.12)', color: 'var(--text-muted)' };
  }
};

const getSitterName = (s: any) => {
  if (!s) return '';
  if (s.fullName) return s.fullName;
  return `${s.firstName || ''} ${s.lastName || ''}`.trim() || 'Unknown Sitter';
};

const getOwnerName = (o: any) => {
  if (!o) return '';
  if (o.fullName) return o.fullName;
  return `${o.firstName || ''} ${o.lastName || ''}`.trim() || 'Unknown Owner';
};

const getSitterAddress = (s: any) => {
  if (!s) return '';
  if (typeof s.address === 'string') return s.address;
  if (s.address && typeof s.address === 'object') {
    const { houseNo, street, locality, city, state, pincode, country } = s.address;
    const parts = [houseNo, street, locality, city, state, pincode, country];
    return parts.map(p => typeof p === 'string' ? p.trim() : p).filter(Boolean).join(', ') || 'No address recorded';
  }
  return 'No address recorded';
};

// Helper to style status filter pills dynamically
const getStatusPillStyle = (status: string, isActive: boolean): React.CSSProperties => {
  const baseStyle: React.CSSProperties = {
    padding: '8px 16px',
    borderRadius: '20px',
    border: '1.5px solid var(--border)',
    backgroundColor: 'var(--bg-card)',
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

interface StatusMessageProps {
  type: 'empty' | 'error';
  message: string;
  onRetry?: () => void;
}

const StatusMessage: React.FC<StatusMessageProps> = ({ type, message, onRetry }) => {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '48px 32px',
      borderRadius: '24px',
      backgroundColor: 'var(--bg-card)',
      border: '1.5px dashed var(--border)',
      textAlign: 'center',
      margin: '24px 0',
      gap: '16px',
      boxShadow: '0 4px 20px rgba(0, 0, 0, 0.02)'
    }}>
      <div style={{
        width: '64px',
        height: '64px',
        borderRadius: '20px',
        backgroundColor: type === 'error' ? 'rgba(239, 68, 68, 0.1)' : 'var(--primary-light)',
        color: type === 'error' ? 'var(--danger)' : 'var(--primary)',
        display: 'grid',
        placeItems: 'center'
      }}>
        {type === 'error' ? <AlertCircle size={32} /> : <Search size={32} />}
      </div>
      <div>
        <h4 style={{ fontSize: '1.15rem', fontWeight: '800', color: 'var(--text-heading)', margin: '0 0 6px 0' }}>
          {type === 'error' ? 'System Error Encountered' : 'No Records Found'}
        </h4>
        <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', margin: 0, maxWidth: '360px', lineHeight: '1.5' }}>
          {message}
        </p>
      </div>
      {onRetry && (
        <button 
          onClick={onRetry} 
          className="btn btn-secondary" 
          style={{ padding: '8px 20px', borderRadius: '12px', fontSize: '0.85rem' }}
        >
          Retry Connection
        </button>
      )}
    </div>
  );
};

const AdminDashboard: React.FC = () => {
  const { adminUser, logoutAdmin } = useAdminAuth();
  const navigate = useNavigate();

  const [currentView, setCurrentView] = useState<'dashboard' | 'users' | 'bookings' | 'payments' | 'settings'>('dashboard');
  const [selectedSitter, setSelectedSitter] = useState<any | null>(null);
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(false);
  const [greeting, setGreeting] = useState('');
  const [activeTab, setActiveTab] = useState<'owners' | 'sitters'>('sitters');
  const [ownerSearch, setOwnerSearch] = useState('');
  const [sitterSearch, setSitterSearch] = useState('');

  // Applied Advanced Filter states (Declared before useEffect hooks)
  const [appliedSitterFilter, setAppliedSitterFilter] = useState('All');
  const [appliedSitterSort, setAppliedSitterSort] = useState('newest');
  const [appliedSitterCity, setAppliedSitterCity] = useState('All');
  const [appliedSitterState, setAppliedSitterState] = useState('All');



  const [sitterCounts, setSitterCounts] = useState({
    total: 0,
    pending: 0,
    verified: 0,
    rejected: 0,
    blocked: 0,
    inactive: 0,
  });

  const [sittersList, setSittersList] = useState<any[]>([]);

  const [debouncedSitterSearch, setDebouncedSitterSearch] = useState(sitterSearch);

  const [sitterPage, setSitterPage] = useState(1);
  const [sitterLimit, setSitterLimit] = useState(20); // Dynamic limit state
  const [sitterTotalPages, setSitterTotalPages] = useState(1);

  const [ownersList, setOwnersList] = useState<any[]>([]);
  const [ownerPage, setOwnerPage] = useState(1);
  const [ownerLimit, setOwnerLimit] = useState(20);
  const [ownerTotalPages, setOwnerTotalPages] = useState(1);
  const [ownerCounts, setOwnerCounts] = useState({
    total: 0,
    active: 0,
    blocked: 0,
    pets: 0,
  });

  const [debouncedOwnerSearch, setDebouncedOwnerSearch] = useState(ownerSearch);
  const [ownerError, setOwnerError] = useState<string | null>(null);
  const [sitterError, setSitterError] = useState<string | null>(null);

  const [appliedOwnerFilter, setAppliedOwnerFilter] = useState('All');
  const [appliedOwnerSort, setAppliedOwnerSort] = useState('newest');
  const [appliedOwnerCity, setAppliedOwnerCity] = useState('All');
  const [appliedOwnerState, setAppliedOwnerState] = useState('All');

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSitterSearch(sitterSearch);
    }, 400);
    return () => clearTimeout(timer);
  }, [sitterSearch]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedOwnerSearch(ownerSearch);
    }, 400);
    return () => clearTimeout(timer);
  }, [ownerSearch]);

  const fetchSitters = async () => {
    try {
      setSitterError(null);
      const queryParams = new URLSearchParams();
      if (debouncedSitterSearch.trim()) {
        queryParams.append('search', debouncedSitterSearch.trim());
      }
      if (appliedSitterFilter && appliedSitterFilter !== 'All') {
        queryParams.append('status', appliedSitterFilter);
      }

      queryParams.append('page', sitterPage.toString());
      queryParams.append('limit', sitterLimit.toString());

      const url = `${API_ROUTES.DASHBOARD.SITTERS_LIST}?${queryParams.toString()}`;
      const response = await fetch(url);
      if (response.ok) {
        const data = await response.json();
        const sitters = data.data || data;
        if (Array.isArray(sitters)) {
          setSittersList(sitters);
        } else {
          setSittersList([]);
        }
        if (data.pagination) {
          setSitterTotalPages(data.pagination.pages || 1);
        }
      } else {
        setSitterError(`Server responded with code ${response.status}`);
      }
    } catch (e: any) {
      console.error("Failed to fetch sitters list", e);
      setSitterError(e.message || "Network request failed. Please verify connection.");
    }
  };

  useEffect(() => {
    fetchSitters();
  }, [debouncedSitterSearch, appliedSitterFilter, sitterPage, sitterLimit]);

  const fetchOwners = async () => {
    try {
      setOwnerError(null);
      const queryParams = new URLSearchParams();
      if (debouncedOwnerSearch.trim()) {
        queryParams.append('search', debouncedOwnerSearch.trim());
      }
      if (appliedOwnerFilter && appliedOwnerFilter !== 'All') {
        queryParams.append('status', appliedOwnerFilter);
      }
      queryParams.append('page', ownerPage.toString());
      queryParams.append('limit', ownerLimit.toString());

      const url = `${API_ROUTES.DASHBOARD.OWNERS_LIST}?${queryParams.toString()}`;
      const response = await fetch(url);
      if (response.ok) {
        const data = await response.json();
        const owners = data.data || data;
        if (Array.isArray(owners)) {
          setOwnersList(owners);
        } else {
          setOwnersList([]);
        }
        if (data.pagination) {
          setOwnerTotalPages(data.pagination.pages || 1);
        }
        
        // Compute stats dynamically
        const totalVal = data.stats?.total ?? owners.length;
        const activeVal = data.stats?.active ?? owners.filter((o: any) => o.status === 'Active').length;
        const blockedVal = data.stats?.blocked ?? owners.filter((o: any) => o.status === 'Blocked').length;
        const petsVal = data.stats?.pets ?? owners.reduce((acc: number, curr: any) => acc + (curr.pets || 0), 0);
        setOwnerCounts({
          total: totalVal,
          active: activeVal,
          blocked: blockedVal,
          pets: petsVal,
        });
      } else {
        setOwnerError(`Server responded with code ${response.status}`);
      }
    } catch (e: any) {
      console.error("Failed to fetch owners list", e);
      setOwnerError(e.message || "Network request failed. Please verify connection.");
    }
  };

  useEffect(() => {
    // fetchOwners();
  }, [debouncedOwnerSearch, appliedOwnerFilter, ownerPage, ownerLimit]);

  const statsFetchedRef = useRef(false);

  useEffect(() => {
    if (statsFetchedRef.current) return;
    statsFetchedRef.current = true;

    const fetchStats = async () => {
      try {
        const response = await fetch(API_ROUTES.DASHBOARD.DASHBOARD_STATS);
        if (response.ok) {
          const data = await response.json();
          const stats = data.stats || data;
          setSitterCounts({
            total: typeof stats.total === 'number' ? stats.total : 0,
            pending: typeof stats.pending === 'number' ? stats.pending : 0,
            verified: typeof (stats.verified || stats.approved) === 'number' ? (stats.verified || stats.approved) : 0,
            rejected: typeof stats.rejected === 'number' ? stats.rejected : 0,
            blocked: typeof stats.blocked === 'number' ? stats.blocked : 0,
            inactive: typeof stats.inactive === 'number' ? stats.inactive : 0,
          });
        }
      } catch (e) {
        console.error("Failed to fetch dashboard stats", e);
      }
    };
    fetchStats();
  }, []);



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
  const sitterCities = ['All', ...Array.from(new Set(sittersList.map(s => s.address?.city || s.city).filter(Boolean)))];
  const sitterStates = ['All', ...Array.from(new Set(sittersList.map(s => s.address?.state || s.state).filter(Boolean)))];

  const ownerCities = ['All', ...Array.from(new Set(ownersList.map(o => o.city).filter(Boolean)))];
  const ownerStates = ['All', ...Array.from(new Set(ownersList.map(o => o.state).filter(Boolean)))];

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

  const handleViewSitterDetails = (sitterId: string | number) => {
    navigate(`/admin/sitters/${sitterId}`);
  };

  // Filtered and Sorted Owners
  const filteredOwners = ownersList
    .filter(o => {
      const matchesSearch = getOwnerName(o).toLowerCase().includes(ownerSearch.toLowerCase()) ||
        o.email.toLowerCase().includes(ownerSearch.toLowerCase()) ||
        (o.phone || o.phoneNumber || '').includes(ownerSearch);
      const matchesFilter = appliedOwnerFilter === 'All' || o.status === appliedOwnerFilter;
      const matchesCity = appliedOwnerCity === 'All' || o.city === appliedOwnerCity;
      const matchesState = appliedOwnerState === 'All' || o.state === appliedOwnerState;
      return matchesSearch && matchesFilter && matchesCity && matchesState;
    })
    .sort((a, b) => {
      const aDate = a.date || a.createdOn || '';
      const bDate = b.date || b.createdOn || '';
      if (appliedOwnerSort === 'newest') return new Date(bDate).getTime() - new Date(aDate).getTime();
      if (appliedOwnerSort === 'oldest') return new Date(aDate).getTime() - new Date(bDate).getTime();
      if (appliedOwnerSort === 'name-asc') return getOwnerName(a).localeCompare(getOwnerName(b));
      if (appliedOwnerSort === 'name-desc') return getOwnerName(b).localeCompare(getOwnerName(a));
      return 0;
    });

  // Filtered and Sorted Sitters
  const filteredSitters = sittersList
    .filter(s => {
      const sitterCity = s.address?.city || s.city;
      const sitterState = s.address?.state || s.state;
      const matchesCity = appliedSitterCity === 'All' || sitterCity === appliedSitterCity;
      const matchesState = appliedSitterState === 'All' || sitterState === appliedSitterState;
      return matchesCity && matchesState;
    })
    .sort((a, b) => {
      const aDate = a.date || a.createdOn || '';
      const bDate = b.date || b.createdOn || '';
      if (appliedSitterSort === 'newest') return new Date(bDate).getTime() - new Date(aDate).getTime();
      if (appliedSitterSort === 'oldest') return new Date(aDate).getTime() - new Date(bDate).getTime();
      if (appliedSitterSort === 'name-asc') return getSitterName(a).localeCompare(getSitterName(b));
      if (appliedSitterSort === 'name-desc') return getSitterName(b).localeCompare(getSitterName(a));
      return 0;
    });

  // Reusable style objects
  const badgeBase = { padding: '4px 8px', borderRadius: '12px', fontSize: '0.8rem', fontWeight: '700' };
  const searchInputStyle = { width: '100%', padding: '10px 12px 10px 36px', borderRadius: '8px', border: '1px solid var(--border)', fontSize: '0.95rem', background: 'var(--bg-card)' };
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
        <aside 
          className="admin-sidebar"
          style={{ 
            width: isSidebarExpanded ? '280px' : '80px', 
            transition: 'width 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            overflowX: 'hidden' 
          }}
        >
          <div style={{ 
            padding: '24px 16px', 
            borderBottom: '1px solid rgba(255,255,255,0.1)', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: isSidebarExpanded ? 'space-between' : 'center',
            flexDirection: isSidebarExpanded ? 'row' : 'column',
            gap: '12px',
            transition: 'all 0.3s'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{
                width: '44px', height: '44px', borderRadius: '12px',
                backgroundColor: 'var(--primary-light)', color: 'var(--primary)',
                display: 'grid', placeItems: 'center',
                boxShadow: '0 4px 12px rgba(13, 148, 136, 0.3)',
                flexShrink: 0
              }}>
                <PawPrint size={24} />
              </div>
              {isSidebarExpanded && (
                <span style={{ fontSize: '1.3rem', fontWeight: '800', color: 'white', letterSpacing: '-0.3px' }}>
                  <span style={{ color: 'var(--primary)' }}>Pet</span>Buddy
                </span>
              )}
            </div>
            
            {/* Expand / Hide toggle button */}
            <button 
              onClick={() => setIsSidebarExpanded(!isSidebarExpanded)}
              style={{
                background: 'rgba(255,255,255,0.08)', border: 'none', borderRadius: '50%',
                width: '28px', height: '28px', display: 'grid', placeItems: 'center',
                color: 'white', cursor: 'pointer', transition: 'all 0.2s',
                outline: 'none',
                boxShadow: '0 2px 5px rgba(0,0,0,0.1)'
              }}
              onMouseOver={e => e.currentTarget.style.background = 'rgba(255,255,255,0.15)'}
              onMouseOut={e => e.currentTarget.style.background = 'rgba(255,255,255,0.08)'}
              title={isSidebarExpanded ? "Collapse Sidebar" : "Expand Sidebar"}
            >
              {isSidebarExpanded ? <ChevronLeft size={16} /> : <ChevronRight size={16} />}
            </button>
          </div>

          {/* Navigation Links */}
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
                  className={`sidebar-nav-link ${isActive ? 'active' : ''}`}
                  style={{
                    justifyContent: isSidebarExpanded ? 'flex-start' : 'center',
                    gap: isSidebarExpanded ? '12px' : '0',
                  }}
                  title={!isSidebarExpanded ? item.name : undefined}
                >
                  <Icon size={20} className="nav-icon" />
                  {isSidebarExpanded && <span style={{ whiteSpace: 'nowrap' }}>{item.name}</span>}
                </Link>
              );
            })}
          </nav>

          {/* Sidebar Profile Item */}
          <div 
            style={{ 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: isSidebarExpanded ? 'flex-start' : 'center', 
              gap: isSidebarExpanded ? '12px' : '0', 
              padding: '12px 24px',
              backgroundColor: 'transparent',
              color: '#cbd5e1', 
              transition: 'all 0.2s',
              borderLeft: '4px solid transparent',
              borderTop: '1px solid rgba(255,255,255,0.08)',
              marginTop: 'auto',
              width: '100%',
              boxSizing: 'border-box'
            }}
            title={!isSidebarExpanded ? adminUser?.fullName : undefined}
          >
            <div 
              style={{ 
                width: '24px', height: '24px', borderRadius: '50%', 
                backgroundColor: 'var(--primary)', color: 'white', 
                display: 'grid', placeItems: 'center', fontWeight: '800', 
                fontSize: '0.75rem', flexShrink: 0,
                boxShadow: '0 2px 6px rgba(13, 148, 136, 0.3)'
              }}
            >
              {adminUser?.fullName?.charAt(0).toUpperCase()}
            </div>
            {isSidebarExpanded && (
              <span style={{ whiteSpace: 'nowrap', fontWeight: '500', fontSize: '0.95rem', color: '#cbd5e1' }}>
                {adminUser?.fullName}
              </span>
            )}
          </div>

          {/* Sign Out Item */}
          <button 
            onClick={handleLogout} 
            className="sidebar-footer-btn"
            style={{
              justifyContent: isSidebarExpanded ? 'flex-start' : 'center',
              gap: isSidebarExpanded ? '12px' : '0',
              marginBottom: '16px',
            }}
            title={!isSidebarExpanded ? "Sign Out" : undefined}
          >
            <LogOut size={20} className="nav-icon" /> 
            {isSidebarExpanded && <span style={{ whiteSpace: 'nowrap' }}>Sign Out</span>}
          </button>
        </aside>

        {/* Main Content */}
        <main className="admin-main">
          
        <div style={{ padding: '32px', flex: 1 }}>
          {!selectedSitter && (
            <>
              <h1 style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--text-heading)' }}>{greeting}, {adminUser?.fullName.split(' ')[0]}!</h1>
              <p style={{ color: 'var(--text-muted)', marginBottom: '24px' }}>Here's what's happening in your platform today.</p>
            </>
          )}

          {/* Tabs */}
          {currentView === 'dashboard' && (
            selectedSitter ? (
              <SitterDetails 
                sitter={selectedSitter}
                onBack={() => setSelectedSitter(null)}
                getBadgeStyle={getBadgeStyle}
                badgeBase={badgeBase}
                getSitterName={getSitterName}
                getSitterAddress={getSitterAddress}
              />
            ) : (
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
                            backgroundColor: showOwnerFilterSelect || ownerFilterCount > 0 ? 'var(--primary-light)' : 'var(--bg-card)',
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
                            width: '340px', backgroundColor: 'var(--bg-card)', 
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
                                style={{ width: '100%', padding: '10px 14px', borderRadius: '12px', border: '1.5px solid var(--border)', background: 'var(--bg-main)', fontWeight: '600', color: 'var(--text-heading)', outline: 'none', fontSize: '0.9rem', cursor: 'pointer', transition: 'border-color 0.2s' }}
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
                                style={{ width: '100%', padding: '10px 14px', borderRadius: '12px', border: '1.5px solid var(--border)', background: 'var(--bg-main)', fontWeight: '600', color: 'var(--text-heading)', outline: 'none', fontSize: '0.9rem', cursor: 'pointer', transition: 'border-color 0.2s' }}
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
                                style={{ width: '100%', padding: '10px 14px', borderRadius: '12px', border: '1.5px solid var(--border)', background: 'var(--bg-main)', fontWeight: '600', color: 'var(--text-heading)', outline: 'none', fontSize: '0.9rem', cursor: 'pointer', transition: 'border-color 0.2s' }}
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

                    {/* Owners Table / Status Messages */}
                    {ownerError ? (
                      <StatusMessage type="error" message={ownerError} onRetry={fetchOwners} />
                    ) : filteredOwners.length === 0 ? (
                      <StatusMessage type="empty" message="No pet owners found matching your criteria. Try adjusting your filters or search terms." />
                    ) : (
                      <>
                        <div className="admin-table-container">
                          <table className="admin-table">
                            <thead>
                              <tr>
                                <th>Owner</th>
                                <th>Contact</th>
                                <th>Reg. Date</th>
                                <th>Activity</th>
                                <th>Status</th>
                                <th style={{ textAlign: 'right' }}>Actions</th>
                              </tr>
                            </thead>
                            <tbody>
                              {filteredOwners.map(owner => (
                                <tr key={owner.id}>
                                  <td>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                      <div className="table-avatar">
                                        {owner.avatar || getOwnerName(owner).charAt(0).toUpperCase()}
                                      </div>
                                      <span style={{ fontWeight: '600', color: 'var(--text-heading)' }}>{getOwnerName(owner)}</span>
                                    </div>
                                  </td>
                                  <td>
                                    <div style={{ fontSize: '0.9rem', color: 'var(--text-heading)' }}>{owner.email}</div>
                                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{owner.phone || owner.phoneNumber}</div>
                                  </td>
                                  <td>{owner.date || (owner.createdOn ? new Date(owner.createdOn).toISOString().split('T')[0] : '')}</td>
                                  <td>
                                    <div style={{ fontSize: '0.9rem' }}><strong>{owner.pets ?? 0}</strong> Pets</div>
                                    <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{owner.bookings ?? 0} Bookings</div>
                                  </td>
                                  <td>
                                    <span style={{ ...badgeBase, ...getBadgeStyle(owner.status) }}>{owner.status}</span>
                                  </td>
                                  <td style={{ textAlign: 'right' }}>
                                    <button onClick={() => console.log('View', owner.id)} className="action-btn" title="View Details"><Eye size={18} /></button>
                                    <button onClick={() => console.log('Toggle block', owner.id)} className={`action-btn ${owner.status === 'Active' ? 'btn-danger' : 'btn-success'}`} title={owner.status === 'Active' ? 'Block Owner' : 'Unblock Owner'}><Ban size={18} /></button>
                                    <button onClick={() => console.log('Delete', owner.id)} className="action-btn btn-danger" title="Delete Owner"><Trash2 size={18} /></button>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>

                        {/* Owner Pagination and Size Selector */}
                        {ownersList.length > 0 && (
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '16px', padding: '0 8px', flexWrap: 'wrap', gap: '12px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                              <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: '600' }}>
                                Page <strong>{ownerPage}</strong> of <strong>{ownerTotalPages || 1}</strong>
                              </span>
                              
                              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: '600' }}>Page:</span>
                                <select
                                  value={ownerPage}
                                  onChange={(e) => setOwnerPage(Number(e.target.value))}
                                  style={{
                                    padding: '4px 8px',
                                    borderRadius: '8px',
                                    border: '1.5px solid var(--border)',
                                    background: 'var(--bg-card)',
                                    color: 'var(--text-heading)',
                                    fontWeight: '600',
                                    fontSize: '0.8rem',
                                    cursor: 'pointer',
                                    outline: 'none'
                                  }}
                                >
                                  {Array.from({ length: ownerTotalPages || 1 }, (_, i) => i + 1).map(p => (
                                    <option key={p} value={p}>{p}</option>
                                  ))}
                                </select>
                              </div>

                              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: '600' }}>Show:</span>
                                <select
                                  value={ownerLimit}
                                  onChange={(e) => {
                                    setOwnerLimit(Number(e.target.value));
                                    setOwnerPage(1); // Reset page back to 1
                                  }}
                                  style={{
                                    padding: '4px 8px',
                                    borderRadius: '8px',
                                    border: '1.5px solid var(--border)',
                                    background: 'var(--bg-card)',
                                    color: 'var(--text-heading)',
                                    fontWeight: '600',
                                    fontSize: '0.8rem',
                                    cursor: 'pointer',
                                    outline: 'none'
                                  }}
                                >
                                  <option value={5}>5 / page</option>
                                  <option value={10}>10 / page</option>
                                  <option value={20}>20 / page</option>
                                  <option value={50}>50 / page</option>
                                </select>
                              </div>
                            </div>
                            
                            {ownerTotalPages > 1 && (
                              <div style={{ display: 'flex', gap: '8px' }}>
                                <button
                                  disabled={ownerPage === 1}
                                  onClick={() => setOwnerPage(prev => Math.max(prev - 1, 1))}
                                  className="btn btn-secondary"
                                  style={{ padding: '6px 12px', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '4px', opacity: ownerPage === 1 ? 0.5 : 1, cursor: ownerPage === 1 ? 'not-allowed' : 'pointer' }}
                                >
                                  <ChevronLeft size={16} /> Prev
                                </button>
                                <button
                                  disabled={ownerPage >= ownerTotalPages}
                                  onClick={() => setOwnerPage(prev => Math.min(prev + 1, ownerTotalPages))}
                                  className="btn btn-secondary"
                                  style={{ padding: '6px 12px', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '4px', opacity: ownerPage >= ownerTotalPages ? 0.5 : 1, cursor: ownerPage >= ownerTotalPages ? 'not-allowed' : 'pointer' }}
                                >
                                  Next <ChevronRight size={16} />
                                </button>
                              </div>
                            )}
                          </div>
                        )}
                      </>
                    )}
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
                      <div className="sitter-card card-blocked">
                        <p className="card-label">Blocked Sitters</p>
                        <h3 className="card-value">{sitterCounts.blocked}</h3>
                      </div>
                      <div className="sitter-card card-inactive">
                        <p className="card-label">Inactive Sitters</p>
                        <h3 className="card-value">{sitterCounts.inactive}</h3>
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
                            backgroundColor: showSitterFilterSelect || sitterFilterCount > 0 ? 'var(--primary-light)' : 'var(--bg-card)',
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
                            width: '340px', backgroundColor: 'var(--bg-card)', 
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
                                style={{ width: '100%', padding: '10px 14px', borderRadius: '12px', border: '1.5px solid var(--border)', background: 'var(--bg-main)', fontWeight: '600', color: 'var(--text-heading)', outline: 'none', fontSize: '0.9rem', cursor: 'pointer', transition: 'border-color 0.2s' }}
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
                                style={{ width: '100%', padding: '10px 14px', borderRadius: '12px', border: '1.5px solid var(--border)', background: 'var(--bg-main)', fontWeight: '600', color: 'var(--text-heading)', outline: 'none', fontSize: '0.9rem', cursor: 'pointer', transition: 'border-color 0.2s' }}
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
                                style={{ width: '100%', padding: '10px 14px', borderRadius: '12px', border: '1.5px solid var(--border)', background: 'var(--bg-main)', fontWeight: '600', color: 'var(--text-heading)', outline: 'none', fontSize: '0.9rem', cursor: 'pointer', transition: 'border-color 0.2s' }}
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

                    {/* Sitters Table / Status Messages */}
                    {sitterError ? (
                      <StatusMessage type="error" message={sitterError} onRetry={fetchSitters} />
                    ) : filteredSitters.length === 0 ? (
                      <StatusMessage type="empty" message="No pet sitters found matching your criteria. Try adjusting your filters or search terms." />
                    ) : (
                      <>
                        <div className="admin-table-container">
                          <table className="admin-table" style={{ minWidth: '1000px' }}>
                            <thead>
                              <tr>
                                <th>Sitter</th>
                                <th>Contact / Address</th>
                                <th>Verification</th>
                                <th>Availability</th>
                                <th style={{ textAlign: 'right' }}>Actions</th>
                              </tr>
                            </thead>
                            <tbody>
                              {filteredSitters.map(sitter => (
                                <tr key={sitter.id}>
                                  <td>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                      <div className="table-avatar">
                                        {sitter.avatar || getSitterName(sitter).charAt(0).toUpperCase()}
                                      </div>
                                      <div>
                                        <div style={{ fontWeight: '600', color: 'var(--text-heading)' }}>{getSitterName(sitter)}</div>
                                        <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                                          Reg: {sitter.date || (sitter.createdOn ? new Date(sitter.createdOn).toISOString().split('T')[0] : '')}
                                        </div>
                                      </div>
                                    </div>
                                  </td>
                                  <td>
                                    <div style={{ fontSize: '0.9rem', color: 'var(--text-heading)' }}>{sitter.email}</div>
                                    <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{sitter.phone || sitter.phoneNumber}</div>
                                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '2px' }}>{getSitterAddress(sitter)}</div>
                                  </td>
                                  <td>
                                     <span style={{ ...badgeBase, ...getBadgeStyle(sitter.status), display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                                       {sitter.status?.toLowerCase() === 'pending' && <Info size={14} />}
                                       {(sitter.status?.toLowerCase() === 'verified' || sitter.status?.toLowerCase() === 'approved') && <CheckCircle size={14} />}
                                       {sitter.status?.toLowerCase() === 'rejected' && <XCircle size={14} />}
                                       {sitter.status?.toLowerCase() === 'blocked' && <Ban size={14} />}
                                       {sitter.status?.toLowerCase() === 'inactive' && <XCircle size={14} />}
                                       {sitter.status}
                                     </span>
                                  </td>
                                  <td>
                                     <span style={{ ...badgeBase, ...getBadgeStyle(sitter.availability || sitter.availStatus) }}>{sitter.availability || sitter.availStatus}</span>
                                  </td>
                                  <td style={{ textAlign: 'right' }}>
                                    <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                                      {sitter.status?.toLowerCase() === 'pending' && (
                                        <>
                                          <button onClick={() => console.log('Approve', sitter.id)} className="action-btn btn-success" title="Approve Sitter"><CheckCircle size={18} /></button>
                                          <button onClick={() => console.log('Reject', sitter.id)} className="action-btn btn-danger" title="Reject Sitter"><XCircle size={18} /></button>
                                          <button onClick={() => console.log('Request Info', sitter.id)} className="action-btn btn-warning" title="Request Info"><FileText size={18} /></button>
                                        </>
                                      )}
                                      <button onClick={() => handleViewSitterDetails(sitter.id || sitter._id)} className="action-btn" title="View Sitter Details"><Eye size={18} /></button>
                                      <button onClick={() => console.log('Block', sitter.id)} className="action-btn btn-danger" title="Block Sitter"><Ban size={18} /></button>
                                    </div>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>

                        {/* Sitter Pagination and Size Selector */}
                        {sittersList.length > 0 && (
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '16px', padding: '0 8px', flexWrap: 'wrap', gap: '12px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                              <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: '600' }}>
                                Page <strong>{sitterPage}</strong> of <strong>{sitterTotalPages || 1}</strong>
                              </span>
                              
                              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: '600' }}>Page:</span>
                                <select
                                  value={sitterPage}
                                  onChange={(e) => setSitterPage(Number(e.target.value))}
                                  style={{
                                    padding: '4px 8px',
                                    borderRadius: '8px',
                                    border: '1.5px solid var(--border)',
                                    background: 'var(--bg-card)',
                                    color: 'var(--text-heading)',
                                    fontWeight: '600',
                                    fontSize: '0.8rem',
                                    cursor: 'pointer',
                                    outline: 'none'
                                  }}
                                >
                                  {Array.from({ length: sitterTotalPages || 1 }, (_, i) => i + 1).map(p => (
                                    <option key={p} value={p}>{p}</option>
                                  ))}
                                </select>
                              </div>

                              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: '600' }}>Show:</span>
                                <select
                                  value={sitterLimit}
                                  onChange={(e) => {
                                    setSitterLimit(Number(e.target.value));
                                    setSitterPage(1); // Reset page back to 1
                                  }}
                                  style={{
                                    padding: '4px 8px',
                                    borderRadius: '8px',
                                    border: '1.5px solid var(--border)',
                                    background: 'var(--bg-card)',
                                    color: 'var(--text-heading)',
                                    fontWeight: '600',
                                    fontSize: '0.8rem',
                                    cursor: 'pointer',
                                    outline: 'none'
                                  }}
                                >
                                  <option value={5}>5 / page</option>
                                  <option value={10}>10 / page</option>
                                  <option value={20}>20 / page</option>
                                  <option value={50}>50 / page</option>
                                </select>
                              </div>
                            </div>
                            
                            {sitterTotalPages > 1 && (
                              <div style={{ display: 'flex', gap: '8px' }}>
                                <button
                                  disabled={sitterPage === 1}
                                  onClick={() => setSitterPage(prev => Math.max(prev - 1, 1))}
                                  className="btn btn-secondary"
                                  style={{ padding: '6px 12px', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '4px', opacity: sitterPage === 1 ? 0.5 : 1, cursor: sitterPage === 1 ? 'not-allowed' : 'pointer' }}
                                >
                                  <ChevronLeft size={16} /> Prev
                                </button>
                                <button
                                  disabled={sitterPage >= sitterTotalPages}
                                  onClick={() => setSitterPage(prev => Math.min(prev + 1, sitterTotalPages))}
                                  className="btn btn-secondary"
                                  style={{ padding: '6px 12px', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '4px', opacity: sitterPage >= sitterTotalPages ? 0.5 : 1, cursor: sitterPage >= sitterTotalPages ? 'not-allowed' : 'pointer' }}
                                >
                                  Next <ChevronRight size={16} />
                                </button>
                              </div>
                            )}
                          </div>
                        )}
                      </>
                    )}
                  </>
                )}
              </>
            )
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
