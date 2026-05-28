import React, { useState } from 'react';
import {
  ChevronLeft, ChevronRight, Mail, Phone, Calendar, MapPin, Shield, Info,
  CheckCircle, XCircle, Ban, FileText, User, AlertCircle, Loader2,
  LayoutDashboard, Users, PawPrint, LogOut
} from 'lucide-react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAdminAuth } from '../../components/admin/AdminAuthContext';
import { API_ROUTES } from '../../constants/apiConstants';
import './AdminDashboard.css';

const _sidebarNavItems = [
  { id: 'dashboard', name: 'Dashboard', path: '/admin/dashboard', icon: LayoutDashboard },
  { id: 'users',     name: 'Users',     path: '#',                 icon: Users },
];

interface SitterDetailsProps {
  sitter?: any;
  onBack?: () => void;
  getBadgeStyle?: (status: string) => { bg: string; color: string };
  badgeBase?: React.CSSProperties;
  getSitterName?: (s: any) => string;
  getSitterAddress?: (s: any) => string;
}

interface SafeImageProps {
  src: string;
  alt: string;
  fallbackType: 'profile' | 'selfie' | 'id-front' | 'id-back';
  style?: React.CSSProperties;
}

const SafeImage: React.FC<SafeImageProps> = ({ src, alt, fallbackType, style }) => {
  const [hasError, setHasError] = React.useState(!src);

  React.useEffect(() => {
    setHasError(!src);
  }, [src]);

  if (hasError) {
    const getFallbackContent = () => {
      switch (fallbackType) {
        case 'profile':
          return (
            <div style={{
              width: '100%', height: '100%', borderRadius: 'inherit',
              backgroundColor: 'var(--primary-light)', color: 'var(--primary)',
              display: 'grid', placeItems: 'center', fontSize: '2.5rem', fontWeight: '800'
            }}>
              <User size={48} />
            </div>
          );
        case 'selfie':
          return (
            <div style={{
              width: '100%', height: '100%', borderRadius: 'inherit',
              backgroundColor: 'rgba(13, 148, 136, 0.1)', color: 'var(--primary)',
              display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
              border: '1.5px dashed var(--border)', fontSize: '0.8rem', gap: '8px'
            }}>
              <User size={32} />
              <span style={{ fontWeight: '600' }}>Selfie Dummy</span>
            </div>
          );
        case 'id-front':
          return (
            <div style={{
              width: '100%', height: '100%', borderRadius: 'inherit',
              backgroundColor: 'rgba(99, 102, 241, 0.1)', color: 'var(--primary)',
              display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
              border: '1.5px dashed var(--border)', fontSize: '0.8rem', gap: '8px'
            }}>
              <FileText size={32} />
              <span style={{ fontWeight: '600' }}>ID Front Dummy</span>
            </div>
          );
        case 'id-back':
          return (
            <div style={{
              width: '100%', height: '100%', borderRadius: 'inherit',
              backgroundColor: 'rgba(99, 102, 241, 0.1)', color: 'var(--primary)',
              display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
              border: '1.5px dashed var(--border)', fontSize: '0.8rem', gap: '8px'
            }}>
              <FileText size={32} />
              <span style={{ fontWeight: '600' }}>ID Back Dummy</span>
            </div>
          );
      }
    };

    return (
      <div style={{ ...style, display: 'inline-block', overflow: 'hidden' }}>
        {getFallbackContent()}
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      style={style}
      onError={() => setHasError(true)}
    />
  );
};

// Local fallback helpers for route-based standalone execution
const localGetBadgeStyle = (status: string) => {
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
      return { bg: 'rgba(220, 38, 38, 0.15)', color: '#dc2626' };
    case 'PENDING':
      return { bg: 'rgba(245, 158, 11, 0.15)', color: 'var(--secondary-hover)' };
    case 'INACTIVE':
      return { bg: 'rgba(124, 58, 237, 0.15)', color: '#7c3aed' };
    default:
      return { bg: 'rgba(100, 116, 139, 0.12)', color: 'var(--text-muted)' };
  }
};

