import React, { useState, useEffect } from 'react';
import {
  ChevronLeft, ChevronRight, Mail, Phone, Calendar, 
  CheckCircle, XCircle, Ban, PawPrint, Loader2, LayoutDashboard, Users, User, CalendarCheck
} from 'lucide-react';
import { useParams, useNavigate, Link } from 'react-router-dom';
// import { useAdminAuth } from '../../components/admin/AdminAuthContext';
import { API_ROUTES } from '../../constants/apiConstants';
import './AdminDashboard.css';

// --- Shared Helpers ---
const formatDate = (dateStr: string | null | undefined) => {
  if (!dateStr) return 'N/A';
  try {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return 'N/A';
    return new Intl.DateTimeFormat('en-US', { year: 'numeric', month: 'short', day: 'numeric' }).format(d);
  } catch {
    return 'N/A';
  }
};

const formatImageSrc = (src: string | null | undefined) => {
  if (!src) return '';
  if (src.startsWith('data:image')) return src;
  if (src.startsWith('http')) return src;
  if (src.startsWith('/')) return `http://localhost:5000${src}`;
  return `http://localhost:5000/${src}`;
};

const SafeImage = ({ src, alt, fallbackName }: { src: string, alt: string, fallbackName: string }) => {
  const [hasError, setHasError] = useState(false);
  useEffect(() => { setHasError(!src); }, [src]);

  if (hasError) {
    return (
      <div style={{ width: '100%', height: '100%', background: 'linear-gradient(135deg, var(--primary) 0%, var(--primary-hover) 100%)', color: 'white', display: 'grid', placeItems: 'center', fontSize: '4rem', fontWeight: '800' }}>
        {fallbackName.charAt(0).toUpperCase()}
      </div>
    );
  }
  return <img src={src} alt={alt} style={{ width: '100%', height: '100%', objectFit: 'cover' }} onError={() => setHasError(true)} />;
};

import { adminSidebarNavItems } from '../../constants/adminNav';

