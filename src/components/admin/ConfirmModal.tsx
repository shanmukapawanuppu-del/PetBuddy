import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { AlertCircle, AlertTriangle, Info, Loader } from 'lucide-react';

export type ConfirmVariant = 'danger' | 'warning' | 'primary';

interface ConfirmModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
  confirmText?: string;
  cancelText?: string;
  isLoading?: boolean;
  variant?: ConfirmVariant;
}

export const ConfirmModal: React.FC<ConfirmModalProps> = ({
  isOpen,
  title,
  message,
  onConfirm,
  onCancel,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  isLoading = false,
  variant = 'danger'
}) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  if (!isOpen || !mounted) return null;

  const getVariantStyles = () => {
    switch (variant) {
      case 'warning':
        return {
          iconBg: 'rgba(245, 158, 11, 0.1)',
          iconColor: 'var(--warning, #f59e0b)',
          btnBg: 'var(--warning, #f59e0b)',
          Icon: AlertTriangle
        };
      case 'primary':
        return {
          iconBg: 'rgba(13, 148, 136, 0.1)',
          iconColor: 'var(--primary)',
          btnBg: 'var(--primary)',
          Icon: Info
        };
      case 'danger':
      default:
        return {
          iconBg: 'rgba(239, 68, 68, 0.1)',
          iconColor: 'var(--danger)',
          btnBg: 'var(--danger)',
          Icon: AlertCircle
        };
    }
  };

  const styles = getVariantStyles();
  const { Icon } = styles;

  return createPortal(
    <div style={{
      position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh',
      backgroundColor: 'rgba(15, 23, 42, 0.6)',
      backdropFilter: 'blur(8px)',
      WebkitBackdropFilter: 'blur(8px)',
      display: 'grid', placeItems: 'center', zIndex: 9999,
      padding: '20px'
    }}>
      <div className="animate-scale" style={{
        backgroundColor: 'var(--bg-card)', borderRadius: '20px',
        width: '100%', maxWidth: '420px', padding: '32px',
        border: '1px solid var(--border)',
        boxShadow: '0 24px 50px -12px rgba(0, 0, 0, 0.25)',
        textAlign: 'center'
      }}>
        <div style={{
          width: '56px', height: '56px', borderRadius: '50%',
          backgroundColor: styles.iconBg, color: styles.iconColor,
          display: 'flex', justifyContent: 'center', alignItems: 'center',
          margin: '0 auto 20px auto'
        }}>
          <Icon size={28} />
        </div>
        <h3 style={{ margin: '0 0 12px 0', fontSize: '1.35rem', fontWeight: '800', color: 'var(--text-heading)' }}>{title}</h3>
        <p style={{ margin: '0 0 32px 0', fontSize: '1rem', color: 'var(--text-muted)', lineHeight: '1.5' }}>
          {message}
        </p>
        <div style={{ display: 'flex', gap: '16px' }}>
          <button 
            onClick={onCancel}
            style={{
              flex: 1, padding: '12px', borderRadius: '12px', border: '1px solid var(--border)',
              backgroundColor: 'var(--bg-card)', color: 'var(--text-heading)', fontWeight: '700', cursor: 'pointer',
              transition: 'all 0.2s', fontSize: '0.95rem'
            }}
            disabled={isLoading}
            onMouseOver={e => { e.currentTarget.style.backgroundColor = 'var(--bg-main)'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
            onMouseOut={e => { e.currentTarget.style.backgroundColor = 'var(--bg-card)'; e.currentTarget.style.transform = 'translateY(0)'; }}
          >
            {cancelText}
          </button>
          <button 
            onClick={onConfirm}
            style={{
              flex: 1, padding: '12px', borderRadius: '12px', border: 'none',
              backgroundColor: styles.btnBg, color: 'white', fontWeight: '700', cursor: 'pointer',
              transition: 'all 0.2s', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px', fontSize: '0.95rem',
              boxShadow: `0 8px 16px ${styles.iconBg}`
            }}
            disabled={isLoading}
            onMouseOver={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = `0 12px 20px ${styles.iconBg}`; }}
            onMouseOut={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = `0 8px 16px ${styles.iconBg}`; }}
          >
            {isLoading ? <Loader size={18} className="spin" /> : confirmText}
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
};
