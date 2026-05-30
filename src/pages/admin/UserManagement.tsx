import React, { useState, useEffect } from 'react';
import { Search, Eye, Trash2, X, CheckCircle, Mail, AlertCircle, Loader } from 'lucide-react';
import axiosInstance from '../../api/axiosInstance';
import { useToast } from '../../context/ToastContext';
import { useAdminAuth } from '../../components/admin/AdminAuthContext';
import { API_ROUTES } from '../../constants/apiConstants';
import { ConfirmModal } from '../../components/admin/ConfirmModal';
import '../../components/admin/PremiumTable.css';

interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  role: string;
  status: string;
  city: string;
  state: string;
  date: string;
}

interface UserManagementProps {
  getStatusPillStyle: (status: string, isActive: boolean) => React.CSSProperties;
  getBadgeStyle: (status: string) => { bg: string; color: string };
}

export const UserManagement: React.FC<UserManagementProps> = ({ getBadgeStyle }) => {
  const { adminUser } = useAdminAuth();
  const [usersList, setUsersList] = useState<User[]>([]);
  const [userSearch, setUserSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const itemsPerPage = 10;

  // User Modal State
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState<'add' | 'view' | 'edit'>('add');
  const [editingUserId, setEditingUserId] = useState<string | null>(null);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [role, setRole] = useState('SUPER_ADMIN');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');

  // Email Verification Sub-state
  const [isEmailSent, setIsEmailSent] = useState(false);
  const [enteredCode, setEnteredCode] = useState('');
  const [isEmailVerified, setIsEmailVerified] = useState(false);
  const [verificationError, setVerificationError] = useState('');
  const [formError, setFormError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSendingOTP, setIsSendingOTP] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [deletingUserId, setDeletingUserId] = useState<string | null>(null);
  const [deleteConfirmUserId, setDeleteConfirmUserId] = useState<string | null>(null);

  // (useToast available if needed locally)
  useToast();

  const fetchUsers = async () => {
    setIsLoading(true);
    try {
      const response = await axiosInstance.get(API_ROUTES.USER_MANAGEMENT.BASE, {
        params: { search: userSearch, page: currentPage, limit: itemsPerPage }
      });
      setUsersList(response.data.data);
      setTotalPages(response.data.pagination.totalPages);
      setTotalRecords(response.data.pagination.total);
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchUsers();
    }, 300);
    return () => clearTimeout(timer);
  }, [userSearch, currentPage]);

  const resetForm = () => {
    setFirstName('');
    setLastName('');
    setEmail('');
    setPhone('');
    setRole('SUPER_ADMIN');
    setCity('');
    setState('');
    setIsEmailSent(false);
    setEnteredCode('');
    setIsEmailVerified(false);
    setVerificationError('');
    setFormError('');
    setEditingUserId(null);
    setModalMode('add');
  };

  // Handlers
  const executeDeleteUser = async () => {
    if (!deleteConfirmUserId) return;
    setDeletingUserId(deleteConfirmUserId);
    try {
      await axiosInstance.delete(API_ROUTES.USER_MANAGEMENT.BY_ID(deleteConfirmUserId));
      fetchUsers();
    } catch (error) {
      console.error('Error deleting user:', error);
    } finally {
      setDeletingUserId(null);
      setDeleteConfirmUserId(null);
    }
  };

  const handleSendVerification = async (confirmRestore: boolean = false) => {
    if (!email || !email.includes('@')) {
      alert('Please enter a valid email address first.');
      return;
    }
    if (!firstName || !lastName) {
      alert('Please enter your first and last name first.');
      return;
    }
    setVerificationError('');
    setIsSendingOTP(true);
    try {
      await axiosInstance.post(API_ROUTES.USER_MANAGEMENT.SEND_OTP, { email, firstName, lastName, confirmRestore });
      setIsEmailSent(true);
    } catch (error: any) {
      console.error('Error sending OTP:', error);
      if (error.response?.status === 409 && error.response?.data?.confirmRestoreRequired) {
        const confirm = window.confirm(error.response.data.error);
        if (confirm) {
          setIsSendingOTP(false);
          handleSendVerification(true);
          return;
        }
      }
      setVerificationError(error.response?.data?.error || 'Failed to send OTP.');
    } finally {
      setIsSendingOTP(false);
    }
  };

  const handleVerifyCode = async () => {
    setIsVerifying(true);
    setVerificationError('');
    try {
      if (enteredCode.length === 6 && /^\d+$/.test(enteredCode)) {
        await axiosInstance.post(API_ROUTES.USER_MANAGEMENT.VERIFY_OTP, { email, otp: enteredCode });
        setIsEmailVerified(true);
      } else {
        setVerificationError('Invalid code format. Must be 6 digits.');
      }
    } catch (error: any) {
      console.error('Error verifying OTP:', error);
      setVerificationError(error.response?.data?.error || 'Failed to verify OTP.');
    } finally {
      setIsVerifying(false);
    }
  };

  const handleUserSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');
    setIsSubmitting(true);

    try {
      if (modalMode === 'add') {
        if (!isEmailVerified) {
          setFormError('Please verify the email before adding the user.');
          setIsSubmitting(false);
          return;
        }
        await axiosInstance.post(API_ROUTES.USER_MANAGEMENT.BASE, {
          firstName, lastName, email, phone, role, city, state
        });
      } else if (modalMode === 'edit' && editingUserId) {
        await axiosInstance.put(API_ROUTES.USER_MANAGEMENT.UPDATE_USER(editingUserId), {
          firstName, lastName, city, state
        });
      }
      
      setShowModal(false);
      resetForm();
      fetchUsers();
    } catch (error: any) {
      console.error('Error submitting user:', error);
      setFormError(error.response?.data?.error || 'An error occurred while saving.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Styles
  const badgeBase = { padding: '4px 8px', borderRadius: '12px', fontSize: '0.8rem', fontWeight: '700' };
  const searchInputStyle = { width: '100%', padding: '10px 12px 10px 36px', borderRadius: '8px', border: '1px solid var(--border)', fontSize: '0.95rem', background: 'var(--bg-card)' };
  const noDataStyle: React.CSSProperties = { padding: '32px', textAlign: 'center', color: 'var(--text-muted)' };

  return (
    <div style={{ width: '100%', animation: 'fadeIn 0.5s cubic-bezier(0.16, 1, 0.3, 1)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '32px' }}>
        <div>
          <h1 style={{ margin: '0 0 8px 0', fontSize: '2.4rem', fontWeight: '800', color: '#0f172a', letterSpacing: '-0.5px' }}>
            Users Management
          </h1>
          <p style={{ margin: 0, color: '#64748b', fontSize: '1.05rem', fontWeight: '500' }}>
            Manage and track all platform users.
          </p>
        </div>
      </div>
      
      {/* Top Header Controls - Search Input and Add User Button in a single bar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
        {/* Search Input Box */}
        <div style={{ position: 'relative', width: '300px' }}>
          <Search size={18} color="var(--text-muted)" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
          <input
            type="text"
            placeholder="Search Name, Email, Phone..."
            value={userSearch}
            onChange={e => {
              setUserSearch(e.target.value);
              setCurrentPage(1);
            }}
            style={{ ...searchInputStyle, paddingLeft: '36px' }}
          />
        </div>

        {/* Add User Action Button */}
        <button
          onClick={() => {
            resetForm();
            setModalMode('add');
            setShowModal(true);
          }}
          style={{
            padding: '10px 20px',
            backgroundColor: 'var(--primary)',
            color: 'white',
            border: 'none',
            borderRadius: '12px',
            fontWeight: '600',
            cursor: 'pointer',
            boxShadow: '0 4px 12px rgba(13, 148, 136, 0.2)',
            transition: 'all 0.2s ease',
            display: 'flex',
            alignItems: 'center',
            gap: '6px'
          }}
        >
          <span>+ Add User</span>
        </button>
      </div>

      {/* Users Table */}
      <div className="glass-panel">
        <div className="table-wrapper">
          <table className="modern-table">
          <thead>
            <tr>
              <th>User</th>
              <th>Contact</th>
              <th>Location</th>
              <th>Role</th>
              <th>Registered</th>
              <th>Status</th>
              <th style={{ textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr><td colSpan={7} style={noDataStyle}>Loading users...</td></tr>
            ) : usersList.length === 0 ? (
              <tr><td colSpan={7} style={noDataStyle}>No users found.</td></tr>
            ) : (
              usersList.map(user => (
              <tr key={user.id} className="table-row">
                <td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div className="table-avatar" style={{ backgroundColor: 'var(--primary-light)', color: 'var(--primary)' }}>
                      {(user.firstName || '?').charAt(0).toUpperCase()}
                    </div>
                    <span style={{ fontWeight: '600', color: 'var(--text-heading)' }}>{user.firstName} {user.lastName}</span>
                  </div>
                </td>
                <td>
                  <div style={{ fontSize: '0.9rem', color: 'var(--text-heading)' }}>{user.email}</div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{user.phone}</div>
                </td>
                <td>
                  <div style={{ fontSize: '0.9rem', color: 'var(--text-heading)' }}>{user.city}, {user.state}</div>
                </td>
                <td>
                  <span style={{ ...badgeBase, padding: '4px 10px', borderRadius: '12px', fontSize: '0.8rem', fontWeight: '700', backgroundColor: 'rgba(59, 130, 246, 0.12)', color: '#3b82f6' }}>
                    {user.role.replace(/_/g, ' ')}
                  </span>
                </td>
                <td>{user.date}</td>
                <td>
                  <span style={{ ...badgeBase, ...getBadgeStyle(user.status) }}>{user.status}</span>
                </td>
                <td style={{ textAlign: 'right' }}>
                  <button onClick={() => {
                    setFirstName(user.firstName || '');
                    setLastName(user.lastName || '');
                    setEmail(user.email);
                    setPhone(user.phone);
                    setRole(user.role);
                    setCity(user.city);
                    setState(user.state);
                    setIsEmailVerified(true);
                    setEditingUserId(user.id);
                    setModalMode('view');
                    setShowModal(true);
                  }} className="action-btn" title="View Details"><Eye size={18} /></button>
                  {adminUser?.id !== user.id && (
                    <button onClick={() => setDeleteConfirmUserId(user.id)} className="action-btn btn-danger" title="Delete User" disabled={deletingUserId === user.id}>
                      {deletingUserId === user.id ? <Loader size={15} style={{ animation: 'spin 0.8s linear infinite' }} /> : <Trash2 size={18} />}
                    </button>
                  )}
                </td>
              </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      
      {/* Pagination */}
      {totalRecords > 0 && !isLoading && (
        <div className="pagination-wrapper" style={{ padding: '16px 24px', borderTop: '1px solid rgba(15,23,42,0.05)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div className="pagination-info">
            Showing <b>{(currentPage - 1) * itemsPerPage + 1}</b> to <b>{Math.min(currentPage * itemsPerPage, totalRecords)}</b> of <b>{totalRecords}</b> results
          </div>
          <div className="pagination-controls" style={{ display: 'flex', gap: '8px' }}>
            <button className="page-btn" disabled={currentPage === 1} onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}>Previous</button>
            <button className="page-btn active" style={{ background: 'var(--primary)', color: 'white', borderColor: 'var(--primary)' }}>{currentPage}</button>
            <button className="page-btn" disabled={currentPage >= totalPages} onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}>Next</button>
          </div>
        </div>
      )}
      </div>

      {/* User Modal */}
      {showModal && (
        <div style={{
          position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
          backgroundColor: 'rgba(15, 23, 42, 0.4)',
          display: 'grid', placeItems: 'center', zIndex: 1000,
          padding: '20px'
        }}>
          <div className="animate-scale" style={{
            backgroundColor: 'var(--bg-card)', borderRadius: '16px',
            width: '100%', maxWidth: '520px', padding: '24px',
            border: '1px solid var(--border)',
            boxShadow: '0 20px 40px -10px rgba(0, 0, 0, 0.1)',
            position: 'relative',
            display: 'flex',
            flexDirection: 'column',
            maxHeight: '90vh'
          }}>
            {/* Modal Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexShrink: 0 }}>
              <div>
                <h3 style={{ fontSize: '1.4rem', fontWeight: '800', color: 'var(--text-heading)', margin: 0, letterSpacing: '-0.5px' }}>
                  {modalMode === 'add' ? 'Create New Account' : modalMode === 'view' ? 'User Details' : 'Edit User Account'}
                </h3>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: '2px 0 0 0' }}>
                  {modalMode === 'add' ? 'Register a new administrative member.' : modalMode === 'view' ? 'Viewing user information.' : 'Update user information.'}
                </p>
              </div>
              <button 
                type="button"
                onClick={() => {
                  setShowModal(false);
                  resetForm();
                }} 
                style={{ background: 'rgba(15, 23, 42, 0.05)', border: 'none', borderRadius: '50%', width: '32px', height: '32px', cursor: 'pointer', display: 'grid', placeItems: 'center', transition: 'all 0.2s' }}
                onMouseOver={e => e.currentTarget.style.backgroundColor = 'rgba(15, 23, 42, 0.1)'}
                onMouseOut={e => e.currentTarget.style.backgroundColor = 'rgba(15, 23, 42, 0.05)'}
              >
                <X size={16} />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleUserSubmit} style={{ display: 'flex', flexDirection: 'column', flex: 1, minHeight: 0, overflow: 'hidden' }}>
              {(() => {
                const isReadOnly = modalMode === 'view';
                const isEditMode = modalMode === 'edit';
                return (
                  <>
              {/* Scrollable Fields Wrapper */}
              <div style={{ 
                overflowY: 'auto', 
                paddingRight: '6px', 
                display: 'flex', 
                flexDirection: 'column', 
                gap: '16px',
                marginBottom: '16px',
                flex: 1
              }}>
                {/* Names row */}
                <div style={{ display: 'flex', gap: '12px' }}>
                  <div style={{ flex: 1 }}>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.85rem', fontWeight: '600', color: 'var(--text-main)', marginBottom: '6px' }}>First Name</label>
                    <input 
                      type="text" 
                      required 
                      disabled={isReadOnly}
                      value={firstName}
                      onChange={e => setFirstName(e.target.value)}
                      style={{ 
                        width: '100%', padding: '10px 12px', borderRadius: '8px', 
                        border: '1px solid var(--border)', outline: 'none', fontSize: '0.92rem',
                        transition: 'all 0.2s ease-in-out',
                        background: isReadOnly ? 'var(--bg-main)' : 'var(--bg-card)',
                        color: isReadOnly ? 'var(--text-muted)' : 'var(--text-heading)'
                      }} 
                      onFocus={e => { if(!isReadOnly) { e.currentTarget.style.borderColor = 'var(--primary)'; e.currentTarget.style.boxShadow = '0 0 0 2px var(--primary-light)'; } }}
                      onBlur={e => { if(!isReadOnly) { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.boxShadow = 'none'; } }}
                      placeholder="e.g. John"
                    />
                  </div>
                  <div style={{ flex: 1 }}>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.85rem', fontWeight: '600', color: 'var(--text-main)', marginBottom: '6px' }}>Last Name</label>
                    <input 
                      type="text" 
                      required 
                      disabled={isReadOnly}
                      value={lastName}
                      onChange={e => setLastName(e.target.value)}
                      style={{ 
                        width: '100%', padding: '10px 12px', borderRadius: '8px', 
                        border: '1px solid var(--border)', outline: 'none', fontSize: '0.92rem',
                        transition: 'all 0.2s ease-in-out',
                        background: isReadOnly ? 'var(--bg-main)' : 'var(--bg-card)',
                        color: isReadOnly ? 'var(--text-muted)' : 'var(--text-heading)'
                      }} 
                      onFocus={e => { if(!isReadOnly) { e.currentTarget.style.borderColor = 'var(--primary)'; e.currentTarget.style.boxShadow = '0 0 0 2px var(--primary-light)'; } }}
                      onBlur={e => { if(!isReadOnly) { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.boxShadow = 'none'; } }}
                      placeholder="e.g. Doe"
                    />
                  </div>
                </div>

                {/* Role Select */}
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', color: 'var(--text-main)', marginBottom: '8px' }}>Assign Security Role</label>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '8px' }}>
                    {[
                      { key: 'SUPER_ADMIN', label: 'Super Admin', desc: 'Full Access' },
                      { key: 'OPERATIONS_ADMIN', label: 'Operations Admin', desc: 'Day-to-day mgmt' },
                      { key: 'SUPPORT_ADMIN', label: 'Support Admin', desc: 'Customer service' },
                      { key: 'FINANCE_ADMIN', label: 'Finance Admin', desc: 'Billing & reports' }
                    ].map(item => {
                      const isSelected = role === item.key;
                      return (
                        <button
                          type="button"
                          key={item.key}
                          disabled={isReadOnly || isEditMode}
                          onClick={() => setRole(item.key)}
                          style={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            gap: '2px',
                            padding: '10px 6px',
                            borderRadius: '8px',
                            border: isSelected ? '1px solid var(--primary)' : '1px solid var(--border)',
                            backgroundColor: isSelected ? 'var(--primary-light)' : ((isReadOnly || isEditMode) ? 'var(--bg-main)' : 'var(--bg-card)'),
                            cursor: (isReadOnly || isEditMode) ? 'not-allowed' : 'pointer',
                            transition: 'all 0.2s ease',
                            textAlign: 'center',
                            opacity: (isReadOnly || isEditMode) && !isSelected ? 0.6 : 1
                          }}
                        >
                          <span style={{ fontSize: '0.85rem', fontWeight: '600', color: isSelected ? 'var(--primary)' : 'var(--text-heading)' }}>{item.label}</span>
                          <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{item.desc}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Email with Verification Flow */}
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', color: 'var(--text-main)', marginBottom: '6px' }}>Email Address</label>
                  <div style={{ display: 'flex', gap: '8px', position: 'relative' }}>
                    <input 
                      type="email" 
                      required 
                      disabled={isEmailVerified || isReadOnly || isEditMode}
                      value={email}
                      onChange={e => {
                        setEmail(e.target.value);
                        setIsEmailSent(false);
                        setEnteredCode('');
                        setIsEmailVerified(false);
                      }}
                      style={{ 
                        flex: 1, padding: '10px 12px', borderRadius: '8px', 
                        border: isEmailVerified ? '1px solid var(--success)' : '1px solid var(--border)', 
                        outline: 'none', fontSize: '0.92rem',
                        transition: 'all 0.2s ease-in-out',
                        backgroundColor: isEmailVerified ? 'rgba(16, 185, 129, 0.05)' : ((isReadOnly || isEditMode) ? 'var(--bg-main)' : 'var(--bg-card)'),
                        color: (isReadOnly || isEditMode) ? 'var(--text-muted)' : 'var(--text-heading)'
                      }} 
                      onFocus={e => { if(!isEmailVerified && !(isReadOnly || isEditMode)) { e.currentTarget.style.borderColor = 'var(--primary)'; e.currentTarget.style.boxShadow = '0 0 0 2px var(--primary-light)'; } }}
                      onBlur={e => { if(!isEmailVerified && !(isReadOnly || isEditMode)) { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.boxShadow = 'none'; } }}
                      placeholder="e.g. john@example.com"
                    />
                    {!isEmailVerified && modalMode === 'add' ? (
                      <button 
                        type="button"
                        onClick={() => handleSendVerification(false)}
                        disabled={isSendingOTP}
                        style={{
                          padding: '8px 16px', borderRadius: '8px', border: 'none',
                          backgroundColor: 'var(--primary)', color: 'white',
                          fontWeight: '600', fontSize: '0.85rem',
                          cursor: isSendingOTP ? 'not-allowed' : 'pointer',
                          transition: 'all 0.2s',
                          boxShadow: '0 2px 4px rgba(13, 148, 136, 0.1)',
                          display: 'flex', alignItems: 'center', gap: '6px', minWidth: '90px', justifyContent: 'center'
                        }}
                      >
                        {isSendingOTP
                          ? <><Loader size={14} style={{ animation: 'spin 0.8s linear infinite' }} /> Sending...</>
                          : isEmailSent ? 'Resend' : 'Send Code'}
                      </button>
                    ) : isEmailVerified ? (
                      <div style={{ 
                        display: 'flex', alignItems: 'center', gap: '4px', 
                        color: 'var(--success)', fontWeight: '700', fontSize: '0.8rem', 
                        backgroundColor: 'rgba(16, 185, 129, 0.1)', padding: '6px 12px', borderRadius: '8px' 
                      }}>
                        <CheckCircle size={14} /> Verified
                      </div>
                    ) : null}
                  </div>

                  {/* OTP Verification Box */}
                  {isEmailSent && !isEmailVerified && modalMode === 'add' && (
                    <div style={{
                      marginTop: '8px', padding: '12px', borderRadius: '8px',
                      backgroundColor: 'var(--bg-main)', border: '1px solid var(--border)'
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px' }}>
                        <Mail size={14} color="var(--primary)" />
                        <span style={{ fontSize: '0.8rem', color: 'var(--text-main)', fontWeight: '500' }}>
                          Check your email for the 6-digit code.
                        </span>
                      </div>
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <div style={{ display: 'flex', gap: '6px', flex: 1 }}>
                          {[0, 1, 2, 3, 4, 5].map((index) => (
                            <input
                              key={index}
                              id={`otp-input-${index}`}
                              type="text"
                              maxLength={1}
                              value={(enteredCode + '      ')[index].trim()}
                              onChange={e => {
                                const char = e.target.value.slice(-1);
                                const codeArr = (enteredCode + '      ').slice(0, 6).split('');
                                codeArr[index] = char === ' ' ? '' : char;
                                setEnteredCode(codeArr.join('').trimEnd());
                                if (char && char !== ' ' && index < 5) {
                                  document.getElementById(`otp-input-${index + 1}`)?.focus();
                                }
                              }}
                              onKeyDown={e => {
                                if (e.key === 'Backspace' && !(enteredCode + '      ')[index].trim() && index > 0) {
                                  document.getElementById(`otp-input-${index - 1}`)?.focus();
                                }
                              }}
                              onPaste={e => {
                                e.preventDefault();
                                const pastedData = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
                                if (pastedData) {
                                  const codeArr = (enteredCode + '      ').slice(0, 6).split('');
                                  for (let i = 0; i < pastedData.length; i++) {
                                    if (index + i < 6) {
                                      codeArr[index + i] = pastedData[i];
                                    }
                                  }
                                  setEnteredCode(codeArr.join('').trimEnd());
                                  const nextIndex = Math.min(index + pastedData.length, 5);
                                  document.getElementById(`otp-input-${nextIndex}`)?.focus();
                                }
                              }}
                              style={{ 
                                width: '36px', height: '40px', borderRadius: '6px', 
                                border: '1px solid var(--border)', outline: 'none', 
                                fontSize: '1.1rem', textAlign: 'center',
                                fontWeight: '600', background: 'var(--bg-card)',
                                transition: 'all 0.2s ease-in-out'
                              }}
                              onFocus={e => { e.currentTarget.style.borderColor = 'var(--primary)'; e.currentTarget.style.boxShadow = '0 0 0 2px var(--primary-light)'; }}
                              onBlur={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.boxShadow = 'none'; }}
                            />
                          ))}
                        </div>
                        <button 
                          type="button" 
                          onClick={handleVerifyCode}
                          disabled={enteredCode.length !== 6 || isVerifying}
                          style={{
                            padding: '8px 16px', borderRadius: '6px', border: 'none',
                            backgroundColor: enteredCode.length === 6 ? 'var(--primary)' : '#e2e8f0', 
                            color: enteredCode.length === 6 ? 'white' : '#94a3b8', fontWeight: '600',
                            fontSize: '0.85rem', cursor: (enteredCode.length === 6 && !isVerifying) ? 'pointer' : 'not-allowed',
                            transition: 'all 0.2s',
                            display: 'flex', alignItems: 'center', gap: '6px', minWidth: '80px', justifyContent: 'center'
                          }}
                        >
                          {isVerifying
                            ? <Loader size={14} style={{ animation: 'spin 0.8s linear infinite' }} />
                            : 'Verify'}
                        </button>
                      </div>
                      {verificationError && (
                        <div style={{ color: 'var(--danger)', fontSize: '0.8rem', marginTop: '6px', display: 'flex', alignItems: 'center', gap: '4px', fontWeight: '500' }}>
                          <AlertCircle size={12} /> {verificationError}
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Phone Number */}
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', color: 'var(--text-main)', marginBottom: '6px' }}>Phone Number</label>
                  <input 
                    type="tel" 
                    required 
                    disabled={isReadOnly || isEditMode}
                    value={phone}
                    onChange={e => setPhone(e.target.value)}
                    style={{ 
                      width: '100%', padding: '10px 12px', borderRadius: '8px', 
                      border: '1px solid var(--border)', outline: 'none', fontSize: '0.92rem',
                      transition: 'all 0.2s ease-in-out',
                      backgroundColor: (isReadOnly || isEditMode) ? 'var(--bg-main)' : 'var(--bg-card)',
                      color: (isReadOnly || isEditMode) ? 'var(--text-muted)' : 'var(--text-heading)'
                    }} 
                    onFocus={e => { if(!(isReadOnly || isEditMode)) { e.currentTarget.style.borderColor = 'var(--primary)'; e.currentTarget.style.boxShadow = '0 0 0 2px var(--primary-light)'; } }}
                    onBlur={e => { if(!(isReadOnly || isEditMode)) { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.boxShadow = 'none'; } }}
                    placeholder="e.g. +91 9948262033"
                  />
                </div>

                {/* City and State */}
                <div style={{ display: 'flex', gap: '12px' }}>
                  <div style={{ flex: 1 }}>
                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', color: 'var(--text-main)', marginBottom: '6px' }}>City</label>
                    <input 
                      type="text" 
                      disabled={isReadOnly}
                      value={city}
                      onChange={e => setCity(e.target.value)}
                      style={{ 
                        width: '100%', padding: '10px 12px', borderRadius: '8px', 
                        border: '1px solid var(--border)', outline: 'none', fontSize: '0.92rem',
                        transition: 'all 0.2s ease-in-out',
                        background: isReadOnly ? 'var(--bg-main)' : 'var(--bg-card)',
                        color: isReadOnly ? 'var(--text-muted)' : 'var(--text-heading)'
                      }} 
                      onFocus={e => { if(!isReadOnly) { e.currentTarget.style.borderColor = 'var(--primary)'; e.currentTarget.style.boxShadow = '0 0 0 2px var(--primary-light)'; } }}
                      onBlur={e => { if(!isReadOnly) { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.boxShadow = 'none'; } }}
                      placeholder="e.g. Hyderabad"
                    />
                  </div>
                  <div style={{ flex: 1 }}>
                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', color: 'var(--text-main)', marginBottom: '6px' }}>State</label>
                    <input 
                      type="text" 
                      disabled={isReadOnly}
                      value={state}
                      onChange={e => setState(e.target.value)}
                      style={{ 
                        width: '100%', padding: '10px 12px', borderRadius: '8px', 
                        border: '1px solid var(--border)', outline: 'none', fontSize: '0.92rem',
                        transition: 'all 0.2s ease-in-out',
                        background: isReadOnly ? 'var(--bg-main)' : 'var(--bg-card)',
                        color: isReadOnly ? 'var(--text-muted)' : 'var(--text-heading)'
                      }} 
                      onFocus={e => { if(!isReadOnly) { e.currentTarget.style.borderColor = 'var(--primary)'; e.currentTarget.style.boxShadow = '0 0 0 2px var(--primary-light)'; } }}
                      onBlur={e => { if(!isReadOnly) { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.boxShadow = 'none'; } }}
                      placeholder="e.g. Telangana"
                    />
                  </div>
                </div>
              </div>
              
              {formError && (
                <div style={{
                  color: 'var(--danger)', fontSize: '0.85rem', fontWeight: '600', 
                  backgroundColor: 'rgba(239, 68, 68, 0.1)', padding: '10px 12px', 
                  borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '6px',
                  marginBottom: '16px'
                }}>
                  <AlertCircle size={14} />
                  {formError}
                </div>
              )}

              {/* Action Buttons (Fixed Footer) */}
              <div style={{ display: 'flex', gap: '12px', flexShrink: 0, borderTop: '1px solid var(--border)', paddingTop: '16px' }}>
                <button 
                  type="button" 
                  onClick={() => {
                    setShowModal(false);
                    resetForm();
                  }}
                  style={{
                    flex: 1, padding: '10px', borderRadius: '8px', border: '1px solid var(--border)',
                    backgroundColor: 'var(--bg-card)', color: 'var(--text-main)', fontWeight: '600', cursor: 'pointer',
                    transition: 'all 0.2s', fontSize: '0.92rem'
                  }}
                  onMouseOver={e => e.currentTarget.style.backgroundColor = 'var(--bg-main)'}
                  onMouseOut={e => e.currentTarget.style.backgroundColor = 'var(--bg-card)'}
                >
                  {modalMode === 'view' ? 'Close' : 'Cancel'}
                </button>
                
                {modalMode === 'view' ? (
                  <button 
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      setModalMode('edit');
                    }}
                    style={{
                      flex: 1, padding: '10px', borderRadius: '8px', border: 'none',
                      backgroundColor: 'var(--primary)', color: 'white', fontWeight: '600', 
                      cursor: 'pointer', transition: 'all 0.2s', fontSize: '0.92rem',
                      boxShadow: '0 2px 4px rgba(13, 148, 136, 0.15)'
                    }}
                  >
                    Edit
                  </button>
                ) : (
                  <button 
                    type="submit"
                    disabled={(modalMode === 'add' && !isEmailVerified) || isSubmitting}
                    style={{
                      flex: 1, padding: '10px', borderRadius: '8px', border: 'none',
                      backgroundColor: ((modalMode === 'edit' || isEmailVerified) && !isSubmitting) ? 'var(--primary)' : '#e2e8f0', 
                      color: ((modalMode === 'edit' || isEmailVerified) && !isSubmitting) ? 'white' : '#94a3b8', fontWeight: '600', 
                      cursor: ((modalMode === 'edit' || isEmailVerified) && !isSubmitting) ? 'pointer' : 'not-allowed',
                      transition: 'all 0.2s',
                      fontSize: '0.92rem',
                      display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px',
                      boxShadow: ((modalMode === 'edit' || isEmailVerified) && !isSubmitting) ? '0 2px 4px rgba(13, 148, 136, 0.15)' : 'none'
                    }}
                  >
                    {isSubmitting ? (
                      <>
                        <Loader size={16} className="spin" /> 
                        Saving...
                      </>
                    ) : modalMode === 'edit' ? 'Save Changes' : 'Create User'}
                  </button>
                )}
              </div>
                  </>
                );
              })()}
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={deleteConfirmUserId !== null}
        title="Delete User"
        message="Are you sure you want to delete this user? This action cannot be undone."
        variant="danger"
        confirmText="Delete User"
        cancelText="Cancel"
        isLoading={deletingUserId !== null}
        onConfirm={executeDeleteUser}
        onCancel={() => setDeleteConfirmUserId(null)}
      />
    </div>
  );
};
