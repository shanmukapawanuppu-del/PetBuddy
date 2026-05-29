import React, { useState } from 'react';
import { Search, Eye, Ban, Trash2, UserPlus, AlertCircle, X, CheckCircle, Mail } from 'lucide-react';
import '../../components/admin/PremiumTable.css';

interface User {
  id: string;
  fullName: string;
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

const initialUsers: User[] = [
  { id: 'U1', fullName: 'saikrishna', email: 'saikrishna@gmail.com', phone: '+91 9948262033', role: 'Super Admin', status: 'Active', city: 'Hyderabad', state: 'Telangana', date: '2025-01-12' },
  { id: 'U2', fullName: 'pavan', email: 'pavan123@gmail.com', phone: '+91 6955847558', role: 'Admin', status: 'Active', city: 'Hyderabad', state: 'Telangana', date: '2025-02-15' },
  { id: 'U3', fullName: 'Venkatesh', email: 'venky@gmail.com', phone: '+91 6955434234', role: 'Monitor', status: 'Blocked', city: 'Hanamkonda', state: 'Telangana', date: '2025-03-20' },
];

export const UserManagement: React.FC<UserManagementProps> = ({ getBadgeStyle }) => {
  const [usersList, setUsersList] = useState<User[]>(initialUsers);
  const [userSearch, setUserSearch] = useState('');

  // Add User Modal State
  const [showAddModal, setShowAddModal] = useState(false);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [role, setRole] = useState('Pet Owner');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');

  // Email Verification Sub-state
  const [isEmailSent, setIsEmailSent] = useState(false);
  const [generatedCode, setGeneratedCode] = useState('');
  const [enteredCode, setEnteredCode] = useState('');
  const [isEmailVerified, setIsEmailVerified] = useState(false);
  const [verificationError, setVerificationError] = useState('');

  const resetAddForm = () => {
    setFirstName('');
    setLastName('');
    setEmail('');
    setPhone('');
    setRole('Pet Owner');
    setCity('');
    setState('');
    setIsEmailSent(false);
    setGeneratedCode('');
    setEnteredCode('');
    setIsEmailVerified(false);
    setVerificationError('');
  };

  // Handlers
  const handleToggleBlockUser = (userId: string) => {
    setUsersList(prev => prev.map(u => {
      if (u.id === userId) {
        const newStatus = u.status === 'Blocked' ? 'Active' : 'Blocked';
        return { ...u, status: newStatus };
      }
      return u;
    }));
  };

  const handleDeleteUser = (userId: string) => {
    if (window.confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
      setUsersList(prev => prev.filter(u => u.id !== userId));
    }
  };

  const handleSendVerification = () => {
    if (!email || !email.includes('@')) {
      alert('Please enter a valid email address first.');
      return;
    }
    // Generate a random 4-digit code
    const code = Math.floor(1000 + Math.random() * 9000).toString();
    setGeneratedCode(code);
    setIsEmailSent(true);
    setVerificationError('');
  };

  const handleVerifyCode = () => {
    if (enteredCode === generatedCode) {
      setIsEmailVerified(true);
      setVerificationError('');
    } else {
      setVerificationError('Invalid code. Please try again.');
    }
  };

  const handleAddUserSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isEmailVerified) {
      alert('Please verify the email before adding the user.');
      return;
    }

    const newUser: User = {
      id: 'U' + (usersList.length + 1),
      fullName: `${firstName} ${lastName}`,
      email,
      phone,
      role,
      status: 'Active',
      city: city || 'Unknown',
      state: state || 'NA',
      date: new Date().toISOString().split('T')[0]
    };

