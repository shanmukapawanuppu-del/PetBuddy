import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShieldCheck, Eye, EyeOff, AlertCircle, Sparkles, Mail, Info } from 'lucide-react';
import { useAdminAuth } from '../../components/admin/AdminAuthContext';
import { API_ROUTES } from '../../constants/apiConstants';

const AdminSignup: React.FC = () => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    otp: '',
    password: '',
    confirmPassword: '',
    termsAccepted: false
  });
  
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showPasswordInfo, setShowPasswordInfo] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState('');
  const [otpSentMessage, setOtpSentMessage] = useState('');

  const { isAdminRegistered, checkRegistrationStatus } = useAdminAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAdminRegistered) {
      navigate('/admin/login', { replace: true });
    }
  }, [isAdminRegistered, navigate]);

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

  const validateStep1 = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.firstName.trim()) newErrors.firstName = 'First Name is required';
    if (!formData.lastName.trim()) newErrors.lastName = 'Last Name is required';
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep2 = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.otp.trim()) newErrors.otp = 'OTP is required';
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (!isPasswordValid(formData.password)) {
      newErrors.password = 'Password does not meet the minimum requirements';
    }
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    if (!formData.termsAccepted) {
      newErrors.termsAccepted = 'You must accept the terms and conditions';
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

  const otpRefs = useRef<(HTMLInputElement | null)[]>([]);
  const passwordRef = useRef<HTMLInputElement>(null);

  const handleOtpChange = (index: number, val: string) => {
    if (!/^[0-9]*$/.test(val)) return;
    const char = val.slice(-1);
    const currentOtp = formData.otp.split('');
    while(currentOtp.length < 6) currentOtp.push('');
    currentOtp[index] = char;
    const newOtp = currentOtp.join('');
    setFormData(prev => ({ ...prev, otp: newOtp }));
    if (errors.otp) setErrors(prev => ({ ...prev, otp: '' }));
    setApiError('');
    if (char && index < 5 && otpRefs.current[index + 1]) {
      otpRefs.current[index + 1]?.focus();
    } else if (char && index === 5) {
      passwordRef.current?.focus();
    }
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !formData.otp[index] && index > 0 && otpRefs.current[index - 1]) {
      otpRefs.current[index - 1]?.focus();
    }
  };

  const handleOtpPaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').slice(0, 6).replace(/[^0-9]/g, '');
    if (pastedData) {
      setFormData(prev => ({ ...prev, otp: pastedData }));
      if (errors.otp) setErrors(prev => ({ ...prev, otp: '' }));
      setApiError('');
      const focusIndex = Math.min(pastedData.length, 5);
      if (pastedData.length === 6) {
        passwordRef.current?.focus();
      } else if (otpRefs.current[focusIndex]) {
        otpRefs.current[focusIndex]?.focus();
      } else {
        otpRefs.current[5]?.focus();
      }
    }
  };

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateStep1()) return;
    
    setIsLoading(true);
    setApiError('');

    try {
      const response = await fetch(API_ROUTES.AUTH.SEND_OTP, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setApiError(data.error || 'Failed to send OTP. Please try again.');
        setIsLoading(false);
        return;
      }

      setIsLoading(false);
      setStep(2);
      setOtpSentMessage(`We've sent a secure OTP to ${formData.email}.`);
    } catch (err) {
      console.error(err);
      setApiError('Failed to connect to verification server. Please try again.');
      setIsLoading(false);
    }
  };

  const handleVerifyAndRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateStep2()) return;
    
    setIsLoading(true);
    setApiError('');

    try {
      // 1. Verify OTP and complete registration
      const verifyResponse = await fetch(API_ROUTES.AUTH.VERIFY_OTP, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          otp: formData.otp,
          password: formData.password,
          confirmPassword: formData.confirmPassword,
        }),
      });

      const verifyData = await verifyResponse.json();

      if (!verifyResponse.ok) {
        setApiError(verifyData.error || 'Failed to verify OTP. Please try again.');
        setIsLoading(false);
        return;
      }

      setIsLoading(false);
      await checkRegistrationStatus();
      navigate("/admin/login", { replace: true });
    } catch (err) {
      console.error(err);
      setApiError('Failed to connect to authentication server. Please try again.');
      setIsLoading(false);
    }
  };

  const pRules = validatePassword(formData.password);

  if (isAdminRegistered) return null;

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
        <div style={{ 
          position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', 
          backgroundImage: 'url(/admin-bg.png)', 
          backgroundSize: 'cover', 
          backgroundPosition: 'center',
          zIndex: 1
        }} />
        <div style={{ 
          position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', 
          background: 'linear-gradient(135deg, rgba(13, 148, 136, 0.85) 0%, rgba(245, 158, 11, 0.7) 100%)',
          zIndex: 2,
          backdropFilter: 'blur(4px)'
        }} />
        
        <div style={{ position: 'relative', zIndex: 3, maxWidth: '600px', animation: 'slideUp 1s ease-out' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '8px 16px', background: 'rgba(255,255,255,0.2)', borderRadius: '30px', backdropFilter: 'blur(10px)', marginBottom: '24px', fontWeight: '600', letterSpacing: '1px' }}>
            <Sparkles size={18} color="#fcd34d" /> Premium Workspace
          </div>
          <h1 style={{ fontSize: '4.5rem', fontWeight: '900', lineHeight: 1.1, marginBottom: '24px', textShadow: '0 10px 30px rgba(0,0,0,0.2)' }}>
            PetBuddy <br/> <span style={{ color: '#fef3c7' }}>Admin Hub</span>
          </h1>
          <p style={{ fontSize: '1.25rem', lineHeight: 1.6, color: 'rgba(255,255,255,0.9)' }}>
            Securely manage caregivers, monitor bookings, and scale your pet care empire from one dynamic dashboard.
          </p>
        </div>
      </div>

      {/* Right Form Side */}
      <div style={{ 
        flex: '1', 
        backgroundColor: 'var(--bg-main)', 
        display: 'flex', 
        flexDirection: 'column',
        padding: '24px',
        overflowY: 'auto'
      }}>
        <div style={{ 
          width: '100%', 
          maxWidth: '480px', 
          background: 'var(--bg-card)', 
          padding: '32px', 
          borderRadius: '24px', 
          boxShadow: '0 25px 50px -12px rgba(13, 148, 136, 0.15)',
          border: '1px solid rgba(13, 148, 136, 0.1)',
          margin: 'auto'
        }} className="animate-fade">
          
          <div style={{ textAlign: 'center', marginBottom: '20px' }}>
            <div style={{ width: '56px', height: '56px', borderRadius: '16px', background: 'var(--primary-light)', display: 'grid', placeItems: 'center', color: 'var(--primary)', margin: '0 auto 16px' }}>
              <ShieldCheck size={28} />
            </div>
            <h2 style={{ fontSize: '2rem', fontWeight: '800', color: 'var(--text-heading)', marginBottom: '8px' }}>
              {step === 1 ? 'Initialize Portal' : 'Verify & Secure'}
            </h2>
            <p style={{ color: 'var(--text-muted)' }}>
              {step === 1 ? 'Step 1: Enter your details to receive a secure OTP.' : 'Step 2: Enter the OTP sent to your email and set a strong password.'}
            </p>
          </div>

          {apiError && (
            <div style={{ padding: '12px 16px', backgroundColor: 'rgba(239, 68, 68, 0.1)', color: 'var(--danger)', borderRadius: '12px', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.9rem', fontWeight: '600' }}>
              <AlertCircle size={18} />
              {apiError}
            </div>
          )}
          
          {step === 2 && otpSentMessage && (
            <div style={{ padding: '12px 16px', backgroundColor: 'rgba(16, 185, 129, 0.1)', color: 'var(--success)', borderRadius: '12px', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.9rem', fontWeight: '600' }}>
              <Mail size={18} />
              {otpSentMessage}
            </div>
          )}

          {step === 1 ? (
            // STEP 1 FORM
            <form onSubmit={handleSendOtp} style={{ display: 'flex', flexDirection: 'column', gap: '20px', animation: 'fadeIn 0.3s ease-out' }} noValidate>
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '6px', fontWeight: '700', fontSize: '0.9rem', color: 'var(--text-heading)' }}>First Name</label>
                  <input name="firstName" type="text" className="input-field" placeholder="John" value={formData.firstName} onChange={handleChange} disabled={isLoading} style={{ width: '100%' }} />
                  {errors.firstName && <span style={{ color: 'var(--danger)', fontSize: '0.85rem', marginTop: '4px', display: 'block' }}>{errors.firstName}</span>}
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '6px', fontWeight: '700', fontSize: '0.9rem', color: 'var(--text-heading)' }}>Last Name</label>
                  <input name="lastName" type="text" className="input-field" placeholder="Doe" value={formData.lastName} onChange={handleChange} disabled={isLoading} style={{ width: '100%' }} />
                  {errors.lastName && <span style={{ color: 'var(--danger)', fontSize: '0.85rem', marginTop: '4px', display: 'block' }}>{errors.lastName}</span>}
                </div>
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '6px', fontWeight: '700', fontSize: '0.9rem', color: 'var(--text-heading)' }}>Email Address</label>
                <input name="email" type="email" className="input-field" placeholder="admin@petbuddy.com" value={formData.email} onChange={handleChange} disabled={isLoading} style={{ width: '100%' }} />
                {errors.email && <span style={{ color: 'var(--danger)', fontSize: '0.85rem', marginTop: '4px', display: 'block' }}>{errors.email}</span>}
              </div>

              <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '16px', fontSize: '1.05rem', marginTop: '8px', borderRadius: '16px', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px' }} disabled={isLoading}>
                {isLoading ? 'Sending...' : <>Send Verification OTP <Mail size={18}/></>}
              </button>
              
            </form>
          ) : (
            // STEP 2 FORM
            <form onSubmit={handleVerifyAndRegister} style={{ display: 'flex', flexDirection: 'column', gap: '16px', animation: 'fadeIn 0.3s ease-out' }} noValidate>
              
              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '700', fontSize: '0.9rem', color: 'var(--text-heading)' }}>6-Digit OTP</label>
                <div style={{ display: 'flex', gap: '8px', justifyContent: 'space-between' }} onPaste={handleOtpPaste}>
                  {[0, 1, 2, 3, 4, 5].map((index) => (
                    <input
                      key={index}
                      ref={(el) => { otpRefs.current[index] = el; }}
                      type="text"
                      maxLength={1}
                      value={formData.otp[index] || ''}
                      onChange={(e) => handleOtpChange(index, e.target.value)}
                      onKeyDown={(e) => handleOtpKeyDown(index, e)}
                      disabled={isLoading}
                      className="input-field"
                      style={{
                        width: 'calc(100% / 6 - 8px)',
                        aspectRatio: '1/1',
                        fontSize: '1.5rem',
                        fontWeight: 'bold',
                        textAlign: 'center',
                        padding: '0',
                        borderRadius: '12px'
                      }}
                    />
                  ))}
                </div>
                {errors.otp && <span style={{ color: 'var(--danger)', fontSize: '0.85rem', marginTop: '6px', display: 'block' }}>{errors.otp}</span>}
              </div>

              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '6px' }}>
                  <label style={{ fontWeight: '700', fontSize: '0.9rem', color: 'var(--text-heading)', margin: 0 }}>Set Password</label>
                  <div 
                    onMouseEnter={() => setShowPasswordInfo(true)} 
                    onMouseLeave={() => setShowPasswordInfo(false)}
                    style={{ position: 'relative', display: 'flex', alignItems: 'center', color: 'var(--text-muted)', cursor: 'help' }}
                  >
                    <Info size={16} />
                    {showPasswordInfo && (
                      <div style={{ position: 'absolute', bottom: '100%', left: '50%', transform: 'translateX(-50%)', marginBottom: '8px', background: 'var(--bg-card)', padding: '14px', borderRadius: '12px', boxShadow: '0 10px 25px rgba(0,0,0,0.1)', border: '1px solid var(--border)', width: '260px', zIndex: 10 }}>
                        <div style={{ fontSize: '0.85rem', fontWeight: 'bold', marginBottom: '8px', color: 'var(--text-heading)' }}>Password Requirements:</div>
                        <div style={{ fontSize: '0.85rem', display: 'flex', flexDirection: 'column', gap: '6px', marginBottom: '10px' }}>
                          <div style={{ color: pRules.length ? 'var(--success)' : 'var(--text-muted)' }}>✓ 8 or more characters</div>
                          <div style={{ color: pRules.upper ? 'var(--success)' : 'var(--text-muted)' }}>✓ One big letter (A-Z)</div>
                          <div style={{ color: pRules.lower ? 'var(--success)' : 'var(--text-muted)' }}>✓ One small letter (a-z)</div>
                          <div style={{ color: pRules.number ? 'var(--success)' : 'var(--text-muted)' }}>✓ One number (0-9)</div>
                          <div style={{ color: pRules.special ? 'var(--success)' : 'var(--text-muted)' }}>✓ One symbol (like @, !, $)</div>
                        </div>
                        {/* <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', padding: '8px', backgroundColor: 'var(--bg-main)', borderRadius: '8px' }}>
                          <span style={{ fontWeight: '600' }}>Example:</span> P@ssw0rd123
                        </div> */}
                      </div>
                    )}
                  </div>
                </div>
                <div style={{ position: 'relative' }}>
                  <input ref={passwordRef} name="password" type={showPassword ? 'text' : 'password'} className="input-field" placeholder="••••••••" value={formData.password} onChange={handleChange} disabled={isLoading} style={{ width: '100%', paddingRight: '40px' }} />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                {errors.password && <span style={{ color: 'var(--danger)', fontSize: '0.85rem', marginTop: '4px', display: 'block' }}>{errors.password}</span>}
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '6px', fontWeight: '700', fontSize: '0.9rem', color: 'var(--text-heading)' }}>Confirm Password</label>
                <div style={{ position: 'relative' }}>
                  <input name="confirmPassword" type={showConfirmPassword ? 'text' : 'password'} className="input-field" placeholder="••••••••" value={formData.confirmPassword} onChange={handleChange} disabled={isLoading} style={{ width: '100%', paddingRight: '40px' }} />
                  <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
                    {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                {errors.confirmPassword && <span style={{ color: 'var(--danger)', fontSize: '0.85rem', marginTop: '4px', display: 'block' }}>{errors.confirmPassword}</span>}
              </div>

              <div style={{ marginTop: '4px', padding: '10px 12px', backgroundColor: 'var(--bg-main)', borderRadius: '12px', border: '1px solid var(--border)' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.85rem', color: 'var(--text-muted)', cursor: 'pointer' }}>
                  <input type="checkbox" name="termsAccepted" checked={formData.termsAccepted} onChange={handleChange} disabled={isLoading} style={{ margin: 0, padding: 0 }} />
                  <span>I understand this grants permanent super-admin privileges.</span>
                </label>
              </div>
              {errors.termsAccepted && <span style={{ color: 'var(--danger)', fontSize: '0.85rem', marginTop: '-10px' }}>{errors.termsAccepted}</span>}

              <div style={{ display: 'flex', gap: '12px', marginTop: '8px' }}>
                <button type="button" className="btn btn-secondary" onClick={() => setStep(1)} disabled={isLoading} style={{ padding: '16px', borderRadius: '16px', flex: '0.3' }}>
                  Back
                </button>
                <button type="submit" className="btn btn-primary" style={{ padding: '16px', fontSize: '1.05rem', borderRadius: '16px', flex: '1' }} disabled={isLoading || !isPasswordValid(formData.password) || !formData.termsAccepted}>
                  {isLoading ? 'Verifying...' : 'Verify & Register'}
                </button>
              </div>
            </form>
          )}
          
          <div style={{ marginTop: '24px', textAlign: 'center', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
            Already initialized? <Link to="/admin/login" style={{ color: 'var(--primary)', fontWeight: '700' }}>Login securely</Link>
          </div>
          
        </div>
      </div>
    </div>
  );
};

export default AdminSignup;