const localGetSitterName = (s: any) => {
  if (!s) return '';
  if (s.fullName) return s.fullName;
  return `${s.firstName || ''} ${s.lastName || ''}`.trim() || 'Unknown Sitter';
};

const localGetSitterAddress = (s: any) => {
  if (!s) return '';
  if (typeof s.address === 'string') return s.address;
  if (s.address && typeof s.address === 'object') {
    const { houseNo, street, locality, city, state, pincode, country } = s.address;
    const parts = [houseNo, street, locality, city, state, pincode, country];
    return parts.map(p => typeof p === 'string' ? p.trim() : p).filter(Boolean).join(', ') || 'No address recorded';
  }
  return 'No address recorded';
};

const localBadgeBase = { padding: '4px 8px', borderRadius: '12px', fontSize: '0.8rem', fontWeight: '700' };

export const SitterDetails: React.FC<SitterDetailsProps> = ({
  sitter: propsRawSitter,
  onBack,
  getBadgeStyle = localGetBadgeStyle,
  badgeBase = localBadgeBase,
  getSitterName = localGetSitterName,
  getSitterAddress = localGetSitterAddress,
}) => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { adminUser, logoutAdmin } = useAdminAuth();
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(false);

  const [fetchedData, setFetchedData] = React.useState<any | null>(null);
  const [loading, setLoading] = React.useState(!!id);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (!id) return;
    const fetchDetails = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await fetch(API_ROUTES.DASHBOARD.SITTER_INFO(id));
        if (response.ok) {
          const data = await response.json();
          setFetchedData(data);
        } else {
          setError(`Server responded with status ${response.status}`);
        }
      } catch (e: any) {
        setError(e.message || "Failed to load sitter details.");
      } finally {
        setLoading(false);
      }
    };
    fetchDetails();
  }, [id]);

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      navigate('/admin/dashboard');
    }
  };

  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);

  const handleUpdateStatus = async (newStatus: string) => {
    const targetId = id || propsRawSitter?._id || propsRawSitter?.id;
    if (!targetId) return;

    try {
      setIsUpdatingStatus(true);
      const token = localStorage.getItem('adminToken');
      const headers: HeadersInit = { 'Content-Type': 'application/json' };
      if (token) headers['Authorization'] = `Bearer ${token}`;

      const response = await fetch(API_ROUTES.DASHBOARD.UPDATE_STATUS(targetId), {
        method: 'PUT',
        headers,
        body: JSON.stringify({ status: newStatus }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Failed to update status');
      }

      if (id) {
        setFetchedData((prev: any) => {
          if (!prev) return prev;
          const isDataNested = !!prev.data;
          const rootData = prev.data || prev;
          const isSitterNested = !!rootData.sitter;
          
          const updatedSitter = isSitterNested ? { ...rootData.sitter, status: newStatus } : { ...rootData, status: newStatus };
          const updatedRoot = isSitterNested ? { ...rootData, sitter: updatedSitter } : updatedSitter;
          return isDataNested ? { ...prev, data: updatedRoot } : updatedRoot;
        });
      } else {
        alert(`Status updated to ${newStatus} successfully. Please refresh the page.`);
      }
    } catch (err: any) {
      console.error('Error updating status:', err);
      alert(err.message || 'Failed to update status. Please try again.');
    } finally {
      setIsUpdatingStatus(false);
    }
  };
  
  // ── Sidebar renderer (only used on the standalone route) ──────────────────
  const renderSidebar = () => (
    <aside
      className="admin-sidebar"
      style={{
        width: isSidebarExpanded ? '280px' : '80px',
        transition: 'width 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        overflowX: 'hidden',
      }}
    >
      {/* Logo + collapse toggle */}
      <div style={{
        padding: '24px 16px',
        borderBottom: '1px solid rgba(255,255,255,0.1)',
        display: 'flex', alignItems: 'center',
        justifyContent: isSidebarExpanded ? 'space-between' : 'center',
        flexDirection: isSidebarExpanded ? 'row' : 'column',
        gap: '12px', transition: 'all 0.3s',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{
            width: '44px', height: '44px', borderRadius: '12px',
            backgroundColor: 'var(--primary-light)', color: 'var(--primary)',
            display: 'grid', placeItems: 'center',
            boxShadow: '0 4px 12px rgba(13, 148, 136, 0.3)', flexShrink: 0,
          }}>
            <PawPrint size={24} />
          </div>
          {isSidebarExpanded && (
            <span style={{ fontSize: '1.3rem', fontWeight: '800', color: 'white', letterSpacing: '-0.3px' }}>
              <span style={{ color: 'var(--primary)' }}>Pet</span>Buddy
            </span>
          )}
        </div>
        <button
          onClick={() => setIsSidebarExpanded(p => !p)}
          style={{
            background: 'rgba(255,255,255,0.08)', border: 'none', borderRadius: '50%',
            width: '28px', height: '28px', display: 'grid', placeItems: 'center',
            color: 'white', cursor: 'pointer', transition: 'all 0.2s',
            outline: 'none', boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
          }}
          onMouseOver={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.15)')}
          onMouseOut={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.08)')}
          title={isSidebarExpanded ? 'Collapse Sidebar' : 'Expand Sidebar'}
        >
          {isSidebarExpanded ? <ChevronLeft size={16} /> : <ChevronRight size={16} />}
        </button>
      </div>

      {/* Nav links */}
      <nav style={{ padding: '16px 0', flex: 1 }}>
        {_sidebarNavItems.map(item => {
          const Icon = item.icon;
          return (
            <Link
              key={item.name}
              to={item.path}
              className={`sidebar-nav-link ${item.id === 'dashboard' ? 'active' : ''}`}
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

      {/* Admin avatar */}
      <div
        style={{
          display: 'flex', alignItems: 'center',
          justifyContent: isSidebarExpanded ? 'flex-start' : 'center',
          gap: isSidebarExpanded ? '12px' : '0',
          padding: '12px 24px', color: '#cbd5e1',
          borderLeft: '4px solid transparent',
          borderTop: '1px solid rgba(255,255,255,0.08)',
          marginTop: 'auto', width: '100%', boxSizing: 'border-box',
        }}
        title={!isSidebarExpanded ? (adminUser?.fullName ?? '') : undefined}
      >
        <div style={{
          width: '24px', height: '24px', borderRadius: '50%',
          backgroundColor: 'var(--primary)', color: 'white',
          display: 'grid', placeItems: 'center', fontWeight: '800',
          fontSize: '0.75rem', flexShrink: 0,
          boxShadow: '0 2px 6px rgba(13, 148, 136, 0.3)',
        }}>
          {adminUser?.fullName?.charAt(0).toUpperCase()}
        </div>
        {isSidebarExpanded && (
          <span style={{ whiteSpace: 'nowrap', fontWeight: '500', fontSize: '0.95rem', color: '#cbd5e1' }}>
            {adminUser?.fullName}
          </span>
        )}
      </div>

      {/* Sign-out */}
      <button
        onClick={() => { if (window.confirm('Are you sure you want to log out?')) logoutAdmin(); }}
        className="sidebar-footer-btn"
        style={{
          justifyContent: isSidebarExpanded ? 'flex-start' : 'center',
          gap: isSidebarExpanded ? '12px' : '0',
          marginBottom: '16px',
        }}
        title={!isSidebarExpanded ? 'Sign Out' : undefined}
      >
        <LogOut size={20} className="nav-icon" />
        {isSidebarExpanded && <span style={{ whiteSpace: 'nowrap' }}>Sign Out</span>}
      </button>
    </aside>
  );

  if (loading) {
    const loadingNode = (
      <div style={{
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
        minHeight: '400px', gap: '16px', color: 'var(--text-muted)'
      }}>
        <Loader2 size={36} className="animate-spin" style={{ color: 'var(--primary)' }} />
        <span>Loading Sitter Details...</span>
        <style>{`
          @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
          .animate-spin { animation: spin 1s linear infinite; }
        `}</style>
      </div>
    );
    if (id) return (
      <div className="admin-wrapper">
        {renderSidebar()}
        <main className="admin-main" style={{ overflowY: 'auto', height: '100vh' }}>
          <div style={{ padding: '32px' }}>{loadingNode}</div>
        </main>
      </div>
    );
    return loadingNode;
  }

  if (error) {
    const errorNode = (
      <div style={{
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
        padding: '48px 32px', borderRadius: '24px', backgroundColor: 'var(--bg-card)',
        border: '1.5px dashed var(--border)', textAlign: 'center', margin: '24px 0', gap: '16px'
      }}>
        <div style={{
          width: '64px', height: '64px', borderRadius: '20px',
          backgroundColor: 'rgba(239, 68, 68, 0.1)', color: 'var(--danger)',
          display: 'grid', placeItems: 'center'
        }}>
          <AlertCircle size={32} />
        </div>
        <div>
          <h4 style={{ fontSize: '1.15rem', fontWeight: '800', color: 'var(--text-heading)', margin: '0 0 6px 0' }}>
            Failed to Load Details
          </h4>
          <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', margin: 0 }}>{error}</p>
        </div>
        <button
          onClick={handleBack}
          className="btn btn-secondary"
          style={{ padding: '8px 20px', borderRadius: '12px', fontSize: '0.85rem', cursor: 'pointer' }}
        >
          Back to Dashboard
        </button>
      </div>
    );
    if (id) return (
      <div className="admin-wrapper">
        {renderSidebar()}
        <main className="admin-main" style={{ overflowY: 'auto', height: '100vh' }}>
          <div style={{ padding: '32px' }}>{errorNode}</div>
        </main>
      </div>
    );
    return errorNode;
  }

  const rawSitter = id ? fetchedData : propsRawSitter;
  if (!rawSitter) return null;

  // Resiliently extract sitter and kycData from API payload shape
  const rootData = rawSitter.data || rawSitter;
  const sitter = rootData.sitter || rootData;
  const kycData = rootData.kycData || sitter.kycData || rootData.kyc || sitter.kyc || null;

  // Formatting helpers
  const formatDate = (dateStr: string) => {
    if (!dateStr) return 'N/A';
    try {
      return new Date(dateStr).toLocaleDateString(undefined, {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch {
      return dateStr;
    }
  };

  const formatImageSrc = (src: string) => {
    if (!src) return '';
    if (src.startsWith('http://') || src.startsWith('https://') || src.startsWith('data:')) {
      return src;
    }
    return `data:image/jpeg;base64,${src}`;
  };

  const detailContent = (
    <div className="animate-scale" style={{ display: 'flex', flexDirection: 'column', gap: '28px', paddingBottom: '40px' }}>
      
      {/* Premium Glassmorphic Hero Header with Mesh Gradient */}
      <div style={{
        position: 'relative',
        borderRadius: '24px',
        background: 'linear-gradient(135deg, rgba(13, 148, 136, 0.18) 0%, rgba(99, 102, 241, 0.08) 50%, rgba(245, 158, 11, 0.05) 100%)',
        backdropFilter: 'blur(24px)',
        border: '1.5px solid rgba(255, 255, 255, 0.1)',
        padding: '32px',
        display: 'flex',
        flexDirection: 'column',
        gap: '24px',
        boxShadow: '0 20px 40px -15px rgba(0, 0, 0, 0.08), inset 0 1px 0 rgba(255,255,255,0.15)',
        overflow: 'hidden'
      }}>
        {/* Top bar with back button */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', zIndex: 2 }}>
          <button 
            onClick={handleBack}
            className="btn btn-secondary"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '10px 18px',
              borderRadius: '14px',
              fontWeight: '700',
              cursor: 'pointer',
              background: 'rgba(255, 255, 255, 0.08)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              color: 'var(--text-heading)',
              transition: 'all 0.2s ease-in-out'
            }}
          >
            <ChevronLeft size={16} /> Back to Dashboard
          </button>
          
          <div style={{ display: 'flex', gap: '8px' }}>
            <span style={{ 
              ...badgeBase, 
              ...getBadgeStyle(sitter.status), 
              display: 'inline-flex', 
              alignItems: 'center', 
              gap: '6px', 
              fontSize: '0.85rem', 
              padding: '8px 16px', 
              borderRadius: '30px',
              boxShadow: '0 4px 10px rgba(0,0,0,0.05)'
            }}>
              {sitter.status?.toLowerCase() === 'pending' && <Info size={14} />}
              {(sitter.status?.toLowerCase() === 'verified' || sitter.status?.toLowerCase() === 'approved') && <CheckCircle size={14} />}
              {sitter.status?.toLowerCase() === 'rejected' && <XCircle size={14} />}
              {sitter.status?.toLowerCase() === 'blocked' && <Ban size={14} />}
              {sitter.status?.toLowerCase() === 'inactive' && <XCircle size={14} />}
              {sitter.status}
            </span>
            <span style={{ 
              ...badgeBase, 
              ...getBadgeStyle(sitter.availability), 
              fontSize: '0.85rem', 
              padding: '8px 16px', 
              borderRadius: '30px',
              boxShadow: '0 4px 10px rgba(0,0,0,0.05)'
            }}>
              {sitter.availability || 'Unknown'}
            </span>
          </div>
        </div>

        {/* Profile Intro Info Row */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '24px', zIndex: 2, flexWrap: 'wrap' }}>
          {sitter.profilePicture ? (
            <div style={{ position: 'relative', display: 'flex', width: '110px', height: '110px' }}>
              <div style={{
                position: 'absolute', 
                top: '-5px', 
                left: '-5px', 
                right: '-5px', 
                bottom: '-5px',
                borderRadius: '40px',
                border: '2px solid var(--primary)',
                opacity: 0.4,
                pointerEvents: 'none'
              }} />
              <SafeImage 
                src={formatImageSrc(sitter.profilePicture)} 
                alt={getSitterName(sitter)} 
                fallbackType="profile"
                style={{ 
                  width: '100%', 
                  height: '100%', 
                  borderRadius: '34px', 
                  objectFit: 'cover',
                  position: 'relative',
                  border: '3px solid var(--bg-card)',
                  boxShadow: '0 12px 28px -5px rgba(0, 0, 0, 0.15)'
                }} 
              />
            </div>
          ) : (
            <div style={{
              width: '110px',
              height: '110px',
              borderRadius: '36px',
              backgroundColor: 'var(--primary-light)',
              color: 'var(--primary)',
              display: 'grid',
              placeItems: 'center',
              fontSize: '3.2rem',
              fontWeight: '800',
              border: '3px solid var(--bg-card)',
              boxShadow: '0 12px 28px -5px rgba(13, 148, 136, 0.25)'
            }}>
              {getSitterName(sitter).charAt(0).toUpperCase()}
            </div>
          )}

          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <h2 style={{ fontSize: '2rem', fontWeight: '800', color: 'var(--text-heading)', margin: 0, letterSpacing: '-0.5px' }}>
              {getSitterName(sitter)}
            </h2>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-muted)', fontSize: '1rem' }}>
              <Mail size={16} />
              <span>{sitter.email}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Grid Content Layout */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 2.1fr', gap: '28px', alignItems: 'start' }}>
        
        {/* Left Column - Details Summary & Verification Console */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
          
          {/* Sitter Details Snapshot */}
          <div style={{
            backgroundColor: 'var(--bg-card)',
            borderRadius: '24px',
            border: '1.5px solid var(--border)',
            padding: '28px',
            boxShadow: '0 8px 30px rgba(0, 0, 0, 0.03)'
          }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: '800', color: 'var(--text-heading)', margin: '0 0 20px 0', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Info size={18} color="var(--primary)" /> Profile Details
            </h3>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '10px', borderBottom: '1.5px solid var(--bg-main)' }}>
                <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Gender:</span>
                <strong style={{ color: 'var(--text-heading)', fontSize: '0.95rem' }}>{sitter.gender || 'N/A'}</strong>
              </div>
              
              <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '10px', borderBottom: '1.5px solid var(--bg-main)' }}>
                <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Date of Birth:</span>
                <strong style={{ color: 'var(--text-heading)', fontSize: '0.95rem' }}>{formatDate(sitter.dateOfBirth)}</strong>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Account Type:</span>
                <strong style={{ color: 'var(--primary)', fontSize: '0.95rem', fontWeight: '700' }}>Pet Sitter</strong>
              </div>
            </div>
          </div>

          {/* Sitter Actions panel */}
          <div style={{
            backgroundColor: 'var(--bg-card)',
            borderRadius: '24px',
            border: '1.5px solid var(--border)',
            padding: '28px',
            boxShadow: '0 8px 30px rgba(0, 0, 0, 0.03)',
            display: 'flex',
            flexDirection: 'column',
            gap: '16px'
          }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: '800', color: 'var(--text-heading)', margin: '0 0 4px 0', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Shield size={18} color="var(--primary)" /> Sitter Verification Console
            </h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', margin: '0 0 8px 0', lineHeight: '1.4' }}>
              Review the submitted documents below and execute verification controls.
            </p>

            {sitter.status?.toLowerCase() === 'pending' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <button 
                  onClick={() => handleUpdateStatus('APPROVED')} 
                  disabled={isUpdatingStatus}
                  className="btn btn-primary"
                  style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', padding: '12px 16px', borderRadius: '12px', fontWeight: '600', opacity: isUpdatingStatus ? 0.7 : 1, cursor: isUpdatingStatus ? 'not-allowed' : 'pointer' }}
                >
                  {isUpdatingStatus ? <Loader2 size={18} className="spin" /> : <CheckCircle size={18} />} Approve Profile
                </button>
                <button 
                  onClick={() => handleUpdateStatus('REJECTED')} 
                  disabled={isUpdatingStatus}
                  className="btn"
                  style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', padding: '12px 16px', borderRadius: '12px', fontWeight: '600', backgroundColor: '#dc2626', color: 'white', border: 'none', transition: 'background-color 0.2s', opacity: isUpdatingStatus ? 0.7 : 1, cursor: isUpdatingStatus ? 'not-allowed' : 'pointer' }}
                >
                  {isUpdatingStatus ? <Loader2 size={18} className="spin" /> : <XCircle size={18} />} Reject Profile
                </button>
              </div>
            )}

            {sitter.status?.toLowerCase() === 'approved' && (
              <button 
                onClick={() => handleUpdateStatus('BLOCKED')} 
                disabled={isUpdatingStatus}
                className="btn"
                style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', padding: '12px 16px', borderRadius: '12px', fontWeight: '600', backgroundColor: '#ef4444', color: 'white', border: 'none', transition: 'background-color 0.2s', opacity: isUpdatingStatus ? 0.7 : 1, cursor: isUpdatingStatus ? 'not-allowed' : 'pointer' }}
              >
                {isUpdatingStatus ? <Loader2 size={18} className="spin" /> : <Ban size={18} />} Block Account
              </button>
            )}

            {sitter.status?.toLowerCase() === 'blocked' && (
              <button 
                onClick={() => handleUpdateStatus('APPROVED')} 
                disabled={isUpdatingStatus}
                className="btn btn-primary"
                style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', padding: '12px 16px', borderRadius: '12px', fontWeight: '600', opacity: isUpdatingStatus ? 0.7 : 1, cursor: isUpdatingStatus ? 'not-allowed' : 'pointer' }}
              >
                {isUpdatingStatus ? <Loader2 size={18} className="spin" /> : <CheckCircle size={18} />} Activate / Unblock
              </button>
            )}
          </div>
        </div>

        {/* Right Column - Extensive Profile Cards */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
          
          {/* Main Info Box Grid */}
          <div style={{
            backgroundColor: 'var(--bg-card)',
            borderRadius: '24px',
            border: '1.5px solid var(--border)',
            padding: '32px',
            boxShadow: '0 8px 30px rgba(0, 0, 0, 0.03)'
          }}>
            <h3 style={{ fontSize: '1.15rem', fontWeight: '800', color: 'var(--text-heading)', margin: '0 0 24px 0', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Shield size={20} color="var(--primary)" /> Profile Details & Contact Info
            </h3>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
              <div style={{ display: 'flex', gap: '14px', alignItems: 'flex-start' }}>
                <div style={{ padding: '8px', borderRadius: '12px', backgroundColor: 'var(--primary-light)', color: 'var(--primary)', display: 'grid', placeItems: 'center' }}>
                  <Mail size={20} />
                </div>
                <div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Email Address</div>
                  <div style={{ fontSize: '1rem', color: 'var(--text-heading)', fontWeight: '600', marginTop: '6px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    {sitter.email}
                    {sitter.isEmailVerified ? (
                      <span style={{ color: 'var(--success)', display: 'inline-flex', alignItems: 'center' }} title="Verified"><CheckCircle size={14} /></span>
                    ) : (
                      <span style={{ color: 'var(--text-muted)', display: 'inline-flex', alignItems: 'center' }} title="Unverified"><Info size={14} /></span>
                    )}
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '14px', alignItems: 'flex-start' }}>
                <div style={{ padding: '8px', borderRadius: '12px', backgroundColor: 'var(--primary-light)', color: 'var(--primary)', display: 'grid', placeItems: 'center' }}>
                  <Phone size={20} />
                </div>
                <div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Phone Number</div>
                  <div style={{ fontSize: '1rem', color: 'var(--text-heading)', fontWeight: '600', marginTop: '6px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    {sitter.countryCode || ''} {sitter.phone || sitter.phoneNumber}
                    {sitter.isPhoneNumberVierified ? (
                      <span style={{ color: 'var(--success)', display: 'inline-flex', alignItems: 'center' }} title="Verified"><CheckCircle size={14} /></span>
                    ) : (
                      <span style={{ color: 'var(--text-muted)', display: 'inline-flex', alignItems: 'center' }} title="Unverified"><Info size={14} /></span>
                    )}
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '14px', alignItems: 'flex-start' }}>
                <div style={{ padding: '8px', borderRadius: '12px', backgroundColor: 'var(--primary-light)', color: 'var(--primary)', display: 'grid', placeItems: 'center' }}>
                  <Calendar size={20} />
                </div>
                <div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Registration Date</div>
                  <div style={{ fontSize: '1rem', color: 'var(--text-heading)', fontWeight: '600', marginTop: '6px' }}>
                    {formatDate(sitter.createdOn || sitter.date)}
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '14px', alignItems: 'flex-start' }}>
                <div style={{ padding: '8px', borderRadius: '12px', backgroundColor: 'var(--primary-light)', color: 'var(--primary)', display: 'grid', placeItems: 'center' }}>
                  <MapPin size={20} />
                </div>
                <div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.5px' }}>City / State</div>
                  <div style={{ fontSize: '1rem', color: 'var(--text-heading)', fontWeight: '600', marginTop: '6px' }}>
                    {(sitter.address?.city && sitter.address?.state) ? `${sitter.address.city}, ${sitter.address.state}` : (sitter.city && sitter.state ? `${sitter.city}, ${sitter.state}` : 'N/A')}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Sitter Address Card */}
          <div style={{
            backgroundColor: 'var(--bg-card)',
            borderRadius: '24px',
            border: '1.5px solid var(--border)',
            padding: '32px',
            boxShadow: '0 8px 30px rgba(0, 0, 0, 0.03)'
          }}>
            <h3 style={{ fontSize: '1.15rem', fontWeight: '800', color: 'var(--text-heading)', margin: '0 0 20px 0', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <MapPin size={20} color="var(--primary)" /> Address details
            </h3>
            
            <div style={{ display: 'flex', gap: '14px', alignItems: 'flex-start' }}>
              <div style={{ padding: '8px', borderRadius: '12px', backgroundColor: 'rgba(99, 102, 241, 0.1)', color: 'var(--primary)', display: 'grid', placeItems: 'center' }}>
                <MapPin size={20} />
              </div>
              <div>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Full Residential Address</span>
                <p style={{ fontSize: '1.05rem', color: 'var(--text-heading)', fontWeight: '600', marginTop: '6px', lineHeight: '1.5', margin: '6px 0 0 0' }}>
                  {getSitterAddress(sitter)}
                </p>
              </div>
            </div>
          </div>

          {/* Trust & KYC card */}
          {kycData && (
            <div style={{
              backgroundColor: 'var(--bg-card)',
              borderRadius: '24px',
              border: '1.5px solid var(--border)',
              padding: '32px',
              boxShadow: '0 8px 30px rgba(0, 0, 0, 0.03)',
              display: 'flex',
              flexDirection: 'column',
              gap: '24px'
            }}>
              <h3 style={{ fontSize: '1.15rem', fontWeight: '800', color: 'var(--text-heading)', margin: 0, display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Shield size={20} color="var(--primary)" /> Trust & KYC Documents
              </h3>

              <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1.2fr 1fr', gap: '20px', paddingBottom: '20px', borderBottom: '1px solid var(--border)' }}>
                <div>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: '700', textTransform: 'uppercase' }}>Government ID Type</span>
                  <div style={{ fontSize: '1.05rem', color: 'var(--text-heading)', fontWeight: '700', marginTop: '6px' }}>{kycData.governmentIDType || 'N/A'}</div>
                </div>
                <div>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: '700', textTransform: 'uppercase' }}>Government ID Number</span>
                  <div style={{ fontSize: '1.05rem', color: 'var(--text-heading)', fontWeight: '700', marginTop: '6px' }}>{kycData.governmentIDNumber || 'N/A'}</div>
                </div>
                <div>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: '700', textTransform: 'uppercase' }}>KYC Check Status</span>
                  <div style={{ marginTop: '6px' }}>
                    <span style={{ 
                      ...badgeBase, 
                      backgroundColor: kycData.backgroundVerificationStatus === 'APPROVED' ? 'rgba(16, 185, 129, 0.15)' : 'rgba(245, 158, 11, 0.15)',
                      color: kycData.backgroundVerificationStatus === 'APPROVED' ? 'var(--success)' : 'var(--secondary-hover)',
                      padding: '6px 14px',
                      borderRadius: '20px',
                      fontWeight: '700',
                      fontSize: '0.8rem'
                    }}>
                      {kycData.backgroundVerificationStatus || 'PENDING'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Uploaded Documents Image List */}
              <div>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: '700', textTransform: 'uppercase', display: 'block', marginBottom: '16px', letterSpacing: '0.5px' }}>Uploaded Verification Documents</span>
                <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
                  
                  {kycData.selfieImage && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', width: '130px' }}>
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: '600', textAlign: 'center' }}>Selfie Image</span>
                      <a href={formatImageSrc(kycData.selfieImage)} target="_blank" rel="noreferrer" style={{ width: '100%', height: '130px', display: 'block' }}>
                        <SafeImage src={formatImageSrc(kycData.selfieImage)} alt="Selfie" fallbackType="selfie" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '16px', border: '1.5px solid var(--border)', transition: 'transform 0.2s', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }} />
                      </a>
                    </div>
                  )}
                  
                  {kycData.governmentIDFrontImage && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', width: '170px' }}>
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: '600', textAlign: 'center' }}>Govt ID Front</span>
                      <a href={formatImageSrc(kycData.governmentIDFrontImage)} target="_blank" rel="noreferrer" style={{ width: '100%', height: '130px', display: 'block' }}>
                        <SafeImage src={formatImageSrc(kycData.governmentIDFrontImage)} alt="ID Front" fallbackType="id-front" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '16px', border: '1.5px solid var(--border)', transition: 'transform 0.2s', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }} />
                      </a>
                    </div>
                  )}
                  
                  {kycData.governmentIDBackImage && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', width: '170px' }}>
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: '600', textAlign: 'center' }}>Govt ID Back</span>
                      <a href={formatImageSrc(kycData.governmentIDBackImage)} target="_blank" rel="noreferrer" style={{ width: '100%', height: '130px', display: 'block' }}>
                        <SafeImage src={formatImageSrc(kycData.governmentIDBackImage)} alt="ID Back" fallbackType="id-back" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '16px', border: '1.5px solid var(--border)', transition: 'transform 0.2s', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }} />
                      </a>
                    </div>
                  )}

                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  // When accessed via /admin/sitters/:id → render with full sidebar layout
  if (id) {
    return (
      <div className="admin-wrapper">
        {renderSidebar()}
        <main className="admin-main" style={{ overflowY: 'auto', height: '100vh' }}>
          <div style={{ padding: '32px' }}>{detailContent}</div>
        </main>
      </div>
    );
  }

  // When embedded inside AdminDashboard → return the content panel directly
  return detailContent;
};