export const OwnerDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  // const { adminUser, logoutAdmin } = useAdminAuth();
  
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(false);
  const [fetchedData, setFetchedData] = useState<any | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);
  const [activeTab, setActiveTab] = useState<'pets' | 'bookings'>('pets');

  useEffect(() => {
    if (!id) {
      setLoading(false);
      return;
    }
    
    const fetchFullDetails = async () => {
      try {
        setLoading(true);
        setError(null);
        const token = localStorage.getItem('petbuddy_admin_access_token');
        const headers: HeadersInit = { 'Content-Type': 'application/json' };
        if (token) headers['Authorization'] = `Bearer ${token}`;

        const response = await fetch(API_ROUTES.DASHBOARD.OWNER_INFO(id), { headers });
        if (response.ok) {
          const data = await response.json();
          setFetchedData(data.data || data);
        } else {
          setError(`Server responded with status ${response.status}`);
        }
      } catch (err: any) {
        setError(err.message || 'Failed to fetch owner details');
      } finally {
        setLoading(false);
      }
    };
    fetchFullDetails();
  }, [id]);

  const handleUpdateStatusLocally = async (newStatus: string) => {
    if (!id) return;
    setIsUpdatingStatus(true);
    try {
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
        setFetchedData((prev: any) => prev ? { ...prev, status: newStatus } : prev);
      } else {
        alert('Failed to update status on server.');
      }
    } catch (e) {
      console.error(e);
      alert('An error occurred.');
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  const getOwnerName = (o: any) => `${o?.firstName || ''} ${o?.lastName || ''}`.trim() || 'Unknown Owner';
  const getOwnerAddress = (o: any) => {
    if (!o) return '';
    if (typeof o.address === 'string') return o.address;
    if (o.address && typeof o.address === 'object') {
      const { houseNo, street, locality, city, state, pincode, country } = o.address;
      return [houseNo, street, locality, city, state, country, pincode].filter(Boolean).join(', ');
    }
    return '';
  };

  const renderAdminNav = () => (
    <aside className="admin-sidebar" style={{ width: isSidebarExpanded ? '280px' : '80px', transition: 'width 0.3s cubic-bezier(0.4, 0, 0.2, 1)', overflowX: 'hidden', zIndex: 50 }}>
      <div style={{ padding: '24px 16px', borderBottom: '1px solid rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: isSidebarExpanded ? 'space-between' : 'center', flexDirection: isSidebarExpanded ? 'row' : 'column', gap: '12px', transition: 'all 0.3s' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ width: '44px', height: '44px', borderRadius: '12px', backgroundColor: 'var(--primary-light)', color: 'var(--primary)', display: 'grid', placeItems: 'center', boxShadow: '0 4px 12px rgba(13, 148, 136, 0.3)', flexShrink: 0 }}>
            <PawPrint size={24} />
          </div>
          {isSidebarExpanded && (
            <span style={{ fontSize: '1.3rem', fontWeight: '800', color: 'white', letterSpacing: '-0.3px' }}>
              <span style={{ color: 'var(--primary)' }}>Pet</span>Buddy
            </span>
          )}
        </div>
        <button onClick={() => setIsSidebarExpanded(p => !p)} style={{ background: 'rgba(255,255,255,0.08)', border: 'none', borderRadius: '50%', width: '28px', height: '28px', display: 'grid', placeItems: 'center', color: 'white', cursor: 'pointer', transition: 'all 0.2s', outline: 'none', boxShadow: '0 2px 5px rgba(0,0,0,0.1)' }}>
          {isSidebarExpanded ? <ChevronLeft size={16} /> : <ChevronRight size={16} />}
        </button>
      </div>
      <nav style={{ padding: '16px 0', flex: 1 }}>
        {adminSidebarNavItems.map(item => (
          <Link 
            key={item.name} 
            to={item.path} 
            className={`sidebar-nav-link ${item.id === 'dashboard' ? 'active' : ''}`}
            style={{ 
              justifyContent: isSidebarExpanded ? 'flex-start' : 'center', 
              gap: isSidebarExpanded ? '12px' : '0' 
            }}
            title={!isSidebarExpanded ? item.name : undefined}
          >
            <item.icon size={20} className="nav-icon" />
            {isSidebarExpanded && <span style={{ whiteSpace: 'nowrap' }}>{item.name}</span>}
          </Link>
        ))}
      </nav>
    </aside>
  );

  const owner = fetchedData;

  const bentoCardStyle = {
    background: 'rgba(255, 255, 255, 0.85)',
    backdropFilter: 'blur(20px)',
    WebkitBackdropFilter: 'blur(20px)',
    borderRadius: '32px',
    border: '1px solid rgba(255, 255, 255, 0.5)',
    boxShadow: '0 10px 40px rgba(0, 0, 0, 0.04), inset 0 1px 0 rgba(255,255,255,0.6)',
    padding: '32px',
    display: 'flex',
    flexDirection: 'column' as const,
    overflow: 'hidden',
    position: 'relative' as const
  };

  const content = (
    <div style={{ animation: 'fadeIn 0.5s cubic-bezier(0.16, 1, 0.3, 1)', margin: '0 auto', width: '100%', minHeight: '100%' }}>
      {loading ? (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '400px', gap: '16px' }}>
          <Loader2 size={40} className="spin" color="var(--primary)" />
          <span style={{ color: 'var(--text-muted)', fontWeight: '600' }}>Fetching Owner Profile...</span>
        </div>
      ) : error || !owner ? (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '400px', gap: '16px', color: 'var(--danger)' }}>
          <XCircle size={48} />
          <span style={{ fontWeight: '600', fontSize: '1.2rem' }}>Error loading details</span>
          <span style={{ color: 'var(--text-muted)' }}>{error || 'Owner not found.'}</span>
          <button onClick={() => navigate(-1)} className="btn btn-outline" style={{ marginTop: '16px' }}>Back to Dashboard</button>
        </div>
      ) : (
        <>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '32px' }}>
            <button 
              onClick={() => navigate(-1)} 
              style={{ 
                display: 'inline-flex', alignItems: 'center', gap: '8px', 
                background: 'rgba(255,255,255,0.6)', backdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.8)', 
                color: 'var(--text-heading)', fontSize: '0.9rem', fontWeight: '700', cursor: 'pointer', 
                padding: '12px 20px', borderRadius: '30px', transition: 'all 0.2s',
                boxShadow: '0 4px 12px rgba(0,0,0,0.03)'
              }}
              onMouseOver={e => { e.currentTarget.style.background = 'white'; e.currentTarget.style.boxShadow = '0 6px 16px rgba(0,0,0,0.06)'; }}
              onMouseOut={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.6)'; e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.03)'; }}
            >
              <ChevronLeft size={16} /> Back to Dashboard
            </button>
            <div style={{ fontSize: '1.2rem', fontWeight: '800', color: 'var(--text-heading)', letterSpacing: '-0.5px' }}>
              Owner Profile
            </div>
          </div>

          {/* BENTO BOX GRID */}
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(12, 1fr)', 
            gridAutoRows: 'minmax(200px, auto)',
            gap: '24px' 
          }}>
            
            {/* HERO IDENTITY BLOCK (Span 4 cols, 2 rows) */}
            <div style={{ ...bentoCardStyle, gridColumn: 'span 4', gridRow: 'span 2', alignItems: 'center', textAlign: 'center', background: 'linear-gradient(180deg, rgba(13, 148, 136, 0.08) 0%, #ffffff 50%)', justifyContent: 'center', padding: '40px', gap: '32px' }}>
              
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%' }}>
                <div style={{ 
                  width: '200px', height: '200px', borderRadius: '50%', backgroundColor: 'white', 
                  border: '8px solid white', boxShadow: '0 24px 48px rgba(13, 148, 136, 0.15)', overflow: 'hidden',
                  marginBottom: '24px', position: 'relative', zIndex: 2
                }}>
                  <SafeImage src={formatImageSrc(owner.profilePicture)} alt="avatar" fallbackName={getOwnerName(owner)} />
                </div>
                
                <h1 style={{ margin: '0 0 12px 0', fontSize: '2.4rem', fontWeight: '800', color: 'var(--text-heading)', letterSpacing: '-0.5px' }}>
                  {getOwnerName(owner)}
                </h1>
                
                <div style={{ 
                  display: 'inline-flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem', 
                  padding: '8px 24px', borderRadius: '30px', fontWeight: '800', marginBottom: '16px',
                  backgroundColor: owner.status?.toLowerCase() === 'blocked' ? 'rgba(239, 68, 68, 0.1)' : 'rgba(16, 185, 129, 0.1)',
                  color: owner.status?.toLowerCase() === 'blocked' ? 'var(--danger)' : 'var(--success)'
                }}>
                  {owner.status?.toLowerCase() === 'blocked' ? <Ban size={16} /> : <CheckCircle size={16} />}
                  {owner.status || 'ACTIVE'}
                </div>

                <div style={{ color: 'var(--text-muted)', fontSize: '0.95rem', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Calendar size={16} color="var(--primary)" /> Joined {formatDate(owner.createdAt)}
                </div>
              </div>

              <div style={{ width: '100%', display: 'flex', flexDirection: 'column' }}>
                {owner.status?.toLowerCase() !== 'blocked' ? (
                  <button 
                    onClick={() => handleUpdateStatusLocally('BLOCKED')} 
                    disabled={isUpdatingStatus}
                    style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', padding: '16px', borderRadius: '20px', fontWeight: '700', fontSize: '1rem', backgroundColor: '#ef4444', color: 'white', border: 'none', cursor: 'pointer', opacity: isUpdatingStatus ? 0.7 : 1, transition: 'all 0.2s', boxShadow: '0 8px 20px rgba(239, 68, 68, 0.3)' }}
                    onMouseOver={e => (e.currentTarget.style.transform = 'translateY(-2px)')}
                    onMouseOut={e => (e.currentTarget.style.transform = 'translateY(0)')}
                  >
                    {isUpdatingStatus ? <Loader2 size={18} className="spin" /> : <Ban size={18} />} Block Account
                  </button>
                ) : (
                  <button 
                    onClick={() => handleUpdateStatusLocally('ACTIVE')} 
                    disabled={isUpdatingStatus}
                    style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', padding: '16px', borderRadius: '20px', fontWeight: '700', fontSize: '1rem', backgroundColor: 'var(--success)', color: 'white', border: 'none', cursor: 'pointer', opacity: isUpdatingStatus ? 0.7 : 1, transition: 'all 0.2s', boxShadow: '0 8px 20px rgba(16, 185, 129, 0.3)' }}
                    onMouseOver={e => (e.currentTarget.style.transform = 'translateY(-2px)')}
                    onMouseOut={e => (e.currentTarget.style.transform = 'translateY(0)')}
                  >
                    {isUpdatingStatus ? <Loader2 size={18} className="spin" /> : <CheckCircle size={18} />} Unblock Account
                  </button>
                )}
              </div>
            </div>

            {/* CONTACT BLOCK (Span 4 cols, 1 row) */}
            <div style={{ ...bentoCardStyle, gridColumn: 'span 4' }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: '800', color: 'var(--text-heading)', margin: '0 0 24px 0', opacity: 0.6, textTransform: 'uppercase', letterSpacing: '1px' }}>
                Contact Info
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', flex: 1, justifyContent: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                  <div style={{ padding: '12px', background: 'rgba(13, 148, 136, 0.1)', color: 'var(--primary)', borderRadius: '16px' }}><Mail size={24} /></div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    <span style={{ fontSize: '1.1rem', color: 'var(--text-heading)', fontWeight: '700' }}>{owner.email}</span>
                    <span style={{ fontSize: '0.8rem', color: owner.isEmailVerified ? 'var(--success)' : 'var(--text-muted)', fontWeight: '700', textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: '4px' }}>
                      {owner.isEmailVerified && <CheckCircle size={12} />} {owner.isEmailVerified ? 'Verified' : 'Unverified'}
                    </span>
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                  <div style={{ padding: '12px', background: 'rgba(13, 148, 136, 0.1)', color: 'var(--primary)', borderRadius: '16px' }}><Phone size={24} /></div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    <span style={{ fontSize: '1.1rem', color: 'var(--text-heading)', fontWeight: '700' }}>{owner.countryCode} {owner.phoneNumber || owner.phone}</span>
                    <span style={{ fontSize: '0.8rem', color: owner.isPhoneNumberVerified ? 'var(--success)' : 'var(--text-muted)', fontWeight: '700', textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: '4px' }}>
                      {owner.isPhoneNumberVerified && <CheckCircle size={12} />} {owner.isPhoneNumberVerified ? 'Verified' : 'Unverified'}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* QUICK STATS BLOCKS (Span 2 cols each, 1 row) */}
            <div style={{ ...bentoCardStyle, gridColumn: 'span 2', alignItems: 'center', justifyContent: 'center', textAlign: 'center', background: 'linear-gradient(135deg, rgba(13, 148, 136, 0.1), rgba(13, 148, 136, 0.02))' }}>
              <div style={{ fontSize: '3.5rem', fontWeight: '800', color: 'var(--primary)', lineHeight: 1, marginBottom: '12px' }}>{owner.pets?.length || 0}</div>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '1px' }}>Pets</div>
            </div>
            
            <div style={{ ...bentoCardStyle, gridColumn: 'span 2', alignItems: 'center', justifyContent: 'center', textAlign: 'center', background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.1), rgba(245, 158, 11, 0.02))' }}>
              <div style={{ fontSize: '3.5rem', fontWeight: '800', color: 'var(--secondary)', lineHeight: 1, marginBottom: '12px' }}>{owner.bookings || 0}</div>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '1px' }}>Bookings</div>
            </div>

            {/* PERSONAL DETAILS BLOCK (Span 4 cols, 1 row) */}
            <div style={{ ...bentoCardStyle, gridColumn: 'span 4' }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: '800', color: 'var(--text-heading)', margin: '0 0 24px 0', opacity: 0.6, textTransform: 'uppercase', letterSpacing: '1px' }}>
                Personal Details
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', flex: 1, justifyContent: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                  <div style={{ padding: '12px', background: 'rgba(99, 102, 241, 0.1)', color: '#6366f1', borderRadius: '16px' }}><User size={24} /></div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    <span style={{ fontSize: '1.1rem', color: 'var(--text-heading)', fontWeight: '800' }}>{owner.gender || 'Not Specified'}</span>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Gender</span>
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                  <div style={{ padding: '12px', background: 'rgba(99, 102, 241, 0.1)', color: '#6366f1', borderRadius: '16px' }}><Calendar size={24} /></div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    <span style={{ fontSize: '1.1rem', color: 'var(--text-heading)', fontWeight: '800' }}>{formatDate(owner.dateOfBirth)}</span>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Date of Birth</span>
                  </div>
                </div>
              </div>
            </div>

            {/* LOCATION BLOCK (Span 4 cols, 1 row) */}
            <div style={{ ...bentoCardStyle, gridColumn: 'span 4' }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: '800', color: 'var(--text-heading)', margin: '0 0 24px 0', opacity: 0.6, textTransform: 'uppercase', letterSpacing: '1px' }}>
                Location & Emergency
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', flex: 1, justifyContent: 'center' }}>
                <div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '8px' }}>Residential Address</div>
                  <div style={{ fontSize: '1.05rem', color: 'var(--text-heading)', fontWeight: '600', lineHeight: '1.6' }}>
                    {getOwnerAddress(owner) || <span style={{ color: 'var(--text-muted)', fontStyle: 'italic', fontWeight: '400' }}>No address provided</span>}
                  </div>
                </div>
                {owner.emergencyContact?.name && (
                  <div style={{ padding: '20px', background: 'rgba(239, 68, 68, 0.05)', borderRadius: '20px', border: '1px solid rgba(239, 68, 68, 0.1)' }}>
                    <span style={{ fontSize: '0.75rem', color: 'var(--danger)', fontWeight: '800', textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px', letterSpacing: '0.5px' }}>
                       Emergency Contact
                    </span>
                    <div style={{ color: 'var(--danger)', fontWeight: '800', fontSize: '1.1rem' }}>{owner.emergencyContact.name} <span style={{ opacity: 0.7, fontWeight: '600', fontSize: '0.9rem' }}>({owner.emergencyContact.relation || 'Relation'})</span></div>
                    <div style={{ color: 'var(--danger)', fontSize: '1rem', marginTop: '4px', fontWeight: '600' }}>{owner.emergencyContact.phoneNumber}</div>
                  </div>
                )}
              </div>
            </div>

            {/* PETS & BOOKINGS TABS SHOWCASE (Span 12 cols, auto row) */}
            <div style={{ ...bentoCardStyle, gridColumn: 'span 12', padding: '40px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '32px', borderBottom: '2px solid rgba(0,0,0,0.05)', marginBottom: '32px', paddingLeft: '16px' }}>
                <button
                  onClick={() => setActiveTab('pets')}
                  style={{
                    background: 'none', border: 'none', cursor: 'pointer', padding: '0 0 16px 0', fontSize: '1.2rem', fontWeight: '800',
                    color: activeTab === 'pets' ? 'var(--text-heading)' : 'var(--text-muted)',
                    borderBottom: activeTab === 'pets' ? '3px solid var(--primary)' : '3px solid transparent',
                    display: 'flex', alignItems: 'center', gap: '12px', transition: 'all 0.2s', marginBottom: '-2px'
                  }}
                >
                  <PawPrint size={24} color={activeTab === 'pets' ? 'var(--text-heading)' : 'var(--text-muted)'} /> 
                  Registered Pets
                  <span style={{ background: activeTab === 'pets' ? 'var(--primary-light)' : 'rgba(0,0,0,0.05)', color: activeTab === 'pets' ? 'var(--primary)' : 'var(--text-muted)', padding: '4px 12px', borderRadius: '30px', fontSize: '0.8rem', fontWeight: '800' }}>
                    {owner.pets?.length || 0} Total
                  </span>
                </button>
                <button
                  onClick={() => setActiveTab('bookings')}
                  style={{
                    background: 'none', border: 'none', cursor: 'pointer', padding: '0 0 16px 0', fontSize: '1.2rem', fontWeight: '800',
                    color: activeTab === 'bookings' ? 'var(--text-heading)' : 'var(--text-muted)',
                    borderBottom: activeTab === 'bookings' ? '3px solid var(--secondary)' : '3px solid transparent',
                    display: 'flex', alignItems: 'center', gap: '12px', transition: 'all 0.2s', marginBottom: '-2px'
                  }}
                >
                  <CalendarCheck size={24} color={activeTab === 'bookings' ? 'var(--secondary)' : 'var(--text-muted)'} /> 
                  Recent Bookings
                  <span style={{ background: activeTab === 'bookings' ? 'rgba(245, 158, 11, 0.1)' : 'rgba(0,0,0,0.05)', color: activeTab === 'bookings' ? 'var(--secondary)' : 'var(--text-muted)', padding: '4px 12px', borderRadius: '30px', fontSize: '0.8rem', fontWeight: '800' }}>
                    0 Total
                  </span>
                </button>
              </div>

              {activeTab === 'pets' ? (
                Array.isArray(owner.pets) && owner.pets.length > 0 ? (
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '24px' }}>
                    {owner.pets.map((pet: any, idx: number) => (
                      <div key={idx} style={{ 
                        background: 'white', borderRadius: '24px', padding: '24px', border: '1px solid rgba(0,0,0,0.03)', 
                        boxShadow: '0 10px 30px rgba(0,0,0,0.03)', display: 'flex', gap: '24px', alignItems: 'center',
                        transition: 'transform 0.2s', cursor: 'pointer'
                      }}
                      onMouseOver={e => (e.currentTarget.style.transform = 'translateY(-4px)')}
                      onMouseOut={e => (e.currentTarget.style.transform = 'translateY(0)')}
                      >
                        <div style={{ width: '90px', height: '90px', borderRadius: '24px', overflow: 'hidden', flexShrink: 0 }}>
                          <SafeImage src={formatImageSrc(pet.photo)} alt={pet.name} fallbackName={pet.name || 'Pet'} />
                        </div>
                        <div style={{ flex: 1 }}>
                          <h4 style={{ margin: '0 0 8px 0', fontSize: '1.3rem', color: 'var(--text-heading)', fontWeight: '800' }}>{pet.name || 'Unnamed Pet'}</h4>
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', color: 'var(--text-muted)', fontSize: '0.9rem', fontWeight: '600' }}>
                            <span>{pet.breed || 'Unknown Breed'}</span>
                            <span style={{ opacity: 0.8 }}>{pet.age ? pet.age + ' yrs' : 'Age N/A'} • {pet.gender || 'N/A'}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '60px 20px', background: 'rgba(0,0,0,0.02)', borderRadius: '24px', border: '2px dashed rgba(0,0,0,0.05)', color: 'var(--text-muted)', height: '100%', minHeight: '250px' }}>
                    <PawPrint size={48} style={{ marginBottom: '16px', opacity: 0.2 }} />
                    <h4 style={{ margin: '0 0 8px 0', color: 'var(--text-heading)', fontSize: '1.2rem', fontWeight: '800' }}>No Pets Found</h4>
                    <p style={{ margin: 0, textAlign: 'center', maxWidth: '400px', lineHeight: 1.5, fontWeight: '500' }}>
                      This owner hasn't registered any pets yet.
                    </p>
                  </div>
                )
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '60px 20px', background: 'rgba(0,0,0,0.02)', borderRadius: '24px', border: '2px dashed rgba(0,0,0,0.05)', color: 'var(--text-muted)', height: '100%', minHeight: '250px' }}>
                  <CalendarCheck size={48} style={{ marginBottom: '16px', opacity: 0.2 }} />
                  <h4 style={{ margin: '0 0 8px 0', color: 'var(--text-heading)', fontSize: '1.2rem', fontWeight: '800' }}>No Bookings Found</h4>
                  <p style={{ margin: 0, textAlign: 'center', maxWidth: '400px', lineHeight: 1.5, fontWeight: '500' }}>
                    This owner hasn't made any bookings yet.
                  </p>
                </div>
              )}
            </div>
            
          </div>
        </>
      )}
    </div>
  );

  return (
    <div className="admin-wrapper" style={{ background: 'radial-gradient(circle at top left, #e0f2fe 0%, #f8fafc 50%, #f1f5f9 100%)', overflow: 'hidden' }}>
      {renderAdminNav()}
      <main className="admin-main" style={{ overflowY: 'auto', height: '100vh', padding: '40px' }}>
        {content}
      </main>
    </div>
  );
};
