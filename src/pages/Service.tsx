import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, Heart, ShieldCheck, Clock } from 'lucide-react';

const Service: React.FC = () => {
  return (
    <div className="page-content page-section animate-fade">
      <div className="container">
        <div className="service-hero card text-center">
          <div className="service-hero-icon">
            <Sparkles size={32} />
          </div>
          <h1 className="section-title">Our Service Promise</h1>
          <p className="section-desc">
            PetBuddy connects you with trusted local caregivers who treat your pet like family. Every booking includes safety checks, clear communication, and photo updates.
          </p>
        </div>

        <div className="grid-4 service-grid">
          <div className="service-card card">
            <ShieldCheck size={32} className="service-icon" />
            <h3>Verified Caregivers</h3>
            <p>Sitters are screened, identity-verified, and rated by real pet parents.</p>
          </div>
          <div className="service-card card">
            <Heart size={32} className="service-icon" />
            <h3>Home Comfort</h3>
            <p>Pets stay in a calm, loving home instead of a kennel or shelter.</p>
          </div>
          <div className="service-card card">
            <Clock size={32} className="service-icon" />
            <h3>Flexible Booking</h3>
            <p>Book by the day, overnight, or for longer stays based on your needs.</p>
          </div>
          <div className="service-card card">
            <Sparkles size={32} className="service-icon" />
            <h3>Trusted Support</h3>
            <p>We’re here to help every step of the way, from search to pickup.</p>
          </div>
        </div>

        <div className="section-cta text-center">
          <Link to="/caregivers" className="btn btn-primary btn-nav">
            Book a Service
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Service;