    setUsersList(prev => [newUser, ...prev]);
    setShowAddModal(false);
    resetAddForm();
  };

  // Filtered and Sorted Users (Search only)
  const filteredUsers = usersList
    .filter(u => {
      const matchesSearch = u.fullName.toLowerCase().includes(userSearch.toLowerCase()) ||
        u.email.toLowerCase().includes(userSearch.toLowerCase()) ||
        u.phone.includes(userSearch);
      return matchesSearch;
    })
    .sort((a, b) => {
      return new Date(b.date).getTime() - new Date(a.date).getTime();
    });

  // Styles

  return (
    <div className="glass-panel" style={{ animation: 'fadeIn 0.5s cubic-bezier(0.16, 1, 0.3, 1)' }}>
      {/* Top Header Controls */}
      <div className="panel-controls">
        {/* Search Input Box */}
        <div className="search-wrapper">
          <Search size={18} className="input-icon" />
          <input
            type="text"
            className="modern-input"
            placeholder="Search Name, Email, Phone..."
            value={userSearch}
            onChange={e => setUserSearch(e.target.value)}
          />
        </div>

        {/* Add User Action Button */}
        <button
          onClick={() => {
            resetAddForm();
            setShowAddModal(true);
          }}
          className="page-btn"
          style={{
            backgroundColor: 'var(--primary)',
            color: 'white',
            border: 'none',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px'
          }}
          onMouseOver={e => e.currentTarget.style.backgroundColor = 'var(--primary-dark)'}
          onMouseOut={e => e.currentTarget.style.backgroundColor = 'var(--primary)'}
        >
          <UserPlus size={18} />
          <span>Add User</span>
        </button>
      </div>

      {/* Users Table */}
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
            {filteredUsers.map(user => (
              <tr key={user.id} className="table-row">
                <td>
                  <div className="user-block">
                    <div className={`user-avatar-small ${user.role === 'Pet Sitter' ? 'bg-purple' : 'bg-blue'}`}>
                      {user.fullName.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <div className="user-name">{user.fullName}</div>
                    </div>
                  </div>
                </td>
                <td>
                  <div className="user-name">{user.email}</div>
                  <div className="user-email">{user.phone}</div>
                </td>
                <td>
                  <div className="date-text">{user.city}, {user.state}</div>
                </td>
                <td>
                  <span className="modern-status-pill" style={{ backgroundColor: user.role === 'Pet Sitter' ? 'rgba(124, 58, 237, 0.1)' : 'rgba(56, 189, 248, 0.1)', color: user.role === 'Pet Sitter' ? '#7c3aed' : '#0284c7' }}>
                    {user.role}
                  </span>
                </td>
                <td className="date-text">{user.date}</td>
                <td>
                  <span className="modern-status-pill" style={getBadgeStyle(user.status)}>{user.status}</span>
                </td>
                <td style={{ textAlign: 'right' }}>
                  <div style={{ display: 'inline-flex', gap: '8px' }}>
                    <button onClick={() => console.log('View', user.id)} className="page-btn" style={{ padding: '6px 10px' }} title="View Details"><Eye size={16} /></button>
                    <button onClick={() => handleToggleBlockUser(user.id)} className="page-btn" style={{ padding: '6px 10px', color: user.status === 'Blocked' ? '#059669' : '#e11d48' }} title={user.status === 'Blocked' ? 'Unblock User' : 'Block User'}>
                      <Ban size={16} />
                    </button>
                    <button onClick={() => handleDeleteUser(user.id)} className="page-btn" style={{ padding: '6px 10px', color: '#e11d48' }} title="Delete User"><Trash2 size={16} /></button>
                  </div>
                </td>
              </tr>
            ))}
            {filteredUsers.length === 0 && (
              <tr><td colSpan={7} className="empty-cell">No users found.</td></tr>
            )}
          </tbody>
        </table>
        
        <div className="pagination-wrapper">
          <div className="pagination-info">Showing <b>{filteredUsers.length}</b> users</div>
          <div className="pagination-controls">
            <button className="page-btn" disabled>Previous</button>
            <button className="page-btn" disabled>Next</button>
          </div>
        </div>
      </div>

      {/* Add User Modal */}
      {showAddModal && (
        <div style={{
          position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
          backgroundColor: 'rgba(15, 23, 42, 0.4)', backdropFilter: 'blur(12px)',
          display: 'grid', placeItems: 'center', zIndex: 1000,
          padding: '20px'
        }}>
          <div className="animate-scale" style={{
            backgroundColor: 'var(--bg-card)', borderRadius: '24px',
            width: '100%', maxWidth: '540px', padding: '28px',
            border: '1px solid var(--border)',
            boxShadow: '0 24px 60px -15px rgba(15, 23, 42, 0.18), 0 0 1px 1px rgba(15, 23, 42, 0.05)',
            position: 'relative',
            display: 'flex',
            flexDirection: 'column',
            maxHeight: '90vh'
          }}>
            {/* Modal Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexShrink: 0 }}>
              <div>
                <h3 style={{ fontSize: '1.4rem', fontWeight: '800', color: 'var(--text-heading)', margin: 0, letterSpacing: '-0.5px' }}>Create New Account</h3>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: '2px 0 0 0' }}>Register a new administrative member.</p>
              </div>
              <button 
                onClick={() => {
                  setShowAddModal(false);
                  resetAddForm();
                }} 
                style={{ background: 'rgba(15, 23, 42, 0.05)', border: 'none', borderRadius: '50%', width: '32px', height: '32px', cursor: 'pointer', display: 'grid', placeItems: 'center', transition: 'all 0.2s' }}
                onMouseOver={e => e.currentTarget.style.backgroundColor = 'rgba(15, 23, 42, 0.1)'}
                onMouseOut={e => e.currentTarget.style.backgroundColor = 'rgba(15, 23, 42, 0.05)'}
              >
                <X size={16} />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleAddUserSubmit} style={{ display: 'flex', flexDirection: 'column', flex: 1, overflow: 'hidden' }}>
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
                    <label style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.75rem', fontWeight: '700', color: 'var(--text-muted)', marginBottom: '6px', letterSpacing: '0.3px', textTransform: 'uppercase' }}>First Name</label>
                    <input 
                      type="text" 
                      required 
                      value={firstName}
                      onChange={e => setFirstName(e.target.value)}
                      style={{ 
                        width: '100%', padding: '10px 14px', borderRadius: '12px', 
                        border: '1.5px solid var(--border)', outline: 'none', fontSize: '0.92rem',
                        transition: 'all 0.2s ease-in-out',
                        background: 'var(--bg-main)'
                      }} 
                      onFocus={e => { e.currentTarget.style.borderColor = 'var(--primary)'; e.currentTarget.style.backgroundColor = 'var(--bg-card)'; e.currentTarget.style.boxShadow = '0 0 0 3px var(--primary-light)'; }}
                      onBlur={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.backgroundColor = 'var(--bg-main)'; e.currentTarget.style.boxShadow = 'none'; }}
                      placeholder="e.g. John"
                    />
                  </div>
                  <div style={{ flex: 1 }}>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.75rem', fontWeight: '700', color: 'var(--text-muted)', marginBottom: '6px', letterSpacing: '0.3px', textTransform: 'uppercase' }}>Last Name</label>
                    <input 
                      type="text" 
                      required 
                      value={lastName}
                      onChange={e => setLastName(e.target.value)}
                      style={{ 
                        width: '100%', padding: '10px 14px', borderRadius: '12px', 
                        border: '1.5px solid var(--border)', outline: 'none', fontSize: '0.92rem',
                        transition: 'all 0.2s ease-in-out',
                        background: 'var(--bg-main)'
                      }} 
                      onFocus={e => { e.currentTarget.style.borderColor = 'var(--primary)'; e.currentTarget.style.backgroundColor = 'var(--bg-card)'; e.currentTarget.style.boxShadow = '0 0 0 3px var(--primary-light)'; }}
                      onBlur={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.backgroundColor = 'var(--bg-main)'; e.currentTarget.style.boxShadow = 'none'; }}
                      placeholder="e.g. Doe"
                    />
                  </div>
                </div>

                {/* Role Select */}
                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: '700', color: 'var(--text-muted)', marginBottom: '8px', letterSpacing: '0.3px', textTransform: 'uppercase' }}>Assign Security Role</label>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px' }}>
                    {[
                      { key: 'Super Admin', desc: 'Full Access' },
                      { key: 'Admin', desc: 'Standard Controls' },
                      { key: 'Monitor', desc: 'Read-only audits' }
                    ].map(item => {
                      const isSelected = role === item.key;
                      return (
                        <button
                          type="button"
                          key={item.key}
                          onClick={() => setRole(item.key)}
                          style={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            gap: '4px',
                            padding: '10px 6px',
                            borderRadius: '12px',
                            border: isSelected ? '2px solid var(--primary)' : '1.5px solid var(--border)',
                            backgroundColor: isSelected ? 'var(--primary-light)' : 'var(--bg-main)',
                            cursor: 'pointer',
                            transition: 'all 0.2s ease-in-out',
                            textAlign: 'center'
                          }}
                        >
                          <span style={{ fontSize: '0.8rem', fontWeight: '700', color: isSelected ? 'var(--primary)' : 'var(--text-heading)' }}>{item.key}</span>
                          <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>{item.desc}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Email with Verification Flow */}
                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: '700', color: 'var(--text-muted)', marginBottom: '6px', letterSpacing: '0.3px', textTransform: 'uppercase' }}>Email Address</label>
                  <div style={{ display: 'flex', gap: '8px', position: 'relative' }}>
                    <input 
                      type="email" 
                      required 
                      disabled={isEmailVerified}
                      value={email}
                      onChange={e => {
                        setEmail(e.target.value);
                        setIsEmailSent(false);
                        setGeneratedCode('');
                        setEnteredCode('');
                        setIsEmailVerified(false);
                      }}
                      style={{ 
                        flex: 1, padding: '10px 14px', borderRadius: '12px', 
                        border: isEmailVerified ? '2px solid var(--success)' : '1.5px solid var(--border)', 
                        outline: 'none', fontSize: '0.92rem',
                        transition: 'all 0.2s ease-in-out',
                        backgroundColor: isEmailVerified ? 'rgba(16, 185, 129, 0.05)' : 'var(--bg-main)'
                      }} 
                      onFocus={e => { if(!isEmailVerified) { e.currentTarget.style.borderColor = 'var(--primary)'; e.currentTarget.style.backgroundColor = 'var(--bg-card)'; e.currentTarget.style.boxShadow = '0 0 0 3px var(--primary-light)'; } }}
                      onBlur={e => { if(!isEmailVerified) { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.backgroundColor = 'var(--bg-main)'; e.currentTarget.style.boxShadow = 'none'; } }}
                      placeholder="e.g. john@example.com"
                    />
                    {!isEmailVerified ? (
                      <button 
                        type="button"
                        onClick={handleSendVerification}
                        style={{
                          padding: '8px 16px', borderRadius: '12px', border: 'none',
                          backgroundColor: 'var(--primary)', color: 'white',
                          fontWeight: '700', fontSize: '0.8rem', cursor: 'pointer',
                          transition: 'all 0.2s',
                          boxShadow: '0 4px 10px rgba(13, 148, 136, 0.15)'
                        }}
                      >
                        {isEmailSent ? 'Resend' : 'Send Code'}
                      </button>
                    ) : (
                      <div style={{ 
                        display: 'flex', alignItems: 'center', gap: '4px', 
                        color: 'var(--success)', fontWeight: '800', fontSize: '0.8rem', 
                        backgroundColor: 'rgba(16, 185, 129, 0.1)', padding: '6px 12px', borderRadius: '12px' 
                      }}>
                        <CheckCircle size={14} /> Verified
                      </div>
                    )}
                  </div>

                  {/* Simulated Inbox / Code entry box */}
                  {isEmailSent && !isEmailVerified && (
                    <div style={{
                      marginTop: '8px', padding: '12px 14px', borderRadius: '14px',
                      backgroundColor: 'rgba(13, 148, 136, 0.04)', border: '1.5px dashed var(--primary)'
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px' }}>
                        <Mail size={14} color="var(--primary)" />
                        <span style={{ fontSize: '0.78rem', color: 'var(--text-main)', fontWeight: '600' }}>
                          Code: <strong style={{ color: 'var(--primary)', fontSize: '0.92rem', marginLeft: '2px' }}>{generatedCode}</strong>
                        </span>
                      </div>
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <input 
                          type="text" 
                          maxLength={4}
                          placeholder="Enter code"
                          value={enteredCode}
                          onChange={e => setEnteredCode(e.target.value)}
                          style={{ 
                            flex: 1, padding: '8px 12px', borderRadius: '8px', 
                            border: '1.5px solid var(--border)', outline: 'none', 
                            fontSize: '0.9rem', textAlign: 'center', letterSpacing: '4px',
                            fontWeight: 'bold', background: 'var(--bg-card)'
                          }}
                        />
                        <button 
                          type="button" 
                          onClick={handleVerifyCode}
                          style={{
                            padding: '8px 16px', borderRadius: '8px', border: 'none',
                            backgroundColor: 'var(--primary)', color: 'white', fontWeight: '700',
                            fontSize: '0.8rem', cursor: 'pointer'
                          }}
                        >
                          Verify
                        </button>
                      </div>
                      {verificationError && (
                        <div style={{ color: 'var(--danger)', fontSize: '0.78rem', marginTop: '6px', display: 'flex', alignItems: 'center', gap: '4px', fontWeight: '600' }}>
                          <AlertCircle size={12} /> {verificationError}
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Phone Number */}
                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: '700', color: 'var(--text-muted)', marginBottom: '6px', letterSpacing: '0.3px', textTransform: 'uppercase' }}>Phone Number</label>
                  <input 
                    type="tel" 
                    required 
                    value={phone}
                    onChange={e => setPhone(e.target.value)}
                    style={{ 
                      width: '100%', padding: '10px 14px', borderRadius: '12px', 
                      border: '1.5px solid var(--border)', outline: 'none', fontSize: '0.92rem',
                      transition: 'all 0.2s ease-in-out',
                      background: 'var(--bg-main)'
                    }} 
                    onFocus={e => { e.currentTarget.style.borderColor = 'var(--primary)'; e.currentTarget.style.backgroundColor = 'var(--bg-card)'; e.currentTarget.style.boxShadow = '0 0 0 3px var(--primary-light)'; }}
                    onBlur={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.backgroundColor = 'var(--bg-main)'; e.currentTarget.style.boxShadow = 'none'; }}
                    placeholder="e.g. +91 9948262033"
                  />
                </div>

                {/* City and State */}
                <div style={{ display: 'flex', gap: '12px' }}>
                  <div style={{ flex: 1 }}>
                    <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: '700', color: 'var(--text-muted)', marginBottom: '6px', letterSpacing: '0.3px', textTransform: 'uppercase' }}>City</label>
                    <input 
                      type="text" 
                      value={city}
                      onChange={e => setCity(e.target.value)}
                      style={{ 
                        width: '100%', padding: '10px 14px', borderRadius: '12px', 
                        border: '1.5px solid var(--border)', outline: 'none', fontSize: '0.92rem',
                        transition: 'all 0.2s ease-in-out',
                        background: 'var(--bg-main)'
                      }} 
                      onFocus={e => { e.currentTarget.style.borderColor = 'var(--primary)'; e.currentTarget.style.backgroundColor = 'var(--bg-card)'; e.currentTarget.style.boxShadow = '0 0 0 3px var(--primary-light)'; }}
                      onBlur={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.backgroundColor = 'var(--bg-main)'; e.currentTarget.style.boxShadow = 'none'; }}
                      placeholder="e.g. Hyderabad"
                    />
                  </div>
                  <div style={{ flex: 1 }}>
                    <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: '700', color: 'var(--text-muted)', marginBottom: '6px', letterSpacing: '0.3px', textTransform: 'uppercase' }}>State</label>
                    <input 
                      type="text" 
                      value={state}
                      onChange={e => setState(e.target.value)}
                      style={{ 
                        width: '100%', padding: '10px 14px', borderRadius: '12px', 
                        border: '1.5px solid var(--border)', outline: 'none', fontSize: '0.92rem',
                        transition: 'all 0.2s ease-in-out',
                        background: 'var(--bg-main)'
                      }} 
                      onFocus={e => { e.currentTarget.style.borderColor = 'var(--primary)'; e.currentTarget.style.backgroundColor = 'var(--bg-card)'; e.currentTarget.style.boxShadow = '0 0 0 3px var(--primary-light)'; }}
                      onBlur={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.backgroundColor = 'var(--bg-main)'; e.currentTarget.style.boxShadow = 'none'; }}
                      placeholder="e.g. Telangana"
                    />
                  </div>
                </div>
              </div>

              {/* Action Buttons (Fixed Footer) */}
              <div style={{ display: 'flex', gap: '12px', flexShrink: 0, borderTop: '1px solid var(--border)', paddingTop: '16px' }}>
                <button 
                  type="button" 
                  onClick={() => {
                    setShowAddModal(false);
                    resetAddForm();
                  }}
                  style={{
                    flex: 1, padding: '12px', borderRadius: '12px', border: '1.5px solid var(--border)',
                    backgroundColor: 'var(--bg-card)', color: 'var(--text-main)', fontWeight: '700', cursor: 'pointer',
                    transition: 'all 0.2s', fontSize: '0.92rem'
                  }}
                  onMouseOver={e => e.currentTarget.style.backgroundColor = 'var(--bg-main)'}
                  onMouseOut={e => e.currentTarget.style.backgroundColor = 'var(--bg-card)'}
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  disabled={!isEmailVerified}
                  style={{
                    flex: 1, padding: '12px', borderRadius: '12px', border: 'none',
                    backgroundColor: isEmailVerified ? 'var(--primary)' : '#e2e8f0', 
                    color: isEmailVerified ? 'white' : '#94a3b8', fontWeight: '700', 
                    cursor: isEmailVerified ? 'pointer' : 'not-allowed',
                    transition: 'all 0.2s',
                    fontSize: '0.92rem',
                    boxShadow: isEmailVerified ? '0 6px 16px -4px rgba(13, 148, 136, 0.3)' : 'none'
                  }}
                >
                  Create User
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
