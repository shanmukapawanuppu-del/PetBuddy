import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, Heart, Clock } from 'lucide-react';

const Features: React.FC = () => {
  const features = [
    {
      icon: <ShieldCheck size={36} />,
      title: '100% Identity Verified',
      desc: 'Every caregiver passes a rigorous background check, residential safety check, and personality assessment.'
    },
    {
      icon: <Heart size={36} />,
      title: 'Loving Home Environment',
      desc: 'No cold cages or noisy kennels. Your pet stays in a comfortable, loving, verified residential home.'
    },
    {
      icon: <Clock size={36} />,
      title: 'Flexible Care Scheduling',
      desc: 'Customize bookings on an hourly, daily, or overnight basis to perfectly match your travel plans.'
    }
  ];

  return (
    <div className="page-content page-section animate-fade">
      <div className="container">
        <div className="section-header text-center">
          <span className="section-pre">Features</span>
          <h1 className="section-title">What makes PetBuddy special</h1>
          <p className="section-desc">Explore the features that keep your pet safe, happy, and cared for while you’re away.</p>
        </div>

        <div className="grid-3 features-grid">
          {features.map((feature, index) => (
            <div key={index} className="feature-item card">
              <div className="feature-icon-wrapper">{feature.icon}</div>
              <h3 className="feature-title">{feature.title}</h3>
              <p className="feature-desc">{feature.desc}</p>
            </div>
          ))}
        </div>

        <div className="section-cta text-center">
          <Link to="/caregivers" className="btn btn-primary btn-nav">
            Browse Caregivers
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Features;
