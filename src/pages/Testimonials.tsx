import React from 'react';
import { Link } from 'react-router-dom';
import { Star } from 'lucide-react';

const Testimonials: React.FC = () => {
  const testimonials = [
    {
      name: 'Monica Geller',
      petName: 'Chappy (Frenchie)',
      rating: 5,
      text: 'We booked Sarah for our wedding weekend. We were super nervous, but she sent us beautiful photo updates every few hours! Chappy had a total blast and was so relaxed when we picked him up.',
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=100&h=100'
    },
    {
      name: 'Chandler Bing',
      petName: 'Waffles (Calico)',
      rating: 5,
      text: 'Marcus is an absolute professional. Waffles usually hates new environments, but Marcus’s quiet, purr-friendly apartment was perfect. Will 100% book again for my next business trip!',
      avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=100&h=100'
    }
  ];

  return (
    <div className="page-content page-section animate-fade">
      <div className="container">
        <div className="section-header text-center">
          <span className="section-pre">Testimonials</span>
          <h1 className="section-title">Pet parents love PetBuddy</h1>
          <p className="section-desc">Real stories from our community of busy pet parents who trust their pets with verified caregivers.</p>
        </div>

        <div className="grid-2 testimonial-grid">
          {testimonials.map((item, index) => (
            <div key={index} className="card testimonial-card">
              <div className="testimonial-header">
                <img src={item.avatar} alt={item.name} className="testimonial-avatar" />
                <div>
                  <h4 className="testimonial-name">{item.name}</h4>
                  <p className="testimonial-pet">{item.petName}</p>
                </div>
                <div className="testimonial-stars">
                  {[...Array(item.rating)].map((_, starIndex) => (
                    <Star key={starIndex} size={14} fill="var(--secondary)" color="var(--secondary)" />
                  ))}
                </div>
              </div>
              <p className="testimonial-text">"{item.text}"</p>
            </div>
          ))}
        </div>

        <div className="section-cta text-center">
          <Link to="/caregivers" className="btn btn-primary btn-nav">
            Meet a Caregiver
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Testimonials;
