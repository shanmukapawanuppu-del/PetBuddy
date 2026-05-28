import React, { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { Search, XCircle, CheckCircle } from "lucide-react";
import { useAdminAuth } from "../../components/admin/AdminAuthContext";

// Mock booking data
interface Booking {
  id: string;
  owner: { name: string; email: string };
  sitter: { name: string; email: string };
  startDate: string; // ISO date
  endDate: string;
  status: "Pending" | "Accepted" | "In Progress" | "Completed" | "Cancelled";
}

const mockBookings: Booking[] = [
  {
    id: "B001",
    owner: { name: "Alice Johnson", email: "alice@example.com" },
    sitter: { name: "Emma Wilson", email: "emma@example.com" },
    startDate: "2025-08-01",
    endDate: "2025-08-07",
    status: "Pending",
  },
  {
    id: "B002",
    owner: { name: "Bob Smith", email: "bob.smith@example.com" },
    sitter: { name: "Frank Thomas", email: "frank@example.com" },
    startDate: "2025-07-15",
    endDate: "2025-07-20",
    status: "In Progress",
  },
  {
    id: "B003",
    owner: { name: "Carol White", email: "carol@example.com" },
    sitter: { name: "Grace Lee", email: "grace.l@example.com" },
    startDate: "2025-06-10",
    endDate: "2025-06-12",
    status: "Completed",
  },
];

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
  const [bookings, setBookings] = useState<Booking[]>(mockBookings);
  const [modal, setModal] = useState<{
    type: "cancel" | "force";
    booking: Booking | null;
  }>({ type: "cancel", booking: null });
  const [reason, setReason] = useState("");
  const [error, setError] = useState("");

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

  const openModal = (type: "cancel" | "force", booking: Booking) => {
    setModal({ type, booking });
    setReason("");
    setError("");
  };
  const closeModal = () => setModal({ type: "cancel", booking: null });

  const handleConfirm = () => {
    if (reason.trim().length < 10) {
      setError("Reason must be at least 10 characters");
      return;
    }
    if (!modal.booking) return;
    const nextStatus =
      modal.type === "cancel" ? ("Cancelled" as const) : ("Completed" as const);
    const updated: Booking[] = bookings.map((b) => {
      if (b.id !== modal.booking!.id) return b;
      return { ...b, status: nextStatus };
    });
    setBookings(updated);
    closeModal();
    // In a real app you would call an API and send notifications here.
  };

  if (!isAuthenticated) return null;

  return (
    <section className="admin-dashboard page-content admin-bookings-page">
      <div className="container">
        <div className="admin-page-shell">
          <header className="admin-page-topbar">
            <div className="admin-navbar-shell">
              <div className="admin-brand">PetBuddy Admin</div>
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
              <button className="btn btn-primary">Export CSV</button>
            </div>
          </header>

          <div className="admin-bookings-summary-grid">
            <div className="stat-card">
              <span>Total Bookings</span>
              <strong>{bookings.length}</strong>
            </div>
            <div className="stat-card">
              <span>Pending</span>
              <strong>
                {bookings.filter((b) => b.status === "Pending").length}
              </strong>
            </div>
            <div className="stat-card">
              <span>In Progress</span>
              <strong>
                {bookings.filter((b) => b.status === "In Progress").length}
              </strong>
            </div>
            <div className="stat-card">
              <span>Completed</span>
              <strong>
                {bookings.filter((b) => b.status === "Completed").length}
              </strong>
            </div>
          </div>

          <section className="admin-bookings-panel card">
            <div className="admin-bookings-controls">
              <div className="search-field">
                <Search size={18} className="search-icon" />
                <input
                  type="text"
                  placeholder="Search bookings by owner, sitter, or ID..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>

              <div className="filter-block">
                {/* <label htmlFor="status-filter">Status</label> */}
                <select
                  id="status-filter"
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                >
                  {statusOptions.map((opt) => (
                    <option key={opt} value={opt}>
                      {opt}
                    </option>
                  ))}
                </select>
              </div>

              <div className="panel-summary-card">
                <span>Showing</span>
                <strong>{filtered.length}</strong>
              </div>
            </div>

            <div className="bookings-card-grid">
              {filtered.length === 0 ? (
                <div className="empty-row">
                  No bookings found. Try a different search or filter.
                </div>
              ) : (
                filtered.map((b) => (
                  <article key={b.id} className="booking-card card">
                    <div className="booking-card-header">
                      <div>
                        <div className="booking-id">{b.id}</div>
                        <div className="booking-meta">
                          {b.startDate} → {b.endDate}
                        </div>
                      </div>
                      <span
                        className={`status-pill status-${b.status.replace(/\s+/g, "").toLowerCase()}`}
                      >
                        {b.status}
                      </span>
                    </div>

                    <div className="booking-card-body">
                      <div className="booking-detail-block">
                        <p className="booking-detail-label">Owner</p>
                        <div className="entity-name">{b.owner.name}</div>
                        <div className="entity-subtitle">{b.owner.email}</div>
                      </div>
                      <div className="booking-detail-block">
                        <p className="booking-detail-label">Sitter</p>
                        <div className="entity-name">{b.sitter.name}</div>
                        <div className="entity-subtitle">{b.sitter.email}</div>
                      </div>
                    </div>

                    <div className="booking-card-footer">
                      <div className="booking-footer-meta">
                        <span>Duration</span>
                        <strong>
                          {b.startDate} — {b.endDate}
                        </strong>
                      </div>
                      <div className="booking-card-actions">
                        <button
                          onClick={() => openModal("cancel", b)}
                          disabled={
                            b.status === "Completed" || b.status === "Cancelled"
                          }
                          className="action-button cancel-button"
                        >
                          <XCircle size={16} /> Cancel
                        </button>
                        <button
                          onClick={() => openModal("force", b)}
                          disabled={b.status !== "In Progress"}
                          className="action-button complete-button"
                        >
                          <CheckCircle size={16} /> Complete
                        </button>
                      </div>
                    </div>
                  </article>
                ))
              )}
            </div>
          </section>

          {modal.booking && (
            <div className="modal-overlay">
              <div className="modal-card">
                <div className="modal-header">
                  <h3>
                    {modal.type === "cancel"
                      ? "Cancel Booking"
                      : "Force Complete Booking"}
                  </h3>
                  <button className="close-button" onClick={closeModal}>
                    <XCircle size={20} />
                  </button>
                </div>
                <p className="modal-subtitle">Please provide a short reason.</p>
                <textarea
                  rows={4}
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  className="modal-textarea"
                />
                {error && <p className="modal-error">{error}</p>}
                <div className="modal-actions">
                  <button className="btn btn-secondary" onClick={closeModal}>
                    Close
                  </button>
                  <button className="btn btn-primary" onClick={handleConfirm}>
                    Confirm
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <style>{`
        .admin-bookings-page {
          background: #f4f7fb;
          padding: 72px 0 96px;
        }

        .admin-page-shell {
          max-width: 1180px;
          margin: 0 auto;
          background: rgba(255, 255, 255, 0.96);
          border-radius: 40px;
          padding: 36px;
          box-shadow: 0 36px 90px rgba(15, 23, 42, 0.08);
          border: 1px solid rgba(15, 23, 42, 0.06);
        }

        .admin-page-topbar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 24px;
          margin-bottom: 30px;
          flex-wrap: wrap;
        }

        .admin-navbar-shell {
          display: flex;
          flex-direction: column;
          gap: 10px;
          min-width: 0;
        }

        .admin-brand {
          font-size: 0.9rem;
          letter-spacing: 0.24em;
          text-transform: uppercase;
          color: var(--primary);
          font-weight: 800;
        }

        .admin-global-links {
          display: flex;
          flex-wrap: wrap;
          gap: 10px;
          align-items: center;
        }

        .admin-global-link {
          padding: 11px 20px;
          border-radius: 999px;
          border: 1px solid transparent;
          background: rgba(15, 23, 42, 0.04);
          color: var(--text-main);
          font-weight: 700;
          transition: var(--transition);
        }

        .admin-global-link:hover {
          background: rgba(15, 23, 42, 0.08);
          transform: translateY(-1px);
        }

        .admin-global-link.active {
          background: var(--primary);
          color: #ffffff;
          border-color: transparent;
        }

        .admin-page-topbar h1 {
          font-size: clamp(2rem, 2.2vw, 2.6rem);
          margin: 0;
        }

        .admin-page-topbar p {
          margin: 12px 0 0;
          max-width: 620px;
          color: var(--text-muted);
        }

        .admin-top-actions {
          display: flex;
          flex-wrap: wrap;
          gap: 12px;
          align-items: center;
        }

        .admin-secondary-nav {
          display: flex;
          flex-wrap: wrap;
          gap: 10px;
          margin-bottom: 28px;
          padding-bottom: 10px;
          border-bottom: 1px solid rgba(15, 23, 42, 0.08);
        }

        .nav-pill {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          padding: 12px 20px;
          border-radius: 999px;
          font-weight: 700;
          color: var(--text-main);
          background: var(--bg-card);
          border: 1px solid transparent;
          text-decoration: none;
          transition: var(--transition);
        }

        .nav-pill:hover {
          transform: translateY(-1px);
          box-shadow: var(--shadow-sm);
        }

        .nav-pill.active {
          background: var(--primary);
          color: #fff;
          border-color: transparent;
        }

        .nav-pill.disabled {
          opacity: 0.5;
          pointer-events: none;
        }

        .admin-bookings-summary-grid {
          display: grid;
          grid-template-columns: repeat(4, minmax(0, 1fr));
          gap: 18px;
          margin-bottom: 32px;
        }

        .stat-card {
          display: flex;
          flex-direction: column;
          gap: 10px;
          padding: 24px;
          border-radius: 24px;
          background: linear-gradient(180deg, rgba(255, 255, 255, 0.95), rgba(246, 250, 255, 0.95));
          border: 1px solid rgba(15, 23, 42, 0.08);
          box-shadow: 0 14px 35px rgba(15, 23, 42, 0.05);
        }

        .stat-card span {
          color: var(--text-muted);
          font-size: 0.85rem;
          text-transform: uppercase;
          letter-spacing: 0.08em;
          font-weight: 700;
        }

        .stat-card strong {
          font-size: 2rem;
          color: var(--text-heading);
          line-height: 1;
        }

        .admin-bookings-panel {
          padding: 36px;
          border-radius: 32px;
          background: #ffffff;
          border: 1px solid rgba(15, 23, 42, 0.08);
          box-shadow: 0 18px 45px rgba(15, 23, 42, 0.06);
        }

        .admin-bookings-controls {
          display: grid;
          grid-template-columns: minmax(280px, 1.6fr) minmax(220px, 1fr) minmax(180px, 0.8fr);
          gap: 18px;
          align-items: start;
          margin-bottom: 30px;
        }

        .admin-bookings-controls > * {
          min-width: 0;
        }

        .search-field,
        .filter-block,
        .panel-summary-card {
          min-height: 76px;
        }

        .search-field {
          position: relative;
          min-width: 0;
        }

        .search-field input {
          width: 100%;
          padding: 16px 18px 16px 48px;
          border-radius: 18px;
          border: 1px solid var(--border);
          background: rgba(15, 23, 42, 0.03);
          color: var(--text-main);
        }

        .search-icon {
          position: absolute;
          left: 16px;
          top: 35%;
          transform: translateY(-50%);
          color: var(--text-muted);
        }

        .filter-block {
          display: flex;
          flex-direction: column;
          gap: 10px;
          min-width: 210px;
          justify-content: flex-start;
        }

        .filter-block label {
          color: var(--text-muted);
          font-size: 0.9rem;
          font-weight: 700;
          margin-bottom: 4px;
        }

        .filter-block select {
          min-width: 100%;
          padding: 14px 16px;
          border-radius: 16px;
          border: 1px solid var(--border);
          background: rgba(15, 23, 42, 0.03);
          color: var(--text-main);
        }

        .panel-summary-card {
         display: flex;
         flex-direction: column;
    align-items: center;
    /* gap: 5px; */
    padding: 1.5px 22px;
    min-width: 160px;
    border-radius: 22px;
    background: linear-gradient(180deg, rgba(236, 251, 255, 0.95), rgba(255, 255, 255, 0.95));
    border: 1px solid rgba(15, 23, 42, 0.08);
    height: 5px;
        }

        .panel-summary-card span {
          color: var(--text-muted);
          font-size: 0.9rem;
          text-transform: uppercase;
          letter-spacing: 0.08em;
          font-weight: 700;
        }

        .panel-summary-card strong {
          font-size: 2rem;
          color: var(--text-heading);
        }

        .bookings-card-grid {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 22px;
        }

        .booking-card {
          padding: 26px;
          border-radius: 28px;
          border: 1px solid rgba(15, 23, 42, 0.08);
          background: linear-gradient(180deg, rgba(255, 255, 255, 0.98), rgba(245, 249, 255, 0.98));
          box-shadow: 0 20px 50px rgba(15, 23, 42, 0.06);
          transition: transform 0.25s ease, box-shadow 0.25s ease;
          display: flex;
          flex-direction: column;
          gap: 24px;
        }

        .booking-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 24px 55px rgba(15, 23, 42, 0.08);
        }

        .booking-card-header {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 16px;
        }

        .booking-id {
          font-size: 1rem;
          font-weight: 800;
          color: var(--text-heading);
        }

        .booking-meta {
          color: var(--text-muted);
          font-size: 0.95rem;
          margin-top: 6px;
        }

        .booking-card-body {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 18px;
        }

        .booking-detail-block {
          display: flex;
          flex-direction: column;
          gap: 8px;
          padding: 18px;
          border-radius: 22px;
          background: rgba(15, 23, 42, 0.05);
        }

        .booking-detail-label {
          margin: 0;
          color: var(--text-muted);
          font-size: 0.82rem;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          font-weight: 700;
        }

        .booking-card-footer {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 16px;
          flex-wrap: wrap;
        }

        .booking-footer-meta {
          display: flex;
          flex-direction: column;
          gap: 4px;
          color: var(--text-muted);
        }

        .booking-footer-meta span {
          font-size: 0.82rem;
          text-transform: uppercase;
          letter-spacing: 0.08em;
          font-weight: 700;
        }

        .booking-footer-meta strong {
          color: var(--text-heading);
          font-size: 1rem;
        }

        .booking-card-actions {
          display: flex;
          flex-wrap: wrap;
          gap: 12px;
          justify-content: flex-end;
        }

        .action-button {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 12px 18px;
          border-radius: 18px;
          border: 1px solid transparent;
          background: rgba(255, 255, 255, 0.9);
          cursor: pointer;
          transition: var(--transition);
          color: var(--text-heading);
          font-weight: 700;
        }

        .action-button:hover:not(:disabled) {
          transform: translateY(-1px);
          box-shadow: var(--shadow-md);
        }

        .cancel-button { border-color: rgba(239, 68, 68, 0.18); color: var(--danger); }
        .complete-button { border-color: rgba(59, 130, 246, 0.18); color: var(--primary); }

        .action-button:disabled {
          opacity: 0.5;
          cursor: not-allowed;
          transform: none;
          box-shadow: none;
        }

        .empty-row {
          grid-column: 1 / -1;
          padding: 28px;
          text-align: center;
          color: var(--text-muted);
          border-radius: 22px;
          background: rgba(15, 23, 42, 0.05);
        }

        .status-pill {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          padding: 10px 16px;
          border-radius: 999px;
          font-weight: 700;
          font-size: 0.85rem;
          min-width: 100px;
          text-align: center;
        }

        .status-pending { background: rgba(245, 158, 11, 0.15); color: #b45309; }
        .status-accepted { background: rgba(14, 165, 233, 0.15); color: #0f76b2; }
        .status-inprogress { background: rgba(59, 130, 246, 0.12); color: #2563eb; }
        .status-completed { background: rgba(16, 185, 129, 0.15); color: #047857; }
        .status-cancelled { background: rgba(239, 68, 68, 0.15); color: #b91c1c; }

        .modal-overlay {
          position: fixed;
          inset: 0;
          background: rgba(15, 23, 42, 0.55);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
          padding: 24px;
        }

        .modal-card {
          width: min(560px, 100%);
          background: var(--bg-card);
          border-radius: 24px;
          padding: 30px;
          box-shadow: var(--shadow-xl);
        }

        .modal-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          gap: 16px;
          margin-bottom: 18px;
        }

        .modal-header h3 {
          margin: 0;
        }

        .close-button {
          border: none;
          background: transparent;
          color: var(--text-muted);
          cursor: pointer;
          display: inline-flex;
          align-items: center;
        }

        .modal-subtitle {
          margin: 0 0 16px;
          color: var(--text-muted);
        }

        .modal-textarea {
          width: 100%;
          border: 1px solid var(--border);
          border-radius: 16px;
          padding: 16px;
          min-height: 140px;
          resize: vertical;
          font-family: inherit;
          margin-bottom: 14px;
          background: rgba(15, 23, 42, 0.04);
        }

        .modal-error {
          color: var(--danger);
          margin-bottom: 12px;
        }

        .modal-actions {
          display: flex;
          justify-content: flex-end;
          gap: 14px;
          flex-wrap: wrap;
        }

        @media (max-width: 1024px) {
          .admin-bookings-summary-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); }
          .admin-bookings-controls { grid-template-columns: 1fr; }
          .panel-summary-card { width: 100%; align-items: flex-start; text-align: left; }
          .bookings-card-grid { grid-template-columns: 1fr; }
          .booking-card-body { grid-template-columns: 1fr; }
          .admin-page-topbar { flex-direction: column; align-items: flex-start; }
          .admin-top-actions { width: 100%; justify-content: flex-start; }
          .admin-global-links { width: 100%; }
        }

        @media (max-width: 700px) {
          .admin-page-shell { padding: 24px; }
          .admin-secondary-nav { gap: 8px; }
          .admin-bookings-summary-grid { grid-template-columns: 1fr; }
          .admin-bookings-controls { gap: 14px; }
          .search-field input { padding: 14px 16px 14px 46px; }
          .filter-block select { padding: 12px 14px; }
          .panel-summary-card { width: 100%; text-align: left; align-items: flex-start; }
          .action-button { width: 100%; justify-content: center; }
        }
      `}</style>
    </section>
  );
};

export default AdminBookings;
