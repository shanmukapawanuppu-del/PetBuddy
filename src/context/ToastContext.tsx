import React, { createContext, useContext, useState, useCallback } from 'react';
import type { ReactNode } from 'react';
import { CheckCircle, AlertCircle, Info, X } from 'lucide-react';

type ToastType = 'success' | 'error' | 'info';

interface Toast {
  id: number;
  message: string;
  type: ToastType;
}

interface ToastContextValue {
  showToast: (message: string, type?: ToastType) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

export const useToast = (): ToastContextValue => {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used inside <ToastProvider>');
  return ctx;
};

// ─── Global singleton (usable outside React, e.g. in axios interceptors) ──
let _showToast: ((message: string, type?: ToastType) => void) | null = null;

export const toast = (message: string, type: ToastType = 'success') => {
  _showToast?.(message, type);
};

// ─── Config ───────────────────────────────────────────────────────────────
const CONFIG: Record<ToastType, { icon: React.ReactNode; iconBg: string; iconColor: string; bar: string }> = {
  success: { icon: <CheckCircle size={20} />, iconBg: '#dcfce7', iconColor: '#16a34a', bar: '#16a34a' },
  error:   { icon: <AlertCircle size={20} />, iconBg: '#fee2e2', iconColor: '#dc2626', bar: '#dc2626' },
  info:    { icon: <Info size={20} />,        iconBg: '#dbeafe', iconColor: '#2563eb', bar: '#2563eb' },
};

const DURATION = 3500;

// ─── Provider ─────────────────────────────────────────────────────────────
export const ToastProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const counter = React.useRef(0);

  const dismiss = useCallback((id: number) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  const showToast = useCallback((message: string, type: ToastType = 'success') => {
    const id = ++counter.current;
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => dismiss(id), DURATION);
  }, [dismiss]);

  // Expose globally for axios interceptor
  React.useEffect(() => {
    _showToast = showToast;
    return () => { _showToast = null; };
  }, [showToast]);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}

      {/* ── Toast Stack (top-right) ── */}
      <div style={{
        position: 'fixed',
        top: '24px',
        right: '24px',
        zIndex: 99999,
        display: 'flex',
        flexDirection: 'column',
        gap: '12px',
        alignItems: 'flex-end',
        pointerEvents: 'none',
      }}>
        {toasts.map(t => {
          const c = CONFIG[t.type];
          return (
            <div
              key={t.id}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                backgroundColor: '#ffffff',
                color: '#1e293b',
                padding: '14px 16px',
                borderRadius: '12px',
                boxShadow: '0 4px 24px rgba(0,0,0,0.12), 0 1px 4px rgba(0,0,0,0.06)',
                fontSize: '0.92rem',
                fontWeight: '500',
                minWidth: '280px',
                maxWidth: '360px',
                position: 'relative',
                overflow: 'hidden',
                animation: 'toastSlideIn 0.35s cubic-bezier(0.16,1,0.3,1)',
                pointerEvents: 'all',
                border: '1px solid rgba(0,0,0,0.06)',
              }}
            >
              <div style={{
                width: '32px', height: '32px', borderRadius: '50%',
                backgroundColor: c.iconBg, color: c.iconColor,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                flexShrink: 0,
              }}>
                {c.icon}
              </div>

              <span style={{ flex: 1, lineHeight: '1.4' }}>{t.message}</span>

              <button
                onClick={() => dismiss(t.id)}
                style={{
                  background: 'none', border: 'none', cursor: 'pointer',
                  color: '#94a3b8', display: 'flex', padding: '2px',
                  borderRadius: '4px', flexShrink: 0,
                }}
              >
                <X size={14} />
              </button>

              <div style={{
                position: 'absolute', bottom: 0, left: 0,
                height: '3px', backgroundColor: c.bar,
                animation: `toastProgress ${DURATION}ms linear forwards`,
              }} />
            </div>
          );
        })}
      </div>

      <style>{`
        @keyframes toastSlideIn {
          from { opacity: 0; transform: translateX(32px) scale(0.96); }
          to   { opacity: 1; transform: translateX(0)    scale(1);    }
        }
        @keyframes toastProgress {
          from { width: 100%; }
          to   { width: 0%;   }
        }
      `}</style>
    </ToastContext.Provider>
  );
};
