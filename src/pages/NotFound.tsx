import React from 'react';
import { Link } from 'react-router-dom';

const NotFound: React.FC = () => {
  return (
    <div className="notfound-page page-center animate-fade">
      <div className="notfound-card card">
        <div className="notfound-header">
          <span className="notfound-code">404</span>
          <h1 className="notfound-title">Page Not Found</h1>
        </div>
        <p className="notfound-text">
          The page you are looking for doesn't exist, but you can explore our top features or read customer testimonials instead.
        </p>
        <div className="notfound-actions">
          <Link to="/home" className="btn btn-primary btn-nav">
            Back to Home
          </Link>
          <Link to="/features" className="btn btn-secondary btn-nav">
            View Features
          </Link>
          <Link to="/testimonials" className="btn btn-secondary btn-nav">
            Read Testimonials
          </Link>
        </div>
      </div>
      <style>{`
        .notfound-page {
          min-height: calc(100vh - 160px);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 50px 20px;
          text-align: center;
        }

        .notfound-card {
          max-width: 600px;
          width: 100%;
          padding: 40px;
          border-radius: 24px;
          background: var(--bg-card);
          box-shadow: var(--shadow-xl);
          border: 1px solid rgba(100, 116, 139, 0.12);
        }

        .notfound-code {
          display: inline-block;
          font-size: 4rem;
          font-weight: 900;
          letter-spacing: -0.05em;
          color: var(--primary);
          margin-bottom: 16px;
        }

        .notfound-title {
          font-size: 2.5rem;
          margin-bottom: 16px;
          color: var(--text-heading);
        }

        .notfound-text {
          color: var(--text-secondary);
          font-size: 1rem;
          line-height: 1.8;
          margin-bottom: 28px;
        }

        .notfound-actions {
          display: flex;
          flex-wrap: wrap;
          justify-content: center;
          gap: 12px;
        }

        @media (max-width: 640px) {
          .notfound-card {
            padding: 28px;
          }

          .notfound-title {
            font-size: 2rem;
          }
        }
      `}</style>
    </div>
  );
};

export default NotFound;
