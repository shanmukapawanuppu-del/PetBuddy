// src/pages/AdminDashboard.tsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Users, Heart, Calendar } from 'lucide-react';

// Mock statistics – replace with real API later
const mockStats = {
  totalUsers: 1245,
  totalSitters: 378,
  activeBookings: 56,
};

const AdminDashboard: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showStats, setShowStats] = useState(true);
  const [form, setForm] = useState({ username: '', password: '' });
  // Dummy data for admin tables
  const [users, setUsers] = useState([
    { id: 1, name: 'Alice', email: 'alice@example.com' },
    { id: 2, name: 'Bob', email: 'bob@example.com' },
    { id: 3, name: 'Carol', email: 'carol@example.com' }
  ]);
  const [sitters, setSitters] = useState([
    { id: 1, name: 'Dave', rating: 4.9 },
    { id: 2, name: 'Eve', rating: 4.7 },
    { id: 3, name: 'Frank', rating: 4.5 }
  ]);
  const [bookings, setBookings] = useState([
    { id: 1, user: 'Alice', sitter: 'Dave', date: '2024-01-10' },
    { id: 2, user: 'Bob', sitter: 'Eve', date: '2024-01-12' },
    { id: 3, user: 'Carol', sitter: 'Frank', date: '2024-01-15' }
  ]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Simple placeholder auth – any non‑empty credentials log you in
    if (form.username && form.password) {
      setIsLoggedIn(true);
    }
  };

  if (!isLoggedIn) {
    return (
      <section className="admin-login page-center">
        <h2>PetBuddy Admin Portal</h2>
        <p>Manage sitters, bookings, users, and trust</p>
        <form onSubmit={handleLogin} className="login-form">
          <input
            type="text"
            placeholder="Username"
            value={form.username}
            onChange={e => setForm({ ...form, username: e.target.value })}
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={form.password}
            onChange={e => setForm({ ...form, password: e.target.value })}
            required
          />
          <button type="submit" className="btn btn-primary">
            Admin Login
          </button>
        </form>
      </section>
    );
  }

  return (
    <section className="admin-dashboard">
      <header className="admin-header">
        <h1>🧑‍💼 Admin Dashboard</h1>
        <Link to="/" className="btn btn-secondary">← Back to Home</Link>
      </header>

      {showStats && (
        <section className="quick-stats grid-3">
          <div className="stat-card">
            <Users className="stat-icon" />
            <h3>Total Users</h3>
            <p>{mockStats.totalUsers}</p>
          </div>
          <div className="stat-card">
            <Heart className="stat-icon" />
            <h3>Total Sitters</h3>
            <p>{mockStats.totalSitters}</p>
          </div>
          <div className="stat-card">
            <Calendar className="stat-icon" />
            <h3>Active Bookings</h3>
            <p>{mockStats.activeBookings}</p>
          </div>
        </section>
      )}

      {/* Dummy data tables */}
      <section className="admin-section">
        <h2>Users</h2>
        <table className="admin-table">
          <thead>
            <tr><th>ID</th><th>Name</th><th>Email</th><th>Action</th></tr>
          </thead>
          <tbody>
            {users.map(u => (
              <tr key={u.id}>
                <td>{u.id}</td>
                <td>{u.name}</td>
                <td>{u.email}</td>
                <td><button className="btn btn-sm btn-danger" onClick={() => deleteUser(u.id)}>Delete</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      <section className="admin-section">
        <h2>Sitter Listings</h2>
        <table className="admin-table">
          <thead>
            <tr><th>ID</th><th>Name</th><th>Rating</th><th>Action</th></tr>
          </thead>
          <tbody>
            {sitters.map(s => (
              <tr key={s.id}>
                <td>{s.id}</td>
                <td>{s.name}</td>
                <td>{s.rating}</td>
                <td><button className="btn btn-sm btn-danger" onClick={() => deleteSitter(s.id)}>Delete</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      <section className="admin-section">
        <h2>Bookings</h2>
        <table className="admin-table">
          <thead>
            <tr><th>ID</th><th>User</th><th>Sitter</th><th>Date</th><th>Action</th></tr>
          </thead>
          <tbody>
            {bookings.map(b => (
              <tr key={b.id}>
                <td>{b.id}</td>
                <td>{b.user}</td>
                <td>{b.sitter}</td>
                <td>{b.date}</td>
                <td><button className="btn btn-sm btn-danger" onClick={() => deleteBooking(b.id)}>Delete</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      {/* Placeholder for future admin sections (user list, sitter list, bookings) */}
    </section>
  );
};

export default AdminDashboard;
