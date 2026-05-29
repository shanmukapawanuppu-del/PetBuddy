import React, { useState } from 'react';
import {
  Search, Filter,
  MessageSquare, ShieldAlert, CheckCircle, Clock,
  Eye, AlertTriangle
} from 'lucide-react';
import { Link } from 'react-router-dom';
import PremiumSidebar from '../../components/admin/PremiumSidebar';
import PremiumSelect from '../../components/admin/PremiumSelect';
import '../../components/admin/PremiumTable.css';
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
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<Status | 'All'>('All');

  const filteredComplaints = mockComplaints
    .filter(c => 
      c.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.submittedBy.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.againstUser.name.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .filter(c => filterStatus === 'All' || c.status === filterStatus)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  return (
    <div className="admin-wrapper" style={{ overflow: 'hidden' }}>
      <PremiumSidebar activeId="complaints" />
      <main className="admin-main" style={{ overflowY: 'auto', height: '100vh', padding: '40px' }}>
        <div style={{ width: '100%', margin: '0 auto', animation: 'fadeIn 0.5s cubic-bezier(0.16, 1, 0.3, 1)' }}>
          
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '32px' }}>
            <div>
              <h1 style={{ margin: '0 0 8px 0', fontSize: '2.4rem', fontWeight: '800', color: '#0f172a', letterSpacing: '-0.5px' }}>
                Complaints & Support
              </h1>
              <p style={{ margin: 0, color: '#64748b', fontSize: '1.05rem', fontWeight: '500' }}>
                Manage trust & safety issues reported by users.
              </p>
            </div>
          </div>

          <div className="glass-panel">
            <div className="panel-controls">
              <div className="search-wrapper">
                <Search size={18} className="input-icon" />
                <input 
                  type="text" 
                  className="modern-input"
                  placeholder="Search Ticket ID or Name..." 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              
              <div className="filter-group">
                <PremiumSelect 
                  options={[
                    { value: 'All', label: 'All Statuses' },
                    'Open',
                    'In Review',
                    'Escalated',
                    'Resolved',
                    'Closed'
                  ]}
                  value={filterStatus}
                  onChange={(val) => setFilterStatus(val as any)}
                  icon={<Filter size={18} />}
                  customLabel="Filter"
                  hideChevron
                />
              </div>
            </div>

            <div className="table-wrapper">
              <table className="modern-table">
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
                      <tr key={complaint.id} className="table-row">
                        <td><span className="booking-id-badge">{complaint.id}</span></td>
                        <td>
                          <div className="user-block">
                            <div className="user-avatar-small bg-blue">{complaint.submittedBy.name.charAt(0)}</div>
                            <div>
                              <div className="user-name">{complaint.submittedBy.name}</div>
                              <div className="user-email">{complaint.submittedBy.role}</div>
                            </div>
                          </div>
                        </td>
                        <td>
                          <div className="user-block">
                            <div className="user-avatar-small bg-rose">{complaint.againstUser.name.charAt(0)}</div>
                            <div>
                              <div className="user-name">{complaint.againstUser.name}</div>
                              <div className="user-email">{complaint.againstUser.role}</div>
                            </div>
                          </div>
                        </td>
                        <td><span className="date-text">{complaint.type}</span></td>
                        <td>
                          <span className="modern-status-pill" style={{ background: prioStyle.bg, color: prioStyle.color }}>
                            {complaint.priority}
                          </span>
                        </td>
                        <td>
                          <span className="modern-status-pill" style={{ background: statStyle.bg, color: statStyle.color }}>
                            <StatIcon size={14} /> {complaint.status}
                          </span>
                        </td>
                        <td className="date-text">
                          {new Date(complaint.createdAt).toLocaleDateString()}
                        </td>
                        <td style={{ textAlign: 'center' }}>
                          <Link 
                            to={`/admin/complaints/${complaint.id.replace('#', '')}`}
                            className="page-btn"
                            style={{ textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '8px 16px' }}
                          >
                            <Eye size={14} /> View
                          </Link>
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
        </div>
      </main>
    </div>
  );
};
