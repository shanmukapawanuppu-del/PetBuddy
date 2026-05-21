import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Signup: React.FC = () => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    if (localStorage.getItem('isLoggedIn') === 'true') {
      navigate('/home');
    }
  }, [navigate]);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    localStorage.setItem('isLoggedIn', 'true');
    // Dispatch storage event to trigger immediate Navbar updates
    window.dispatchEvent(new Event('storage'));
    navigate('/home');
  };

  return (
    <div className="auth-page animate-fade">
      <div className="container auth-page-container">
        <div className="auth-card card">
          <div className="auth-card-header">
            <span className="section-pre">Create your account</span>
            <h1 className="auth-title">Sign up for PetBuddy</h1>
            <p className="auth-subtitle">
              Join our community and book trusted caregivers for your pet with confidence.
            </p>
          </div>

          <form className="auth-form" onSubmit={handleSubmit}>
            <label className="auth-label" htmlFor="signup-name">Full name</label>
            <input
              id="signup-name"
              type="text"
              className="auth-input"
              value={fullName}
              onChange={(event) => setFullName(event.target.value)}
              placeholder="Jessie Parker"
              required
            />

            <label className="auth-label" htmlFor="signup-email">Email address</label>
            <input
              id="signup-email"
              type="email"
              className="auth-input"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="you@example.com"
              required
            />

            <label className="auth-label" htmlFor="signup-password">Password</label>
            <input
              id="signup-password"
              type="password"
              className="auth-input"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="Choose a strong password"
              required
            />

            <label className="auth-label" htmlFor="signup-confirm-password">Confirm password</label>
            <input
              id="signup-confirm-password"
              type="password"
              className="auth-input"
              value={confirmPassword}
              onChange={(event) => setConfirmPassword(event.target.value)}
              placeholder="Repeat your password"
              required
            />

            <button type="submit" className="btn btn-primary btn-auth-submit">
              Create account
            </button>
          </form>

          <p className="auth-footer">
            Already have an account?{' '}
            <Link to="/login" className="auth-link auth-link-strong">
              Log in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signup;
