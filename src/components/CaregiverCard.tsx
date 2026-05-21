import React from 'react';
import { Link } from 'react-router-dom';
import { Star, MapPin, Calendar, ChevronRight } from 'lucide-react';
import type { Caregiver } from '../data/caregivers';

interface CaregiverCardProps {
  caregiver: Caregiver;
}

const CaregiverCard: React.FC<CaregiverCardProps> = ({ caregiver }) => {
  const getAvailabilityClass = (status: string) => {
    switch (status) {
      case 'Available Today':
        return 'badge-success';
      case 'Available Next Week':
        return 'badge-amber';
      default:
        return 'badge-danger';
    }
  };

  return (
    <div className="card caregiver-card animate-scale">
      <div className="card-image-wrapper">
        <img src={caregiver.photo} alt={caregiver.name} className="card-image" />
        <span className={`availability-badge badge ${getAvailabilityClass(caregiver.availability)}`}>
          <Calendar size={12} />
          {caregiver.availability}
        </span>
      </div>

      <div className="card-content">
        <div className="card-meta">
          <span className="experience-tag">{caregiver.experience} exp</span>
          <div className="rating-tag">
            <Star size={14} className="star-icon" fill="var(--secondary)" />
            <span className="rating-score">{caregiver.rating.toFixed(1)}</span>
            <span className="review-count">({caregiver.reviewCount})</span>
          </div>
        </div>

        <h3 className="card-name">{caregiver.name}</h3>
        <p className="card-title-desc">{caregiver.title}</p>

        <div className="location-tag">
          <MapPin size={14} />
          <span>{caregiver.location}</span>
        </div>

        <div className="supported-pets">
          {caregiver.supportedPets.map((pet) => (
            <span key={pet} className="pet-tag">
              {pet}
            </span>
          ))}
        </div>

        <div className="pricing-footer">
          <div className="price-box">
            <span className="price-amount">${caregiver.price}</span>
            <span className="price-unit">/ hr</span>
          </div>
          <Link to={`/profile/${caregiver.id}`} className="btn btn-primary btn-card-action">
            <span>View Profile</span>
            <ChevronRight size={14} />
          </Link>
        </div>
      </div>

      <style>{`
        .caregiver-card {
          display: flex;
          flex-direction: column;
          height: 100%;
          text-align: left;
        }
        
        .card-image-wrapper {
          position: relative;
          height: 200px;
          overflow: hidden;
          background-color: var(--border);
        }
        
        .card-image {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: var(--transition);
        }
        
        .caregiver-card:hover .card-image {
          transform: scale(1.08);
        }
        
        .availability-badge {
          position: absolute;
          bottom: 12px;
          left: 12px;
          box-shadow: var(--shadow-md);
          backdrop-filter: blur(4px);
        }
        
        .card-content {
          padding: 20px;
          display: flex;
          flex-direction: column;
          flex-grow: 1;
        }
        
        .card-meta {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 12px;
        }
        
        .experience-tag {
          font-size: 0.75rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          color: var(--primary);
          background-color: var(--primary-light);
          padding: 2px 8px;
          border-radius: var(--radius-sm);
        }
        
        .rating-tag {
          display: flex;
          align-items: center;
          gap: 4px;
        }
        
        .star-icon {
          color: var(--secondary);
        }
        
        .rating-score {
          font-weight: 700;
          font-size: 0.85rem;
          color: var(--text-heading);
        }
        
        .review-count {
          font-size: 0.8rem;
          color: var(--text-muted);
        }
        
        .card-name {
          font-size: 1.25rem;
          font-weight: 700;
          color: var(--text-heading);
          margin-bottom: 4px;
        }
        
        .card-title-desc {
          font-size: 0.85rem;
          color: var(--text-muted);
          margin-bottom: 16px;
          line-height: 1.4;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
          height: 2.8em; /* Force height so all cards align */
        }
        
        .location-tag {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 0.85rem;
          color: var(--text-muted);
          margin-bottom: 16px;
        }
        
        .location-tag svg {
          color: var(--primary);
        }
        
        .supported-pets {
          display: flex;
          flex-wrap: wrap;
          gap: 6px;
          margin-bottom: 24px;
          margin-top: auto; /* Push tags & pricing to bottom */
        }
        
        .pet-tag {
          font-size: 0.75rem;
          font-weight: 600;
          color: var(--text-main);
          background-color: var(--bg-main);
          border: 1px solid var(--border);
          padding: 2px 8px;
          border-radius: var(--radius-sm);
        }
        
        .pricing-footer {
          display: flex;
          align-items: center;
          justify-content: space-between;
          border-top: 1px solid var(--border);
          padding-top: 16px;
        }
        
        .price-box {
          display: flex;
          align-items: baseline;
        }
        
        .price-amount {
          font-size: 1.4rem;
          font-weight: 800;
          color: var(--text-heading);
        }
        
        .price-unit {
          font-size: 0.85rem;
          color: var(--text-muted);
          font-weight: 500;
          margin-left: 2px;
        }
        
        .btn-card-action {
          padding: 8px 16px;
          font-size: 0.85rem;
          gap: 4px;
          border-radius: var(--radius-md);
        }
      `}</style>
    </div>
  );
};

export default CaregiverCard;
