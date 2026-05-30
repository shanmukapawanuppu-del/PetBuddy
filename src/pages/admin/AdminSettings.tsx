import React, { useState } from 'react';
import { useAdminAuth } from '../../components/admin/AdminAuthContext';
import PremiumSidebar from '../../components/admin/PremiumSidebar';
import { 
  User, 
  Edit2, 
  KeyRound, 
  Eye, 
  EyeOff, 
  Bell, 
  TicketPercent, 
  Info
} from 'lucide-react';
import '../../components/admin/PremiumTable.css';

const AdminSettings: React.FC = () => {
  const { adminUser } = useAdminAuth();
  
  // Profile State
  const [profile, setProfile] = useState({
    fullName: adminUser?.fullName || 'SaiKrishna Mateti',
    email: adminUser?.email || 'sai.mateti@petbuddy.',
    phone: '+91 98765 43210',
    role: 'Super Admin'
  });

  // Security State
  const [passwords, setPasswords] = useState({
    current: '••••••••',
    newPass: '••••••••',
    confirm: '••••••••'
  });
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [showPasswordInfo, setShowPasswordInfo] = useState(false);

  const validatePassword = (pass: string) => {
    return {
      length: pass.length >= 8,
      upper: /[A-Z]/.test(pass),
      lower: /[a-z]/.test(pass),
      number: /[0-9]/.test(pass),
      special: /[^A-Za-z0-9]/.test(pass),
    };
  };

  const pRules = validatePassword(passwords.newPass);

  // Notifications State
  const [notifications, setNotifications] = useState({
    emailAlerts: true,
    inAppAlerts: true,
    complaintAlerts: true,
    reviewAlerts: false,
    bookingAlerts: true
  });

  // Commission State
  const [commission, setCommission] = useState('15');

  // Handlers
  const handleProfileSave = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Saving profile...', profile);
  };

  const handlePasswordUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Updating password...');
  };

  const handlePreferencesSave = () => {
    console.log('Saving preferences...', notifications);
  };

  const handleCommissionUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Updating commission to...', commission);
  };

  return (
    <div className="premium-dashboard">
      <PremiumSidebar activeId="settings" />
      <main className="dashboard-main" style={{ backgroundColor: '#eef4f9' }}>
        <div className="dashboard-content" style={{ width: '100%', maxWidth: '1400px', margin: '0 auto', padding: '40px' }}>
          
          {/* Header */}
          <div style={{ marginBottom: '32px' }}>
            <h1 style={{ fontSize: '2.2rem', fontWeight: '800', color: '#0f172a', letterSpacing: '-0.02em', margin: '0 0 6px 0' }}>
              System Settings
            </h1>
            <p style={{ color: '#64748b', fontSize: '1.05rem', margin: 0 }}>
              Configure platform preferences and admin profile
            </p>
          </div>

          {/* Grid Layout Container */}
          <div className="settings-grid-layout">
            
            {/* LEFT COLUMN */}
            <div className="settings-col-left">
              
              {/* Left Column now starts with Security & Password */}
              {/* 2. Security & Password Card */}
              <div className="settings-card">
                <div className="card-header-row">
                  <div className="icon-badge amber-badge">
                    <KeyRound size={20} />
                  </div>
                  <h2 className="card-title">Security & Password</h2>
                </div>

                <form className="security-form" onSubmit={handlePasswordUpdate}>
                  <div className="settings-input-group full-width">
                    <label>CURRENT PASSWORD</label>
                    <div className="password-input-wrapper">
                      <input 
                        type={showCurrent ? "text" : "password"} 
                        value={passwords.current} 
                        onChange={e => setPasswords({...passwords, current: e.target.value})} 
                      />
                      <button type="button" className="eye-btn" onClick={() => setShowCurrent(!showCurrent)}>
                        {showCurrent ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>
                  </div>

                  <div className="form-grid-2">
                    <div className="settings-input-group">
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <label style={{ margin: 0 }}>NEW PASSWORD</label>
                        <div 
                          onMouseEnter={() => setShowPasswordInfo(true)} 
                          onMouseLeave={() => setShowPasswordInfo(false)}
                          style={{ position: 'relative', display: 'flex', alignItems: 'center', color: '#94a3b8', cursor: 'help' }}
                        >
                          <Info size={14} />
                          {showPasswordInfo && (
                            <div style={{ position: 'absolute', bottom: '100%', left: '50%', transform: 'translateX(-50%)', marginBottom: '8px', background: 'white', padding: '14px', borderRadius: '12px', boxShadow: '0 10px 25px rgba(0,0,0,0.1)', border: '1px solid #e2e8f0', width: '260px', zIndex: 10 }}>
                              <div style={{ fontSize: '0.85rem', fontWeight: 'bold', marginBottom: '8px', color: '#0f172a' }}>Password Requirements:</div>
                              <div style={{ fontSize: '0.85rem', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                                <div style={{ color: pRules.length ? '#0ea5e9' : '#94a3b8' }}>✓ 8 or more characters</div>
                                <div style={{ color: pRules.upper ? '#0ea5e9' : '#94a3b8' }}>✓ One big letter (A-Z)</div>
                                <div style={{ color: pRules.lower ? '#0ea5e9' : '#94a3b8' }}>✓ One small letter (a-z)</div>
                                <div style={{ color: pRules.number ? '#0ea5e9' : '#94a3b8' }}>✓ One number (0-9)</div>
                                <div style={{ color: pRules.special ? '#0ea5e9' : '#94a3b8' }}>✓ One symbol (like @, !, $)</div>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="password-input-wrapper">
                        <input 
                          type={showNew ? "text" : "password"} 
                          value={passwords.newPass} 
                          onChange={e => setPasswords({...passwords, newPass: e.target.value})} 
                        />
                        <button type="button" className="eye-btn" onClick={() => setShowNew(!showNew)}>
                          {showNew ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                      </div>
                      <div className="password-strength">
                        <div className="strength-bars">
                          <div className="bar filled"></div>
                          <div className="bar filled"></div>
                          <div className="bar filled"></div>
                          <div className="bar empty"></div>
                        </div>
                        <span className="strength-text">STRONG PASSWORD</span>
                      </div>
                    </div>

                    <div className="settings-input-group">
                      <label>CONFIRM NEW PASSWORD</label>
                      <div className="password-input-wrapper">
                        <input 
                          type={showConfirm ? "text" : "password"} 
                          value={passwords.confirm} 
                          onChange={e => setPasswords({...passwords, confirm: e.target.value})} 
                        />
                        <button type="button" className="eye-btn" onClick={() => setShowConfirm(!showConfirm)}>
                          {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="security-footer">
                    <div className="security-info">
                      {/* <Info size={14} />
                      <span>Minimum 8 characters with numbers & symbols.</span> */}
                    </div>
                    <button type="submit" className="pale-blue-btn">Update Password</button>
                  </div>
                </form>
              </div>

            </div>

            {/* RIGHT COLUMN */}
            <div className="settings-col-right">
              
              {/* 3. Notifications Card */}
              <div className="settings-card">
                <div className="card-header-row">
                  <div className="icon-badge light-blue-badge">
                    <Bell size={20} />
                  </div>
                  <h2 className="card-title">Notifications</h2>
                </div>

                <div className="notifications-list">
                  {Object.entries(notifications).map(([key, value]) => {
                    const contentMap: Record<string, { title: string, desc: string }> = {
                      emailAlerts: { title: 'Email alerts', desc: 'For daily summaries' },
                      inAppAlerts: { title: 'In-app alerts', desc: 'Real-time system updates' },
                      complaintAlerts: { title: 'Complaint alerts', desc: 'Priority user reports' },
                      reviewAlerts: { title: 'Review alerts', desc: 'New sitter reviews' },
                      bookingAlerts: { title: 'Booking alerts', desc: 'New transaction logs' }
                    };
                    
                    return (
                      <div key={key} className="notification-item">
                        <div className="notification-text">
                          <div className="notif-title">{contentMap[key].title}</div>
                          <div className="notif-desc">{contentMap[key].desc}</div>
                        </div>
                        <label className="design-toggle">
                          <input 
                            type="checkbox" 
                            checked={value}
                            onChange={(e) => setNotifications({...notifications, [key]: e.target.checked})}
                          />
                          <span className="design-slider"></span>
                        </label>
                      </div>
                    );
                  })}
                </div>
                
                <button onClick={handlePreferencesSave} className="pale-blue-btn full-width-btn">
                  Save Preferences
                </button>
              </div>

              {/* 4. Commission Card */}
              {/* <div className="settings-card">
                <div className="card-header-row">
                  <div className="icon-badge light-red-badge">
                    <TicketPercent size={20} />
                  </div>
                  <h2 className="card-title">Commission</h2>
                </div>

                <div className="commission-content">
                  <label className="commission-label">DEFAULT RATE (%)</label>
                  <div className="commission-input-wrapper">
                    <input 
                      type="text" 
                      value={commission}
                      onChange={e => setCommission(e.target.value)}
                    />
                    <span className="percent-symbol">%</span>
                  </div>
                  
                  <p className="commission-helper-text">
                    This rate is automatically applied to all bookings platform-wide.
                  </p>

                  <button onClick={handleCommissionUpdate} className="black-btn full-width-btn">
                    Update Commission
                  </button>
                </div>
              </div> */}

            </div>
          </div>
        </div>
      </main>

      <style>{`
        /* Global Background override for this specific screen if needed */
        .premium-dashboard {
          display: flex;
          height: 100vh;
          overflow: hidden;
        }

        .dashboard-main {
          flex: 1;
          overflow-y: auto;
        }
        
        .settings-grid-layout {
          display: grid;
          grid-template-columns: minmax(0, 1.4fr) minmax(0, 1fr);
          gap: 24px;
          align-items: start;
        }

        /* Card Setup */
        .settings-card {
          background: white;
          border-radius: 20px;
          padding: 32px;
          box-shadow: 0 4px 20px rgba(15, 23, 42, 0.03);
          margin-bottom: 24px;
          border: 1px solid rgba(226, 232, 240, 0.8);
        }

        .card-header-row {
          display: flex;
          align-items: center;
          gap: 16px;
          margin-bottom: 28px;
        }

        .icon-badge {
          width: 44px;
          height: 44px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .teal-badge { background: #e0f2fe; color: #0ea5e9; }
        .amber-badge { background: #fef3c7; color: #d97706; }
        .light-blue-badge { background: #f1f5f9; color: #3b82f6; }
        .light-red-badge { background: #fee2e2; color: #ef4444; }

        .card-title {
          font-size: 1.25rem;
          font-weight: 700;
          color: #0f172a;
          margin: 0;
        }

        /* Forms & Inputs */
        .settings-input-group {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }
        
        .settings-input-group label {
          font-size: 0.75rem;
          font-weight: 600;
          color: #94a3b8;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        .settings-input-group input {
          width: 100%;
          padding: 12px 16px;
          border: 1px solid #cbd5e1;
          border-radius: 10px;
          font-size: 0.95rem;
          color: #334155;
          transition: border-color 0.2s;
        }
        .settings-input-group input:focus {
          outline: none;
          border-color: var(--primary);
        }

        .form-grid-2 {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 20px;
        }

        /* Profile Layout */
        .profile-layout {
          display: flex;
          gap: 40px;
        }

        .profile-avatar-col {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 16px;
          width: 140px;
          flex-shrink: 0;
        }

        .avatar-wrapper {
          position: relative;
          width: 120px;
          height: 120px;
          border-radius: 20px;
        }

        .avatar-image-placeholder {
          width: 100%;
          height: 100%;
          background: linear-gradient(135deg, #0ea5e9, #0ea5e9);
          color: white;
          font-size: 3rem;
          font-weight: 700;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 24px;
        }

        .avatar-edit-btn {
          position: absolute;
          bottom: -4px;
          right: -4px;
          background: #0ea5e9;
          color: white;
          width: 32px;
          height: 32px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          border: 3px solid white;
          cursor: pointer;
        }

        .admin-id {
          font-size: 0.75rem;
          color: #94a3b8;
          font-weight: 600;
        }

        .profile-form {
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .card-action-right {
          display: flex;
          justify-content: flex-end;
          margin-top: 12px;
        }

        /* Security Layout */
        .security-form {
          display: flex;
          flex-direction: column;
          gap: 24px;
        }

        .password-input-wrapper {
          position: relative;
        }
        
        .eye-btn {
          position: absolute;
          right: 12px;
          top: 50%;
          transform: translateY(-50%);
          background: none;
          border: none;
          color: #94a3b8;
          cursor: pointer;
          display: flex;
          padding: 4px;
        }

        .password-strength {
          margin-top: 8px;
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .strength-bars {
          display: flex;
          gap: 4px;
        }

        .bar {
          height: 4px;
          flex: 1;
          border-radius: 2px;
        }
        .bar.filled { background: var(--primary); }
        .bar.empty { background: #e2e8f0; }

        .strength-text {
          font-size: 0.7rem;
          font-weight: 700;
          color: var(--primary);
        }

        .security-footer {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-top: 12px;
        }

        .security-info {
          display: flex;
          align-items: center;
          gap: 8px;
          color: #64748b;
          font-size: 0.85rem;
        }

        /* Notifications Layout */
        .notifications-list {
          display: flex;
          flex-direction: column;
          gap: 24px;
          margin-bottom: 32px;
        }

        .notification-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .notif-title {
          font-weight: 500;
          color: #1e293b;
          font-size: 1.05rem;
          margin-bottom: 2px;
        }

        .notif-desc {
          font-size: 0.85rem;
          color: #94a3b8;
        }

        /* Commission Layout */
        .commission-content {
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          padding-top: 12px;
        }
        
        .commission-label {
          font-size: 0.75rem;
          font-weight: 600;
          color: #94a3b8;
          text-transform: uppercase;
          margin-bottom: 12px;
          width: 100%;
          text-align: left;
        }

        .commission-input-wrapper {
          position: relative;
          width: 100%;
          margin-bottom: 20px;
        }

        .commission-input-wrapper input {
          width: 100%;
          text-align: center;
          font-size: 2rem;
          font-weight: 700;
          color: #0f172a;
          padding: 20px;
          border: 1px solid #cbd5e1;
          border-radius: 12px;
          outline: none;
        }
        
        .percent-symbol {
          position: absolute;
          right: 24px;
          top: 50%;
          transform: translateY(-50%);
          font-size: 1.5rem;
          font-weight: 600;
          color: #94a3b8;
        }

        .commission-helper-text {
          font-size: 0.85rem;
          color: #64748b;
          margin-bottom: 32px;
          line-height: 1.5;
        }

        /* Buttons */
        .teal-btn {
          background: #0ea5e9;
          color: white;
          padding: 12px 24px;
          border-radius: 10px;
          font-weight: 600;
          border: none;
          cursor: pointer;
        }
        
        .pale-blue-btn {
          background: #e0f2fe;
          color: #0284c7;
          padding: 12px 24px;
          border-radius: 10px;
          font-weight: 600;
          border: none;
          cursor: pointer;
          transition: all 0.2s;
        }
        
        .pale-blue-btn:hover {
          background: #0ea5e9;
          color: white;
        }

        .outline-btn {
          background: white;
          color: #475569;
          border: 1px solid #cbd5e1;
          padding: 14px;
          border-radius: 12px;
          font-weight: 600;
          cursor: pointer;
          transition: background 0.2s;
        }
        .outline-btn:hover { background: #0ea5e9; color: white; }

        .black-btn {
          background: #eeeff2ff;
          color: #0ea5e9;
          border: none;
          padding: 14px;
          border-radius: 12px;
          font-weight: 600;
          cursor: pointer;
        }

        .black-btn: hover {
          background: #0ea5e9;
          color: white
        }

        .full-width-btn {
          width: 100%;
        }

        /* Design Toggle */
        .design-toggle {
          position: relative;
          display: inline-block;
          width: 48px;
          height: 26px;
        }
        .design-toggle input { opacity: 0; width: 0; height: 0; }
        .design-slider {
          position: absolute;
          cursor: pointer;
          top: 0; left: 0; right: 0; bottom: 0;
          background-color: #e2e8f0;
          transition: .3s;
          border-radius: 34px;
        }
        .design-slider:before {
          position: absolute;
          content: "";
          height: 20px; width: 20px;
          left: 3px; bottom: 3px;
          background-color: white;
          transition: .3s;
          border-radius: 50%;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }
        .design-toggle input:checked + .design-slider {
          background-color: #0ea5e9;
        }
        .design-toggle input:checked + .design-slider:before {
          transform: translateX(22px);
        }

        @media (max-width: 1024px) {
          .settings-grid-layout {
            grid-template-columns: 1fr;
          }
          .profile-layout {
            flex-direction: column;
            gap: 24px;
          }
          .profile-avatar-col {
            flex-direction: row;
            align-items: center;
            width: 100%;
          }
          .form-grid-2 {
            grid-template-columns: 1fr;
          }
          .security-footer {
            flex-direction: column;
            align-items: flex-start;
            gap: 16px;
          }
        }
      `}</style>
    </div>
  );
};

export default AdminSettings;
