import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

const Auth: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const isSignup = location.pathname === '/signup';

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);

  useEffect(() => {
    if (localStorage.getItem('isLoggedIn') === 'true') {
      navigate('/home');
    }
  }, [navigate]);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (isSignup && password !== confirmPassword) {
      alert('Passwords do not match.');
      return;
    }

    localStorage.setItem('isLoggedIn', 'true');
    window.dispatchEvent(new Event('storage'));
    navigate('/home');
  };

  return (
    <div className="auth-page animate-fade">
      <div className="container auth-page-container">
        <div className="auth-card card">
          <div className="auth-card-header">
            <span className="section-pre">{isSignup ? 'Create your account' : 'Welcome back'}</span>
            <h1 className="auth-title">{isSignup ? 'Sign up for PetBuddy' : 'Log in to PetBuddy'}</h1>
            <p className="auth-subtitle">
              {isSignup
                ? 'Join our community and book trusted caregivers for your pet with confidence.'
                : "Sign in to manage your bookings, message caregivers, and keep your pet's care schedule in one place."}
            </p>
          </div>

          <form className="auth-form" onSubmit={handleSubmit}>
            {isSignup && (
              <>
                <label className="auth-label" htmlFor="auth-name">Full name</label>
                <input
                  id="auth-name"
                  type="text"
                  className="auth-input"
                  value={fullName}
                  onChange={(event) => setFullName(event.target.value)}
                  placeholder="Jessie Parker"
                  required
                />
              </>
            )}

            <label className="auth-label" htmlFor="auth-email">Email address</label>
            <input
              id="auth-email"
              type="email"
              className="auth-input"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="you@example.com"
              required
            />

            <label className="auth-label" htmlFor="auth-password">Password</label>
            <input
              id="auth-password"
              type="password"
              className="auth-input"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder={isSignup ? 'Choose a strong password' : 'Enter your password'}
              required
            />

            {isSignup && (
              <>
                <label className="auth-label" htmlFor="auth-confirm-password">Confirm password</label>
                <input
                  id="auth-confirm-password"
                  type="password"
                  className="auth-input"
                  value={confirmPassword}
                  onChange={(event) => setConfirmPassword(event.target.value)}
                  placeholder="Repeat your password"
                  required
                />
              </>
            )}

            {!isSignup && (
              <div className="auth-row">
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(event) => setRememberMe(event.target.checked)}
                  />
                  Remember me
                </label>
                <span className="auth-link">Need help?</span>
              </div>
            )}

            <button type="submit" className="btn btn-primary btn-auth-submit">
              {isSignup ? 'Create account' : 'Log In'}
            </button>
          </form>

          <p className="auth-footer">
            {isSignup ? 'Already have an account?' : 'New to PetBuddy?'}{' '}
            <Link to={isSignup ? '/login' : '/signup'} className="auth-link auth-link-strong">
              {isSignup ? 'Log in' : 'Create an account'}
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Auth;
