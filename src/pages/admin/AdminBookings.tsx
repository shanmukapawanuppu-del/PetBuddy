import React, { useState, useMemo, useEffect } from "react";
import { Link, Navigate } from "react-router-dom";
import { Search, Filter } from "lucide-react";
import { useAdminAuth } from "../../components/admin/AdminAuthContext";
console.log('AdminBookings component rendered');
// Mock booking data
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

const statusOptions = [
  "All",
  "Pending",
  "Accepted",
  "In Progress",
  "Completed",
  "Cancelled",
];

const AdminBookings: React.FC = () => {
  const { isAuthenticated } = useAdminAuth();
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  useEffect(() => {
    // Simulate API fetch delay
    const timer = setTimeout(() => {
      setBookings(mockBookings);
      setIsLoading(false);
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    setCurrentPage(1);
  }, [search, filterStatus]);
  const filtered = useMemo(() => {
    return bookings.filter((b) => {
      const matchesSearch =
        b.id.toLowerCase().includes(search.toLowerCase()) ||
        b.owner.name.toLowerCase().includes(search.toLowerCase()) ||
        b.owner.email.toLowerCase().includes(search.toLowerCase()) ||
        b.sitter.name.toLowerCase().includes(search.toLowerCase()) ||
        b.sitter.email.toLowerCase().includes(search.toLowerCase());
      const matchesStatus = filterStatus === "All" || b.status === filterStatus;
      return matchesSearch && matchesStatus;
    });
  }, [bookings, search, filterStatus]);

  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const paginatedData = filtered.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const handleExportCSV = () => {
    if (filtered.length === 0) {
      alert("No data to export");
      return;
    }
    
    const htmlTable = `
      <html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40">
      <head>
        <meta charset="utf-8" />
        <style>
          table { border-collapse: collapse; font-family: 'Segoe UI', Arial, sans-serif; }
          th { background-color: #0d9488; color: #ffffff; padding: 14px; font-weight: bold; font-size: 14px; text-transform: uppercase; border: 1px solid #c0d6d4; text-align: left; }
          td { padding: 12px; border: 1px solid #e2e8f0; font-size: 13px; color: #334155; vertical-align: middle; }
          .booking-id { font-weight: bold; color: #0d9488; font-size: 14px; }
          .status-pending { background-color: #ffedd5; color: #c2410c; font-weight: bold; text-align: center; }
          .status-inprogress { background-color: #dbeafe; color: #1d4ed8; font-weight: bold; text-align: center; }
          .status-completed { background-color: #d1fae5; color: #047857; font-weight: bold; text-align: center; }
          .status-cancelled { background-color: #fee2e2; color: #b91c1c; font-weight: bold; text-align: center; }
          .header-title { font-size: 24px; font-weight: bold; color: #0f172a; padding: 20px; border: none; text-align: left; background: #f8fafc; }
        </style>
      </head>
      <body>
        <table>
          <tr><th colspan="5" class="header-title">✨ PetBuddy Premium Bookings Export ✨</th></tr>
          <tr>
            <th>Booking ID</th>
            <th>Owner Details</th>
            <th>Sitter Details</th>
            <th>Duration</th>
            <th>Status</th>
          </tr>
          ${filtered.map(b => {
            const statusClass = "status-" + b.status.replace(/\s+/g, "").toLowerCase();
            return `
            <tr>
              <td class="booking-id">${b.id}</td>
              <td><b>${b.owner.name}</b><br/>${b.owner.email}</td>
              <td><b>${b.sitter.name}</b><br/>${b.sitter.email}</td>
              <td>${b.startDate} <br/><span style="color:#64748b">to</span> ${b.endDate}</td>
              <td class="${statusClass}">${b.status}</td>
            </tr>
            `;
          }).join("")}
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

  if (!isAuthenticated) {
    // If not authenticated, redirect to login page
    return <Navigate to="/admin/login" replace />;
  }

  // Render Admin Bookings page
  return (
    <section className="admin-dashboard page-content admin-bookings-page">
      <div>
        <div className="admin-page-shell">
          <header className="admin-page-topbar">
            <div className="admin-navbar-shell">
              <nav className="admin-global-links">
                <Link to="/admin/dashboard" className="admin-global-link">
                  Dashboard
                </Link>
                <Link to="/admin/bookings" className="admin-global-link active">
                  Bookings
                </Link>
                {/* <Link to="/home" className="admin-global-link">Website</Link> */}
              </nav>
            </div>
            <div className="admin-top-actions">
              <button 
                onClick={handleExportCSV}
                style={{ padding: '10px 24px', borderRadius: '999px', background: 'var(--primary, #0d9488)', color: 'white', border: 'none', fontWeight: '700', cursor: 'pointer', boxShadow: '0 4px 12px rgba(13, 148, 136, 0.2)' }}
              >
                Export Excel
              </button>
            </div>
          </header>



          <section className="admin-bookings-panel card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
              
              <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                <Filter size={16} color="#64748b" style={{ position: 'absolute', left: '16px', pointerEvents: 'none' }} />
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  style={{
                    appearance: 'none',
                    padding: '10px 36px 10px 42px',
                    borderRadius: '999px',
                    border: '1px solid #e2e8f0',
                    background: '#ffffff',
                    color: '#334155',
                    fontSize: '0.9rem',
                    fontWeight: '700',
                    cursor: 'pointer',
                    minWidth: '130px',
                    outline: 'none',
                    boxShadow: '0 2px 4px rgba(15, 23, 42, 0.02)'
                  }}
                >
                  {statusOptions.map((opt) => (
                    <option key={opt} value={opt}>
                      {opt === 'All' ? 'Filter' : opt}
                    </option>
                  ))}
                </select>
                <div style={{ position: 'absolute', right: '16px', pointerEvents: 'none', fontSize: '0.6rem', color: '#64748b' }}>▼</div>
              </div>

              <div style={{ position: 'relative', minWidth: '320px', flex: '1', maxWidth: '400px' }}>
                <Search size={16} color="#64748b" style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)' }} />
                <input
                  type="text"
                  placeholder="Search with Booking Id..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '10px 16px 10px 42px',
                    borderRadius: '999px',
                    border: '1px solid #e2e8f0',
                    background: '#ffffff',
                    color: '#334155',
                    fontSize: '0.95rem',
                    outline: 'none',
                    boxShadow: '0 2px 4px rgba(15, 23, 42, 0.02)',
                    transition: 'border-color 0.2s'
                  }}
                  onFocus={(e) => e.target.style.borderColor = '#0d9488'}
                  onBlur={(e) => e.target.style.borderColor = '#e2e8f0'}
                />
              </div>

            </div>

            <div className="bookings-table-container">
              <div className="bookings-table-header">
                <div>BOOKING ID</div>
                <div>OWNER</div>
                <div>SITTER</div>
                <div>DURATION</div>
                <div>STATUS</div>
              </div>
              
              <div className="bookings-table-body">
                {isLoading ? (
                  <div style={{ padding: '80px', textAlign: 'center', color: '#64748b' }}>
                    <div className="spinner-animation"></div>
                    <div style={{ fontWeight: '600' }}>Loading bookings data...</div>
                  </div>
                ) : filtered.length === 0 ? (
                  <div className="empty-row">
                    No bookings found. Try a different search or filter.
                  </div>
                ) : (
                  paginatedData.map((b) => (
                    <div key={b.id} className="bookings-table-row">
                      <div className="booking-col-id">
                        <div className="entity-name" style={{ color: 'var(--primary)', fontWeight: '800' }}>{b.id}</div>
                      </div>
                      <div className="booking-col-user">
                        <div>
                          <div className="entity-name">{b.owner.name}</div>
                          <div className="entity-subtitle">{b.owner.email}</div>
                        </div>
                      </div>
                      <div className="booking-col-user">
                        <div>
                          <div className="entity-name">{b.sitter.name}</div>
                          <div className="entity-subtitle">{b.sitter.email}</div>
                        </div>
                      </div>
                      <div className="booking-col-dates">
                        <div className="duration-dates">{b.startDate} → {b.endDate}</div>
                        <div className="duration-days-badge">{Math.floor((new Date(b.endDate).getTime() - new Date(b.startDate).getTime()) / (1000 * 60 * 60 * 24))} days</div>
                      </div>
                      <div className="booking-col-status">
                         <span className={`status-pill status-${b.status.replace(/\s+/g, "").toLowerCase()}`}>
                           {b.status}
                         </span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {!isLoading && totalPages > 1 && (
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px 24px', borderTop: '1px solid rgba(15, 23, 42, 0.08)' }}>
                <div style={{ color: '#64748b', fontSize: '0.9rem' }}>
                  Showing <span style={{ fontWeight: 'bold', color: '#0f172a' }}>{(currentPage - 1) * itemsPerPage + 1}</span> to <span style={{ fontWeight: 'bold', color: '#0f172a' }}>{Math.min(currentPage * itemsPerPage, filtered.length)}</span> of <span style={{ fontWeight: 'bold', color: '#0f172a' }}>{filtered.length}</span> results
                </div>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button 
                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                    className="pagination-btn"
                  >
                    Previous
                  </button>
                  <button 
                    onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                    disabled={currentPage === totalPages}
                    className="pagination-btn"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}

          </section>
        </div>
      </div>

      <style>{`
        .pagination-btn {
          padding: 8px 18px;
          border-radius: 999px;
          border: 1px solid #e2e8f0;
          background: #ffffff;
          color: #334155;
          cursor: pointer;
          font-weight: 700;
          font-size: 0.85rem;
          transition: all 0.2s;
        }
        .pagination-btn:hover:not(:disabled) {
          background: #f8fafc;
          color: var(--primary, #0d9488);
          border-color: #cbd5e1;
        }
        .pagination-btn:disabled {
          background: #f8fafc;
          color: #94a3b8;
          cursor: not-allowed;
          opacity: 0.6;
        }

        .spinner-animation {
          display: inline-block;
          width: 36px;
          height: 36px;
          border: 3px solid #e2e8f0;
          border-top-color: var(--primary, #0d9488);
          border-radius: 50%;
          animation: spin 1s linear infinite;
          margin-bottom: 16px;
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        .admin-bookings-page {
          background: #f8fafc;
          padding: 40px 24px;
          min-height: 100vh;
        }

        .admin-page-shell {
          max-width: 1280px;
          margin: 0 auto;
          background: #ffffff;
          border-radius: 20px;
          padding: 24px 20px;
          box-shadow: 0 10px 40px -10px rgba(15, 23, 42, 0.05);
          border: 1px solid rgba(15, 23, 42, 0.04);
        }

        .admin-page-topbar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 24px;
          margin-bottom: 32px;
          flex-wrap: wrap;
        }

        .admin-navbar-shell {
          display: flex;
          flex-direction: column;
          gap: 12px;
          min-width: 0;
        }

        .admin-brand {
          font-size: 0.85rem;
          letter-spacing: 0.15em;
          text-transform: uppercase;
          color: var(--primary, #0d9488);
          font-weight: 800;
        }

        .admin-global-links {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
          align-items: center;
        }

        .admin-global-link {
          padding: 10px 20px;
          border-radius: 999px;
          border: 1px solid transparent;
          background: rgba(15, 23, 42, 0.03);
          color: var(--text-main, #334155);
          font-weight: 700;
          font-size: 0.95rem;
          transition: var(--transition, all 0.2s);
          text-decoration: none;
        }

        .admin-global-link:hover {
          background: rgba(15, 23, 42, 0.06);
          transform: translateY(-1px);
        }

        .admin-global-link.active {
          background: var(--primary, #0d9488);
          color: #ffffff;
          border-color: transparent;
        }

        .admin-page-topbar h2 {
          font-size: 2.2rem;
          font-weight: 800;
          color: var(--text-heading, #0f172a);
          margin: 0 0 24px 0;
          letter-spacing: -0.02em;
        }

        .admin-top-actions {
          display: flex;
          flex-wrap: wrap;
          gap: 12px;
          align-items: center;
        }

        .admin-bookings-panel {
          padding: 0;
          background: transparent;
          border: none;
          box-shadow: none;
          border-radius: 0;
        }



        .bookings-table-container {
          background: #ffffff;
          border-radius: 16px;
          border: 1px solid rgba(15, 23, 42, 0.08);
          overflow: hidden;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.03);
        }

        /* ── TABLE LAYOUT: header & rows share identical columns ── */
        .bookings-table-header,
        .bookings-table-row {
          display: grid;
          grid-template-columns: 100px 1fr 1fr 200px 120px;
          align-items: center;
          padding: 0 16px;
          gap: 0;
        }

        .bookings-table-header {
          height: 52px;
          background: rgba(15, 23, 42, 0.03);
          border-bottom: 1px solid rgba(15, 23, 42, 0.08);
          color: #0f172a;
          font-weight: 800;
          font-size: 0.78rem;
          text-transform: uppercase;
          letter-spacing: 0.07em;
        }

        .bookings-table-header > div {
          display: flex;
          align-items: center;
          height: 100%;
        }

        .bookings-table-row {
          min-height: 72px;
          padding-top: 12px;
          padding-bottom: 12px;
          border-bottom: 1px solid rgba(15, 23, 42, 0.05);
          transition: background 0.18s;
        }

        .bookings-table-row:last-child { border-bottom: none; }
        .bookings-table-row:hover { background: rgba(13,148,136,0.03); }

        /* column‑level alignment */
        .booking-col-id   { display: flex; align-items: center; }
        .booking-col-user { display: flex; align-items: center; }
        .booking-col-dates {
          display: flex;
          flex-direction: column;
          justify-content: center;
          gap: 4px;
          white-space: normal;
          overflow: visible;
        }
        .booking-col-status {
          display: flex;
          align-items: center;
          justify-content: center;
        }

        /* Duration cell */
        .duration-dates {
          font-size: 0.85rem;
          font-weight: 600;
          color: #334155;
          white-space: nowrap;
        }
        .duration-days-badge {
          display: inline-flex;
          align-items: center;
          background: rgba(13,148,136,0.10);
          color: #0d9488;
          font-weight: 700;
          font-size: 0.78rem;
          padding: 2px 10px;
          border-radius: 999px;
          width: fit-content;
        }

        .user-info-wrapper {
          display: flex;
          align-items: center;
          gap: 12px;
        }
        
        .user-avatar {
          width: 38px;
          height: 38px;
          border-radius: 12px;
          display: grid;
          place-items: center;
          font-weight: 800;
          font-size: 1.1rem;
          flex-shrink: 0;
        }

        .entity-name {
          font-weight: 700;
          color: var(--text-heading, #0f172a);
          font-size: 0.95rem;
          margin-bottom: 2px;
        }

        .entity-subtitle {
          color: var(--text-muted, #64748b);
          font-size: 0.85rem;
        }


        .empty-row {
          grid-column: 1 / -1;
          padding: 40px;
          text-align: center;
          color: var(--text-muted, #64748b);
          font-weight: 500;
          background: rgba(15, 23, 42, 0.02);
        }

        .status-pill {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          padding: 8px 16px;
          border-radius: 999px;
          font-weight: 700;
          font-size: 0.85rem;
          min-width: 90px;
          text-align: center;
        }

        .status-pending { background: #ffedd5; color: #c2410c; }
        .status-accepted { background: #e0f2fe; color: #0369a1; }
        .status-inprogress { background: #dbeafe; color: #1d4ed8; }
        .status-completed { background: #d1fae5; color: #047857; }
        .status-cancelled { background: #fee2e2; color: #b91c1c; }



        @media (max-width: 1024px) {
          .bookings-table-container { overflow-x: auto; }
          .bookings-table-header, .bookings-table-row { min-width: 800px; }
          .admin-page-topbar { flex-direction: column; align-items: flex-start; }
          .admin-top-actions { width: 100%; justify-content: flex-start; }
          .admin-global-links { width: 100%; }
        }

        @media (max-width: 700px) {
          .admin-page-shell { padding: 24px; }
        }
      `}</style>
    </section>
  );
};

export default AdminBookings;
