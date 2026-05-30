import React, { useEffect, useState } from 'react';
import { Users, Search, Eye, Ban, Trash2, CheckCircle, XCircle, Info, Filter, PawPrint, AlertCircle } from 'lucide-react';
import { useAdminAuth } from '../../components/admin/AdminAuthContext';
import { useNavigate } from 'react-router-dom';
import './AdminDashboard.css';
import { UserManagement } from './UserManagement';
import { SitterDetails } from './SitterDetails';
import { API_ROUTES } from '../../constants/apiConstants';
import PremiumSidebar from '../../components/admin/PremiumSidebar';
import '../../components/admin/PremiumSelect.css';

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

const AdminDashboard: React.FC<{ initialView?: 'dashboard' | 'users' | 'bookings' | 'payments' | 'settings' }> = ({ initialView = 'dashboard' }) => {
  const { adminUser } = useAdminAuth();
  const [currentView, setCurrentView] = useState<'dashboard' | 'users' | 'bookings' | 'payments' | 'settings'>(initialView);
  const navigate = useNavigate();

  useEffect(() => {
    setCurrentView(initialView);
    if (initialView !== 'dashboard') {
      sessionStorage.removeItem('petbuddy_admin_tab');
      setActiveTab('sitters');
    }
  }, [initialView]);
  const [selectedSitter, setSelectedSitter] = useState<any | null>(null);
  const [selectedOwner, setSelectedOwner] = useState<any | null>(null);

  // Tab State
  const [greeting, setGreeting] = useState('');
  const [activeTab, setActiveTab] = useState<'owners' | 'sitters'>(() => {
    return (sessionStorage.getItem('petbuddy_admin_tab') as 'owners' | 'sitters') || 'sitters';
  });

  // Persist active tab to session storage
  useEffect(() => {
    sessionStorage.setItem('petbuddy_admin_tab', activeTab);
  }, [activeTab]);
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

  const [isSittersLoading, setIsSittersLoading] = useState(true);
  const [isOwnersLoading, setIsOwnersLoading] = useState(true);

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

  const fetchSitters = async (signal?: AbortSignal) => {
    try {
      setIsSittersLoading(true);
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
      const token = localStorage.getItem('petbuddy_admin_access_token');
      const response = await fetch(url, { 
        signal,
        headers: token ? { 'Authorization': `Bearer ${token}` } : undefined
      });
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
        if (data.stats) {
          setSitterCounts({
            total: typeof data.stats.total === 'number' ? data.stats.total : 0,
            pending: typeof data.stats.pending === 'number' ? data.stats.pending : 0,
            verified: typeof data.stats.verified === 'number' ? data.stats.verified : 0,
            rejected: typeof data.stats.rejected === 'number' ? data.stats.rejected : 0,
            blocked: typeof data.stats.blocked === 'number' ? data.stats.blocked : 0,
          });
        }
      } else {
        setSitterError(`Server responded with code ${response.status}`);
      }
    } catch (e: any) {
      if (e.name === 'AbortError') return;
      console.error("Failed to fetch sitters list", e);
      setSitterError(e.message || "Network request failed. Please verify connection.");
    } finally {
      setIsSittersLoading(false);
    }
  };

  useEffect(() => {
    if (currentView === 'dashboard' && activeTab === 'sitters') {
      const controller = new AbortController();
      fetchSitters(controller.signal);
      return () => controller.abort();
    }
  }, [currentView, activeTab, debouncedSitterSearch, appliedSitterFilter, sitterPage, sitterLimit]);

  const fetchOwners = async (signal?: AbortSignal) => {
    try {
      setIsOwnersLoading(true);
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
      const token = localStorage.getItem('petbuddy_admin_access_token');
      const response = await fetch(url, { 
        signal,
        headers: token ? { 'Authorization': `Bearer ${token}` } : undefined
      });
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
      if (e.name === 'AbortError') return;
      console.error("Failed to fetch owners list", e);
      setOwnerError(e.message || "Network request failed. Please verify connection.");
    } finally {
      setIsOwnersLoading(false);
    }
  };

  const handleToggleOwnerStatus = async (id: string, currentStatus: string) => {
    try {
      const newStatus = currentStatus === 'ACTIVE' ? 'BLOCKED' : 'ACTIVE';
      const token = localStorage.getItem('petbuddy_admin_access_token');
      const response = await fetch(API_ROUTES.DASHBOARD.OWNER_STATUS(id), {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { 'Authorization': `Bearer ${token}` } : {})
        },
        body: JSON.stringify({ status: newStatus })
      });
      
      if (response.ok) {
        fetchOwners();
        if (selectedOwner && (selectedOwner._id === id || selectedOwner.id === id)) {
          setSelectedOwner({ ...selectedOwner, status: newStatus });
        }
      } else {
        alert('Failed to update owner status');
      }
    } catch (e) {
      console.error('Failed to update status', e);
      alert('An error occurred while updating owner status');
    }
  };

  const handleDeleteOwner = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this owner? This action cannot be undone.')) return;
    try {
      const token = localStorage.getItem('petbuddy_admin_access_token');
      const response = await fetch(API_ROUTES.DASHBOARD.OWNER_DELETE(id), {
        method: 'DELETE',
        headers: token ? { 'Authorization': `Bearer ${token}` } : undefined
      });
      
      if (response.ok) {
        fetchOwners();
        if (selectedOwner && (selectedOwner._id === id || selectedOwner.id === id)) {
          setSelectedOwner(null);
        }
      } else {
        alert('Failed to delete owner');
      }
    } catch (e) {
      console.error('Failed to delete owner', e);
      alert('An error occurred while deleting owner');
    }
  };

  useEffect(() => {
    if (currentView === 'dashboard' && activeTab === 'owners') {
      const controller = new AbortController();
      fetchOwners(controller.signal);
      return () => controller.abort();
    }
  }, [currentView, activeTab, debouncedOwnerSearch, appliedOwnerFilter, ownerPage, ownerLimit]);

  // Stats are now fetched alongside sitters list



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
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (hour < 12) setGreeting('Good Morning');
    else if (hour < 18) setGreeting('Good Afternoon');
    else setGreeting('Good Evening');
  }, []);


  const handleViewSitterDetails = (sitterId: string | number) => {
    navigate(`/admin/sitters/${sitterId}`);
  };

  // Filtered and Sorted Owners
  const filteredOwners = ownersList
    .filter(o => {
      const matchesSearch = getOwnerName(o).toLowerCase().includes(ownerSearch.toLowerCase()) ||
        o.email.toLowerCase().includes(ownerSearch.toLowerCase()) ||
        (o.phone || o.phoneNumber || '').includes(ownerSearch);
      const matchesFilter = appliedOwnerFilter === 'All' || o.status?.toUpperCase() === appliedOwnerFilter.toUpperCase();
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
      const matchesFilter = appliedSitterFilter === 'All' || s.status?.toUpperCase() === appliedSitterFilter.toUpperCase();
      const matchesState = appliedSitterState === 'All' || sitterState === appliedSitterState;
      return matchesCity && matchesFilter && matchesState;
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
  // const searchInputStyle = { width: '100%', padding: '10px 12px 10px 36px', borderRadius: '25px', border: '1px solid var(--border)', fontSize: '0.95rem', background: 'var(--bg-card)' };


  return (
    <div className="admin-wrapper">
        <PremiumSidebar activeId={currentView} />

        {/* Main Content */}
        <main className="admin-main">
          
        <div style={{ padding: '32px', flex: 1 }}>
          {!selectedSitter && currentView === 'dashboard' && (
            <div style={{ marginBottom: '32px' }}>
              <h1 style={{ fontSize: '2.5rem', fontWeight: '800', color: '#0f172a', letterSpacing: '-0.02em', marginBottom: '8px' }}>
                {greeting}, {adminUser?.fullName.split(' ')[0]}!
              </h1>
              <p style={{ color: '#64748b', fontSize: '1.15rem', margin: 0 }}>
                Here's what's happening in your platform today.
              </p>
            </div>
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
                {/* Premium Tab Button Group */}
                <div style={{ display: 'inline-flex', background: '#f1f5f9', padding: '6px', borderRadius: '16px', marginBottom: '36px', boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.04)' }}>
                  <button 
                    onClick={() => setActiveTab('sitters')} 
                    className={`premium-tab-btn ${activeTab === 'sitters' ? 'active' : ''}`}
                  >
                    Pet Sitters
                  </button>
                  <button 
                    onClick={() => setActiveTab('owners')} 
                    className={`premium-tab-btn ${activeTab === 'owners' ? 'active' : ''}`}
                  >
                    Pet Owners
                  </button>
                </div>

                {activeTab === 'owners' && (
                  <>
                    {/* Summary Cards Grid */}
                    <div className="grid-4" style={{ marginBottom: '40px' }}>
                      <div className="owner-card card-total-owners">
                        <Users className="card-bg-icon" />
                        <div className="card-content">
                          <div className="card-header">
                            <div className="icon-wrapper">
                              <Users size={20} />
                            </div>
                          </div>
                          <div>
                            <h3 className="card-value">{ownerCounts.total}</h3>
                            <p className="card-label">Total Owners</p>
                          </div>
                        </div>
                      </div>
                      <div className="owner-card card-active-owners">
                        <CheckCircle className="card-bg-icon" />
                        <div className="card-content">
                          <div className="card-header">
                            <div className="icon-wrapper">
                              <CheckCircle size={20} />
                            </div>
                          </div>
                          <div>
                            <h3 className="card-value">{ownerCounts.active}</h3>
                            <p className="card-label">Active Owners</p>
                          </div>
                        </div>
                      </div>
                      <div className="owner-card card-blocked-owners">
                        <Ban className="card-bg-icon" />
                        <div className="card-content">
                          <div className="card-header">
                            <div className="icon-wrapper">
                              <Ban size={20} />
                            </div>
                          </div>
                          <div>
                            <h3 className="card-value">{ownerCounts.blocked}</h3>
                            <p className="card-label">Blocked Owners</p>
                          </div>
                        </div>
                      </div>
                      <div className="owner-card card-pets-owners">
                        <PawPrint className="card-bg-icon" />
                        <div className="card-content">
                          <div className="card-header">
                            <div className="icon-wrapper">
                              <PawPrint size={20} />
                            </div>
                          </div>
                          <div>
                            <h3 className="card-value">{ownerCounts.pets}</h3>
                            <p className="card-label">Registered Pets</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="glass-panel" style={{ animation: 'fadeIn 0.5s cubic-bezier(0.16, 1, 0.3, 1)', marginBottom: '32px' }}>
                      {/* Search & Filter Container aligned to the right */}
                      <div className="panel-controls" style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: '12px', position: 'relative' }}>
                        <div className="search-wrapper">
                          <Search size={18} className="input-icon" />
                          <input
                            type="text"
                            className="modern-input"
                            placeholder="Search Name, Email, Phone..."
                            value={ownerSearch}
                            onChange={e => setOwnerSearch(e.target.value)}
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
                          className={`premium-select-trigger ${showOwnerFilterSelect ? 'open' : ''}`}
                        >
                          <span className="premium-select-icon"><Filter size={18} /></span>
                          <span className="premium-select-value">Filter</span>
                          {ownerFilterCount > 0 && (
                            <span style={{
                              backgroundColor: '#3b82f6', color: 'white',
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
                    {(isOwnersLoading && ownersList.length === 0) ? (
                      <div className="premium-loader-container">
                        <div className="paw-pulse-wrapper">
                          <div className="paw-pulse-ring"></div>
                          <PawPrint size={48} className="paw-icon bouncing" color="var(--primary)" />
                        </div>
                        <p className="loading-text">Loading Owners...</p>
                      </div>
                    ) : ownerError ? (
                      <StatusMessage type="error" message={ownerError} onRetry={fetchOwners} />
                    ) : filteredOwners.length === 0 ? (
                      <StatusMessage type="empty" message="No pet owners found matching your criteria. Try adjusting your filters or search terms." />
                    ) : (
                      <>
                        <div className="table-wrapper">
                          <table className="modern-table">
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
                              {filteredOwners.map((owner: any) => (
                                <tr key={owner._id || owner.id} className="table-row">
                                  <td>
                                    <div className="user-block">
                                      <div className="user-avatar-small bg-blue" style={{ overflow: 'hidden' }}>
                                        {owner.profilePicture ? (
                                          <img src={owner.profilePicture} alt="avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                        ) : (
                                          getOwnerName(owner).charAt(0).toUpperCase()
                                        )}
                                      </div>
                                      <div>
                                        <div className="user-name">{getOwnerName(owner)}</div>
                                      </div>
                                    </div>
                                  </td>
                                  <td>
                                    <div className="user-name">{owner.email}</div>
                                    <div className="user-email">{owner.countryCode} {owner.phoneNumber || owner.phone}</div>
                                  </td>
                                  <td className="date-text">{owner.createdAt ? new Date(owner.createdAt).toISOString().split('T')[0] : (owner.createdOn ? new Date(owner.createdOn).toISOString().split('T')[0] : '')}</td>
                                  <td>
                                    <div style={{ fontSize: '0.9rem' }}><strong>{owner.petsCount ?? 0}</strong> Pets</div>
                                    <div style={{ fontSize: '0.85rem' }}><strong>{owner.bookingsCount ?? 0}</strong> Bookings</div>
                                  </td>
                                  <td>
                                    <span className="modern-status-pill" style={getBadgeStyle(owner.status)}>{owner.status || 'ACTIVE'}</span>
                                  </td>
                                  <td style={{ textAlign: 'right' }}>
                                    <div style={{ display: 'inline-flex', gap: '8px', justifyContent: 'flex-end' }}>
                                      <button onClick={() => navigate(`/admin/owners/${owner._id || owner.id}`)} className="page-btn" style={{ padding: '6px 16px' }} title="View Details"><Eye size={16} /> View</button>
                                      <button onClick={() => handleToggleOwnerStatus(owner._id || owner.id, owner.status || 'ACTIVE')} className="page-btn" style={{ padding: '6px 10px', color: (!owner.status || owner.status === 'ACTIVE') ? '#e11d48' : '#059669' }} title={(!owner.status || owner.status === 'ACTIVE') ? 'Block Owner' : 'Unblock Owner'}><Ban size={16} /></button>
                                      <button onClick={() => handleDeleteOwner(owner._id || owner.id)} className="page-btn" style={{ padding: '6px 10px', color: '#e11d48' }} title="Delete Owner"><Trash2 size={16} /></button>
                                    </div>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>

                        {/* Owner Pagination and Size Selector */}
                        {ownersList.length > 0 && (
                          <div className="pagination-wrapper">
                            <div className="pagination-info">
                              Showing Page <b>{ownerPage}</b> of <b>{ownerTotalPages || 1}</b>
                            </div>
                            
                            <div className="pagination-controls">
                              <select
                                value={ownerLimit}
                                onChange={(e) => {
                                  setOwnerLimit(Number(e.target.value));
                                  setOwnerPage(1);
                                }}
                                className="modern-select"
                                style={{ padding: '8px 12px', minWidth: '100px', fontSize: '0.85rem' }}
                              >
                                <option value={5}>5 / page</option>
                                <option value={10}>10 / page</option>
                                <option value={20}>20 / page</option>
                                <option value={50}>50 / page</option>
                              </select>

                              {ownerTotalPages > 1 && (
                                <div style={{ display: 'flex', gap: '8px' }}>
                                  <button
                                    disabled={ownerPage === 1}
                                    onClick={() => setOwnerPage(prev => Math.max(prev - 1, 1))}
                                    className="page-btn"
                                  >
                                    Prev
                                  </button>
                                  <button
                                    disabled={ownerPage >= ownerTotalPages}
                                    onClick={() => setOwnerPage(prev => Math.min(prev + 1, ownerTotalPages))}
                                    className="page-btn"
                                  >
                                    Next
                                  </button>
                                </div>
                              )}
                            </div>
                          </div>
                        )}
                      </>
                    )}
                    </div>
                  </>
                )}

                {activeTab === 'sitters' && (
                  <>
                    {/* Summary Cards Grid */}
                    <div className="grid-5" style={{ marginBottom: '40px' }}>
                      <div className="sitter-card card-total">
                        <Users className="card-bg-icon" />
                        <div className="card-content">
                          <div className="card-header">
                            <div className="icon-wrapper">
                              <Users size={20} />
                            </div>
                          </div>
                          <div>
                            <h3 className="card-value">{sitterCounts.total}</h3>
                            <p className="card-label">Total Sitters</p>
                          </div>
                        </div>
                      </div>
                      <div className="sitter-card card-pending">
                        <AlertCircle className="card-bg-icon" />
                        <div className="card-content">
                          <div className="card-header">
                            <div className="icon-wrapper">
                              <AlertCircle size={20} />
                            </div>
                          </div>
                          <div>
                            <h3 className="card-value">{sitterCounts.pending}</h3>
                            <p className="card-label">Pending</p>
                          </div>
                        </div>
                      </div>
                      <div className="sitter-card card-verified">
                        <CheckCircle className="card-bg-icon" />
                        <div className="card-content">
                          <div className="card-header">
                            <div className="icon-wrapper">
                              <CheckCircle size={20} />
                            </div>
                          </div>
                          <div>
                            <h3 className="card-value">{sitterCounts.verified}</h3>
                            <p className="card-label">Verified</p>
                          </div>
                        </div>
                      </div>
                      <div className="sitter-card card-rejected">
                        <XCircle className="card-bg-icon" />
                        <div className="card-content">
                          <div className="card-header">
                            <div className="icon-wrapper">
                              <XCircle size={20} />
                            </div>
                          </div>
                          <div>
                            <h3 className="card-value">{sitterCounts.rejected}</h3>
                            <p className="card-label">Rejected</p>
                          </div>
                        </div>
                      </div>
                      <div className="sitter-card card-blocked">
                        <Ban className="card-bg-icon" />
                        <div className="card-content">
                          <div className="card-header">
                            <div className="icon-wrapper">
                              <Ban size={20} />
                            </div>
                          </div>
                          <div>
                            <h3 className="card-value">{sitterCounts.blocked}</h3>
                            <p className="card-label">Blocked</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="glass-panel" style={{ animation: 'fadeIn 0.5s cubic-bezier(0.16, 1, 0.3, 1)', marginBottom: '32px' }}>
                      {/* Search & Filter Container aligned to the right */}
                      <div className="panel-controls" style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: '12px', position: 'relative' }}>
                        <div className="search-wrapper">
                          <Search size={18} className="input-icon" />
                          <input
                            type="text"
                            className="modern-input"
                            placeholder="Search Name, Email, Phone..."
                            value={sitterSearch}
                            onChange={e => setSitterSearch(e.target.value)}
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
                          className={`premium-select-trigger ${showSitterFilterSelect ? 'open' : ''}`}
                        >
                          <span className="premium-select-icon"><Filter size={18} /></span>
                          <span className="premium-select-value">Filter</span>
                          {sitterFilterCount > 0 && (
                            <span style={{
                              backgroundColor: '#3b82f6', color: 'white',
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
                    {(isSittersLoading && sittersList.length === 0) ? (
                      <div className="premium-loader-container">
                        <div className="paw-pulse-wrapper">
                          <div className="paw-pulse-ring"></div>
                          <PawPrint size={48} className="paw-icon bouncing" color="var(--primary)" />
                        </div>
                        <p className="loading-text">Loading Sitters...</p>
                      </div>
                    ) : sitterError ? (
                      <StatusMessage type="error" message={sitterError} onRetry={fetchSitters} />
                    ) : filteredSitters.length === 0 ? (
                      <StatusMessage type="empty" message="No pet sitters found matching your criteria. Try adjusting your filters or search terms." />
                    ) : (
                      <>
                        <div className="table-wrapper">
                          <table className="modern-table" style={{ minWidth: '1000px' }}>
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
                                <tr key={sitter.id} className="table-row">
                                  <td>
                                    <div className="user-block">
                                      <div className="user-avatar-small bg-purple">
                                        {sitter.avatar || getSitterName(sitter).charAt(0).toUpperCase()}
                                      </div>
                                      <div>
                                        <div className="user-name">{getSitterName(sitter)}</div>
                                        <div className="user-email">
                                          Reg: {sitter.date || (sitter.createdOn ? new Date(sitter.createdOn).toISOString().split('T')[0] : '')}
                                        </div>
                                      </div>
                                    </div>
                                  </td>
                                  <td>
                                    <div className="user-name">{sitter.email}</div>
                                    <div className="user-email">{sitter.phone || sitter.phoneNumber}</div>
                                    <div className="date-text" style={{ marginTop: '2px' }}>{getSitterAddress(sitter)}</div>
                                  </td>
                                  <td>
                                     <span className="modern-status-pill" style={getBadgeStyle(sitter.status)}>
                                       {sitter.status?.toLowerCase() === 'pending' && <Info size={14} />}
                                       {(sitter.status?.toLowerCase() === 'verified' || sitter.status?.toLowerCase() === 'approved') && <CheckCircle size={14} />}
                                       {sitter.status?.toLowerCase() === 'rejected' && <XCircle size={14} />}
                                       {sitter.status?.toLowerCase() === 'blocked' && <Ban size={14} />}
                                       {sitter.status?.toLowerCase() === 'inactive' && <XCircle size={14} />}
                                       {sitter.status}
                                     </span>
                                  </td>
                                  <td>
                                     <span className="modern-status-pill" style={getBadgeStyle(sitter.availability || sitter.availStatus)}>{sitter.availability || sitter.availStatus}</span>
                                  </td>
                                  <td style={{ textAlign: 'right' }}>
                                    <div style={{ display: 'inline-flex', gap: '8px', justifyContent: 'flex-end' }}>
                                      <button onClick={() => handleViewSitterDetails(sitter.id || sitter._id)} className="page-btn" style={{ padding: '6px 16px' }} title="View Sitter Details"><Eye size={16} /> View</button>
                                    </div>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>

                        {/* Sitter Pagination and Size Selector */}
                        {sittersList.length > 0 && (
                          <div className="pagination-wrapper">
                            <div className="pagination-info">
                              Showing Page <b>{sitterPage}</b> of <b>{sitterTotalPages || 1}</b>
                            </div>
                            
                            <div className="pagination-controls">
                              <select
                                value={sitterLimit}
                                onChange={(e) => {
                                  setSitterLimit(Number(e.target.value));
                                  setSitterPage(1);
                                }}
                                className="modern-select"
                                style={{ padding: '8px 12px', minWidth: '100px', fontSize: '0.85rem' }}
                              >
                                <option value={5}>5 / page</option>
                                <option value={10}>10 / page</option>
                                <option value={20}>20 / page</option>
                                <option value={50}>50 / page</option>
                              </select>

                              {sitterTotalPages > 1 && (
                                <div style={{ display: 'flex', gap: '8px' }}>
                                  <button
                                    disabled={sitterPage === 1}
                                    onClick={() => setSitterPage(prev => Math.max(prev - 1, 1))}
                                    className="page-btn"
                                  >
                                    Prev
                                  </button>
                                  <button
                                    disabled={sitterPage >= sitterTotalPages}
                                    onClick={() => setSitterPage(prev => Math.min(prev + 1, sitterTotalPages))}
                                    className="page-btn"
                                  >
                                    Next
                                  </button>
                                </div>
                              )}
                            </div>
                          </div>
                        )}
                      </>
                    )}
                    </div>
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
