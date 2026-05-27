import React, { useState, useRef } from "react";
import { Link } from "react-router-dom";
import { KeyRound, AlertCircle, CheckCircle2, Eye, EyeOff, ShieldCheck, Info } from "lucide-react";
import { API_ROUTES } from "../../constants/apiConstants";

const AdminForgotPassword: React.FC = () => {
  const [step, setStep] = useState(1); // 1: Request OTP, 2: Reset Form, 3: Success
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showPasswordInfo, setShowPasswordInfo] = useState(false);
  
  const [error, setError] = useState("");
  const [apiError, setApiError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const otpRefs = useRef<(HTMLInputElement | null)[]>([]);
  const passwordRef = useRef<HTMLInputElement>(null);

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

  const handleOtpChange = (index: number, val: string) => {
    if (!/^[0-9]*$/.test(val)) return;
    const char = val.slice(-1);
    const currentOtp = otp.split('');
    while(currentOtp.length < 6) currentOtp.push('');
    currentOtp[index] = char;
    const newOtp = currentOtp.join('');
    setOtp(newOtp);
    if (error) setError('');
    setApiError('');
    if (char && index < 5 && otpRefs.current[index + 1]) {
      otpRefs.current[index + 1]?.focus();
    } else if (char && index === 5) {
      passwordRef.current?.focus();
    }
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0 && otpRefs.current[index - 1]) {
      otpRefs.current[index - 1]?.focus();
    }
  };

  const handleOtpPaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').slice(0, 6).replace(/[^0-9]/g, '');
    if (pastedData) {
      setOtp(pastedData);
      if (error) setError('');
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

    if (!email.trim()) {
      setError("Email is required");
      return;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("Please enter a valid email address");
      return;
    }

    setError("");
    setIsLoading(true);
    setApiError("");

    try {
      const response = await fetch(API_ROUTES.AUTH.FORGOT_PASSWORD, {
        method: "POST",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();
      if (!response.ok) {
        setApiError(data.error || "Failed to send reset link. Please try again.");
        setIsLoading(false);
        return;
      }
      setStep(2);
      setIsLoading(false);
    } catch (err) {
      setApiError("Failed to connect to verification server. Please try again.");
      setIsLoading(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!otp || otp.length !== 6) {
      setError("A valid 6-digit OTP is required");
      return;
    }
    if (!password) {
      setError("Password is required");
      return;
    }
    if (!isPasswordValid(password)) {
      setError("Password does not meet requirements");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    setError("");
    setIsLoading(true);
    setApiError("");
    try {
      const response = await fetch(API_ROUTES.AUTH.RESET_PASSWORD, {
        method: "POST",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify({
          otp,
          password,
          confirmPassword,
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        setApiError(data.error || "Failed to reset password. Please verify your OTP.");
        setIsLoading(false);
        return;
      }
      setStep(3);
      setIsLoading(false);
    } catch (err) {
      setApiError("Failed to connect to verification server. Please try again.");
      setIsLoading(false);
    }
  };

  const pRules = validatePassword(password);

  return (
    <div className="auth-page" style={{ backgroundColor: "#f8fafc" }}>
      <div className="container auth-page-container">
        <div className="card auth-card animate-slide">
          {step === 1 && (
            <>
              <div className="auth-card-header text-center">
                <div style={{ display: "flex", justifyContent: "center", margin: "0 auto 16px" }}>
                  <div style={{ width: "64px", height: "64px", borderRadius: "16px", background: "var(--primary-light)", display: "grid", placeItems: "center", color: "var(--primary)" }}>
                    <KeyRound size={32} />
                  </div>
                </div>
                <h1 className="auth-title">Forgot Password</h1>
                <p className="auth-subtitle">
                  Enter your email address and we'll send you an OTP to reset your password.
                </p>
              </div>
              {apiError && (
                <div style={{ padding: "12px 16px", backgroundColor: "rgba(239, 68, 68, 0.1)", color: "var(--danger)", borderRadius: "8px", marginBottom: "20px", display: "flex", alignItems: "center", gap: "8px", fontSize: "0.9rem" }}>
                  <AlertCircle size={18} />
                  {apiError}
                </div>
              )}
              <form onSubmit={handleSendOtp} className="auth-form" noValidate>
                <div className="input-group">
                  <label className="input-label" htmlFor="email">
                    Email Address
                  </label>
                  <input
                    id="email"
                    type="email"
                    className="input-field"
                    placeholder="admin@petbuddy.com"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      if (error) setError("");
                    }}
                    disabled={isLoading}
                  />
                  {error && <span style={{ color: "var(--danger)", fontSize: "0.85rem" }}>{error}</span>}
                </div>
                <button
                  type="submit"
                  className="btn btn-primary btn-auth-submit"
                  style={{ marginTop: "8px" }}
                  disabled={isLoading}
                >
                  {isLoading ? "Sending OTP..." : "Send Verification OTP"}
                </button>

                <div className="auth-footer" style={{ marginTop: "24px" }}>
                  <Link to="/admin/login" className="auth-link">
                    ← Back to Login
                  </Link>
                </div>
              </form>
            </>
          )}
          {step === 2 && (
            <>
              <div className="auth-card-header text-center">
                <div style={{ display: "flex", justifyContent: "center", margin: "0 auto 16px" }}>
                  <div style={{ width: "64px", height: "64px", borderRadius: "16px", background: "var(--primary-light)", display: "grid", placeItems: "center", color: "var(--primary)" }}>
                    <ShieldCheck size={32} />
                  </div>
                </div>
                <h1 className="auth-title">Verify & Reset</h1>
                <p className="auth-subtitle">
                  Enter the 6-digit OTP sent to <strong>{email}</strong> and set your new password.
                </p>
              </div>
              {apiError && (
                <div style={{ padding: "12px 16px", backgroundColor: "rgba(239, 68, 68, 0.1)", color: "var(--danger)", borderRadius: "8px", marginBottom: "20px", display: "flex", alignItems: "center", gap: "8px", fontSize: "0.9rem" }}>
                  <AlertCircle size={18} />
                  {apiError}
                </div>
              )}
              <form onSubmit={handleResetPassword} className="auth-form" noValidate>
                <div className="input-group">
                  <label className="input-label" htmlFor="otp">
                    6-Digit OTP
                  </label>
                  <div style={{ display: "flex", gap: "8px", justifyContent: "space-between" }} onPaste={handleOtpPaste}>
                    {[0, 1, 2, 3, 4, 5].map((index) => (
                      <input
                        key={index}
                        ref={(el) => { otpRefs.current[index] = el; }}
                        type="text"
                        maxLength={1}
                        value={otp[index] || ""}
                        onChange={(e) => handleOtpChange(index, e.target.value)}
                        onKeyDown={(e) => handleOtpKeyDown(index, e)}
                        disabled={isLoading}
                        className="input-field"
                        style={{
                          width: "calc(100% / 6 - 8px)",
                          aspectRatio: "1/1",
                          fontSize: "1.5rem",
                          fontWeight: "bold",
                          textAlign: "center",
                          padding: "0",
                          borderRadius: "12px"
                        }}
                      />
                    ))}
                  </div>
                  {error && !otp && <span style={{ color: "var(--danger)", fontSize: "0.85rem", marginTop: "8px", display: "block" }}>{error}</span>}
                </div>
                <div className="input-group">
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '6px' }}>
                    <label className="input-label" htmlFor="password" style={{ margin: 0 }}>
                      New Password
                    </label>
                    <div 
                      onMouseEnter={() => setShowPasswordInfo(true)} 
                      onMouseLeave={() => setShowPasswordInfo(false)}
                      style={{ position: 'relative', display: 'flex', alignItems: 'center', color: 'var(--text-muted)', cursor: 'help' }}
                    >
                      <Info size={16} />
                      {showPasswordInfo && (
                        <div style={{ position: 'absolute', bottom: '100%', left: '50%', transform: 'translateX(-50%)', marginBottom: '8px', background: 'var(--bg-card)', padding: '14px', borderRadius: '12px', boxShadow: '0 10px 25px rgba(0,0,0,0.1)', border: '1px solid var(--border)', width: '260px', zIndex: 10 }}>
                          <div style={{ fontSize: '0.85rem', fontWeight: 'bold', marginBottom: '8px', color: 'var(--text-heading)' }}>Password Requirements:</div>
                          <div style={{ fontSize: '0.85rem', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                            <div style={{ color: pRules.length ? 'var(--success)' : 'var(--text-muted)' }}>✓ At least 8 characters</div>
                            <div style={{ color: pRules.upper ? 'var(--success)' : 'var(--text-muted)' }}>✓ At least 1 uppercase letter</div>
                            <div style={{ color: pRules.lower ? 'var(--success)' : 'var(--text-muted)' }}>✓ At least 1 lowercase letter</div>
                            <div style={{ color: pRules.number ? 'var(--success)' : 'var(--text-muted)' }}>✓ At least 1 number</div>
                            <div style={{ color: pRules.special ? 'var(--success)' : 'var(--text-muted)' }}>✓ At least 1 special character</div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                  <div style={{ position: "relative" }}>
                    <input
                      ref={passwordRef}
                      id="password"
                      type={showPassword ? "text" : "password"}
                      className="input-field"
                      style={{ width: "100%", paddingRight: "40px" }}
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => {
                        setPassword(e.target.value);
                        if (error) setError("");
                      }}
                      disabled={isLoading}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      style={{ position: "absolute", right: "12px", top: "50%", transform: "translateY(-50%)", background: "none", border: "none", color: "var(--text-muted)", cursor: "pointer" }}
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>
                <div className="input-group">
                  <label className="input-label" htmlFor="confirmPassword">
                    Confirm New Password
                  </label>
                  <div style={{ position: "relative" }}>
                    <input
                      id="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      className="input-field"
                      placeholder="••••••••"
                      value={confirmPassword}
                      onChange={(e) => {
                        setConfirmPassword(e.target.value);
                        if (error) setError("");
                      }}
                      disabled={isLoading}
                      style={{ width: "100%", paddingRight: "40px" }}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      style={{ position: "absolute", right: "12px", top: "50%", transform: "translateY(-50%)", background: "none", border: "none", color: "var(--text-muted)", cursor: "pointer" }}
                    >
                      {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                  {error && password !== confirmPassword && <span style={{ color: "var(--danger)", fontSize: "0.85rem" }}>{error}</span>}
                </div>
                <button
                  type="submit"
                  className="btn btn-primary btn-auth-submit"
                  style={{ marginTop: "16px" }}
                  disabled={isLoading || otp.length !== 6 || !isPasswordValid(password)}
                >
                  {isLoading ? "Resetting Password..." : "Reset Password"}
                </button>
                <button
                  type="button"
                  className="btn btn-secondary"
                  style={{ width: "100%", marginTop: "8px" }}
                  onClick={() => setStep(1)}
                  disabled={isLoading}
                >
                  Back
                </button>
              </form>
            </>
          )}
          {step === 3 && (
            <div style={{ textAlign: "center", padding: "20px 0" }}>
              <div style={{ color: "var(--success)", display: "flex", justifyContent: "center", marginBottom: "16px" }}>
                <CheckCircle2 size={48} />
              </div>
              <h3 style={{ marginBottom: "12px", fontSize: "1.25rem" }}>
                Password Reset Successful
              </h3>
              <p style={{ color: "var(--text-muted)", marginBottom: "24px", lineHeight: "1.6" }}>
                Your password has been successfully updated. You can now login to the admin portal with your new credentials.
              </p>
              <Link to="/admin/login" className="btn btn-primary" style={{ width: "100%" }}>
                Go to Login
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminForgotPassword;
