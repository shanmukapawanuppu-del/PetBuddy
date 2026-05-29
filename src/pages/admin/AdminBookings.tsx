import React, { useState, useMemo, useEffect } from "react";
import { Navigate } from "react-router-dom";
import { Search, Filter, CalendarDays, CheckCircle, Clock, XCircle, Upload } from "lucide-react";
import { useAdminAuth } from "../../components/admin/AdminAuthContext";
import PremiumSidebar from "../../components/admin/PremiumSidebar";
import PremiumSelect from "../../components/admin/PremiumSelect";
import "../../components/admin/PremiumTable.css";

interface Booking {
  id: string;
  owner: { name: string; email: string };
  sitter: { name: string; email: string };
  startDate: string; // ISO date
  endDate: string;
  status: "Pending" | "Accepted" | "In Progress" | "Completed" | "Cancelled";
}

const mockBookings: Booking[] = Array.from({ length: 45 }).map((_, i) => {
  const statuses: Booking["status"][] = ["Pending", "Accepted", "In Progress", "Completed", "Cancelled"];
  return {
    id: `B${String(i + 1).padStart(3, '0')}`,
    owner: { name: `Pet Owner ${i + 1}`, email: `owner${i + 1}@example.com` },
    sitter: { name: `Pet Sitter ${i + 1}`, email: `sitter${i + 1}@example.com` },
    startDate: `2025-08-${String((i % 28) + 1).padStart(2, '0')}`,
    endDate: `2025-08-${String((i % 28) + 5).padStart(2, '0')}`,
    status: statuses[i % statuses.length],
  };
});

const statusOptions = ["All", "Pending", "Accepted", "In Progress", "Completed", "Cancelled"];

