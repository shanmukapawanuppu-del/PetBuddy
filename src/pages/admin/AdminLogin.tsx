import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, AlertCircle } from 'lucide-react';
import { useAdminAuth } from '../../components/admin/AdminAuthContext';
import { API_ROUTES } from '../../constants/apiConstants';

const AdminLogin: React.FC = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false
  });
  
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState('');
  // const [showOtp, setShowOtp] = useState(false);
  // const [otp, setOtp] = useState(['', '', '', '', '', '']);
  // const otpRefs = useRef<(HTMLInputElement | null)[]>([]);

  const { isAuthenticated, loginAdmin, isAdminRegistered } = useAdminAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/admin/dashboard', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    }
    if (!formData.password) {
      newErrors.password = 'Password is required';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
    setApiError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    setIsLoading(true);
    setApiError('');

    try {
      const response = await fetch(API_ROUTES.AUTH.LOGIN, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setApiError(data.error || 'Invalid credentials. Access denied.');
        setIsLoading(false);
        return;
      }

      const adminUser = {
        id: data.admin.id,
        fullName: `${data.admin.firstName} ${data.admin.lastName}`.trim(),
        email: data.admin.email,
      };

      loginAdmin(adminUser, data.token);
    } catch (err) {
      console.error(err);
      setApiError('Failed to connect to authentication server. Please try again.');
      setIsLoading(false);
    }
  };

  if (isAuthenticated) return null;

  return (
    <div style={{ display: 'flex', height: '100vh', width: '100vw', margin: 0, padding: 0, overflow: 'hidden' }}>
      {/* Left Vibrant Image Side */}
      <div style={{ 
        flex: '1.2', 
        position: 'relative', 
        display: 'flex', 
        flexDirection: 'column', 
        justifyContent: 'center', 
        padding: '60px',
        color: 'white',
        overflow: 'hidden'
      }}>
        {/* The generated image background */}
        <div style={{ 
          position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', 
          backgroundImage: 'url(/admin-bg.png)', 
          backgroundSize: 'cover', 
          backgroundPosition: 'center',
          zIndex: 1
        }} />
        {/* Deep Gradient Overlay */}
        <div style={{ 
          position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', 
          background: 'linear-gradient(135deg, rgba(13, 148, 136, 0.9) 0%, rgba(15, 23, 42, 0.8) 100%)',
          zIndex: 2,
          backdropFilter: 'blur(4px)'
        }} />
        
        <div style={{ position: 'relative', zIndex: 3, maxWidth: '600px', animation: 'slideUp 1s ease-out' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '8px 16px', background: 'rgba(255,255,255,0.15)', borderRadius: '30px', backdropFilter: 'blur(10px)', marginBottom: '24px', fontWeight: '600', letterSpacing: '1px' }}>
            {/* <Lock size={18} color="#2dd4bf" /> Secure Environment */}
          </div>
          <h1 style={{ fontSize: '4.5rem', fontWeight: '900', lineHeight: 1.1, marginBottom: '24px', textShadow: '0 10px 30px rgba(0,0,0,0.3)' }}>
            Welcome <br/> <span style={{ color: '#2dd4bf' }}>Back.</span>
          </h1>
          <p style={{ fontSize: '1.25rem', lineHeight: 1.6, color: 'rgba(255,255,255,0.8)' }}>
            Authenticate to access the PetBuddy command center and oversee your community.
          </p>
        </div>
      </div>

      {/* Right Form Side */}
      <div style={{ 
        flex: '1', 
        backgroundColor: 'var(--bg-main)', 
        display: 'flex', 
        flexDirection: 'column',
        padding: '40px',
        overflowY: 'auto'
      }}>
        <div style={{ 
          width: '100%', 
          maxWidth: '480px', 
          background: 'var(--bg-card)', 
          padding: '48px', 
          borderRadius: '24px', 
          boxShadow: '0 25px 50px -12px rgba(15, 23, 42, 0.15)',
          border: '1px solid rgba(15, 23, 42, 0.05)',
          margin: 'auto'
        }} className="animate-fade">
          
          <div style={{ textAlign: 'center', marginBottom: '40px' }}>
            <h2 style={{ fontSize: '2.2rem', fontWeight: '800', color: 'var(--text-heading)', marginBottom: '8px' }}>Admin Portal</h2>
            <p style={{ color: 'var(--text-muted)' }}>Enter your credentials to continue.</p>
          </div>

          {apiError && (
            <div style={{ padding: '12px 16px', backgroundColor: 'rgba(239, 68, 68, 0.1)', color: 'var(--danger)', borderRadius: '12px', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.9rem', fontWeight: '600' }}>
              <AlertCircle size={18} />
              {apiError}
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }} noValidate>
            
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: '700', fontSize: '0.9rem', color: 'var(--text-heading)' }}>Email Address</label>
              <input name="email" type="email" className="input-field" placeholder="admin@petbuddy.com" value={formData.email} onChange={handleChange} disabled={isLoading} style={{ width: '100%', padding: '16px', borderRadius: '12px' }} />
              {errors.email && <span style={{ color: 'var(--danger)', fontSize: '0.85rem', marginTop: '6px', display: 'block' }}>{errors.email}</span>}
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: '700', fontSize: '0.9rem', color: 'var(--text-heading)' }}>Password</label>
              <div style={{ position: 'relative' }}>
                <input name="password" type={showPassword ? 'text' : 'password'} className="input-field" placeholder="••••••••" value={formData.password} onChange={handleChange} disabled={isLoading} style={{ width: '100%', padding: '16px', borderRadius: '12px', paddingRight: '48px' }} />
                <button type="button" onClick={() => setShowPassword(!showPassword)} style={{ position: 'absolute', right: '16px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              {errors.password && <span style={{ color: 'var(--danger)', fontSize: '0.85rem', marginTop: '6px', display: 'block' }}>{errors.password}</span>}
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '4px' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.9rem', color: 'var(--text-muted)', cursor: 'pointer' }}>
                <input type="checkbox" name="rememberMe" checked={formData.rememberMe} onChange={handleChange} disabled={isLoading} style={{ width: '16px', height: '16px', accentColor: 'var(--primary)' }} />
                Remember me
              </label>
              <Link to="/admin/forgot-password" style={{ fontSize: '0.9rem', color: 'var(--primary)', fontWeight: '700', textDecoration: 'none' }}>
                Forgot Password?
              </Link>
            </div>

            <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '18px', fontSize: '1.1rem', marginTop: '8px', borderRadius: '16px', fontWeight: '800', boxShadow: '0 10px 25px -5px rgba(13, 148, 136, 0.4)' }} disabled={isLoading}>
              {isLoading ? 'Authenticating...' : 'Sign In'}
            </button>
            
          </form>

          {!isAdminRegistered && (
            <div style={{ marginTop: '24px', textAlign: 'center', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
              Admin account not initialized? <Link to="/admin/signup" style={{ color: 'var(--primary)', fontWeight: '700', textDecoration: 'none' }}>Register</Link>
            </div>
          )}
          
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
