import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { KeyRound, AlertCircle, CheckCircle2 } from 'lucide-react';

const AdminForgotPassword: React.FC = () => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [apiError, setApiError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email.trim()) {
      setError('Email is required');
      return;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError('Please enter a valid email address');
      return;
    }

    setError('');
    setApiError('');
    setIsSubmitting(true);

    // Simulate API request to send reset link
    setTimeout(() => {
      const storedAdmin = localStorage.getItem('petbuddy_admin_account');
      if (storedAdmin) {
        const adminUser = JSON.parse(storedAdmin);
        if (adminUser.email !== email) {
          // For security reasons, usually we still say "If the email exists, a link was sent".
          // But to be helpful in this mock, we show an error if it doesn't match.
          setApiError('Email not found in our records.');
          setIsSubmitting(false);
          return;
        }

        // Mock success
        setIsSuccess(true);
        // Note: In reality, backend sends an email with a 30-min expiring token link.
        // E.g. https://petbuddy.com/admin/reset-password?token=abc...
      } else {
        setApiError('No admin account registered.');
      }
      setIsSubmitting(false);
    }, 1500);
  };

  return (
    <div className="auth-page" style={{ backgroundColor: '#f8fafc' }}>
      <div className="container auth-page-container">
        
        <div className="card auth-card animate-slide">
          <div className="auth-card-header text-center">
            <div style={{ display: 'flex', justifyContent: 'center', margin: '0 auto 16px' }}>
              <div style={{ width: '64px', height: '64px', borderRadius: '16px', background: 'var(--primary-light)', display: 'grid', placeItems: 'center', color: 'var(--primary)' }}>
                <KeyRound size={32} />
              </div>
            </div>
            <h1 className="auth-title">Forgot Password</h1>
            <p className="auth-subtitle">Enter your email address and we'll send you a link to reset your password.</p>
          </div>

          {apiError && (
            <div style={{ padding: '12px 16px', backgroundColor: 'rgba(239, 68, 68, 0.1)', color: 'var(--danger)', borderRadius: '8px', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.9rem' }}>
              <AlertCircle size={18} />
              {apiError}
            </div>
          )}

          {isSuccess ? (
            <div style={{ textAlign: 'center', padding: '20px 0' }}>
              <div style={{ color: 'var(--success)', display: 'flex', justifyContent: 'center', marginBottom: '16px' }}>
                <CheckCircle2 size={48} />
              </div>
              <h3 style={{ marginBottom: '12px', fontSize: '1.25rem' }}>Check your email</h3>
              <p style={{ color: 'var(--text-muted)', marginBottom: '24px', lineHeight: '1.6' }}>
                We've sent a password reset link to <strong>{email}</strong>. 
                The link will expire in 30 minutes.
              </p>
              
              {/* For mock testing purposes, we'll provide a direct link to the reset page */}
              <div style={{ padding: '16px', background: 'var(--secondary-light)', borderRadius: '8px', border: '1px solid rgba(245,158,11,0.2)', marginBottom: '24px' }}>
                <p style={{ fontSize: '0.85rem', color: 'var(--secondary-hover)', marginBottom: '8px', fontWeight: 'bold' }}>Simulation Note (Dev Only):</p>
                <Link to="/admin/reset-password?token=mock_token_123" className="btn btn-amber" style={{ padding: '8px 16px', fontSize: '0.85rem' }}>
                  Mock Click Reset Link
                </Link>
              </div>

              <Link to="/admin/login" className="btn btn-secondary" style={{ width: '100%' }}>
                Return to Login
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="auth-form" noValidate>
              
              <div className="input-group">
                <label className="input-label" htmlFor="email">Email Address</label>
                <input
                  id="email"
                  type="email"
                  className="input-field"
                  placeholder="admin@petbuddy.com"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if(error) setError('');
                  }}
                  disabled={isSubmitting}
                />
                {error && <span style={{ color: 'var(--danger)', fontSize: '0.85rem' }}>{error}</span>}
              </div>

              <button 
                type="submit" 
                className="btn btn-primary btn-auth-submit" 
                style={{ marginTop: '8px' }}
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Sending Link...' : 'Send Reset Link'}
              </button>
              
              <div className="auth-footer" style={{ marginTop: '24px' }}>
                <Link to="/admin/login" className="auth-link">
                  ← Back to Login
                </Link>
              </div>
            </form>
          )}
          
        </div>
      </div>
    </div>
  );
};

export default AdminForgotPassword;
