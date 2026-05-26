import React, { useEffect, useState } from 'react';
import { LogOut, Users, UserCheck, Calendar, CreditCard, Settings, LayoutDashboard, Search, Eye, Ban, Trash2, CheckCircle, XCircle, FileText, Info } from 'lucide-react';
import { useAdminAuth } from '../../components/admin/AdminAuthContext';
import { Link, useLocation } from 'react-router-dom';
import './AdminDashboard.css';
const mockOwners = [
  { id: 'O1', avatar: 'A', fullName: 'Alice Johnson', email: 'alice@example.com', phone: '+1 555-0101', date: '2025-01-12', pets: 2, bookings: 5, status: 'Active' },
  { id: 'O2', avatar: 'B', fullName: 'Bob Smith', email: 'bob.smith@example.com', phone: '+1 555-0202', date: '2025-02-15', pets: 1, bookings: 12, status: 'Active' },
  { id: 'O3', avatar: 'C', fullName: 'Carol White', email: 'carol@example.com', phone: '+1 555-0103', date: '2025-03-20', pets: 3, bookings: 1, status: 'Blocked' },
];

const mockSitters = [
  { id: 'S1', avatar: 'E', fullName: 'Emma Wilson', email: 'emma@example.com', phone: '+1 555-0201', address: '123 Park Ave, NY', date: '2025-01-10', verifStatus: 'Verified', availStatus: 'Available' },
  { id: 'S2', avatar: 'F', fullName: 'Frank Thomas', email: 'frank@example.com', phone: '+1 555-0202', address: '456 Oak St, SF', date: '2025-04-12', verifStatus: 'Pending', availStatus: 'Unavailable' },
  { id: 'S3', avatar: 'G', fullName: 'Grace Lee', email: 'grace.l@example.com', phone: '+1 555-0203', address: '789 Pine Rd, TX', date: '2025-03-01', verifStatus: 'Rejected', availStatus: 'Unavailable' },
];

