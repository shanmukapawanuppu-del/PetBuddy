import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Filter } from 'lucide-react';
import './PremiumSelect.css';

interface Option {
  value: string;
  label: string;
}

interface PremiumSelectProps {
  options: (string | Option)[];
  value: string;
  onChange: (value: string) => void;
  icon?: React.ReactNode;
  placeholder?: string;
  customLabel?: string;
  hideChevron?: boolean;
}

const PremiumSelect: React.FC<PremiumSelectProps> = ({ 
  options, 
  value, 
  onChange, 
  icon = <Filter size={18} />, 
  placeholder = "Select...",
  customLabel,
  hideChevron = false
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const formattedOptions: Option[] = options.map(opt => 
    typeof opt === 'string' ? { value: opt, label: opt } : opt
  );

  const selectedLabel = formattedOptions.find(opt => opt.value === value)?.label || placeholder;

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="premium-select-container" ref={dropdownRef}>
      <div 
        className={`premium-select-trigger ${isOpen ? 'open' : ''}`}
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="premium-select-icon">{icon}</span>
        <span className="premium-select-value">{customLabel || selectedLabel}</span>
        {!hideChevron && <ChevronDown size={18} className={`premium-select-chevron ${isOpen ? 'open' : ''}`} />}
      </div>

      {isOpen && (
        <div className="premium-select-dropdown">
          {formattedOptions.map((option) => (
            <div
              key={option.value}
              className={`premium-select-option ${option.value === value ? 'selected' : ''}`}
              onClick={() => {
                onChange(option.value);
                setIsOpen(false);
              }}
            >
              {option.label}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PremiumSelect;
