import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
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
            <span className="section-pre">Welcome back</span>
            <h1 className="auth-title">Log in to PetBuddy</h1>
            <p className="auth-subtitle">
              Sign in to manage your bookings, message caregivers, and keep your pet's care schedule in one place.
            </p>
          </div>

          <form className="auth-form" onSubmit={handleSubmit}>
            <label className="auth-label" htmlFor="login-email">Email address</label>
            <input
              id="login-email"
              type="email"
              className="auth-input"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="you@example.com"
              required
            />

            <label className="auth-label" htmlFor="login-password">Password</label>
            <input
              id="login-password"
              type="password"
              className="auth-input"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="Enter your password"
              required
            />

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

            <button type="submit" className="btn btn-primary btn-auth-submit">
              Log In
            </button>
          </form>

          <p className="auth-footer">
            New to PetBuddy?{' '}
            <Link to="/signup" className="auth-link auth-link-strong">
              Create an account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
