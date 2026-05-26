import React, { useState } from 'react';
import { Search, Eye, Ban, Trash2, X, CheckCircle, Mail, AlertCircle } from 'lucide-react';

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
  const badgeBase = { padding: '4px 8px', borderRadius: '12px', fontSize: '0.8rem', fontWeight: '700' };
  const avatarStyle = { width: '40px', height: '40px', borderRadius: '50%', backgroundColor: 'var(--primary-light)', color: 'var(--primary)', display: 'grid', placeItems: 'center', fontWeight: 'bold' };
  const searchInputStyle = { width: '100%', padding: '10px 12px 10px 36px', borderRadius: '8px', border: '1px solid var(--border)', fontSize: '0.95rem', background: 'white' };
  const tableContainerStyle = { backgroundColor: 'white', borderRadius: '12px', border: '1px solid var(--border)', overflow: 'hidden' };
  const theadStyle = { backgroundColor: 'var(--bg-main)', borderBottom: '1px solid var(--border)' };
  const rowStyle = { borderBottom: '1px solid var(--border)' };
  const cellStyle: React.CSSProperties = { padding: '12px 16px', textAlign: 'left' };
  const noDataStyle: React.CSSProperties = { padding: '32px', textAlign: 'center', color: 'var(--text-muted)' };
  const iconBtnStyle = { background: 'none', border: 'none', cursor: 'pointer', padding: '4px' };

  return (
    <>
      {/* Top Header Controls - Search Input and Add User Button in a single bar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
        {/* Search Input Box */}
        <div style={{ position: 'relative', width: '300px' }}>
          <Search size={18} color="var(--text-muted)" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
          <input
            type="text"
            placeholder="Search Name, Email, Phone..."
            value={userSearch}
            onChange={e => setUserSearch(e.target.value)}
            style={{ ...searchInputStyle, paddingLeft: '36px' }}
          />
        </div>

        {/* Add User Action Button */}
        <button
          onClick={() => {
            resetAddForm();
            setShowAddModal(true);
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
      <div className="card" style={tableContainerStyle}>
        <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '800px' }}>
          <thead style={theadStyle}>
            <tr>
              <th style={cellStyle}>User</th>
              <th style={cellStyle}>Contact</th>
              <th style={cellStyle}>Location</th>
              <th style={cellStyle}>Role</th>
              <th style={cellStyle}>Registered</th>
              <th style={cellStyle}>Status</th>
              <th style={{ ...cellStyle, textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map(user => (
              <tr key={user.id} style={rowStyle}>
                <td style={cellStyle}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{ ...avatarStyle, backgroundColor: user.role === 'Pet Sitter' ? 'rgba(124, 58, 237, 0.12)' : 'var(--primary-light)', color: user.role === 'Pet Sitter' ? '#7c3aed' : 'var(--primary)' }}>
                      {user.fullName.charAt(0).toUpperCase()}
                    </div>
                    <span style={{ fontWeight: '600', color: 'var(--text-heading)' }}>{user.fullName}</span>
                  </div>
                </td>
                <td style={cellStyle}>
                  <div style={{ fontSize: '0.9rem', color: 'var(--text-heading)' }}>{user.email}</div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{user.phone}</div>
                </td>
                <td style={cellStyle}>
                  <div style={{ fontSize: '0.9rem', color: 'var(--text-heading)' }}>{user.city}, {user.state}</div>
                </td>
                <td style={cellStyle}>
                  <span style={{ ...badgeBase, padding: '4px 10px', borderRadius: '12px', fontSize: '0.8rem', fontWeight: '700', backgroundColor: user.role === 'Pet Sitter' ? 'rgba(124, 58, 237, 0.12)' : 'rgba(59, 130, 246, 0.12)', color: user.role === 'Pet Sitter' ? '#7c3aed' : '#3b82f6' }}>
                    {user.role}
                  </span>
                </td>
                <td style={cellStyle}>{user.date}</td>
                <td style={cellStyle}>
                  <span style={{ ...badgeBase, ...getBadgeStyle(user.status) }}>{user.status}</span>
                </td>
                <td style={{ ...cellStyle, textAlign: 'right' }}>
                  <button onClick={() => console.log('View', user.id)} style={iconBtnStyle}><Eye size={18} /></button>
                  <button onClick={() => handleToggleBlockUser(user.id)} style={iconBtnStyle}>
                    {user.status === 'Blocked' ? <Ban size={18} color="var(--success)" /> : <Ban size={18} color="var(--danger)" />}
                  </button>
                  <button onClick={() => handleDeleteUser(user.id)} style={iconBtnStyle}><Trash2 size={18} color="var(--danger)" /></button>
                </td>
              </tr>
            ))}
            {filteredUsers.length === 0 && (
              <tr><td colSpan={7} style={noDataStyle}>No users found.</td></tr>
            )}
          </tbody>
        </table>
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
            backgroundColor: 'rgba(255, 255, 255, 0.98)', borderRadius: '24px',
            width: '100%', maxWidth: '540px', padding: '28px',
            border: '1px solid rgba(255, 255, 255, 0.8)',
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
                        background: '#f8fafc'
                      }} 
                      onFocus={e => { e.currentTarget.style.borderColor = 'var(--primary)'; e.currentTarget.style.backgroundColor = '#fff'; e.currentTarget.style.boxShadow = '0 0 0 3px var(--primary-light)'; }}
                      onBlur={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.backgroundColor = '#f8fafc'; e.currentTarget.style.boxShadow = 'none'; }}
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
                        background: '#f8fafc'
                      }} 
                      onFocus={e => { e.currentTarget.style.borderColor = 'var(--primary)'; e.currentTarget.style.backgroundColor = '#fff'; e.currentTarget.style.boxShadow = '0 0 0 3px var(--primary-light)'; }}
                      onBlur={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.backgroundColor = '#f8fafc'; e.currentTarget.style.boxShadow = 'none'; }}
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
                            backgroundColor: isSelected ? 'var(--primary-light)' : '#f8fafc',
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
                        backgroundColor: isEmailVerified ? 'rgba(16, 185, 129, 0.05)' : '#f8fafc'
                      }} 
                      onFocus={e => { if(!isEmailVerified) { e.currentTarget.style.borderColor = 'var(--primary)'; e.currentTarget.style.backgroundColor = '#fff'; e.currentTarget.style.boxShadow = '0 0 0 3px var(--primary-light)'; } }}
                      onBlur={e => { if(!isEmailVerified) { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.backgroundColor = '#f8fafc'; e.currentTarget.style.boxShadow = 'none'; } }}
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
                            fontWeight: 'bold', background: 'white'
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
                      background: '#f8fafc'
                    }} 
                    onFocus={e => { e.currentTarget.style.borderColor = 'var(--primary)'; e.currentTarget.style.backgroundColor = '#fff'; e.currentTarget.style.boxShadow = '0 0 0 3px var(--primary-light)'; }}
                    onBlur={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.backgroundColor = '#f8fafc'; e.currentTarget.style.boxShadow = 'none'; }}
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
                        background: '#f8fafc'
                      }} 
                      onFocus={e => { e.currentTarget.style.borderColor = 'var(--primary)'; e.currentTarget.style.backgroundColor = '#fff'; e.currentTarget.style.boxShadow = '0 0 0 3px var(--primary-light)'; }}
                      onBlur={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.backgroundColor = '#f8fafc'; e.currentTarget.style.boxShadow = 'none'; }}
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
                        background: '#f8fafc'
                      }} 
                      onFocus={e => { e.currentTarget.style.borderColor = 'var(--primary)'; e.currentTarget.style.backgroundColor = '#fff'; e.currentTarget.style.boxShadow = '0 0 0 3px var(--primary-light)'; }}
                      onBlur={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.backgroundColor = '#f8fafc'; e.currentTarget.style.boxShadow = 'none'; }}
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
                    backgroundColor: 'white', color: 'var(--text-main)', fontWeight: '700', cursor: 'pointer',
                    transition: 'all 0.2s', fontSize: '0.92rem'
                  }}
                  onMouseOver={e => e.currentTarget.style.backgroundColor = '#f8fafc'}
                  onMouseOut={e => e.currentTarget.style.backgroundColor = 'white'}
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
    </>
  );
};
