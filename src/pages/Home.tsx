import React, { useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ShieldCheck, Heart, Clock, Star, PartyPopper, Briefcase, PlaneTakeoff, ShieldAlert, Sparkles, Search, Compass } from 'lucide-react';
import { CAREGIVERS } from '../data/caregivers';
import CaregiverCard from '../components/CaregiverCard';

const Home: React.FC = () => {
  const location = useLocation();

  useEffect(() => {
    if (location.hash) {
      const element = document.querySelector(location.hash) as HTMLElement | null;
      if (element) {
        setTimeout(() => {
          element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 50);
      }
    }
  }, [location.hash]);

  // Get top 3 rated caregivers for spotlight
  const spotlightSitters = [...CAREGIVERS]
    .sort((a, b) => b.rating - a.rating)
    .slice(0, 3);

  const scenarios = [
    {
      icon: <PartyPopper size={28} className="scenario-icon orange" />,
      title: "Weddings & Ceremonies",
      desc: "Attend family unions knowing your best friend is playing safely nearby."
    },
    {
      icon: <Briefcase size={28} className="scenario-icon teal" />,
      title: "Business Travel",
      desc: "Keep your work trip stress-free while we cover feed & exercise schedules."
    },
    {
      icon: <PlaneTakeoff size={28} className="scenario-icon blue" />,
      title: "Vacations & Trips",
      desc: "Take that relaxing holiday with peace of mind and constant photo updates."
    },
    {
      icon: <ShieldAlert size={28} className="scenario-icon rose" />,
      title: "Emergency Travel",
      desc: "Immediate, last-minute booking options for unexpected medical or urgent trips."
    }
  ];

  const features = [
    {
      icon: <ShieldCheck size={36} />,
      title: "100% Identity Verified",
      desc: "Every caregiver passes a rigorous background check, residential safety check, and personality assessment."
    },
    {
      icon: <Heart size={36} />,
      title: "Loving Home Environment",
      desc: "No cold cages or noisy kennels. Your pet stays in a comfortable, loving, verified residential home."
    },
    {
      icon: <Clock size={36} />,
      title: "Flexible Care Scheduling",
      desc: "Customize bookings on an hourly, daily, or overnight basis to perfectly match your travel plans."
    }
  ];

  const testimonials = [
    {
      name: "Monica Geller",
      petName: "Chappy (Frenchie)",
      rating: 5,
      text: "We booked Sarah for our wedding weekend. We were super nervous, but she sent us beautiful photo updates every few hours! Chappy had a total blast and was so relaxed when we picked him up.",
      avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=100&h=100"
    },
    {
      name: "Chandler Bing",
      petName: "Waffles (Calico)",
      rating: 5,
      text: "Marcus is an absolute professional. Waffles usually hates new environments, but Marcus's quiet, purr-friendly apartment was perfect. Will 100% book again for my next business trip!",
      avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=100&h=100"
    }
  ];

  return (
    <div className="home-page animate-fade">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="container hero-container">
          <div className="hero-content">
            <div className="hero-badge badge badge-primary animate-float">
              <Sparkles size={14} />
              <span>Pet Care Reinvented</span>
            </div>
            <h1 className="hero-title">
              Trusted pet care, <br />
              <span className="accent-gradient">whenever life takes you away</span>
            </h1>
            <p className="hero-subtitle">
              Connect with verified local caregivers who host your pet in a loving home environment. Perfect for weddings, business trips, holidays, or short-notice emergencies.
            </p>
            <div className="hero-actions">
              <Link to="/caregivers" className="btn btn-primary btn-hero-primary">
                <Search size={18} />
                <span>Find a Pet Sitter</span>
              </Link>
              <a href="#features" className="btn btn-secondary btn-hero-secondary">
                <Compass size={18} />
                <span>Learn More</span>
              </a>
            </div>
          </div>
          <div className="hero-image-area">
            <div className="main-hero-image-wrapper">
              <img
                src="https://images.unsplash.com/photo-1415369629372-26f2fe60c467?auto=format&fit=crop&q=80&w=600&h=600"
                alt="Cozy golden retriever with owner"
                className="main-hero-image"
              />
              <div className="floating-stat-card">
                <div className="stat-avatar-group">
                  <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=40&h=40" alt="Avatar" />
                  <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=40&h=40" alt="Avatar" />
                </div>
                <div>
                  <div className="stat-stars">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} size={12} fill="var(--secondary)" color="var(--secondary)" />
                    ))}
                  </div>
                  <p className="stat-text">4.9/5 Average Sitter Rating</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Scenarios Grid */}
      <section className="scenarios-section">
        <div className="container">
          <div className="section-header">
            <span className="section-pre">Scenarios</span>
            <h2 className="section-title">When do pet parents use PetBuddy?</h2>
            <p className="section-desc">Life moves fast. We ensure your pet's happiness is never compromised when plans change.</p>
          </div>
          <div className="grid-4 scenario-grid">
            {scenarios.map((sc, idx) => (
              <div key={idx} className="card scenario-card">
                <div className="scenario-icon-box">{sc.icon}</div>
                <h3 className="scenario-title">{sc.title}</h3>
                <p className="scenario-desc-text">{sc.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Trust & Features Section */}
      <section id="features" className="features-section">
        <div className="container">
          <div className="section-header text-center">
            <span className="section-pre">Why PetBuddy</span>
            <h2 className="section-title">Designed for ultimate peace of mind</h2>
            <p className="section-desc">Safety, transparency, and high quality comfort are at the center of everything we do.</p>
          </div>
          <div className="grid-3 features-grid">
            {features.map((feat, idx) => (
              <div key={idx} className="feature-item">
                <div className="feature-icon-wrapper">{feat.icon}</div>
                <h3 className="feature-title">{feat.title}</h3>
                <p className="feature-desc">{feat.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Caregiver Spotlight Section */}
      <section className="spotlight-section">
        <div className="container">
          <div className="section-header-row">
            <div>
              <span className="section-pre">Sitter Spotlight</span>
              <h2 className="section-title">Top-Rated Caregivers Near You</h2>
              <p className="section-desc">Highly requested, verified professionals with exceptional community feedback.</p>
            </div>
            <Link to="/caregivers" className="btn btn-secondary">
              <span>View All Caregivers</span>
            </Link>
          </div>
          <div className="grid-3 spotlight-grid">
            {spotlightSitters.map((sitter) => (
              <CaregiverCard key={sitter.id} caregiver={sitter} />
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="testimonials-section">
        <div className="container">
          <div className="section-header">
            <span className="section-pre">Testimonials</span>
            <h2 className="section-title">What other pet parents say</h2>
            <p className="section-desc">Read reviews from our community of happy pets and satisfied owners.</p>
          </div>
          <div className="grid-2 testimonial-grid">
            {testimonials.map((t, idx) => (
              <div key={idx} className="card testimonial-card">
                <div className="testimonial-header">
                  <img src={t.avatar} alt={t.name} className="testimonial-avatar" />
                  <div>
                    <h4 className="testimonial-name">{t.name}</h4>
                    <p className="testimonial-pet">{t.petName}</p>
                  </div>
                  <div className="testimonial-stars">
                    {[...Array(t.rating)].map((_, i) => (
                      <Star key={i} size={14} fill="var(--secondary)" color="var(--secondary)" />
                    ))}
                  </div>
                </div>
                <p className="testimonial-text">"{t.text}"</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-bottom-section">
        <div className="container cta-container card">
          <div className="cta-content">
            <h2 className="cta-title">Your pet deserves the best care.</h2>
            <p className="cta-desc">Join thousands of happy pet parents today. Book verified, safe, and loving care in minutes.</p>
            <Link to="/caregivers" className="btn btn-amber btn-cta-bottom animate-pulse-soft">
              Find a Trusted Sitter
            </Link>
          </div>
        </div>
      </section>

      <style>{`
        .home-page {
          padding-bottom: 80px;
        }
        
        .section-header {
          margin-bottom: 48px;
          text-align: left;
        }
        
        .section-header.text-center {
          text-align: center;
        }
        
        .section-pre {
          font-size: 0.8rem;
          font-weight: 800;
          text-transform: uppercase;
          letter-spacing: 1.5px;
          color: var(--primary);
          display: block;
          margin-bottom: 8px;
        }
        
        .section-title {
          font-size: 2.2rem;
          font-weight: 800;
          color: var(--text-heading);
          letter-spacing: -0.5px;
          margin-bottom: 12px;
          line-height: 1.2;
        }
        
        .section-desc {
          font-size: 1.1rem;
          color: var(--text-muted);
          max-width: 600px;
          line-height: 1.5;
        }
        
        .text-center .section-desc {
          margin-left: auto;
          margin-right: auto;
        }

        /* Hero CSS */
        .hero-section {
          padding: 80px 0 100px;
          background: radial-gradient(circle at 80% 20%, rgba(13, 148, 136, 0.05), transparent 50%);
        }
        
        .hero-container {
          display: grid;
          grid-template-columns: 1.2fr 1fr;
          gap: 60px;
          align-items: center;
        }
        
        .hero-content {
          text-align: left;
        }
        
        .hero-badge {
          margin-bottom: 24px;
          align-self: flex-start;
          display: inline-flex;
        }
        
        .hero-title {
          font-size: 3.5rem;
          font-weight: 850;
          color: var(--text-heading);
          line-height: 1.15;
          letter-spacing: -1.5px;
          margin-bottom: 24px;
        }
        
        .accent-gradient {
          background: linear-gradient(135deg, var(--primary), #0ea5e9);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }
        
        .hero-subtitle {
          font-size: 1.15rem;
          line-height: 1.6;
          color: var(--text-main);
          margin-bottom: 40px;
          max-width: 580px;
        }
        
        .hero-actions {
          display: flex;
          gap: 16px;
          flex-wrap: wrap;
        }
        
        .btn-hero-primary {
          padding: 14px 32px;
          font-size: 1.05rem;
        }
        
        .btn-hero-secondary {
          padding: 14px 32px;
          font-size: 1.05rem;
        }
        
        .hero-image-area {
          position: relative;
        }
        
        .main-hero-image-wrapper {
          position: relative;
          border-radius: var(--radius-lg);
          overflow: hidden;
          box-shadow: var(--shadow-premium);
          border: 1px solid var(--border);
        }
        
        .main-hero-image {
          width: 100%;
          height: 480px;
          object-fit: cover;
        }
        
        .floating-stat-card {
          position: absolute;
          bottom: 24px;
          left: 24px;
          background-color: var(--bg-card);
          border: 1px solid var(--border);
          padding: 16px 20px;
          border-radius: var(--radius-md);
          box-shadow: var(--shadow-xl);
          display: flex;
          align-items: center;
          gap: 14px;
          backdrop-filter: blur(8px);
        }
        
        .stat-avatar-group {
          display: flex;
        }
        
        .stat-avatar-group img {
          width: 32px;
          height: 32px;
          border-radius: var(--radius-full);
          border: 2px solid var(--bg-card);
          object-fit: cover;
        }
        
        .stat-avatar-group img:not(:first-child) {
          margin-left: -12px;
        }
        
        .stat-stars {
          display: flex;
          gap: 2px;
          margin-bottom: 2px;
        }
        
        .stat-text {
          font-size: 0.75rem;
          font-weight: 700;
          color: var(--text-heading);
        }

        /* Scenarios Styling */
        .scenarios-section {
          padding: 80px 0;
        }
        
        .scenario-card {
          padding: 24px;
          text-align: left;
        }
        
        .scenario-icon-box {
          background-color: var(--bg-main);
          width: 56px;
          height: 56px;
          border-radius: var(--radius-md);
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 20px;
          border: 1px solid var(--border);
        }
        
        .scenario-icon.orange { color: #f59e0b; }
        .scenario-icon.teal { color: #0d9488; }
        .scenario-icon.blue { color: #3b82f6; }
        .scenario-icon.rose { color: #f43f5e; }
        
        .scenario-title {
          font-size: 1.15rem;
          font-weight: 700;
          color: var(--text-heading);
          margin-bottom: 8px;
        }
        
        .scenario-desc-text {
          font-size: 0.9rem;
          color: var(--text-muted);
          line-height: 1.5;
        }

        /* Features CSS */
        .features-section {
          padding: 80px 0;
          background-color: var(--bg-card);
          border-y: 1px solid var(--border);
        }
        
        .features-grid {
          margin-top: 48px;
        }
        
        .feature-item {
          text-align: center;
          padding: 16px;
        }
        
        .feature-icon-wrapper {
          color: var(--primary);
          background-color: var(--primary-light);
          width: 72px;
          height: 72px;
          border-radius: var(--radius-full);
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 24px;
        }
        
        .feature-title {
          font-size: 1.25rem;
          font-weight: 700;
          color: var(--text-heading);
          margin-bottom: 12px;
        }
        
        .feature-desc {
          font-size: 0.95rem;
          color: var(--text-muted);
          line-height: 1.6;
        }

        /* Spotlight Row */
        .spotlight-section {
          padding: 80px 0;
        }
        
        .section-header-row {
          display: flex;
          justify-content: space-between;
          align-items: flex-end;
          margin-bottom: 48px;
        }

        /* Testimonials CSS */
        .testimonials-section {
          padding: 80px 0;
          background-color: var(--bg-card);
        }
        
        .testimonial-card {
          padding: 32px;
          text-align: left;
        }
        
        .testimonial-header {
          display: flex;
          align-items: center;
          gap: 16px;
          margin-bottom: 20px;
        }
        
        .testimonial-avatar {
          width: 48px;
          height: 48px;
          border-radius: var(--radius-full);
          object-fit: cover;
        }
        
        .testimonial-name {
          font-size: 1rem;
          font-weight: 700;
          color: var(--text-heading);
        }
        
        .testimonial-pet {
          font-size: 0.8rem;
          color: var(--primary);
          font-weight: 600;
        }
        
        .testimonial-stars {
          margin-left: auto;
          display: flex;
          gap: 2px;
        }
        
        .testimonial-text {
          font-size: 1rem;
          line-height: 1.6;
          font-style: italic;
          color: var(--text-main);
        }

        /* CTA Section */
        .cta-bottom-section {
          padding: 80px 0 40px;
        }
        
        .cta-container {
          background: linear-gradient(135deg, #1e293b, #0f172a);
          color: white;
          padding: 60px 40px;
          text-align: center;
          border: none !important;
        }
        
        .cta-title {
          font-size: 2.2rem;
          font-weight: 800;
          margin-bottom: 16px;
          color: white;
        }
        
        .cta-desc {
          font-size: 1.15rem;
          color: #94a3b8;
          max-width: 600px;
          margin: 0 auto 32px;
        }
        
        .btn-cta-bottom {
          padding: 14px 36px;
          font-size: 1.05rem;
        }

        /* Responsive Hero */
        @media (max-width: 992px) {
          .hero-container {
            grid-template-columns: 1fr;
            gap: 40px;
          }
          .hero-title {
            font-size: 2.8rem;
          }
          .main-hero-image {
            height: 380px;
          }
          .section-header-row {
            flex-direction: column;
            align-items: flex-start;
            gap: 20px;
          }
        }
        
        @media (max-width: 600px) {
          .hero-section {
            padding: 40px 0 60px;
          }
          .hero-title {
            font-size: 2.2rem;
          }
          .main-hero-image {
            height: 280px;
          }
          .cta-container {
            padding: 40px 20px;
          }
          .cta-title {
            font-size: 1.7rem;
          }
        }
      `}</style>
    </div>
  );
};

export default Home;
