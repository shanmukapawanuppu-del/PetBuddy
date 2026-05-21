import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import { CheckCircle, Calendar, ShieldCheck, Home, FileText, ArrowRight } from 'lucide-react';

interface ReceiptDetails {
  bookingCode: string;
  caregiverName: string;
  caregiverPhoto: string;
  location: string;
  petName: string;
  petType: string;
  date: string;
  slot: string;
  service: string;
  duration: string;
  rate: number;
  subtotal: number;
  platformFee: number;
  total: number;
  specialInstructions: string;
}

const BookingSuccess: React.FC = () => {
  const location = useLocation();

  // Retrieve receipt details passed from Booking Form page state
  const receipt = location.state as ReceiptDetails | null;

  // Provide high-quality mock defaults if accessed directly (prevents crashes)
  const defaultReceipt: ReceiptDetails = {
    bookingCode: "PB-748293",
    caregiverName: "Elena Rostova",
    caregiverPhoto: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=300&h=300",
    location: "Sunnyvale",
    petName: "Waffles",
    petType: "Cat",
    date: new Date().toISOString().split('T')[0],
    slot: "09:00 AM - 11:00 AM",
    service: "Overnight Boarding",
    duration: "2 nights",
    rate: 95,
    subtotal: 190.00,
    platformFee: 5.00,
    total: 195.00,
    specialInstructions: "Feed twice daily. Likes soft scratching behind the ears."
  };

  const activeReceipt = receipt || defaultReceipt;

  return (
    <div className="success-page container animate-fade">
      {/* Animated Success Badge */}
      <div className="success-header animate-slide">
        <div className="check-icon-wrapper animate-float">
          <CheckCircle size={64} className="check-icon" />
        </div>
        <h1 className="success-title">Booking Confirmed!</h1>
        <p className="success-subtitle">
          Your booking was successfully processed. {activeReceipt.caregiverName.split(' ')[0]} is excited to care for {activeReceipt.petName}!
        </p>
      </div>

      {/* Main Double Column Receipt Layout */}
      <div className="success-layout-grid animate-slide">
        {/* Left Column: Receipt Receipt Details */}
        <main className="receipt-area card">
          <div className="receipt-banner">
            <h2 className="receipt-title">
              <FileText size={18} />
              <span>Care Receipt</span>
            </h2>
            <span className="booking-code-badge">{activeReceipt.bookingCode}</span>
          </div>

          <div className="receipt-body">
            {/* Sitter Spot */}
            <div className="receipt-section sitter-receipt-section">
              <span className="receipt-sec-label">Caregiver Host</span>
              <div className="sitter-receipt-card">
                <img src={activeReceipt.caregiverPhoto} alt={activeReceipt.caregiverName} className="sitter-receipt-img" />
                <div>
                  <h4 className="sitter-receipt-name">{activeReceipt.caregiverName}</h4>
                  <p className="sitter-receipt-loc">{activeReceipt.location} neighborhood</p>
                </div>
              </div>
            </div>

            {/* Pet Spot */}
            <div className="receipt-section grid-2">
              <div>
                <span className="receipt-sec-label">Pet Details</span>
                <p className="receipt-txt-val">{activeReceipt.petName} ({activeReceipt.petType})</p>
              </div>
              <div>
                <span className="receipt-sec-label">Care Mode</span>
                <p className="receipt-txt-val">{activeReceipt.service}</p>
              </div>
            </div>

            {/* Schedule Spot */}
            <div className="receipt-section grid-2">
              <div>
                <span className="receipt-sec-label">Booking Date</span>
                <p className="receipt-txt-val date-val">
                  <Calendar size={14} className="val-icon" />
                  <span>{activeReceipt.date}</span>
                </p>
              </div>
              <div>
                <span className="receipt-sec-label">Timetable Slot</span>
                <p className="receipt-txt-val slot-val">{activeReceipt.slot.split(' - ')[0]}</p>
              </div>
            </div>

            {/* Duration Spot */}
            <div className="receipt-section">
              <span className="receipt-sec-label">Selected Duration</span>
              <p className="receipt-txt-val">{activeReceipt.duration}</p>
            </div>

            {/* Special Instructions Spot */}
            <div className="receipt-section">
              <span className="receipt-sec-label">Special Instructions Provided</span>
              <p className="receipt-instructions-box">{activeReceipt.specialInstructions}</p>
            </div>
          </div>
        </main>

        {/* Right Column: Invoice items and next steps */}
        <aside className="billing-success-sidebar">
          {/* Invoice Summary Card */}
          <div className="success-billing-card card">
            <h3 className="billing-card-title">Payment Summary</h3>
            
            <div className="billing-breakdown">
              <div className="billing-row">
                <span>Base Rate ({activeReceipt.duration})</span>
                <span>${activeReceipt.subtotal.toFixed(2)}</span>
              </div>
              <div className="billing-row">
                <span>Platform Support Fee</span>
                <span>${activeReceipt.platformFee.toFixed(2)}</span>
              </div>
              <div className="billing-total-row">
                <span>Amount Charged</span>
                <span className="total-charged">${activeReceipt.total.toFixed(2)}</span>
              </div>
            </div>

            <div className="payment-guarantee">
              <ShieldCheck size={16} />
              <span>Payment Held Securely by PetBuddy Escrow</span>
            </div>
          </div>

          {/* Next Steps Guidance Card */}
          <div className="next-steps-card card">
            <h3 className="steps-title">What happens next?</h3>
            <ul className="steps-list">
              <li>
                <div className="step-num">1</div>
                <div>
                  <h4 className="step-heading">Host Confirmation</h4>
                  <p className="step-info">{activeReceipt.caregiverName.split(' ')[0]} will message you shortly to coordinate arrivals.</p>
                </div>
              </li>
              <li>
                <div className="step-num">2</div>
                <div>
                  <h4 className="step-heading">Pack Pet Essentials</h4>
                  <p className="step-info">Prepare your pet's food, bowls, leash, favorite toys, and bedding.</p>
                </div>
              </li>
              <li>
                <div className="step-num">3</div>
                <div>
                  <h4 className="step-heading">Enjoy Peace of Mind</h4>
                  <p className="step-info">Receive continuous photo updates during your pet's stay!</p>
                </div>
              </li>
            </ul>
          </div>
        </aside>
      </div>

      {/* Bottom Navigation CTAs */}
      <div className="success-action-row animate-slide">
        <Link to="/" className="btn btn-primary btn-success-home">
          <Home size={18} />
          <span>Return to Home Page</span>
        </Link>
        <Link to="/caregivers" className="btn btn-secondary btn-success-more">
          <span>Find Another Caregiver</span>
          <ArrowRight size={16} />
        </Link>
      </div>

      <style>{`
        .success-page {
          padding-top: 40px;
          padding-bottom: 80px;
          flex-grow: 1;
        }
        
        .success-header {
          text-align: center;
          margin-bottom: 48px;
          max-width: 650px;
          margin-left: auto;
          margin-right: auto;
        }
        
        .check-icon-wrapper {
          background-color: rgba(16, 185, 129, 0.12);
          color: var(--success);
          width: 96px;
          height: 96px;
          border-radius: var(--radius-full);
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 24px;
        }
        
        .success-title {
          font-size: 2.5rem;
          font-weight: 850;
          color: var(--text-heading);
          letter-spacing: -0.8px;
          margin-bottom: 12px;
        }
        
        .success-subtitle {
          font-size: 1.15rem;
          color: var(--text-muted);
          line-height: 1.5;
        }

        /* Layout Grid */
        .success-layout-grid {
          display: grid;
          grid-template-columns: 1fr 380px;
          gap: 32px;
          align-items: start;
          margin-bottom: 48px;
        }
        
        .receipt-area {
          padding: 0;
          text-align: left;
          overflow: hidden;
        }
        
        .receipt-banner {
          background: linear-gradient(135deg, var(--primary), #0ea5e9);
          color: white;
          padding: 24px 32px;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        
        .receipt-title {
          font-size: 1.25rem;
          font-weight: 800;
          display: flex;
          align-items: center;
          gap: 8px;
        }
        
        .booking-code-badge {
          background-color: rgba(255, 255, 255, 0.2);
          padding: 6px 14px;
          border-radius: var(--radius-sm);
          font-family: var(--mono);
          font-weight: 700;
          font-size: 0.9rem;
          border: 1px solid rgba(255, 255, 255, 0.3);
          letter-spacing: 0.5px;
        }
        
        .receipt-body {
          padding: 32px;
        }
        
        .receipt-section {
          border-bottom: 1px solid var(--border);
          padding-bottom: 16px;
          margin-bottom: 16px;
        }
        
        .receipt-section:last-child {
          border-bottom: none;
          padding-bottom: 0;
          margin-bottom: 0;
        }
        
        .receipt-sec-label {
          display: block;
          font-size: 0.8rem;
          font-weight: 700;
          color: var(--text-muted);
          text-transform: uppercase;
          letter-spacing: 0.5px;
          margin-bottom: 6px;
        }
        
        .sitter-receipt-card {
          display: flex;
          align-items: center;
          gap: 12px;
        }
        
        .sitter-receipt-img {
          width: 48px;
          height: 48px;
          border-radius: var(--radius-sm);
          object-fit: cover;
        }
        
        .sitter-receipt-name {
          font-size: 0.95rem;
          font-weight: 700;
          color: var(--text-heading);
        }
        
        .sitter-receipt-loc {
          font-size: 0.8rem;
          color: var(--text-muted);
        }
        
        .receipt-txt-val {
          font-weight: 700;
          color: var(--text-heading);
          font-size: 1rem;
        }
        
        .receipt-txt-val.date-val {
          display: flex;
          align-items: center;
          gap: 6px;
        }
        
        .val-icon {
          color: var(--primary);
        }
        
        .receipt-instructions-box {
          background-color: var(--bg-main);
          border: 1.5px solid var(--border);
          padding: 14px;
          border-radius: var(--radius-md);
          font-size: 0.9rem;
          line-height: 1.5;
          color: var(--text-main);
          font-style: italic;
        }

        /* Sidebar Billing Success */
        .success-billing-card {
          padding: 24px;
          text-align: left;
          margin-bottom: 24px;
        }
        
        .billing-card-title {
          font-size: 1.1rem;
          font-weight: 800;
          color: var(--text-heading);
          border-bottom: 1px solid var(--border);
          padding-bottom: 12px;
          margin-bottom: 16px;
        }
        
        .billing-breakdown {
          display: flex;
          flex-direction: column;
          gap: 12px;
          border-bottom: 1px solid var(--border);
          padding-bottom: 16px;
          margin-bottom: 16px;
        }
        
        .billing-row {
          display: flex;
          justify-content: space-between;
          font-size: 0.85rem;
          font-weight: 600;
          color: var(--text-main);
        }
        
        .billing-total-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-weight: 800;
          color: var(--text-heading);
          font-size: 1rem;
          margin-top: 4px;
        }
        
        .total-charged {
          font-size: 1.3rem;
          color: var(--primary);
        }
        
        .payment-guarantee {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 0.75rem;
          font-weight: 700;
          color: var(--success);
          line-height: 1.3;
        }

        /* Next Steps */
        .next-steps-card {
          padding: 24px;
          text-align: left;
        }
        
        .steps-title {
          font-size: 1.1rem;
          font-weight: 800;
          color: var(--text-heading);
          border-bottom: 1px solid var(--border);
          padding-bottom: 12px;
          margin-bottom: 16px;
        }
        
        .steps-list {
          list-style: none;
          display: flex;
          flex-direction: column;
          gap: 20px;
        }
        
        .steps-list li {
          display: flex;
          gap: 12px;
          align-items: start;
        }
        
        .step-num {
          background-color: var(--primary-light);
          color: var(--primary);
          width: 24px;
          height: 24px;
          border-radius: var(--radius-full);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 0.75rem;
          font-weight: 800;
          flex-shrink: 0;
          margin-top: 2px;
        }
        
        .step-heading {
          font-size: 0.9rem;
          font-weight: 750;
          color: var(--text-heading);
          margin-bottom: 2px;
        }
        
        .step-info {
          font-size: 0.8rem;
          color: var(--text-muted);
          line-height: 1.4;
        }

        /* Action Row */
        .success-action-row {
          display: flex;
          justify-content: center;
          gap: 16px;
          flex-wrap: wrap;
        }
        
        .btn-success-home {
          padding: 12px 28px;
          font-size: 1rem;
        }
        
        .btn-success-more {
          padding: 12px 28px;
          font-size: 1rem;
        }

        /* Responsiveness */
        @media (max-width: 900px) {
          .success-layout-grid {
            grid-template-columns: 1fr;
          }
        }
        
        @media (max-width: 600px) {
          .success-title {
            font-size: 2rem;
          }
          .receipt-body {
            padding: 20px;
          }
        }
      `}</style>
    </div>
  );
};

export default BookingSuccess;
