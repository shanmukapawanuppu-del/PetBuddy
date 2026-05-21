import React, { useState, useMemo } from 'react';
import { Search, Filter, RotateCcw, X, SlidersHorizontal } from 'lucide-react';
import { CAREGIVERS } from '../data/caregivers';
import CaregiverCard from '../components/CaregiverCard';

const CaregiverListing: React.FC = () => {
  // Filter States
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('All');
  const [selectedPet, setSelectedPet] = useState('All');
  const [maxPrice, setMaxPrice] = useState(25);
  const [minRating, setMinRating] = useState(0);
  const [sortBy, setSortBy] = useState('rating'); // rating, price-low, price-high
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  // Available Locations for filtering
  const locations = useMemo(() => {
    const locs = new Set(CAREGIVERS.map(cg => cg.location));
    return ['All', ...Array.from(locs)];
  }, []);

  // Available Pet Types for filtering
  const petTypes = ['All', 'Dog', 'Cat', 'Bird', 'Rabbit'];

  // Reset Filters
  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedLocation('All');
    setSelectedPet('All');
    setMaxPrice(25);
    setMinRating(0);
    setSortBy('rating');
  };

  // Real-time Filter & Sort Logic
  const filteredCaregivers = useMemo(() => {
    let result = [...CAREGIVERS];

    // Search query
    if (searchQuery.trim() !== '') {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        cg => cg.name.toLowerCase().includes(q) || cg.title.toLowerCase().includes(q)
      );
    }

    // Location
    if (selectedLocation !== 'All') {
      result = result.filter(cg => cg.location === selectedLocation);
    }

    // Supported Pet Type
    if (selectedPet !== 'All') {
      result = result.filter(cg => cg.supportedPets.includes(selectedPet));
    }

    // Max Price
    result = result.filter(cg => cg.price <= maxPrice);

    // Min Rating
    if (minRating > 0) {
      result = result.filter(cg => cg.rating >= minRating);
    }

    // Sorting
    if (sortBy === 'rating') {
      result.sort((a, b) => b.rating - a.rating);
    } else if (sortBy === 'price-low') {
      result.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'price-high') {
      result.sort((a, b) => b.price - a.price);
    }

    return result;
  }, [searchQuery, selectedLocation, selectedPet, maxPrice, minRating, sortBy]);

  return (
    <div className="listing-page container animate-fade">
      {/* Top Banner Area */}
      <div className="listing-header">
        <h1 className="listing-page-title">Find Trusted Local Caregivers</h1>
        <p className="listing-page-subtitle">
          Search verified background-checked sitters ready to love your pet in their secure home environments.
        </p>
      </div>

      <div className="listing-layout">
        {/* Desktop Filter Sidebar & Mobile Drawer */}
        <aside className={`filter-sidebar ${showMobileFilters ? 'mobile-open' : ''}`}>
          <div className="filter-sidebar-header">
            <div className="filter-header-title">
              <Filter size={18} />
              <span>Filters</span>
            </div>
            <button className="reset-btn" onClick={handleResetFilters} title="Reset all filters">
              <RotateCcw size={14} />
              <span>Reset</span>
            </button>
            <button className="close-mobile-filters" onClick={() => setShowMobileFilters(false)}>
              <X size={20} />
            </button>
          </div>

          <div className="filter-body">
            {/* Search Input inside Filters */}
            <div className="filter-section">
              <label className="filter-label">Search by Name</label>
              <div className="search-input-wrapper">
                <Search className="search-icon" size={16} />
                <input 
                  type="text" 
                  className="search-input" 
                  placeholder="e.g. Sarah"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>

            {/* Location Select */}
            <div className="filter-section">
              <label className="filter-label">Neighborhood</label>
              <select 
                className="filter-select"
                value={selectedLocation}
                onChange={(e) => setSelectedLocation(e.target.value)}
              >
                {locations.map(loc => (
                  <option key={loc} value={loc}>{loc === 'All' ? 'All Locations' : loc}</option>
                ))}
              </select>
            </div>

            {/* Pet Type Bubble Toggles */}
            <div className="filter-section">
              <label className="filter-label">Supported Pet Type</label>
              <div className="pet-selector-bubbles">
                {petTypes.map(pet => (
                  <button
                    key={pet}
                    type="button"
                    className={`pet-bubble-btn ${selectedPet === pet ? 'active' : ''}`}
                    onClick={() => setSelectedPet(pet)}
                  >
                    {pet}
                  </button>
                ))}
              </div>
            </div>

            {/* Max Budget Slider */}
            <div className="filter-section">
              <div className="price-slider-label-row">
                <label className="filter-label">Max Price / hr</label>
                <span className="price-slider-value">${maxPrice}</span>
              </div>
              <input 
                type="range" 
                min="10" 
                max="25" 
                step="1"
                className="price-range-slider"
                value={maxPrice}
                onChange={(e) => setMaxPrice(Number(e.target.value))}
              />
              <div className="slider-limits">
                <span>$10</span>
                <span>$25</span>
              </div>
            </div>

            {/* Minimum Ratings */}
            <div className="filter-section">
              <label className="filter-label">Minimum Rating</label>
              <div className="rating-selector-stars">
                {[0, 4.5, 4.8, 4.9].map((rating) => (
                  <button
                    key={rating}
                    type="button"
                    className={`rating-star-btn ${minRating === rating ? 'active' : ''}`}
                    onClick={() => setMinRating(rating)}
                  >
                    {rating === 0 ? 'Any Rating' : `${rating}★ & up`}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </aside>

        {/* Caregiver Grid Area */}
        <main className="results-area">
          {/* Controls Bar */}
          <div className="results-controls">
            <p className="results-count">
              Found <span className="highlight">{filteredCaregivers.length}</span> caregivers
            </p>

            <div className="controls-right">
              {/* Sort Selector */}
              <div className="sort-wrapper">
                <span className="sort-label">Sort by:</span>
                <select 
                  className="sort-select"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                >
                  <option value="rating">Top Rated</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                </select>
              </div>

              {/* Mobile Filter Toggle Trigger */}
              <button className="mobile-filter-trigger btn btn-secondary" onClick={() => setShowMobileFilters(true)}>
                <SlidersHorizontal size={16} />
                <span>Filters</span>
              </button>
            </div>
          </div>

          {/* Sitter Grid */}
          {filteredCaregivers.length > 0 ? (
            <div className="grid-2 sitters-grid">
              {filteredCaregivers.map((cg) => (
                <CaregiverCard key={cg.id} caregiver={cg} />
              ))}
            </div>
          ) : (
            /* Detailed Empty State */
            <div className="empty-state card">
              <div className="empty-state-icon-wrapper">
                <Search size={32} />
              </div>
              <h3 className="empty-state-title">No Caregivers Match Your Filters</h3>
              <p className="empty-state-desc">
                Try widening your price range, clearing some search terms, or checking another nearby neighborhood.
              </p>
              <button className="btn btn-primary" onClick={handleResetFilters}>
                <RotateCcw size={16} />
                <span>Reset All Filters</span>
              </button>
            </div>
          )}
        </main>
      </div>

      <style>{`
        .listing-page {
          padding-top: 40px;
          padding-bottom: 80px;
          flex-grow: 1;
        }
        
        .listing-header {
          text-align: left;
          margin-bottom: 40px;
        }
        
        .listing-page-title {
          font-size: 2.4rem;
          font-weight: 800;
          color: var(--text-heading);
          letter-spacing: -0.8px;
          margin-bottom: 8px;
        }
        
        .listing-page-subtitle {
          font-size: 1.1rem;
          color: var(--text-muted);
          max-width: 700px;
        }
        
        .listing-layout {
          display: grid;
          grid-template-columns: 280px 1fr;
          gap: 32px;
          align-items: start;
        }

        /* Filter Sidebar */
        .filter-sidebar {
          background-color: var(--bg-card);
          border: 1px solid var(--border);
          border-radius: var(--radius-lg);
          padding: 24px;
          position: sticky;
          top: 100px;
          box-shadow: var(--shadow-sm);
        }
        
        .filter-sidebar-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          border-bottom: 1px solid var(--border);
          padding-bottom: 16px;
          margin-bottom: 24px;
        }
        
        .filter-header-title {
          display: flex;
          align-items: center;
          gap: 8px;
          font-weight: 700;
          color: var(--text-heading);
        }
        
        .reset-btn {
          background: none;
          border: none;
          color: var(--text-muted);
          font-size: 0.8rem;
          font-weight: 600;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 4px;
          transition: var(--transition-fast);
        }
        
        .reset-btn:hover {
          color: var(--primary);
        }
        
        .close-mobile-filters {
          display: none;
          background: none;
          border: none;
          color: var(--text-heading);
          cursor: pointer;
        }
        
        .filter-section {
          margin-bottom: 24px;
          text-align: left;
        }
        
        .filter-section:last-child {
          margin-bottom: 0;
        }
        
        .filter-label {
          display: block;
          font-weight: 700;
          font-size: 0.85rem;
          color: var(--text-heading);
          margin-bottom: 10px;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }
        
        .search-input-wrapper {
          position: relative;
          display: flex;
          align-items: center;
        }
        
        .search-icon {
          position: absolute;
          left: 12px;
          color: var(--text-muted);
        }
        
        .search-input {
          width: 100%;
          padding: 10px 12px 10px 38px;
          background-color: var(--bg-main);
          border: 1.5px solid var(--border);
          border-radius: var(--radius-md);
          font-size: 0.9rem;
          transition: var(--transition-fast);
        }
        
        .search-input:focus {
          border-color: var(--border-focus);
          background-color: var(--bg-card);
        }
        
        .filter-select {
          width: 100%;
          padding: 10px 12px;
          background-color: var(--bg-main);
          border: 1.5px solid var(--border);
          border-radius: var(--radius-md);
          font-size: 0.9rem;
          cursor: pointer;
          transition: var(--transition-fast);
        }
        
        .filter-select:focus {
          border-color: var(--border-focus);
        }
        
        .pet-selector-bubbles {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
        }
        
        .pet-bubble-btn {
          background-color: var(--bg-main);
          border: 1px solid var(--border);
          padding: 6px 12px;
          font-size: 0.8rem;
          font-weight: 600;
          border-radius: var(--radius-full);
          cursor: pointer;
          transition: var(--transition-fast);
        }
        
        .pet-bubble-btn:hover {
          border-color: var(--text-muted);
        }
        
        .pet-bubble-btn.active {
          background-color: var(--primary-light);
          color: var(--primary);
          border-color: var(--primary);
        }
        
        .price-slider-label-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        
        .price-slider-value {
          font-size: 0.9rem;
          font-weight: 700;
          color: var(--primary);
        }
        
        .price-range-slider {
          width: 100%;
          accent-color: var(--primary);
          cursor: pointer;
          height: 6px;
          border-radius: var(--radius-full);
          background-color: var(--border);
          outline: none;
        }
        
        .slider-limits {
          display: flex;
          justify-content: space-between;
          font-size: 0.75rem;
          color: var(--text-muted);
          margin-top: 4px;
        }
        
        .rating-selector-stars {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }
        
        .rating-star-btn {
          background-color: var(--bg-main);
          border: 1px solid var(--border);
          padding: 8px 12px;
          font-size: 0.8rem;
          font-weight: 600;
          border-radius: var(--radius-md);
          cursor: pointer;
          text-align: left;
          transition: var(--transition-fast);
        }
        
        .rating-star-btn:hover {
          border-color: var(--text-muted);
        }
        
        .rating-star-btn.active {
          background-color: var(--primary-light);
          color: var(--primary);
          border-color: var(--primary);
        }

        /* Results Area */
        .results-area {
          display: flex;
          flex-direction: column;
          gap: 24px;
        }
        
        .results-controls {
          display: flex;
          align-items: center;
          justify-content: space-between;
          border-bottom: 1px solid var(--border);
          padding-bottom: 16px;
        }
        
        .results-count {
          font-weight: 600;
          color: var(--text-main);
        }
        
        .results-count .highlight {
          color: var(--primary);
          font-weight: 800;
        }
        
        .controls-right {
          display: flex;
          align-items: center;
          gap: 16px;
        }
        
        .sort-wrapper {
          display: flex;
          align-items: center;
          gap: 8px;
        }
        
        .sort-label {
          font-size: 0.85rem;
          color: var(--text-muted);
          font-weight: 600;
        }
        
        .sort-select {
          padding: 8px 12px;
          background-color: var(--bg-card);
          border: 1px solid var(--border);
          border-radius: var(--radius-md);
          font-size: 0.85rem;
          font-weight: 600;
          cursor: pointer;
          color: var(--text-heading);
        }
        
        .mobile-filter-trigger {
          display: none;
          padding: 8px 16px;
          font-size: 0.85rem;
        }

        /* Empty State */
        .empty-state {
          padding: 60px 40px;
          text-align: center;
          max-width: 600px;
          margin: 40px auto;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 16px;
        }
        
        .empty-state-icon-wrapper {
          background-color: var(--primary-light);
          color: var(--primary);
          padding: 20px;
          border-radius: var(--radius-full);
          margin-bottom: 8px;
        }
        
        .empty-state-title {
          font-size: 1.4rem;
          font-weight: 800;
          color: var(--text-heading);
        }
        
        .empty-state-desc {
          font-size: 0.95rem;
          color: var(--text-muted);
          line-height: 1.6;
          max-width: 420px;
          margin-bottom: 8px;
        }

        /* Responsive Layouts */
        @media (max-width: 850px) {
          .listing-layout {
            grid-template-columns: 1fr;
          }
          .filter-sidebar {
            display: none;
          }
          .mobile-filter-trigger {
            display: flex;
          }
          
          /* Mobile Drawer Open States */
          .filter-sidebar.mobile-open {
            display: block;
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            z-index: 150;
            background-color: var(--bg-card);
            border-radius: 0;
            overflow-y: auto;
            border: none;
          }
          
          .close-mobile-filters {
            display: block;
          }
        }
        
        @media (max-width: 600px) {
          .listing-page {
            padding-top: 20px;
          }
          .listing-page-title {
            font-size: 1.8rem;
          }
          .results-controls {
            flex-direction: column;
            align-items: flex-start;
            gap: 12px;
          }
          .controls-right {
            width: 100%;
            justify-content: space-between;
          }
        }
      `}</style>
    </div>
  );
};

export default CaregiverListing;
