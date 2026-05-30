import React, { useState } from 'react';
import { useAdminAuth } from '../../components/admin/AdminAuthContext';
import PremiumSidebar from '../../components/admin/PremiumSidebar';
import { 
  User, 
  Edit2, 
  Mail,
  Phone,
  Shield,
  Activity,
  Calendar,
  DollarSign
} from 'lucide-react';
import '../../components/admin/PremiumTable.css';

const AdminProfile: React.FC = () => {
  const { adminUser } = useAdminAuth();
  
  // Profile State
  const [profile, setProfile] = useState({
    fullName: adminUser?.fullName || 'SaiKrishna Mateti',
    email: adminUser?.email || 'sai.mateti@petbuddy.',
    phone: '+91 98765 43210',
    role: 'Super Admin'
  });

  const handleProfileSave = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Saving profile...', profile);
  };

  return (
    <div className="premium-dashboard">
      <PremiumSidebar activeId="" /> {/* No active item if you want, or you can add profile to the sidebar nav */}
      <main className="dashboard-main" style={{ backgroundColor: '#eef4f9' }}>
        <div className="dashboard-content" style={{ width: '100%', padding: '40px' }}>
          
          {/* Header */}
          <div style={{ marginBottom: '32px' }}>
            <h1 style={{ fontSize: '2.2rem', fontWeight: '800', color: '#0f172a', letterSpacing: '-0.02em', margin: '0 0 6px 0' }}>
              Admin Profile
            </h1>
            <p style={{ color: '#64748b', fontSize: '1.05rem', margin: 0 }}>
              Manage your personal information and platform identity
            </p>
          </div>

          <div className="profile-container">
            
            {/* Cover Banner & Avatar */}
            <div className="profile-banner-card">
              <div className="banner-bg"></div>
              <div className="banner-content">
                <div className="profile-avatar-large">
                  {profile.fullName.charAt(0)}
                  <button className="avatar-edit-large">
                    <Edit2 size={16} />
                  </button>
                </div>
                <div className="profile-titles">
                  <h2>{profile.fullName}</h2>
                  <div className="role-badge">
                    <Shield size={14} /> {profile.role}
                  </div>
                </div>
              </div>
            </div>

            <div className="profile-grid">
              {/* Left Form */}
              <div className="profile-card">
                <div className="card-header-row">
                  <div className="icon-badge teal-badge">
                    <User size={20} />
                  </div>
                  <h2 className="card-title">Personal Details</h2>
                </div>

                <form className="profile-form-detailed" onSubmit={handleProfileSave}>
                  <div className="form-grid-2">
                    <div className="settings-input-group">
                      <label>FULL NAME</label>
                      <div className="input-with-icon">
                        <User size={18} className="input-icon" />
                        <input 
                          type="text" 
                          value={profile.fullName} 
                          onChange={e => setProfile({...profile, fullName: e.target.value})} 
                        />
                      </div>
                    </div>
                    <div className="settings-input-group">
                      <label>ROLE</label>
                      <div className="input-with-icon">
                        <Shield size={18} className="input-icon" />
                        <input 
                          type="text" 
                          value={profile.role} 
                          disabled 
                          style={{ backgroundColor: '#f8fafc', color: '#64748b', borderColor: '#e2e8f0' }}
                        />
                      </div>
                    </div>
                    <div className="settings-input-group">
                      <label>EMAIL ADDRESS</label>
                      <div className="input-with-icon">
                        <Mail size={18} className="input-icon" />
                        <input 
                          type="text" 
                          value={profile.email} 
                          onChange={e => setProfile({...profile, email: e.target.value})} 
                        />
                      </div>
                    </div>
                    <div className="settings-input-group">
                      <label>PHONE NUMBER</label>
                      <div className="input-with-icon">
                        <Phone size={18} className="input-icon" />
                        <input 
                          type="text" 
                          value={profile.phone} 
                          onChange={e => setProfile({...profile, phone: e.target.value})} 
                        />
                      </div>
                    </div>
                  </div>
                  
                  <div className="profile-actions">
                    <button type="submit" className="pale-blue-btn" style={{ padding: '14px 32px' }}>
                      Save Changes
                    </button>
                  </div>
                </form>
              </div>

              {/* Right Stats Column */}
              <div className="stats-column">
                <div className="profile-card stat-card">
                  <div className="stat-icon-wrapper blue-bg">
                    <Calendar size={24} />
                  </div>
                  <div className="stat-info">
                    <div className="stat-value">Oct 2023</div>
                    <div className="stat-label">Member Since</div>
                  </div>
                </div>
                
                <div className="profile-card stat-card">
                  <div className="stat-icon-wrapper green-bg">
                    <Activity size={24} />
                  </div>
                  <div className="stat-info">
                    <div className="stat-value">1,492</div>
                    <div className="stat-label">Actions Performed</div>
                  </div>
                </div>

                <div className="profile-card stat-card">
                  <div className="stat-icon-wrapper purple-bg">
                    <DollarSign size={24} />
                  </div>
                  <div className="stat-info">
                    <div className="stat-value">$142.5k</div>
                    <div className="stat-label">Revenue Processed</div>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>
      </main>

      <style>{`
        .premium-dashboard {
          display: flex;
          height: 100vh;
          overflow: hidden;
        }

        .dashboard-main {
          flex: 1;
          overflow-y: auto;
        }

        .profile-container {
          display: flex;
          flex-direction: column;
          gap: 24px;
        }

        .profile-banner-card {
          background: white;
          border-radius: 20px;
          overflow: hidden;
          box-shadow: 0 4px 20px rgba(15, 23, 42, 0.03);
          border: 1px solid rgba(226, 232, 240, 0.8);
          position: relative;
        }

        .banner-bg {
          height: 140px;
          background: linear-gradient(135deg, #0ea5e9, #38bdf8);
        }

        .banner-content {
          padding: 0 40px 32px 40px;
          display: flex;
          align-items: flex-end;
          gap: 24px;
          margin-top: -50px;
        }

        .profile-avatar-large {
          width: 120px;
          height: 120px;
          border-radius: 24px;
          background: white;
          border: 4px solid white;
          box-shadow: 0 10px 25px rgba(0,0,0,0.1);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 3.5rem;
          font-weight: 800;
          color: #0ea5e9;
          position: relative;
          background-image: linear-gradient(135deg, #f0f9ff, #e0f2fe);
        }

        .avatar-edit-large {
          position: absolute;
          bottom: -4px;
          right: -4px;
          width: 36px;
          height: 36px;
          background: #0ea5e9;
          color: white;
          border-radius: 50%;
          border: 3px solid white;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: transform 0.2s;
        }
        .avatar-edit-large:hover {
          transform: scale(1.1);
        }

        .profile-titles {
          padding-bottom: 8px;
        }
        .profile-titles h2 {
          margin: 0 0 8px 0;
          font-size: 1.8rem;
          font-weight: 800;
          color: #0f172a;
        }
        .role-badge {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          background: #f1f5f9;
          color: #475569;
          padding: 6px 12px;
          border-radius: 20px;
          font-size: 0.85rem;
          font-weight: 600;
        }

        .profile-grid {
          display: grid;
          grid-template-columns: 1fr 340px;
          gap: 24px;
        }

        .profile-card {
          background: white;
          border-radius: 20px;
          padding: 32px;
          box-shadow: 0 4px 20px rgba(15, 23, 42, 0.03);
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

        .card-title {
          font-size: 1.25rem;
          font-weight: 700;
          color: #0f172a;
          margin: 0;
        }

        .form-grid-2 {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 24px;
        }

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

        .input-with-icon {
          position: relative;
        }

        .input-icon {
          position: absolute;
          left: 14px;
          top: 50%;
          transform: translateY(-50%);
          color: #94a3b8;
        }

        .input-with-icon input {
          width: 100%;
          padding: 14px 16px 14px 42px;
          border: 1px solid #cbd5e1;
          border-radius: 12px;
          font-size: 0.95rem;
          color: #334155;
          transition: border-color 0.2s;
        }
        .input-with-icon input:focus {
          outline: none;
          border-color: #0ea5e9;
        }

        .profile-actions {
          margin-top: 32px;
          display: flex;
          justify-content: flex-end;
        }

        .pale-blue-btn {
          background: #e0f2fe;
          color: #0284c7;
          padding: 12px 24px;
          border-radius: 12px;
          font-weight: 600;
          border: none;
          cursor: pointer;
          transition: all 0.2s;
        }
        .pale-blue-btn:hover {
          background: #0ea5e9;
          color: white;
        }

        .stats-column {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .stat-card {
          padding: 24px;
          display: flex;
          align-items: center;
          gap: 20px;
        }

        .stat-icon-wrapper {
          width: 56px;
          height: 56px;
          border-radius: 16px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .blue-bg { background: #e0f2fe; color: #0284c7; }
        .green-bg { background: #dcfce7; color: #16a34a; }
        .purple-bg { background: #f3e8ff; color: #9333ea; }

        .stat-info {
          display: flex;
          flex-direction: column;
        }
        .stat-value {
          font-size: 1.4rem;
          font-weight: 800;
          color: #0f172a;
        }
        .stat-label {
          font-size: 0.85rem;
          color: #64748b;
          font-weight: 500;
        }

        @media (max-width: 1024px) {
          .profile-grid {
            grid-template-columns: 1fr;
          }
          .form-grid-2 {
            grid-template-columns: 1fr;
          }
          .banner-content {
            flex-direction: column;
            align-items: center;
            text-align: center;
            padding: 0 20px 32px 20px;
            margin-top: -60px;
          }
        }
      `}</style>
    </div>
  );
};

export default AdminProfile;
