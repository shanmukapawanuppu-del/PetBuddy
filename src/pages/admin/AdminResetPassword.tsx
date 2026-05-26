import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { ShieldAlert, Eye, EyeOff, AlertCircle, CheckCircle2 } from 'lucide-react';

const AdminResetPassword: React.FC = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');

  const [formData, setFormData] = useState({
    password: '',
    confirmPassword: ''
  });
  
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    if (!token) {
      setApiError('Invalid or missing reset token.');
    }
  }, [token]);

  const validatePassword = (pass: string) => {
    return {
      length: pass.length >= 8,
      upper: /[A-Z]/.test(pass),
      lower: /[a-z]/.test(pass),
      number: /[0-9]/.test(pass),
      special: /[^A-Za-z0-9]/.test(pass),
    };
  };

  const isPasswordValid = (pass: string) => {
    return Object.values(validatePassword(pass)).every(Boolean);
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (!isPasswordValid(formData.password)) {
      newErrors.password = 'Password does not meet the minimum requirements';
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
    setApiError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm() || !token) return;

    setIsLoading(true);
    setApiError('');

    // Simulate API call for Password Reset
    setTimeout(() => {
      // Mock validation of token and updating password in DB
      if (token === 'mock_token_123') {
        setIsSuccess(true);
      } else {
        setApiError('The reset token has expired or is invalid.');
      }
      setIsLoading(false);
    }, 1500);
  };

  const pRules = validatePassword(formData.password);

  return (
    <div className="auth-page" style={{ backgroundColor: '#f8fafc' }}>
      <div className="container auth-page-container">
        
        <div className="card auth-card animate-slide">
          <div className="auth-card-header text-center">
            <div style={{ display: 'flex', justifyContent: 'center', margin: '0 auto 16px' }}>
              <div style={{ width: '64px', height: '64px', borderRadius: '16px', background: 'var(--primary-light)', display: 'grid', placeItems: 'center', color: 'var(--primary)' }}>
                <ShieldAlert size={32} />
              </div>
            </div>
            <h1 className="auth-title">Reset Password</h1>
            <p className="auth-subtitle">Please enter your new password below.</p>
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
              <h3 style={{ marginBottom: '12px', fontSize: '1.25rem' }}>Password Reset Successful</h3>
              <p style={{ color: 'var(--text-muted)', marginBottom: '24px', lineHeight: '1.6' }}>
                Your password has been successfully updated. You can now login with your new credentials.
              </p>
              
              <Link to="/admin/login" className="btn btn-primary" style={{ width: '100%' }}>
                Go to Login
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="auth-form" noValidate>
              
              <div className="input-group">
                <label className="input-label" htmlFor="password">New Password</label>
                <div style={{ position: 'relative' }}>
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    className="input-field"
                    style={{ width: '100%', paddingRight: '40px' }}
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={handleChange}
                    disabled={isLoading || !token}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                
                {/* Password Requirements UI */}
                <div style={{ marginTop: '8px', fontSize: '0.8rem', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <div style={{ color: pRules.length ? 'var(--success)' : 'var(--text-muted)' }}>✓ At least 8 characters</div>
                  <div style={{ color: pRules.upper ? 'var(--success)' : 'var(--text-muted)' }}>✓ At least 1 uppercase letter</div>
                  <div style={{ color: pRules.lower ? 'var(--success)' : 'var(--text-muted)' }}>✓ At least 1 lowercase letter</div>
                  <div style={{ color: pRules.number ? 'var(--success)' : 'var(--text-muted)' }}>✓ At least 1 number</div>
                  <div style={{ color: pRules.special ? 'var(--success)' : 'var(--text-muted)' }}>✓ At least 1 special character (@, #, $, etc.)</div>
                </div>

                {errors.password && <span style={{ color: 'var(--danger)', fontSize: '0.85rem' }}>{errors.password}</span>}
              </div>

              <div className="input-group">
                <label className="input-label" htmlFor="confirmPassword">Confirm New Password</label>
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showPassword ? 'text' : 'password'}
                  className="input-field"
                  placeholder="••••••••"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  disabled={isLoading || !token}
                />
                {errors.confirmPassword && <span style={{ color: 'var(--danger)', fontSize: '0.85rem' }}>{errors.confirmPassword}</span>}
              </div>

              <button 
                type="submit" 
                className="btn btn-primary btn-auth-submit" 
                style={{ marginTop: '16px' }}
                disabled={isLoading || !token || !isPasswordValid(formData.password)}
              >
                {isLoading ? 'Updating...' : 'Reset Password'}
              </button>
              
            </form>
          )}
          
        </div>
      </div>
    </div>
  );
};

export default AdminResetPassword;
