import React, { useState, useEffect } from 'react';
import { useParams, useLocation, useNavigate, Link } from 'react-router-dom';
import { Calendar, Clock, Heart, ShieldCheck, ArrowLeft, AlertCircle, ShoppingBag, Star } from 'lucide-react';
import { CAREGIVERS } from '../data/caregivers';

interface BookingState {
  service?: 'hourly' | 'daily' | 'overnight';
  slot?: string;
  date?: string;
}

const Booking: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const location = useLocation();
  const navigate = useNavigate();

  // Find caregiver by URL param
  const caregiver = CAREGIVERS.find((cg) => cg.id === id);

  // Retrieve pre-selected options passed from Profile page state
  const routerState = location.state as BookingState | null;

  // Form Field States
  const [petName, setPetName] = useState('');
  const [petType, setPetType] = useState('Dog');
  const [bookingDate, setBookingDate] = useState(routerState?.date || '');
  const [selectedSlot, setSelectedSlot] = useState(routerState?.slot || '');
  const [serviceType, setServiceType] = useState<'hourly' | 'daily' | 'overnight'>(routerState?.service || 'hourly');
  const [duration, setDuration] = useState<number>(1);
  const [specialInstructions, setSpecialInstructions] = useState('');
  
  // Validation Errors state
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (caregiver && !selectedSlot && caregiver.slots.length > 0) {
      setSelectedSlot(caregiver.slots[0]);
    }
  }, [caregiver, selectedSlot]);

  if (!caregiver) {
    return (
      <div className="container booking-not-found animate-fade">
        <h2 className="error-title">Caregiver Not Found</h2>
        <p className="error-desc">We cannot open the booking panel because the specified caregiver doesn't exist.</p>
        <Link to="/caregivers" className="btn btn-primary">
          <span>Back to Sitter Listings</span>
        </Link>
      </div>
    );
  }

  // Cost calculations
  const priceRate = caregiver.pricingOptions[serviceType];
  const subtotal = priceRate * duration;
  const platformFee = 5.00; // Flat trust & support platform fee
  const totalCost = subtotal + platformFee;

  const handleDurationChange = (val: number) => {
    if (val < 1) return;
    setDuration(val);
  };

  const getServiceLabel = () => {
    switch (serviceType) {
      case 'hourly': return 'Hourly Care';
      case 'daily': return 'Daily Boarding';
      case 'overnight': return 'Overnight Boarding';
    }
  };

  const getDurationUnit = () => {
    switch (serviceType) {
      case 'hourly': return duration === 1 ? 'hour' : 'hours';
      case 'daily': return duration === 1 ? 'day' : 'days';
      case 'overnight': return duration === 1 ? 'night' : 'nights';
    }
  };

  const validateForm = () => {
    const tempErrors: Record<string, string> = {};
    if (!petName.trim()) tempErrors.petName = 'Pet Name is required';
    if (!bookingDate) tempErrors.bookingDate = 'Please select a date';
    if (!selectedSlot) tempErrors.selectedSlot = 'Please select a care slot';
    if (duration <= 0) tempErrors.duration = 'Duration must be at least 1';
    
    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleConfirmBooking = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    // Generate unique random booking ID for receipt
    const bookingCode = `PB-${Math.floor(100000 + Math.random() * 900000)}`;

    // Pass receipt details to Success page
    navigate('/booking-success', {
      state: {
        bookingCode,
        caregiverName: caregiver.name,
        caregiverPhoto: caregiver.photo,
        location: caregiver.location,
        petName,
        petType,
        date: bookingDate,
        slot: selectedSlot,
        service: getServiceLabel(),
        duration: `${duration} ${getDurationUnit()}`,
        rate: priceRate,
        subtotal,
        platformFee,
        total: totalCost,
        specialInstructions: specialInstructions.trim() || 'None'
      }
    });
  };

  return (
    <div className="booking-page container animate-fade">
      {/* Back Link */}
      <div className="back-nav-row">
        <Link to={`/profile/${caregiver.id}`} className="back-link">
          <ArrowLeft size={16} />
          <span>Back to {caregiver.name.split(' ')[0]}'s Profile</span>
        </Link>
      </div>

      <div className="booking-title-block">
        <h1 className="booking-page-title">Secure Your Pet's Booking</h1>
        <p className="booking-page-subtitle">Provide details about your pet and confirm schedule details to finalize care.</p>
      </div>

      {/* Main Layout Grid */}
      <div className="booking-layout-grid">
        {/* Left Column: Form Panel */}
        <main className="booking-form-area card">
          <form onSubmit={handleConfirmBooking}>
            <h2 className="form-section-title">
              <Heart size={20} className="title-icon" />
              <span>Pet Information</span>
            </h2>

            <div className="grid-2">
              {/* Pet Name */}
              <div className="input-group">
                <label className="input-label" htmlFor="pet-name">Pet's Name *</label>
                <input
                  type="text"
                  id="pet-name"
                  className={`input-field ${errors.petName ? 'input-error' : ''}`}
                  placeholder="e.g. Buddy"
                  value={petName}
                  onChange={(e) => setPetName(e.target.value)}
                />
                {errors.petName && (
                  <span className="error-message">
                    <AlertCircle size={12} />
                    {errors.petName}
                  </span>
                )}
              </div>

              {/* Pet Type */}
              <div className="input-group">
                <label className="input-label" htmlFor="pet-type">Pet Type *</label>
                <select
                  id="pet-type"
                  className="input-field"
                  value={petType}
                  onChange={(e) => setPetType(e.target.value)}
                >
                  <option value="Dog">Dog</option>
                  <option value="Cat">Cat</option>
                  <option value="Rabbit">Rabbit</option>
                  <option value="Bird">Bird</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>

            <h2 className="form-section-title spacing-title">
              <Calendar size={20} className="title-icon" />
              <span>Schedule Details</span>
            </h2>

            {/* Service Type Buttons */}
            <div className="input-group">
              <label className="input-label">Care Service Mode</label>
              <div className="service-mode-toggles">
                <button
                  type="button"
                  className={`service-mode-btn ${serviceType === 'hourly' ? 'active' : ''}`}
                  onClick={() => { setServiceType('hourly'); setDuration(1); }}
                >
                  Hourly Care (${caregiver.pricingOptions.hourly}/hr)
                </button>
                <button
                  type="button"
                  className={`service-mode-btn ${serviceType === 'daily' ? 'active' : ''}`}
                  onClick={() => { setServiceType('daily'); setDuration(1); }}
                >
                  Daily Boarding (${caregiver.pricingOptions.daily}/day)
                </button>
                <button
                  type="button"
                  className={`service-mode-btn ${serviceType === 'overnight' ? 'active' : ''}`}
                  onClick={() => { setServiceType('overnight'); setDuration(1); }}
                >
                  Overnight (${caregiver.pricingOptions.overnight}/night)
                </button>
              </div>
            </div>

            <div className="grid-2">
              {/* Date Input */}
              <div className="input-group">
                <label className="input-label" htmlFor="booking-date">Select Date *</label>
                <input
                  type="date"
                  id="booking-date"
                  className={`input-field ${errors.bookingDate ? 'input-error' : ''}`}
                  value={bookingDate}
                  onChange={(e) => setBookingDate(e.target.value)}
                  min={new Date().toISOString().split('T')[0]}
                />
                {errors.bookingDate && (
                  <span className="error-message">
                    <AlertCircle size={12} />
                    {errors.bookingDate}
                  </span>
                )}
              </div>

              {/* Slot Selector */}
              <div className="input-group">
                <label className="input-label" htmlFor="care-slot">Select Care Slot *</label>
                <select
                  id="care-slot"
                  className={`input-field ${errors.selectedSlot ? 'input-error' : ''}`}
                  value={selectedSlot}
                  onChange={(e) => setSelectedSlot(e.target.value)}
                >
                  {caregiver.slots.map(slot => (
                    <option key={slot} value={slot}>{slot}</option>
                  ))}
                </select>
                {errors.selectedSlot && (
                  <span className="error-message">
                    <AlertCircle size={12} />
                    {errors.selectedSlot}
                  </span>
                )}
              </div>
            </div>

            {/* Duration Input */}
            <div className="input-group">
              <label className="input-label">Duration ({getDurationUnit()})</label>
              <div className="duration-counter-box">
                <button
                  type="button"
                  className="counter-btn"
                  onClick={() => handleDurationChange(duration - 1)}
                  disabled={duration <= 1}
                >
                  -
                </button>
                <span className="counter-value">{duration}</span>
                <button
                  type="button"
                  className="counter-btn"
                  onClick={() => handleDurationChange(duration + 1)}
                >
                  +
                </button>
              </div>
            </div>

            {/* Special Instructions */}
            <div className="input-group spacing-textarea">
              <label className="input-label" htmlFor="special-notes">Special Care Instructions (Optional)</label>
              <textarea
                id="special-notes"
                className="input-field textarea-field"
                placeholder="Mention any dietary requirements, medication times, favorite toys, or behavioral quirks here..."
                rows={4}
                value={specialInstructions}
                onChange={(e) => setSpecialInstructions(e.target.value)}
              />
            </div>

            <button type="submit" className="btn btn-primary submit-booking-btn">
              <ShieldCheck size={18} />
              <span>Confirm & Book Care</span>
            </button>
          </form>
        </main>

        {/* Right Column: Dynamic Pricing Widget */}
        <aside className="booking-summary-sidebar">
          <div className="summary-widget card">
            <h3 className="summary-widget-title">
              <ShoppingBag size={18} />
              <span>Booking Summary</span>
            </h3>

            {/* Caregiver Mini Card */}
            <div className="summary-sitter-card">
              <img src={caregiver.photo} alt={caregiver.name} className="sitter-avatar-mini" />
              <div>
                <h4 className="sitter-name-mini">{caregiver.name}</h4>
                <p className="sitter-location-mini">{caregiver.location} neighborhood</p>
                <div className="sitter-rating-mini">
                  <Star size={12} fill="var(--secondary)" color="var(--secondary)" />
                  <span>{caregiver.rating} ({caregiver.reviewCount} reviews)</span>
                </div>
              </div>
            </div>

            {/* Receipt Cost Items */}
            <div className="cost-breakdown-panel">
              <div className="cost-item">
                <span className="cost-label">
                  {getServiceLabel()} <span className="light-subtext">(${priceRate} × {duration} {getDurationUnit()})</span>
                </span>
                <span className="cost-value">${subtotal.toFixed(2)}</span>
              </div>
              <div className="cost-item">
                <span className="cost-label">
                  PetBuddy Platform Fee <span className="light-subtext">(Includes insurance & 24/7 support)</span>
                </span>
                <span className="cost-value">${platformFee.toFixed(2)}</span>
              </div>

              <div className="cost-total-row">
                <span className="total-label">Grand Total</span>
                <span className="total-value">${totalCost.toFixed(2)}</span>
              </div>
            </div>

            {/* Trust Elements */}
            <div className="summary-trust-bullets">
              <div className="trust-bullet">
                <ShieldCheck size={16} className="bullet-icon" />
                <span>Free $1M Sitter Liability Property Protection</span>
              </div>
              <div className="trust-bullet">
                <Clock size={16} className="bullet-icon" />
                <span>24/7 Emergency Veterinary Hotlines</span>
              </div>
            </div>
          </div>
        </aside>
      </div>

      <style>{`
        .booking-page {
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
        }
        
        .back-link:hover {
          color: var(--primary);
        }
        
        .booking-title-block {
          text-align: left;
          margin-bottom: 36px;
        }
        
        .booking-page-title {
          font-size: 2.2rem;
          font-weight: 850;
          color: var(--text-heading);
          letter-spacing: -0.8px;
          margin-bottom: 8px;
        }
        
        .booking-page-subtitle {
          font-size: 1.1rem;
          color: var(--text-muted);
        }

        /* Layout Grid */
        .booking-layout-grid {
          display: grid;
          grid-template-columns: 1fr 380px;
          gap: 32px;
          align-items: start;
        }
        
        .booking-form-area {
          padding: 40px;
          text-align: left;
        }
        
        .form-section-title {
          font-size: 1.25rem;
          font-weight: 800;
          color: var(--text-heading);
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 20px;
          border-bottom: 1px solid var(--border);
          padding-bottom: 10px;
        }
        
        .form-section-title.spacing-title {
          margin-top: 40px;
        }
        
        .title-icon {
          color: var(--primary);
        }
        
        .service-mode-toggles {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }
        
        .service-mode-btn {
          border: 1.5px solid var(--border);
          background-color: var(--bg-main);
          padding: 12px 16px;
          font-size: 0.9rem;
          font-weight: 600;
          border-radius: var(--radius-md);
          cursor: pointer;
          text-align: left;
          transition: var(--transition-fast);
          color: var(--text-main);
        }
        
        .service-mode-btn:hover {
          border-color: var(--text-muted);
        }
        
        .service-mode-btn.active {
          background-color: var(--primary-light);
          color: var(--primary);
          border-color: var(--primary);
        }
        
        .duration-counter-box {
          display: inline-flex;
          align-items: center;
          background-color: var(--bg-main);
          border: 1.5px solid var(--border);
          border-radius: var(--radius-md);
          overflow: hidden;
          max-width: 150px;
        }
        
        .counter-btn {
          border: none;
          background: none;
          padding: 10px 16px;
          font-size: 1.2rem;
          font-weight: 700;
          cursor: pointer;
          transition: var(--transition-fast);
          color: var(--text-heading);
        }
        
        .counter-btn:disabled {
          color: var(--text-muted);
          cursor: not-allowed;
        }
        
        .counter-btn:hover:not(:disabled) {
          background-color: var(--border);
        }
        
        .counter-value {
          flex-grow: 1;
          text-align: center;
          font-weight: 700;
          font-size: 1.1rem;
          min-width: 50px;
          color: var(--text-heading);
        }
        
        .textarea-field {
          resize: vertical;
          font-family: inherit;
        }
        
        .spacing-textarea {
          margin-top: 24px;
        }
        
        .submit-booking-btn {
          width: 100%;
          padding: 14px;
          font-size: 1.05rem;
          border-radius: var(--radius-md);
          margin-top: 32px;
          box-shadow: 0 4px 14px rgba(13, 148, 136, 0.3);
        }
        
        .input-error {
          border-color: var(--danger) !important;
        }
        
        .error-message {
          display: flex;
          align-items: center;
          gap: 4px;
          font-size: 0.8rem;
          color: var(--danger);
          font-weight: 600;
          margin-top: 4px;
        }

        /* Sidebar summary widget */
        .booking-summary-sidebar {
          position: sticky;
          top: 100px;
        }
        
        .summary-widget {
          padding: 24px;
          text-align: left;
        }
        
        .summary-widget-title {
          font-size: 1.1rem;
          font-weight: 800;
          color: var(--text-heading);
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 20px;
          border-bottom: 1.5px solid var(--border);
          padding-bottom: 12px;
        }
        
        .summary-widget-title svg {
          color: var(--primary);
        }
        
        .summary-sitter-card {
          display: flex;
          align-items: center;
          gap: 12px;
          background-color: var(--bg-main);
          border: 1px solid var(--border);
          padding: 12px;
          border-radius: var(--radius-md);
          margin-bottom: 24px;
        }
        
        .sitter-avatar-mini {
          width: 50px;
          height: 50px;
          border-radius: var(--radius-sm);
          object-fit: cover;
        }
        
        .sitter-name-mini {
          font-size: 0.95rem;
          font-weight: 700;
          color: var(--text-heading);
        }
        
        .sitter-location-mini {
          font-size: 0.8rem;
          color: var(--text-muted);
        }
        
        .sitter-rating-mini {
          display: flex;
          align-items: center;
          gap: 4px;
          font-size: 0.75rem;
          font-weight: 600;
          color: var(--text-heading);
          margin-top: 2px;
        }
        
        .cost-breakdown-panel {
          display: flex;
          flex-direction: column;
          gap: 16px;
          border-bottom: 1.5px solid var(--border);
          padding-bottom: 20px;
          margin-bottom: 20px;
        }
        
        .cost-item {
          display: flex;
          justify-content: space-between;
          font-size: 0.85rem;
          line-height: 1.4;
        }
        
        .cost-label {
          font-weight: 600;
          color: var(--text-main);
          display: flex;
          flex-direction: column;
        }
        
        .light-subtext {
          font-size: 0.75rem;
          color: var(--text-muted);
          font-weight: 500;
          margin-top: 2px;
        }
        
        .cost-value {
          font-weight: 700;
          color: var(--text-heading);
        }
        
        .cost-total-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-top: 8px;
        }
        
        .total-label {
          font-size: 1rem;
          font-weight: 800;
          color: var(--text-heading);
        }
        
        .total-value {
          font-size: 1.4rem;
          font-weight: 850;
          color: var(--primary);
        }
        
        .summary-trust-bullets {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }
        
        .trust-bullet {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 0.75rem;
          color: var(--text-muted);
          line-height: 1.3;
          font-weight: 600;
        }
        
        .bullet-icon {
          color: var(--primary);
          flex-shrink: 0;
        }

        /* Caregiver not found */
        .booking-not-found {
          padding: 80px 20px;
          text-align: center;
          max-width: 500px;
          margin: 40px auto;
        }

        /* Responsiveness */
        @media (max-width: 900px) {
          .booking-layout-grid {
            grid-template-columns: 1fr;
          }
          .booking-summary-sidebar {
            position: static;
          }
        }
        
        @media (max-width: 600px) {
          .booking-form-area {
            padding: 24px;
          }
          .booking-page-title {
            font-size: 1.8rem;
          }
        }
      `}</style>
    </div>
  );
};

export default Booking;