const AdminBookings: React.FC = () => {
  const { isAuthenticated } = useAdminAuth();
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  useEffect(() => {
    const timer = setTimeout(() => {
      setBookings(mockBookings);
      setIsLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => { setCurrentPage(1); }, [search, filterStatus]);

  const filtered = useMemo(() => {
    return bookings.filter((b) => {
      const matchesSearch =
        b.id.toLowerCase().includes(search.toLowerCase()) ||
        b.owner.name.toLowerCase().includes(search.toLowerCase()) ||
        b.sitter.name.toLowerCase().includes(search.toLowerCase());
      const matchesStatus = filterStatus === "All" || b.status === filterStatus;
      return matchesSearch && matchesStatus;
    });
  }, [bookings, search, filterStatus]);

  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const paginatedData = filtered.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const stats = useMemo(() => {
    return {
      total: bookings.length,
      pending: bookings.filter(b => b.status === 'Pending').length,
      completed: bookings.filter(b => b.status === 'Completed').length,
      cancelled: bookings.filter(b => b.status === 'Cancelled').length,
    };
  }, [bookings]);

  const handleExportCSV = () => {
    if (filtered.length === 0) return alert("No data to export");
    const htmlTable = `
      <html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40">
      <head><meta charset="utf-8" /></head>
      <body>
        <table>
          <tr><th>Booking ID</th><th>Owner</th><th>Sitter</th><th>Duration</th><th>Status</th></tr>
          ${filtered.map(b => `<tr><td>${b.id}</td><td>${b.owner.name}</td><td>${b.sitter.name}</td><td>${b.startDate} to ${b.endDate}</td><td>${b.status}</td></tr>`).join("")}
        </table>
      </body>
      </html>
    `;
    const blob = new Blob([htmlTable], { type: "application/vnd.ms-excel" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `PetBuddy_Bookings_${new Date().toISOString().split('T')[0]}.xls`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  if (!isAuthenticated) return <Navigate to="/admin/login" replace />;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Pending': return { bg: 'rgba(245, 158, 11, 0.15)', color: '#d97706', border: 'rgba(245, 158, 11, 0.3)' };
      case 'Accepted': return { bg: 'rgba(56, 189, 248, 0.15)', color: '#0284c7', border: 'rgba(56, 189, 248, 0.3)' };
      case 'In Progress': return { bg: 'rgba(99, 102, 241, 0.15)', color: '#4f46e5', border: 'rgba(99, 102, 241, 0.3)' };
      case 'Completed': return { bg: 'rgba(16, 185, 129, 0.15)', color: '#059669', border: 'rgba(16, 185, 129, 0.3)' };
      case 'Cancelled': return { bg: 'rgba(239, 68, 68, 0.15)', color: '#dc2626', border: 'rgba(239, 68, 68, 0.3)' };
      default: return { bg: 'rgba(148, 163, 184, 0.15)', color: '#475569', border: 'rgba(148, 163, 184, 0.3)' };
    }
  };

  return (
    <div className="premium-dashboard">
      <PremiumSidebar activeId="bookings" />
      <main className="dashboard-main">
        <div className="dashboard-content">
          
          {/* Header Area */}
          <header className="page-header">
            <div>
              <h1 className="page-title">Bookings Overview</h1>
              <p className="page-subtitle">Manage and track all pet sitting appointments</p>
            </div>
            <button onClick={handleExportCSV} className="export-btn">
              <Upload size={18} /> Export Data
            </button>
          </header>

          {/* Stats Cards */}
          <div className="stats-grid">
            <div className="stat-card" style={{ background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)', color: 'white' }}>
              <div className="stat-icon"><CalendarDays size={24} color="#38bdf8" /></div>
              <div className="stat-info">
                <span className="stat-value">{stats.total}</span>
                <span className="stat-label">Total Bookings</span>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon" style={{ background: 'rgba(245,158,11,0.1)' }}><Clock size={24} color="#d97706" /></div>
              <div className="stat-info">
                <span className="stat-value" style={{ color: '#0f172a' }}>{stats.pending}</span>
                <span className="stat-label">Pending</span>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon" style={{ background: 'rgba(16,185,129,0.1)' }}><CheckCircle size={24} color="#059669" /></div>
              <div className="stat-info">
                <span className="stat-value" style={{ color: '#0f172a' }}>{stats.completed}</span>
                <span className="stat-label">Completed</span>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon" style={{ background: 'rgba(239,68,68,0.1)' }}><XCircle size={24} color="#dc2626" /></div>
              <div className="stat-info">
                <span className="stat-value" style={{ color: '#0f172a' }}>{stats.cancelled}</span>
                <span className="stat-label">Cancelled</span>
              </div>
            </div>
          </div>

          {/* Main Panel */}
          <div className="glass-panel">
            {/* Controls */}
            <div className="panel-controls">
              <div className="filter-group">
                <PremiumSelect 
                  options={statusOptions.map(opt => ({ value: opt, label: opt === 'All' ? 'All Statuses' : opt }))}
                  value={filterStatus}
                  onChange={setFilterStatus}
                  icon={<Filter size={18} />}
                  customLabel="Filter"
                  hideChevron
                />
              </div>
              <div className="search-wrapper">
                <Search size={18} className="input-icon" />
                <input 
                  type="text" 
                  placeholder="Search by ID, Owner, or Sitter..." 
                  value={search} 
                  onChange={(e) => setSearch(e.target.value)} 
                  className="modern-input"
                />
              </div>
            </div>

            {/* Table */}
            <div className="table-wrapper">
              <table className="modern-table">
                <thead>
                  <tr>
                    <th>Booking ID</th>
                    <th>Owner Details</th>
                    <th>Sitter Details</th>
                    <th>Timeline</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {isLoading ? (
                    <tr><td colSpan={5} className="loading-cell"><div className="loader"></div></td></tr>
                  ) : filtered.length === 0 ? (
                    <tr><td colSpan={5} className="empty-cell">No bookings match your criteria.</td></tr>
                  ) : (
                    paginatedData.map((b) => {
                      const statusStyle = getStatusColor(b.status);
                      return (
                        <tr key={b.id} className="table-row">
                          <td><span className="booking-id-badge">{b.id}</span></td>
                          <td>
                            <div className="user-block">
                              <div className="user-avatar-small bg-blue">{b.owner.name.charAt(0)}</div>
                              <div>
                                <div className="user-name">{b.owner.name}</div>
                                <div className="user-email">{b.owner.email}</div>
                              </div>
                            </div>
                          </td>
                          <td>
                            <div className="user-block">
                              <div className="user-avatar-small bg-purple">{b.sitter.name.charAt(0)}</div>
                              <div>
                                <div className="user-name">{b.sitter.name}</div>
                                <div className="user-email">{b.sitter.email}</div>
                              </div>
                            </div>
                          </td>
                          <td>
                            <div className="timeline-block">
                              <span className="date-text">{b.startDate} <span style={{color: '#94a3b8', margin: '0 4px'}}>to</span> {b.endDate}</span>
                            </div>
                          </td>
                          <td>
                            <span className="modern-status-pill" style={{ backgroundColor: statusStyle.bg, color: statusStyle.color, border: `1px solid ${statusStyle.border}` }}>
                              {b.status}
                            </span>
                          </td>
                        </tr>
                      )
                    })
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {!isLoading && totalPages > 1 && (
              <div className="pagination-wrapper">
                <div className="pagination-info">
                  Showing <b>{(currentPage - 1) * itemsPerPage + 1}</b> to <b>{Math.min(currentPage * itemsPerPage, filtered.length)}</b> of <b>{filtered.length}</b> entries
                </div>
                <div className="pagination-controls">
                  <button onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1} className="page-btn">Previous</button>
                  <button onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages} className="page-btn">Next</button>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      <style>{`
        .premium-dashboard {
          display: flex;
          height: 100vh;
          font-family: 'Inter', system-ui, sans-serif;
          overflow: hidden;
        }

        /* --- MAIN CONTENT --- */
        .dashboard-main {
          flex: 1;
          overflow-y: auto;
        }

        .dashboard-content {
          max-width: 1400px;
          margin: 0 auto;
          padding: 40px;
        }

        /* Header */
        .page-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-end;
          margin-bottom: 32px;
        }

        .page-title {
          font-size: 2.2rem;
          font-weight: 800;
          color: #0f172a;
          margin: 0 0 8px 0;
          letter-spacing: -0.5px;
        }

        .page-subtitle {
          color: #64748b;
          font-size: 1.1rem;
          margin: 0;
        }

        .export-btn {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 12px 24px;
          border-radius: 99px;
          background: #0f172a;
          color: white;
          font-weight: 600;
          border: none;
          cursor: pointer;
          transition: all 0.2s;
          box-shadow: 0 4px 12px rgba(15, 23, 42, 0.15);
        }
        .export-btn:hover { transform: translateY(-2px); box-shadow: 0 6px 16px rgba(15, 23, 42, 0.2); }

        /* Stats Grid */
        .stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
          gap: 24px;
          margin-bottom: 32px;
        }

        .stat-card {
          background: white;
          border-radius: 20px;
          padding: 24px;
          display: flex;
          align-items: center;
          gap: 20px;
          box-shadow: 0 4px 20px rgba(0,0,0,0.03);
          border: 1px solid rgba(0,0,0,0.02);
          transition: transform 0.2s;
        }
        .stat-card:hover { transform: translateY(-4px); }

        .stat-icon {
          width: 56px;
          height: 56px;
          border-radius: 16px;
          display: grid;
          place-items: center;
        }

        .stat-info { display: flex; flex-direction: column; }
        .stat-value { font-size: 1.8rem; font-weight: 800; line-height: 1; margin-bottom: 6px; }
        .stat-label { font-size: 0.9rem; font-weight: 600; color: #64748b; text-transform: uppercase; letter-spacing: 0.5px; }


        /* Glass Panel */
        .glass-panel {
          background: rgba(255, 255, 255, 0.9);
          backdrop-filter: blur(10px);
          border-radius: 24px;
          border: 1px solid rgba(255,255,255,0.8);
          box-shadow: 0 10px 40px rgba(15, 23, 42, 0.04);
          overflow: hidden;
          display: flex;
          flex-direction: column;
        }

        .panel-controls {
          padding: 24px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          border-bottom: 1px solid rgba(15, 23, 42, 0.05);
          background: white;
        }

        .select-wrapper, .search-wrapper {
          position: relative;
          display: flex;
          align-items: center;
        }

        .input-icon {
          position: absolute;
          left: 16px;
          pointer-events: none;
          color: #94a3b8;
        }

        .modern-select, .modern-input {
          appearance: none;
          padding: 12px 20px 12px 44px;
          border-radius: 99px;
          border: 1px solid #e2e8f0;
          background: #f8fafc;
          color: #0f172a;
          font-size: 0.95rem;
          font-weight: 500;
          outline: none;
          transition: all 0.2s;
        }
        .modern-select:focus, .modern-input:focus { border-color: #3b82f6; background: white; box-shadow: 0 0 0 3px rgba(59,130,246,0.1); }
        
        .modern-select { min-width: 160px; cursor: pointer; font-weight: 600; }
        .modern-input { min-width: 320px; }

        /* Table */
        .table-wrapper {
          overflow-x: auto;
        }

        .modern-table {
          width: 100%;
          border-collapse: collapse;
          text-align: left;
        }

        .modern-table th {
          padding: 20px 24px;
          font-size: 0.8rem;
          font-weight: 700;
          color: #64748b;
          text-transform: uppercase;
          letter-spacing: 1px;
          background: #f8fafc;
          border-bottom: 1px solid rgba(15,23,42,0.05);
        }

        .modern-table td {
          padding: 20px 24px;
          border-bottom: 1px solid rgba(15,23,42,0.03);
          vertical-align: middle;
        }

        .table-row { transition: background 0.2s; animation: fadeIn 0.4s ease-out forwards; }
        .table-row:hover { background: #f8fafc; }

        .booking-id-badge {
          background: #f1f5f9;
          color: #334155;
          padding: 6px 12px;
          border-radius: 8px;
          font-weight: 700;
          font-size: 0.9rem;
          font-family: monospace;
          border: 1px solid #e2e8f0;
        }

        .user-block {
          display: flex;
          align-items: center;
          gap: 16px;
        }

        .user-avatar-small {
          width: 40px;
          height: 40px;
          border-radius: 12px;
          display: grid;
          place-items: center;
          font-weight: 700;
          font-size: 1.1rem;
          color: white;
        }
        .bg-blue { background: linear-gradient(135deg, #38bdf8, #0284c7); }
        .bg-purple { background: linear-gradient(135deg, #a78bfa, #7c3aed); }

        .user-name { font-weight: 700; color: #0f172a; font-size: 0.95rem; margin-bottom: 2px; }
        .user-email { color: #64748b; font-size: 0.85rem; }

        .date-text { font-weight: 600; color: #334155; font-size: 0.95rem; }

        .modern-status-pill {
          padding: 8px 16px;
          border-radius: 99px;
          font-size: 0.85rem;
          font-weight: 700;
          display: inline-block;
        }

        .pagination-wrapper {
          padding: 24px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          background: white;
          border-top: 1px solid rgba(15,23,42,0.05);
        }

        .pagination-info { color: #64748b; font-size: 0.95rem; }
        .pagination-info b { color: #0f172a; font-weight: 700; }

        .pagination-controls { display: flex; gap: 8px; }
        .page-btn {
          padding: 10px 20px;
          border-radius: 10px;
          border: 1px solid #e2e8f0;
          background: white;
          font-weight: 600;
          color: #334155;
          cursor: pointer;
          transition: all 0.2s;
        }
        .page-btn:hover:not(:disabled) { background: #f1f5f9; border-color: #cbd5e1; }
        .page-btn:disabled { opacity: 0.5; cursor: not-allowed; }

        .loader {
          width: 40px;
          height: 40px;
          border: 4px solid #f1f5f9;
          border-top: 4px solid #3b82f6;
          border-radius: 50%;
          animation: spin 1s linear infinite;
          margin: 40px auto;
        }
        .stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
          gap: 24px;
          margin-bottom: 32px;
        }

        .stat-card {
          background: white;
          border-radius: 20px;
          padding: 24px;
          display: flex;
          align-items: center;
          gap: 20px;
          box-shadow: 0 4px 20px rgba(0,0,0,0.03);
          border: 1px solid rgba(0,0,0,0.02);
          transition: transform 0.2s;
        }
        .stat-card:hover { transform: translateY(-4px); }

        .stat-icon {
          width: 56px;
          height: 56px;
          border-radius: 16px;
          display: grid;
          place-items: center;
        }

        .stat-info { display: flex; flex-direction: column; }
        .stat-value { font-size: 1.8rem; font-weight: 800; line-height: 1; margin-bottom: 6px; }
        .stat-label { font-size: 0.9rem; font-weight: 600; color: #64748b; text-transform: uppercase; letter-spacing: 0.5px; }
      `}</style>
    </div>
  );
};

export default AdminBookings;
