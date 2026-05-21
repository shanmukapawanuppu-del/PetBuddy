import React from 'react';
import { Link } from 'react-router-dom';
import { PawPrint, Heart, Mail, Phone, MapPin, ShieldCheck } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="main-footer">
      <div className="container footer-grid">
        <div className="footer-col branding-col">
          <Link to="/home" className="logo-area footer-logo">
            <div className="logo-icon-wrapper-small">
              <PawPrint size={18} />
            </div>
            <span className="logo-text">Pet<span className="accent-text">Buddy</span></span>
          </Link>
          <p className="footer-desc">
            Connecting loving pet owners with verified local pet caregivers. Providing premium, hourly, daily, and overnight stays for absolute peace of mind.
          </p>
          <div className="trust-badge">
            <ShieldCheck size={18} className="trust-icon" />
            <span>100% Verified Sitters</span>
          </div>
        </div>

        <div className="footer-col">
          <h4 className="footer-title">Quick Links</h4>
          <ul className="footer-links">
            <li><Link to="/home">Home Page</Link></li>
            <li><Link to="/caregivers">Find Caregivers</Link></li>
            <li><a href="/home#features">Platform Features</a></li>
            <li><a href="/home#testimonials">Customer Reviews</a></li>
          </ul>
        </div>

        <div className="footer-col">
          <h4 className="footer-title">Services</h4>
          <ul className="footer-links">
            <li><Link to="/caregivers">Dog Boarding</Link></li>
            <li><Link to="/caregivers">Cat Sitting</Link></li>
            <li><Link to="/caregivers">Hourly Care</Link></li>
            <li><Link to="/caregivers">Overnight Stays</Link></li>
          </ul>
        </div>

        <div className="footer-col contact-col">
          <h4 className="footer-title">Contact Support</h4>
          <ul className="contact-details">
            <li>
              <Mail size={16} />
              <span>support@petbuddy.com</span>
            </li>
            <li>
              <Phone size={16} />
              <span>+1 (800) PET-BUDDY</span>
            </li>
            <li>
              <MapPin size={16} />
              <span>100 Loving Care Way, San Francisco</span>
            </li>
          </ul>
        </div>
      </div>

      <div className="footer-bottom">
        <div className="container bottom-container">
          <p className="copyright">
            &copy; {new Date().getFullYear()} PetBuddy Inc. All rights reserved.
          </p>
          <p className="crafted-by">
            Made with <Heart size={14} className="heart-icon animate-pulse-soft" /> for pets everywhere.
          </p>
        </div>
      </div>

      <style>{`
        .main-footer {
          background-color: #1e293b;
          color: #94a3b8;
          padding: 80px 0 30px;
          border-top: 1px solid #334155;
          margin-top: auto;
          font-size: 0.9rem;
        }
        
        .footer-grid {
          display: grid;
          grid-template-columns: 2fr 1fr 1fr 1.5fr;
          gap: 40px;
          margin-bottom: 60px;
        }
        
        .branding-col {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }
        
        .footer-logo {
          color: white !important;
          margin-bottom: 8px;
        }
        
        .logo-icon-wrapper-small {
          background: linear-gradient(135deg, var(--primary), #0ea5e9);
          color: white;
          padding: 6px;
          border-radius: var(--radius-sm);
          display: flex;
          align-items: center;
          justify-content: center;
        }
        
        .footer-desc {
          line-height: 1.6;
          color: #cbd5e1;
        }
        
        .trust-badge {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background-color: rgba(13, 148, 136, 0.15);
          color: #2dd4bf;
          padding: 8px 16px;
          border-radius: var(--radius-sm);
          font-weight: 600;
          font-size: 0.85rem;
          align-self: flex-start;
          border: 1px solid rgba(45, 212, 191, 0.2);
        }
        
        .trust-icon {
          flex-shrink: 0;
        }
        
        .footer-title {
          color: white;
          font-size: 1rem;
          font-weight: 700;
          margin-bottom: 20px;
          position: relative;
        }
        
        .footer-links {
          list-style: none;
          display: flex;
          flex-direction: column;
          gap: 12px;
        }
        
        .footer-links a {
          color: #94a3b8;
          transition: var(--transition-fast);
        }
        
        .footer-links a:hover {
          color: white;
          transform: translateX(4px);
          display: inline-block;
        }
        
        .contact-details {
          list-style: none;
          display: flex;
          flex-direction: column;
          gap: 14px;
        }
        
        .contact-details li {
          display: flex;
          align-items: center;
          gap: 10px;
          line-height: 1.4;
        }
        
        .contact-details svg {
          color: var(--primary);
          flex-shrink: 0;
        }
        
        .footer-bottom {
          border-top: 1px solid #334155;
          padding-top: 30px;
        }
        
        .bottom-container {
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 16px;
        }
        
        .heart-icon {
          color: #f43f5e;
          display: inline;
          vertical-align: middle;
        }
        
        .animate-pulse-soft {
          animation: pulse-soft 2s infinite;
        }
        
        @media (max-width: 992px) {
          .footer-grid {
            grid-template-columns: repeat(2, 1fr);
            gap: 40px;
          }
        }
        
        @media (max-width: 600px) {
          .main-footer {
            padding: 60px 0 30px;
          }
          .footer-grid {
            grid-template-columns: 1fr;
            gap: 32px;
          }
          .bottom-container {
            flex-direction: column;
            text-align: center;
          }
        }
      `}</style>
    </footer>
  );
};

export default Footer;
