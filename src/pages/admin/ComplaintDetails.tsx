import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  ChevronLeft, MessageSquare, AlertTriangle, 
  Clock, ShieldAlert, CheckCircle, Mail, Phone, ExternalLink,
  Calendar, FileText, Image as ImageIcon, MessageCircle, Send, Ban, RefreshCw, PawPrint
} from 'lucide-react';
import './AdminDashboard.css';

// --- Types & Mock Data ---
type Priority = 'Low' | 'Medium' | 'High' | 'Critical';
type Status = 'Open' | 'In Review' | 'Escalated' | 'Resolved' | 'Closed';

import { adminSidebarNavItems } from '../../constants/adminNav';

const mockComplaintDetail = {
  id: '#1001',
  type: 'Pet injury or health concern',
  description: 'When I picked up Max, he had a significant limp on his back right leg. The sitter claimed she didn\'t notice anything, but he was perfectly fine when I dropped him off. I took him to the vet and they confirmed a sprain.',
  status: 'Open' as Status,
  priority: 'High' as Priority,
  createdAt: '2025-01-10T14:30:00Z',
  
  reporter: {
    name: 'Sarah Jenkins',
    role: 'Owner',
    email: 'sarah.j@example.com',
    phone: '+1 (555) 123-4567',
    id: 'o1'
  },
  
  reportedAgainst: {
    name: 'Mike Ross',
    role: 'Sitter',
    id: 's1'
  },
  
  booking: {
    id: 'BK-7890',
    petName: 'Max (Golden Retriever)',
    dates: 'Jan 8, 2025 - Jan 10, 2025',
    status: 'Completed',
    notes: 'Please ensure he takes his joint supplement every morning.'
  },
  
  attachments: [
    { name: 'vet_bill_0110.pdf', type: 'document', url: '#' },
    { name: 'max_leg_swelling.jpg', type: 'image', url: '#' },
    { name: 'chat_history.png', type: 'image', url: '#' }
  ],
  
  adminNotes: [
    { author: 'Admin Dave', text: 'Reviewed initial submission. Attached vet bill matches the timeline. Need to contact the sitter for their statement.', timestamp: '2025-01-10T15:00:00Z' }
  ]
};