// Helper to style status badges
const getBadgeStyle = (status) => {
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

const AdminDashboard: React.FC = () => {
  const { adminUser, logoutAdmin } = useAdminAuth();
  const location = useLocation();

  const [greeting, setGreeting] = useState('');
  const [activeTab, setActiveTab] = useState<'owners' | 'sitters'>('sitters');
  const [ownerSearch, setOwnerSearch] = useState('');
  const [sitterSearch, setSitterSearch] = useState('');
  const [sitterFilter, setSitterFilter] = useState('All');

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

  // Filtered data
  const filteredOwners = mockOwners.filter(o =>
    o.fullName.toLowerCase().includes(ownerSearch.toLowerCase()) ||
    o.email.toLowerCase().includes(ownerSearch.toLowerCase()) ||
    o.phone.includes(ownerSearch)
  );

  const filteredSitters = mockSitters.filter(s => {
    const matchesSearch = s.fullName.toLowerCase().includes(sitterSearch.toLowerCase()) ||
      s.email.toLowerCase().includes(sitterSearch.toLowerCase()) ||
      s.phone.includes(sitterSearch);
    const matchesFilter = sitterFilter === 'All' || s.verifStatus === sitterFilter;
    return matchesSearch && matchesFilter;
  });

  const sitterCounts = {
    total: mockSitters.length,
    pending: mockSitters.filter(s => s.verifStatus === 'Pending').length,
    verified: mockSitters.filter(s => s.verifStatus === 'Verified').length,
    rejected: mockSitters.filter(s => s.verifStatus === 'Rejected').length,
  };

  // Reusable style objects
  const badgeBase = { padding: '4px 8px', borderRadius: '12px', fontSize: '0.8rem', fontWeight: '700' };
  const avatarStyle = { width: '40px', height: '40px', borderRadius: '50%', backgroundColor: 'var(--primary-light)', color: 'var(--primary)', display: 'grid', placeItems: 'center', fontWeight: 'bold' };
  const cardStyle = { padding: '24px', backgroundColor: 'white', borderRadius: '12px', border: '1px solid var(--border)', boxShadow: 'var(--shadow-sm)' };
  const labelStyle = { color: 'var(--text-muted)', fontSize: '0.9rem', fontWeight: '600', marginBottom: '8px' };
  const valueStyle = { fontSize: '1.8rem', fontWeight: 'bold', margin: 0 };
  const searchInputStyle = { width: '100%', padding: '10px 12px 10px 36px', borderRadius: '8px', border: '1px solid var(--border)', fontSize: '0.95rem', background: 'white' };
  const filterSelectStyle = { padding: '8px 12px', borderRadius: '8px', border: '1px solid var(--border)', fontSize: '0.95rem', background: 'white', fontWeight: '600', color: 'var(--text-heading)' };
  const tableContainerStyle = { backgroundColor: 'white', borderRadius: '12px', border: '1px solid var(--border)', overflow: 'hidden' };
  const theadStyle = { backgroundColor: 'var(--bg-main)', borderBottom: '1px solid var(--border)' };
  const rowStyle = { borderBottom: '1px solid var(--border)' };
  const cellStyle = { padding: '12px 16px' };
  const noDataStyle = { padding: '32px', textAlign: 'center', color: 'var(--text-muted)' };
  const iconBtnStyle = { background: 'none', border: 'none', cursor: 'pointer', padding: '4px' };
  const tabButton = (active) => ({
    padding: '8px 16px', border: 'none', borderBottom: active ? '2px solid var(--primary)' : '2px solid transparent', background: 'transparent', color: active ? 'var(--primary)' : 'var(--text-muted)', fontWeight: active ? '600' : '500', cursor: 'pointer' })

  const navItems = [
    { name: 'Dashboard', path: '/admin/dashboard', icon: LayoutDashboard },
    { name: 'Users', path: '#', icon: Users },
    { name: 'Pet Sitters', path: '#', icon: UserCheck },
    { name: 'Bookings', path: '#', icon: Calendar },
    { name: 'Payments', path: '#', icon: CreditCard },
    { name: 'Settings', path: '#', icon: Settings },
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
              const isActive = location.pathname === item.path;
              const Icon = item.icon;
              return (
                <Link
                  key={item.name}
                  to={item.path}
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
          <div style={{ padding: '16px', borderTop: '1px solid rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', gap: '12px' }}>
  <div style={{ textAlign: 'right' }}>
    <div style={{ fontWeight: '600', color: 'white' }}>{adminUser?.fullName}</div>
    <div style={{ fontSize: '0.8rem', color: '#cbd5e1' }}>Administrator</div>
  </div>
  <div style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: 'var(--primary)', color: 'white', display: 'grid', placeItems: 'center', fontWeight: 'bold' }}>{adminUser?.fullName?.charAt(0).toUpperCase()}</div>
</div>
<div style={{ padding: '24px', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
  <button onClick={handleLogout} style={{
    display: 'flex', alignItems: 'center', gap: '12px', width: '100%', padding: '12px',
    backgroundColor: 'transparent', color: '#ef4444', border: '1px solid rgba(239, 68, 68, 0.3)',
    borderRadius: '8px', cursor: 'pointer', transition: 'all 0.2s', fontWeight: '600'
  }}
    onMouseOver={e => { e.currentTarget.style.backgroundColor = 'rgba(239, 68, 68, 0.1)'; }}
    onMouseOut={e => { e.currentTarget.style.backgroundColor = 'transparent'; }}
  >
    <LogOut size={20} /> Sign Out
  </button>
</div>
        </aside>

        {/* Main Content */}
        <main className="admin-main">
          
        <div style={{ padding: '32px', flex: 1 }}>
          <h1 style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--text-heading)' }}>{greeting}, {adminUser?.fullName.split(' ')[0]}!</h1>
          <p style={{ color: 'var(--text-muted)', marginBottom: '24px' }}>Here's what's happening in your platform today.</p>

          {/* Tabs */}
          <div style={{ display: 'flex', gap: '12px', marginBottom: '24px' }}>
            <button onClick={() => setActiveTab('sitters')} style={tabButton(activeTab === 'sitters')}>Pet Sitters</button>
            <button onClick={() => setActiveTab('owners')} style={tabButton(activeTab === 'owners')}>Pet Owners</button>
          </div>

          {activeTab === 'owners' && (
            <>
              {/* Summary Card */}
              <div className="owner-card">
                <p style={labelStyle}>Total Pet Owners</p>
                <h3 style={valueStyle}>{mockOwners.length}</h3>
              </div>

              {/* Search */}
              <div style={{ position: 'relative', margin: '16px 0', maxWidth: '400px' }}>
                <Search size={20} color="var(--text-muted)" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
                <input
                  type="text"
                  placeholder="Search Name, Email, Phone..."
                  value={ownerSearch}
                  onChange={e => setOwnerSearch(e.target.value)}
                  style={searchInputStyle}
                />
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
              <div className="grid-4" style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '24px', marginBottom: '32px' }}>
                <div className="sitter-card">
                  <p style={labelStyle}>Total Sitters</p>
                  <h3 style={valueStyle}>{sitterCounts.total}</h3>
                </div>
                <div className="sitter-card">
                  <p style={labelStyle}>Pending Sitters</p>
                  <h3 style={valueStyle}>{sitterCounts.pending}</h3>
                </div>
                <div className="sitter-card">
                  <p style={labelStyle}>Verified Sitters</p>
                  <h3 style={valueStyle}>{sitterCounts.verified}</h3>
                </div>
                <div className="sitter-card">
                  <p style={labelStyle}>Rejected Sitters</p>
                  <h3 style={valueStyle}>{sitterCounts.rejected}</h3>
                </div>
              </div>

              {/* Search & Filter */}
              <div style={{ display: 'flex', gap: '12px', marginBottom: '16px' }}>
                <div style={{ position: 'relative', flex: 1, maxWidth: '400px' }}>
                  <Search size={20} color="var(--text-muted)" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
                  <input
                    type="text"
                    placeholder="Search Name, Email, Phone..."
                    value={sitterSearch}
                    onChange={e => setSitterSearch(e.target.value)}
                    style={searchInputStyle}
                  />
                </div>
                <select value={sitterFilter} onChange={e => setSitterFilter(e.target.value)} style={filterSelectStyle}>
                  <option value="All">All Statuses</option>
                  <option value="Pending">Pending</option>
                  <option value="Verified">Verified</option>
                  <option value="Rejected">Rejected</option>
                  <option value="Blocked">Blocked</option>
                </select>
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
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
