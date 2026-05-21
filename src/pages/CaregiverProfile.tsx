import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Star, MapPin, Calendar, ShieldCheck, Heart, Home, Shield, Sparkles, MessageSquare, Award, ArrowLeft, Clock } from 'lucide-react';
import { CAREGIVERS } from '../data/caregivers';

const CaregiverProfile: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  // Find caregiver by URL param
  const caregiver = CAREGIVERS.find((cg) => cg.id === id);

  // Profile Booking Widget States
  const [selectedService, setSelectedService] = useState<'hourly' | 'daily' | 'overnight'>('hourly');
  const [selectedSlot, setSelectedSlot] = useState<string>('');
  const [bookingDate, setBookingDate] = useState<string>('');

  if (!caregiver) {
    return (
      <div className="container profile-not-found animate-fade">
        <h2 className="error-title">Caregiver Profile Not Found</h2>
        <p className="error-desc">We couldn't find the pet sitter you are looking for. They may have updated their profile or went offline.</p>
        <Link to="/caregivers" className="btn btn-primary">
          <ArrowLeft size={16} />
          <span>Back to Sitter Listings</span>
        </Link>
      </div>
    );
  }

  const handleBookNow = () => {
    // Navigate to booking form, passing selected parameters via state
    navigate(`/book/${caregiver.id}`, {
      state: {
        service: selectedService,
        slot: selectedSlot,
        date: bookingDate
      }
    });
  };

  const getServicePrice = () => {
    return caregiver.pricingOptions[selectedService];
  };

  const getServiceUnit = () => {
    switch (selectedService) {
      case 'hourly': return 'hour';
      case 'daily': return 'day';
      case 'overnight': return 'night';
    }
  };

  return (
    <div className="profile-page container animate-fade">
      {/* Back Button */}
      <div className="back-nav-row">
        <Link to="/caregivers" className="back-link">
          <ArrowLeft size={16} />
          <span>Back to Sitter Listings</span>
        </Link>
      </div>

      {/* Main Profile Header */}
      <div className="profile-header card">
        <div className="header-primary-grid">
          <div className="profile-image-container">
            <img src={caregiver.photo} alt={caregiver.name} className="profile-avatar" />
            <div className="header-verified-tag">
              <ShieldCheck size={14} />
              <span>Verified Host</span>
            </div>
          </div>

          <div className="profile-info-block">
            <div className="badge-row">
              <span className="badge badge-primary">{caregiver.experience} Experience</span>
              <span className="badge badge-amber">{caregiver.availability}</span>
            </div>

            <h1 className="profile-name">{caregiver.name}</h1>
            <p className="profile-tagline">{caregiver.title}</p>

            <div className="meta-info-row">
              <div className="meta-item">
                <MapPin size={16} />
                <span>Lives in {caregiver.location}</span>
              </div>
              <div className="meta-item">
                <Star size={16} fill="var(--secondary)" color="var(--secondary)" />
                <span className="rating-score">{caregiver.rating.toFixed(1)}</span>
                <span className="reviews-text">({caregiver.reviewCount} customer reviews)</span>
              </div>
            </div>

            <div className="header-pets-row">
              <span className="pets-label">Welcomes:</span>
              <div className="pets-tags">
                {caregiver.supportedPets.map(pet => (
                  <span key={pet} className="pet-tag">{pet}s</span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Profile Double Column Layout */}
      <div className="profile-body-layout">
        {/* Left Side: Bio, Yard details, safety, gallery, reviews */}
        <div className="profile-main-content">
          {/* Section: About Me */}
          <section className="profile-section card">
            <h2 className="section-block-title">
              <Heart size={20} className="section-title-icon" />
              <span>About {caregiver.name.split(' ')[0]}</span>
            </h2>
            <p className="paragraph-content">{caregiver.about}</p>
          </section>

          {/* Section: Home Environment */}
          <section className="profile-section card">
            <h2 className="section-block-title">
              <Home size={20} className="section-title-icon" />
              <span>My Cozy Home Environment</span>
            </h2>
            <p className="paragraph-content">{caregiver.environment}</p>
          </section>

          {/* Section: Safety Rules */}
          <section className="profile-section card">
            <h2 className="section-block-title">
              <Shield size={20} className="section-title-icon" />
              <span>Safety & Health Protocols</span>
            </h2>
            <p className="paragraph-content">{caregiver.safetyPolicy}</p>
          </section>

          {/* Section: Gallery */}
          <section className="profile-section card">
            <h2 className="section-block-title">
              <Sparkles size={20} className="section-title-icon" />
              <span>Home & Playtime Gallery</span>
            </h2>
            <div className="gallery-grid">
              {caregiver.gallery.map((img, idx) => (
                <div key={idx} className="gallery-item-wrapper card">
                  <img src={img} alt={`Gallery ${idx + 1}`} className="gallery-img" />
                </div>
              ))}
            </div>
          </section>

          {/* Section: Reviews */}
          <section className="profile-section card">
            <h2 className="section-block-title">
              <MessageSquare size={20} className="section-title-icon" />
              <span>Parent Testimonials ({caregiver.reviews.length})</span>
            </h2>
            <div className="reviews-list">
              {caregiver.reviews.map((rev) => (
                <div key={rev.id} className="review-item">
                  <div className="review-header-row">
                    <img src={rev.avatar || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=100&h=100"} alt={rev.user} className="review-user-avatar" />
                    <div>
                      <h4 className="review-user-name">{rev.user}</h4>
                      <span className="review-date">{rev.date}</span>
                    </div>
                    <div className="review-rating-stars">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} size={12} fill={i < Math.floor(rev.rating) ? "var(--secondary)" : "none"} color="var(--secondary)" />
                      ))}
                    </div>
                  </div>
                  <p className="review-body">"{rev.comment}"</p>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* Right Side: Booking Widget Box */}
        <aside className="profile-sidebar">
          <div className="booking-widget card">
            <div className="widget-price-row">
              <div>
                <span className="price-label">Service Rate</span>
                <div className="widget-price-box">
                  <span className="price-amount">${getServicePrice()}</span>
                  <span className="price-unit">/ {getServiceUnit()}</span>
                </div>
              </div>
              <div className="widget-award-badge">
                <Award size={18} />
                <span>Top Sitter</span>
              </div>
            </div>

            {/* Service Type Tabs Selector */}
            <div className="widget-service-tabs">
              <button
                type="button"
                className={`service-tab-btn ${selectedService === 'hourly' ? 'active' : ''}`}
                onClick={() => setSelectedService('hourly')}
              >
                Hourly Care
              </button>
              <button
                type="button"
                className={`service-tab-btn ${selectedService === 'daily' ? 'active' : ''}`}
                onClick={() => setSelectedService('daily')}
              >
                Daily Boarding
              </button>
              <button
                type="button"
                className={`service-tab-btn ${selectedService === 'overnight' ? 'active' : ''}`}
                onClick={() => setSelectedService('overnight')}
              >
                Overnight
              </button>
            </div>

            <div className="widget-body">
              {/* Service Details Descriptions */}
              <div className="service-details-highlight">
                {selectedService === 'hourly' && (
                  <p className="service-info-txt">Great for weddings, errands, or dining out. Minimum booking of 2 hours applies.</p>
                )}
                {selectedService === 'daily' && (
                  <p className="service-info-txt">Daytime boarding in Sitter's house. Includes 2 walks, nutrition, and massive play.</p>
                )}
                {selectedService === 'overnight' && (
                  <p className="service-info-txt">Overnight boarding. Sitter watches your pet 24/7 in a relaxed residential home.</p>
                )}
              </div>

              {/* Date Input Selector */}
              <div className="widget-input-wrapper">
                <label className="widget-input-label">Select Date</label>
                <div className="widget-input-icon-box">
                  <Calendar size={16} className="widget-icon" />
                  <input
                    type="date"
                    className="widget-date-input"
                    value={bookingDate}
                    onChange={(e) => setBookingDate(e.target.value)}
                    min={new Date().toISOString().split('T')[0]}
                  />
                </div>
              </div>

              {/* Slots Timetable Selector */}
              <div className="widget-input-wrapper">
                <label className="widget-input-label">Available Care Slots</label>
                <div className="slots-grid">
                  {caregiver.slots.map((slot) => (
                    <button
                      key={slot}
                      type="button"
                      className={`slot-pill-btn ${selectedSlot === slot ? 'active' : ''}`}
                      onClick={() => setSelectedSlot(slot)}
                    >
                      <Clock size={12} />
                      <span>{slot.split(' - ')[0]}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Book CTA Trigger */}
              <button
                type="button"
                className="btn btn-primary widget-book-now-btn animate-pulse-soft"
                onClick={handleBookNow}
                disabled={!bookingDate}
              >
                {bookingDate ? "Book Care Now" : "Select Date to Book"}
              </button>

              <p className="widget-security-info">
                🔒 Protected by PetBuddy Safety & Support Insurance Guarantees.
              </p>
            </div>
          </div>
        </aside>
      </div>

      <style>{`
        .profile-page {
          padding-top: 30px;
          padding-bottom: 80px;
          flex-grow: 1;
        }
        
        .back-nav-row {
          text-align: left;
          margin-bottom: 24px;
        }
        
        .back-link {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          font-weight: 700;
          color: var(--text-muted);
          transition: var(--transition-fast);
        }
        
        .back-link:hover {
          color: var(--primary);
        }

        /* Profile Header Card */
        .profile-header {
          padding: 32px;
          text-align: left;
          margin-bottom: 32px;
        }
        
        .header-primary-grid {
          display: grid;
          grid-template-columns: 180px 1fr;
          gap: 32px;
          align-items: center;
        }
        
        .profile-image-container {
          position: relative;
          width: 180px;
          height: 180px;
          border-radius: var(--radius-lg);
          overflow: hidden;
          box-shadow: var(--shadow-md);
        }
        
        .profile-avatar {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
        
        .header-verified-tag {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          background: rgba(13, 148, 136, 0.9);
          color: white;
          font-size: 0.7rem;
          font-weight: 700;
          padding: 4px 0;
          text-align: center;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 4px;
        }
        
        .profile-info-block {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }
        
        .badge-row {
          display: flex;
          gap: 8px;
        }
        
        .profile-name {
          font-size: 2.2rem;
          font-weight: 850;
          color: var(--text-heading);
          letter-spacing: -0.8px;
        }
        
        .profile-tagline {
          font-size: 1.1rem;
          color: var(--primary);
          font-weight: 600;
        }
        
        .meta-info-row {
          display: flex;
          gap: 20px;
          color: var(--text-muted);
          font-size: 0.95rem;
          flex-wrap: wrap;
        }
        
        .meta-item {
          display: flex;
          align-items: center;
          gap: 6px;
        }
        
        .reviews-text {
          margin-left: 2px;
        }
        
        .header-pets-row {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-top: 8px;
        }
        
        .pets-label {
          font-weight: 700;
          font-size: 0.85rem;
          color: var(--text-heading);
          text-transform: uppercase;
        }
        
        .pets-tags {
          display: flex;
          gap: 6px;
        }

        /* Profile Layout */
        .profile-body-layout {
          display: grid;
          grid-template-columns: 1fr 360px;
          gap: 32px;
          align-items: start;
        }
        
        .profile-main-content {
          display: flex;
          flex-direction: column;
          gap: 24px;
        }
        
        .profile-section {
          padding: 32px;
          text-align: left;
        }
        
        .section-block-title {
          font-size: 1.4rem;
          font-weight: 800;
          color: var(--text-heading);
          margin-bottom: 20px;
          display: flex;
          align-items: center;
          gap: 10px;
          border-bottom: 1.5px solid var(--border);
          padding-bottom: 12px;
        }
        
        .section-title-icon {
          color: var(--primary);
        }
        
        .paragraph-content {
          font-size: 1rem;
          line-height: 1.7;
          color: var(--text-main);
        }

        /* Gallery Grid */
        .gallery-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 16px;
        }
        
        .gallery-item-wrapper {
          height: 130px;
          overflow: hidden;
        }
        
        .gallery-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: var(--transition);
        }
        
        .gallery-img:hover {
          transform: scale(1.08);
        }

        /* Reviews List */
        .reviews-list {
          display: flex;
          flex-direction: column;
          gap: 24px;
        }
        
        .review-item {
          border-bottom: 1px solid var(--border);
          padding-bottom: 20px;
        }
        
        .review-item:last-child {
          border-bottom: none;
          padding-bottom: 0;
        }
        
        .review-header-row {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 12px;
        }
        
        .review-user-avatar {
          width: 40px;
          height: 40px;
          border-radius: var(--radius-full);
          object-fit: cover;
        }
        
        .review-user-name {
          font-size: 0.95rem;
          font-weight: 700;
          color: var(--text-heading);
        }
        
        .review-date {
          font-size: 0.8rem;
          color: var(--text-muted);
          display: block;
        }
        
        .review-rating-stars {
          margin-left: auto;
          display: flex;
          gap: 2px;
        }
        
        .review-body {
          font-size: 0.95rem;
          line-height: 1.5;
          color: var(--text-main);
          font-style: italic;
        }

        /* Sidebar Booking Widget */
        .profile-sidebar {
          position: sticky;
          top: 100px;
        }
        
        .booking-widget {
          padding: 24px;
          text-align: left;
        }
        
        .widget-price-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
        }
        
        .price-label {
          font-size: 0.8rem;
          font-weight: 700;
          color: var(--text-muted);
          text-transform: uppercase;
        }
        
        .widget-price-box {
          display: flex;
          align-items: baseline;
        }
        
        .widget-award-badge {
          display: flex;
          align-items: center;
          gap: 4px;
          background-color: var(--secondary-light);
          color: var(--secondary-hover);
          padding: 6px 12px;
          border-radius: var(--radius-full);
          font-size: 0.75rem;
          font-weight: 700;
        }
        
        .widget-service-tabs {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 6px;
          background-color: var(--bg-main);
          border: 1px solid var(--border);
          padding: 4px;
          border-radius: var(--radius-md);
          margin-bottom: 20px;
        }
        
        .service-tab-btn {
          border: none;
          background: none;
          padding: 8px 4px;
          font-size: 0.75rem;
          font-weight: 700;
          border-radius: var(--radius-sm);
          cursor: pointer;
          transition: var(--transition-fast);
          color: var(--text-muted);
        }
        
        .service-tab-btn.active {
          background-color: var(--bg-card);
          color: var(--primary);
          box-shadow: var(--shadow-sm);
        }
        
        .service-details-highlight {
          background-color: var(--primary-light);
          border-radius: var(--radius-md);
          padding: 12px;
          margin-bottom: 20px;
          border: 1px dashed rgba(13, 148, 136, 0.2);
        }
        
        .service-info-txt {
          font-size: 0.8rem;
          color: var(--primary);
          font-weight: 600;
          line-height: 1.4;
        }
        
        .widget-body {
          display: flex;
          flex-direction: column;
        }
        
        .widget-input-wrapper {
          margin-bottom: 20px;
        }
        
        .widget-input-label {
          display: block;
          font-weight: 700;
          font-size: 0.8rem;
          color: var(--text-heading);
          margin-bottom: 8px;
          text-transform: uppercase;
        }
        
        .widget-input-icon-box {
          display: flex;
          align-items: center;
          position: relative;
        }
        
        .widget-icon {
          position: absolute;
          left: 12px;
          color: var(--text-muted);
        }
        
        .widget-date-input {
          width: 100%;
          padding: 10px 12px 10px 38px;
          background-color: var(--bg-main);
          border: 1.5px solid var(--border);
          border-radius: var(--radius-md);
          font-size: 0.9rem;
          cursor: pointer;
          color: var(--text-heading);
        }
        
        .slots-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 8px;
        }
        
        .slot-pill-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
          border: 1px solid var(--border);
          background-color: var(--bg-main);
          padding: 8px;
          font-size: 0.75rem;
          font-weight: 600;
          border-radius: var(--radius-md);
          cursor: pointer;
          transition: var(--transition-fast);
        }
        
        .slot-pill-btn:hover {
          border-color: var(--text-muted);
        }
        
        .slot-pill-btn.active {
          background-color: var(--primary-light);
          color: var(--primary);
          border-color: var(--primary);
        }
        
        .widget-book-now-btn {
          width: 100%;
          padding: 12px;
          font-size: 1rem;
          border-radius: var(--radius-md);
          margin-top: 10px;
          box-shadow: 0 4px 14px rgba(13, 148, 136, 0.2);
        }
        
        .widget-book-now-btn:disabled {
          background-color: var(--border);
          color: var(--text-muted);
          box-shadow: none;
          cursor: not-allowed;
          transform: none;
        }
        
        .widget-security-info {
          font-size: 0.75rem;
          color: var(--text-muted);
          text-align: center;
          margin-top: 14px;
          line-height: 1.4;
        }

        /* Profile Not Found */
        .profile-not-found {
          padding: 80px 20px;
          text-align: center;
          max-width: 500px;
          margin: 40px auto;
        }
        
        .error-title {
          font-size: 1.8rem;
          color: var(--text-heading);
          margin-bottom: 12px;
        }
        
        .error-desc {
          font-size: 1rem;
          color: var(--text-muted);
          margin-bottom: 24px;
          line-height: 1.5;
        }

        /* Responsiveness */
        @media (max-width: 900px) {
          .profile-body-layout {
            grid-template-columns: 1fr;
          }
          .profile-sidebar {
            position: static;
          }
        }
        
        @media (max-width: 600px) {
          .header-primary-grid {
            grid-template-columns: 1fr;
            text-align: center;
            justify-items: center;
          }
          .profile-name {
            font-size: 1.8rem;
          }
          .meta-info-row {
            justify-content: center;
          }
          .header-pets-row {
            flex-direction: column;
            gap: 8px;
          }
          .gallery-grid {
            grid-template-columns: repeat(2, 1fr);
          }
          .profile-section {
            padding: 24px;
          }
        }
      `}</style>
    </div>
  );
};

export default CaregiverProfile;