const getPriorityStyle = (priority: Priority) => {
  switch (priority) {
    case 'Critical': return { bg: 'rgba(239, 68, 68, 0.15)', color: '#ef4444' };
    case 'High':     return { bg: 'rgba(249, 115, 22, 0.15)', color: '#f97316' };
    case 'Medium':   return { bg: 'rgba(234, 179, 8, 0.15)', color: '#eab308' };
    case 'Low':      return { bg: 'rgba(148, 163, 184, 0.15)', color: '#64748b' };
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

export const ComplaintDetails: React.FC = () => {
  // const { ticketId } = useParams();
  const navigate = useNavigate();
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(false);
  const [newNote, setNewNote] = useState('');
  
  // In a real app, fetch based on ticketId
  const ticket = mockComplaintDetail;
  const prioStyle = getPriorityStyle(ticket.priority);
  const statStyle = getStatusStyle(ticket.status);
  const StatIcon = statStyle.icon;

  const bentoCardStyle = {
    background: 'rgba(255, 255, 255, 0.85)',
    backdropFilter: 'blur(20px)',
    borderRadius: '24px',
    border: '1px solid rgba(255, 255, 255, 0.5)',
    boxShadow: '0 10px 40px rgba(0, 0, 0, 0.04)',
    padding: '32px',
    display: 'flex',
    flexDirection: 'column' as const,
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
          {/* {isSidebarExpanded ? <ChevronLeft size={16} /> : <ChevronRight size={16} />} */}
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
          
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '32px' }}>
            <button 
              onClick={() => navigate('/admin/complaints')} 
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
              <ChevronLeft size={16} /> Back to Complaints
            </button>
            <div style={{ display: 'flex', gap: '12px' }}>
               <button className="btn btn-outline" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><RefreshCw size={16} /> Mark In Review</button>
               <button className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'var(--danger)', borderColor: 'var(--danger)' }}><ShieldAlert size={16} /> Escalate</button>
               <button className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><CheckCircle size={16} /> Resolve Ticket</button>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)', gap: '24px' }}>
            
            {/* Header / Ticket Info (Span 12) */}
            <div style={{ ...bentoCardStyle, gridColumn: 'span 12', padding: '40px', background: 'linear-gradient(135deg, rgba(255,255,255,0.9), rgba(255,255,255,0.6))' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '16px' }}>
                    <h1 style={{ margin: 0, fontSize: '2.5rem', fontWeight: '800', color: 'var(--text-heading)', letterSpacing: '-0.5px' }}>
                      Ticket {ticket.id}
                    </h1>
                    <span style={{ display: 'inline-flex', padding: '6px 16px', borderRadius: '30px', fontSize: '0.9rem', fontWeight: '800', background: prioStyle.bg, color: prioStyle.color }}>
                      {ticket.priority} Priority
                    </span>
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '6px 16px', borderRadius: '30px', fontSize: '0.9rem', fontWeight: '800', background: statStyle.bg, color: statStyle.color }}>
                      <StatIcon size={16} /> {ticket.status}
                    </span>
                  </div>
                  <h2 style={{ margin: '0 0 8px 0', fontSize: '1.4rem', fontWeight: '700', color: 'var(--text-heading)' }}>
                    {ticket.type}
                  </h2>
                  <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: '1rem', fontWeight: '600' }}>
                    Submitted on {new Date(ticket.createdAt).toLocaleString()}
                  </p>
                </div>
              </div>
              <div style={{ marginTop: '32px', padding: '24px', background: 'rgba(0,0,0,0.02)', borderRadius: '16px', border: '1px solid rgba(0,0,0,0.05)' }}>
                <h3 style={{ margin: '0 0 12px 0', fontSize: '1.1rem', fontWeight: '800', color: 'var(--text-heading)' }}>Description</h3>
                <p style={{ margin: 0, fontSize: '1.05rem', lineHeight: '1.6', color: 'var(--text-heading)', fontWeight: '500' }}>
                  "{ticket.description}"
                </p>
              </div>
            </div>

            {/* Left Column (Reporter, Against, Booking, Attachments) */}
            <div style={{ gridColumn: 'span 7', display: 'flex', flexDirection: 'column', gap: '24px' }}>
              
              <div style={{ display: 'flex', gap: '24px' }}>
                {/* Reporter */}
                <div style={{ ...bentoCardStyle, flex: 1 }}>
                  <h3 style={{ fontSize: '1rem', fontWeight: '800', color: 'var(--text-heading)', margin: '0 0 20px 0', opacity: 0.6, textTransform: 'uppercase', letterSpacing: '1px' }}>
                    Reporter
                  </h3>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '20px' }}>
                    <div style={{ width: '50px', height: '50px', borderRadius: '16px', background: 'var(--primary-light)', color: 'var(--primary)', display: 'grid', placeItems: 'center', fontWeight: '800', fontSize: '1.2rem' }}>
                      {ticket.reporter.name.charAt(0)}
                    </div>
                    <div>
                      <div style={{ fontWeight: '800', fontSize: '1.2rem', color: 'var(--text-heading)' }}>{ticket.reporter.name}</div>
                      <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: '700' }}>{ticket.reporter.role}</div>
                    </div>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', color: 'var(--text-muted)', fontWeight: '600', fontSize: '0.95rem' }}><Mail size={16} /> {ticket.reporter.email}</div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', color: 'var(--text-muted)', fontWeight: '600', fontSize: '0.95rem' }}><Phone size={16} /> {ticket.reporter.phone}</div>
                  </div>
                  <button className="btn btn-outline" style={{ marginTop: '24px', width: '100%', display: 'flex', justifyContent: 'center', gap: '8px' }}><MessageCircle size={16} /> Contact {ticket.reporter.role}</button>
                </div>

                {/* Reported Against */}
                <div style={{ ...bentoCardStyle, flex: 1 }}>
                  <h3 style={{ fontSize: '1rem', fontWeight: '800', color: 'var(--text-heading)', margin: '0 0 20px 0', opacity: 0.6, textTransform: 'uppercase', letterSpacing: '1px' }}>
                    Reported Against
                  </h3>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '20px' }}>
                    <div style={{ width: '50px', height: '50px', borderRadius: '16px', background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', display: 'grid', placeItems: 'center', fontWeight: '800', fontSize: '1.2rem' }}>
                      {ticket.reportedAgainst.name.charAt(0)}
                    </div>
                    <div>
                      <div style={{ fontWeight: '800', fontSize: '1.2rem', color: 'var(--text-heading)' }}>{ticket.reportedAgainst.name}</div>
                      <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: '700' }}>{ticket.reportedAgainst.role}</div>
                    </div>
                  </div>
                  <Link to={`/admin/${ticket.reportedAgainst.role.toLowerCase()}s/${ticket.reportedAgainst.id}`} style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--primary)', fontWeight: '700', textDecoration: 'none', marginBottom: '24px' }}>
                    <ExternalLink size={16} /> View Full Profile
                  </Link>
                  <div style={{ display: 'flex', gap: '12px', marginTop: 'auto' }}>
                    <button className="btn btn-outline" style={{ flex: 1, padding: '12px' }} title="Suspend Sitter"><Ban size={18} style={{ margin: '0 auto' }}/></button>
                    <button className="btn btn-outline" style={{ flex: 1, padding: '12px' }} title="Contact"><MessageCircle size={18} style={{ margin: '0 auto' }}/></button>
                  </div>
                </div>
              </div>

              {/* Booking Info */}
              <div style={{ ...bentoCardStyle }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                  <h3 style={{ fontSize: '1.1rem', fontWeight: '800', color: 'var(--text-heading)', margin: 0 }}>Booking Information</h3>
                  <span style={{ padding: '6px 12px', borderRadius: '20px', background: 'rgba(0,0,0,0.05)', fontSize: '0.85rem', fontWeight: '800', color: 'var(--text-heading)' }}>{ticket.booking.id}</span>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                  <div>
                    <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: '700', marginBottom: '4px' }}>Pet Name</div>
                    <div style={{ fontSize: '1.05rem', fontWeight: '700', color: 'var(--text-heading)' }}>{ticket.booking.petName}</div>
                  </div>
                  <div>
                    <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: '700', marginBottom: '4px' }}>Status</div>
                    <div style={{ fontSize: '1.05rem', fontWeight: '700', color: 'var(--text-heading)' }}>{ticket.booking.status}</div>
                  </div>
                  <div style={{ gridColumn: 'span 2' }}>
                    <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: '700', marginBottom: '4px' }}>Dates</div>
                    <div style={{ fontSize: '1.05rem', fontWeight: '700', color: 'var(--text-heading)', display: 'flex', alignItems: 'center', gap: '8px' }}><Calendar size={16} color="var(--primary)" /> {ticket.booking.dates}</div>
                  </div>
                  <div style={{ gridColumn: 'span 2', padding: '16px', background: 'rgba(245, 158, 11, 0.05)', borderRadius: '12px', border: '1px dashed rgba(245, 158, 11, 0.3)' }}>
                    <div style={{ fontSize: '0.85rem', color: '#d97706', fontWeight: '800', marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '6px' }}><AlertTriangle size={14} /> Special Notes</div>
                    <div style={{ fontSize: '0.95rem', fontWeight: '600', color: 'var(--text-heading)' }}>{ticket.booking.notes}</div>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '12px', marginTop: '24px' }}>
                  <button className="btn btn-outline" style={{ flex: 1, borderColor: '#10b981', color: '#10b981' }}>Approve Refund</button>
                  <button className="btn btn-outline" style={{ flex: 1, borderColor: '#ef4444', color: '#ef4444' }}>Reject Refund</button>
                </div>
              </div>

              {/* Attachments */}
              <div style={{ ...bentoCardStyle }}>
                <h3 style={{ fontSize: '1.1rem', fontWeight: '800', color: 'var(--text-heading)', margin: '0 0 24px 0' }}>Attachments</h3>
                <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
                  {ticket.attachments.map((file, idx) => (
                    <div key={idx} style={{ 
                      display: 'flex', alignItems: 'center', gap: '12px', padding: '16px', 
                      border: '1px solid rgba(0,0,0,0.1)', borderRadius: '16px', cursor: 'pointer',
                      transition: 'all 0.2s'
                    }}
                    onMouseOver={e => e.currentTarget.style.borderColor = 'var(--primary)'}
                    onMouseOut={e => e.currentTarget.style.borderColor = 'rgba(0,0,0,0.1)'}
                    >
                      <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'var(--primary-light)', color: 'var(--primary)', display: 'grid', placeItems: 'center' }}>
                        {file.type === 'image' ? <ImageIcon size={20} /> : <FileText size={20} />}
                      </div>
                      <div>
                        <div style={{ fontWeight: '700', fontSize: '0.95rem', color: 'var(--text-heading)' }}>{file.name}</div>
                        <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: '600', textTransform: 'capitalize' }}>{file.type}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>

            {/* Right Column (Internal Notes & Log) */}
            <div style={{ gridColumn: 'span 5', display: 'flex', flexDirection: 'column' }}>
              <div style={{ ...bentoCardStyle, flex: 1, background: 'linear-gradient(180deg, rgba(255,255,255,0.9), rgba(248,250,252,0.9))' }}>
                <h3 style={{ fontSize: '1.2rem', fontWeight: '800', color: 'var(--text-heading)', margin: '0 0 24px 0', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <ShieldAlert size={20} color="var(--primary)" /> Internal Investigation
                </h3>
                
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '20px', overflowY: 'auto', paddingRight: '8px', marginBottom: '24px' }}>
                  {ticket.adminNotes.map((note, idx) => (
                    <div key={idx} style={{ background: 'white', padding: '20px', borderRadius: '16px', boxShadow: '0 4px 12px rgba(0,0,0,0.02)', border: '1px solid rgba(0,0,0,0.03)' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                        <span style={{ fontWeight: '800', fontSize: '0.95rem', color: 'var(--text-heading)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <div style={{ width: '24px', height: '24px', borderRadius: '50%', background: 'var(--primary)', color: 'white', display: 'grid', placeItems: 'center', fontSize: '0.7rem' }}>
                            {note.author.charAt(0)}
                          </div>
                          {note.author}
                        </span>
                        <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: '600' }}>
                          {new Date(note.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                        </span>
                      </div>
                      <p style={{ margin: 0, fontSize: '0.95rem', color: 'var(--text-heading)', lineHeight: '1.5', fontWeight: '500' }}>
                        {note.text}
                      </p>
                    </div>
                  ))}
                </div>

                <div style={{ position: 'relative' }}>
                  <textarea 
                    value={newNote}
                    onChange={(e) => setNewNote(e.target.value)}
                    placeholder="Add a private internal note..."
                    style={{ 
                      width: '100%', height: '120px', padding: '16px', borderRadius: '16px', 
                      border: '1px solid rgba(0,0,0,0.1)', background: 'white', resize: 'none',
                      fontSize: '0.95rem', fontWeight: '500', outline: 'none', fontFamily: 'inherit',
                      boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.02)', transition: 'all 0.2s'
                    }}
                    onFocus={e => e.currentTarget.style.borderColor = 'var(--primary)'}
                    onBlur={e => e.currentTarget.style.borderColor = 'rgba(0,0,0,0.1)'}
                  />
                  <button 
                    style={{ 
                      position: 'absolute', right: '12px', bottom: '16px', background: 'var(--primary)', 
                      color: 'white', border: 'none', borderRadius: '12px', padding: '10px 20px', 
                      display: 'flex', alignItems: 'center', gap: '8px', fontWeight: '700', cursor: 'pointer',
                      boxShadow: '0 4px 12px rgba(13, 148, 136, 0.3)', transition: 'all 0.2s'
                    }}
                    onMouseOver={e => e.currentTarget.style.transform = 'translateY(-2px)'}
                    onMouseOut={e => e.currentTarget.style.transform = 'translateY(0)'}
                  >
                    <Send size={16} /> Save Note
                  </button>
                </div>
              </div>
            </div>

          </div>
        </div>
      </main>
    </div>
  );
};
