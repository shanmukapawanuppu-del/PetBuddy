import React, { useState } from 'react';
import {
  ChevronLeft, ChevronRight, Search, Filter,
  MessageSquare, ShieldAlert, CheckCircle, Clock,
  Eye, AlertTriangle, PawPrint
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import './AdminDashboard.css';

// --- Types & Mock Data ---
type Priority = 'Low' | 'Medium' | 'High' | 'Critical';
type Status = 'Open' | 'In Review' | 'Escalated' | 'Resolved' | 'Closed';

interface Complaint {
  id: string;
  submittedBy: { name: string; role: 'Owner' | 'Sitter'; id: string };
  againstUser: { name: string; role: 'Owner' | 'Sitter'; id: string };
  type: string;
  priority: Priority;
  status: Status;
  createdAt: string;
}

const mockComplaints: Complaint[] = [
  {
    id: '#1001',
    submittedBy: { name: 'Sarah Jenkins', role: 'Owner', id: 'o1' },
    againstUser: { name: 'Mike Ross', role: 'Sitter', id: 's1' },
    type: 'Pet injury or health concern',
    priority: 'High',
    status: 'Open',
    createdAt: '2025-01-10T14:30:00Z'
  },
  {
    id: '#1002',
    submittedBy: { name: 'Alex Thompson', role: 'Sitter', id: 's2' },
    againstUser: { name: 'Emily Clark', role: 'Owner', id: 'o2' },
    type: 'Pet owner no-show',
    priority: 'Medium',
    status: 'In Review',
    createdAt: '2025-01-09T09:15:00Z'
  },
  {
    id: '#1003',
    submittedBy: { name: 'David Miller', role: 'Owner', id: 'o3' },
    againstUser: { name: 'Jessica Wang', role: 'Sitter', id: 's3' },
    type: 'Refund request',
    priority: 'Low',
    status: 'Resolved',
    createdAt: '2025-01-08T16:45:00Z'
  },
  {
    id: '#1004',
    submittedBy: { name: 'Amanda Smith', role: 'Owner', id: 'o4' },
    againstUser: { name: 'Tom Hardy', role: 'Sitter', id: 's4' },
    type: 'Safety concern',
    priority: 'Critical',
    status: 'Escalated',
    createdAt: '2025-01-11T10:20:00Z'
  },
  {
    id: '#1005',
    submittedBy: { name: 'Chris Evans', role: 'Owner', id: 'o5' },
    againstUser: { name: 'Unknown', role: 'Sitter', id: 's5' },
    type: 'Fraud or fake profile',
    priority: 'High',
    status: 'Closed',
    createdAt: '2025-01-05T11:00:00Z'
  }
];

// --- Helpers ---
import { adminSidebarNavItems } from '../../constants/adminNav';

const getPriorityStyle = (priority: Priority) => {
  switch (priority) {
    case 'Critical': return { bg: 'rgba(239, 68, 68, 0.15)', color: '#ef4444' }; // Red
    case 'High':     return { bg: 'rgba(249, 115, 22, 0.15)', color: '#f97316' }; // Orange
    case 'Medium':   return { bg: 'rgba(234, 179, 8, 0.15)', color: '#eab308' };  // Yellow
    case 'Low':      return { bg: 'rgba(148, 163, 184, 0.15)', color: '#64748b' };// Slate
    default:         return { bg: 'rgba(148, 163, 184, 0.15)', color: '#64748b' };
  }
};

const getStatusStyle = (status: Status) => {
  switch (status) {
    case 'Open':      return { bg: 'rgba(59, 130, 246, 0.1)', color: '#3b82f6', icon: AlertTriangle };
    case 'In Review': return { bg: 'rgba(168, 85, 247, 0.1)', color: '#a855f7', icon: Clock };
    case 'Escalated': return { bg: 'rgba(239, 68, 68, 0.1)', color: '#ef4444',  icon: ShieldAlert };
    case 'Resolved':  return { bg: 'rgba(16, 185, 129, 0.1)', color: '#10b981', icon: CheckCircle };
    case 'Closed':    return { bg: 'rgba(100, 116, 139, 0.1)', color: '#64748b',icon: CheckCircle };
    default:          return { bg: 'rgba(100, 116, 139, 0.1)', color: '#64748b',icon: Clock };
  }
};

export const ComplaintsList: React.FC = () => {
  const navigate = useNavigate();
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<Status | 'All'>('All');
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const filteredComplaints = mockComplaints
    .filter(c => 
      c.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.submittedBy.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.againstUser.name.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .filter(c => filterStatus === 'All' || c.status === filterStatus)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

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
            className={`sidebar-nav-link ${item.id === 'complaints' ? 'active' : ''}`}
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

  return (
    <div className="admin-wrapper" style={{ background: 'radial-gradient(circle at top left, #e0f2fe 0%, #f8fafc 50%, #f1f5f9 100%)', overflow: 'hidden' }}>
      {renderAdminNav()}
      <main className="admin-main" style={{ overflowY: 'auto', height: '100vh', padding: '40px' }}>
        <div style={{ width: '100%', margin: '0 auto', animation: 'fadeIn 0.5s cubic-bezier(0.16, 1, 0.3, 1)' }}>
          
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '32px' }}>
            <div>
              <h1 style={{ margin: '0 0 8px 0', fontSize: '2rem', fontWeight: '800', color: 'var(--text-heading)', letterSpacing: '-0.5px' }}>
                Complaints & Support
              </h1>
              <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: '1rem', fontWeight: '500' }}>
                Manage trust & safety issues reported by users.
              </p>
            </div>
            
            <div style={{ display: 'flex', gap: '16px' }}>
              <div style={{ position: 'relative' }}>
                <Search size={18} color="var(--text-muted)" style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)' }} />
                <input 
                  type="text" 
                  placeholder="Search Ticket ID or Name..." 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  style={{ 
                    padding: '10px 16px 10px 42px', borderRadius: '30px', border: '1px solid var(--border)', 
                    background: 'var(--bg-card)', color: 'var(--text-main)', width: '320px', fontSize: '0.95rem', fontWeight: '500', outline: 'none',
                    transition: 'all 0.2s'
                  }}
                  onFocus={e => e.currentTarget.style.borderColor = 'var(--primary)'}
                  onBlur={e => e.currentTarget.style.borderColor = 'var(--border)'}
                />
              </div>
              
              <div style={{ position: 'relative' }}>
                <button
                  onClick={() => setIsFilterOpen(!isFilterOpen)}
                  style={{ 
                    padding: '10px 24px 10px 20px', borderRadius: '30px', border: 'none', 
                    background: 'var(--bg-card)', color: 'var(--text-main)', fontSize: '0.95rem', fontWeight: '700', outline: 'none', cursor: 'pointer',
                    display: 'flex', alignItems: 'center', gap: '8px',
                    transition: 'all 0.2s', height: '42px'
                  }}
                >
                  <Filter size={18} />
                  <span>Filter</span>
                </button>

                {isFilterOpen && (
                  <div style={{ 
                    position: 'absolute', top: '100%', right: 0, marginTop: '12px', 
                    background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '16px', 
                    boxShadow: '0 10px 30px rgba(0,0,0,0.08)', zIndex: 100, width: '340px', padding: '24px'
                  }}>
                    <h3 style={{ margin: '0 0 16px 0', fontSize: '1.1rem', fontWeight: '800', color: 'var(--text-heading)' }}>Advanced Filters</h3>
                    <div style={{ height: '1px', background: 'var(--border)', margin: '0 -24px 20px -24px' }}></div>
                    
                    <div style={{ fontSize: '0.75rem', fontWeight: '800', color: 'var(--text-muted)', letterSpacing: '1px', marginBottom: '16px' }}>STATUS</div>
                    
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                      {['All', 'Open', 'In Review', 'Escalated', 'Resolved', 'Closed'].map(option => {
                        const isSelected = filterStatus === option;
                        return (
                          <button 
                            key={option}
                            onClick={() => {
                              setFilterStatus(option as any);
                              setIsFilterOpen(false);
                            }}
                            style={{ 
                              padding: '8px 18px', cursor: 'pointer', fontSize: '0.85rem', fontWeight: '700',
                              borderRadius: '30px', border: `1px solid ${isSelected ? 'var(--primary)' : 'var(--border)'}`,
                              background: isSelected ? 'var(--primary-light)' : 'transparent',
                              color: isSelected ? 'var(--primary)' : 'var(--text-heading)',
                              transition: 'all 0.2s', outline: 'none'
                            }}
                            onMouseOver={e => {
                              if (!isSelected) e.currentTarget.style.borderColor = 'var(--text-muted)';
                            }}
                            onMouseOut={e => {
                              if (!isSelected) e.currentTarget.style.borderColor = 'var(--border)';
                            }}
                          >
                            {option}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="admin-table-container">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Ticket ID</th>
                  <th>Pet Owner</th>
                  <th>Pet Sitter</th>
                  <th>Complaint Type</th>
                  <th>Priority</th>
                  <th>Status</th>
                  <th>Created</th>
                  <th style={{ textAlign: 'center' }}>Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredComplaints.map((complaint) => {
                  const prioStyle = getPriorityStyle(complaint.priority);
                  const statStyle = getStatusStyle(complaint.status);
                  const StatIcon = statStyle.icon;

                  return (
                    <tr key={complaint.id}>
                      <td><span style={{ fontWeight: '800', color: 'var(--text-heading)' }}>{complaint.id}</span></td>
                      <td>
                        <div style={{ fontWeight: '700', color: 'var(--text-heading)' }}>{complaint.submittedBy.name}</div>
                        <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: '600', marginTop: '2px' }}>{complaint.submittedBy.role}</div>
                      </td>
                      <td>
                        <div style={{ fontWeight: '700', color: 'var(--text-heading)' }}>{complaint.againstUser.name}</div>
                        <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: '600', marginTop: '2px' }}>{complaint.againstUser.role}</div>
                      </td>
                      <td><span style={{ fontWeight: '600', color: 'var(--text-heading)' }}>{complaint.type}</span></td>
                      <td>
                        <span style={{ 
                          display: 'inline-flex', padding: '6px 12px', borderRadius: '30px', fontSize: '0.8rem', 
                          fontWeight: '800', background: prioStyle.bg, color: prioStyle.color 
                        }}>
                          {complaint.priority}
                        </span>
                      </td>
                      <td>
                        <span style={{ 
                          display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '6px 12px', 
                          borderRadius: '30px', fontSize: '0.8rem', fontWeight: '800', 
                          background: statStyle.bg, color: statStyle.color 
                        }}>
                          <StatIcon size={14} /> {complaint.status}
                        </span>
                      </td>
                      <td>
                        <span style={{ fontWeight: '600', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                          {new Date(complaint.createdAt).toLocaleDateString()}
                        </span>
                      </td>
                      <td style={{ textAlign: 'center' }}>
                        <button 
                          onClick={() => navigate(`/admin/complaints/${complaint.id.replace('#', '')}`)}
                          className="view-details-btn"
                        >
                          <Eye size={14} /> View
                        </button>
                      </td>
                    </tr>
                  );
                })}
                {filteredComplaints.length === 0 && (
                  <tr>
                    <td colSpan={8} style={{ padding: '60px 24px', textAlign: 'center', color: 'var(--text-muted)' }}>
                      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' }}>
                        <MessageSquare size={48} style={{ opacity: 0.2 }} />
                        <span style={{ fontSize: '1.2rem', fontWeight: '700' }}>No complaints found</span>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

        </div>
      </main>
    </div>
  );
};
