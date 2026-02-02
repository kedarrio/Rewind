import React, { useState, useEffect } from 'react';

type SemanticType = 'success' | 'error' | 'warning' | 'info';

interface ErrorBannerProps {
  message: string;
  type?: SemanticType;
  onRefresh?: () => void;
  onDismiss?: () => void;
  duration?: number;
}

const getStyles = (type: SemanticType) => {
  switch (type) {
    case 'success':
      return { bg: 'bg-success', icon: 'check_circle' };
    case 'warning':
      return { bg: 'bg-warning', icon: 'warning' };
    case 'info':
      return { bg: 'bg-info', icon: 'info' };
    case 'error':
    default:
      return { bg: 'bg-error', icon: 'error' };
  }
};

const getBannerStyles = (type: SemanticType) => {
  switch (type) {
    case 'success':
      return { bg: 'bg-emerald-50', border: 'border-success', text: 'text-emerald-900', icon: 'check_circle', iconColor: 'text-success' };
    case 'warning':
      return { bg: 'bg-amber-50', border: 'border-warning', text: 'text-amber-900', icon: 'warning', iconColor: 'text-warning' };
    case 'info':
      return { bg: 'bg-blue-50', border: 'border-info', text: 'text-blue-900', icon: 'info', iconColor: 'text-info' };
    case 'error':
    default:
      return { bg: 'bg-red-50', border: 'border-error', text: 'text-red-900', icon: 'error', iconColor: 'text-error' };
  }
};

export const ErrorBanner: React.FC<ErrorBannerProps> = ({ message, type = 'error', onRefresh, onDismiss, duration = 5000 }) => {
  const [isVisible, setIsVisible] = useState(true);
  const styles = getBannerStyles(type);

  useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(() => {
        setIsVisible(false);
        onDismiss?.();
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [duration, onDismiss]);

  if (!isVisible) return null;

  return (
    <div className={`fixed top-0 left-0 right-0 z-[200] border-l-4 ${styles.bg} ${styles.border} ${styles.text} px-6 py-4 flex items-center justify-between shadow-lg animate-in slide-in-from-top duration-300`}>
      <div className="flex items-center gap-3">
        <span className={`material-symbols-sharp text-xl ${styles.iconColor}`}>{styles.icon}</span>
        <span className="text-[11px] font-bold uppercase tracking-widest">{message}</span>
      </div>
      <div className="flex items-center gap-4">
        {onRefresh && (
          <button 
            onClick={onRefresh}
            className="text-[10px] font-bold uppercase tracking-widest border border-current opacity-50 px-3 py-1 hover:opacity-100 transition-all"
          >
            Refresh
          </button>
        )}
        <button onClick={() => { setIsVisible(false); onDismiss?.(); }}>
          <span className="material-symbols-sharp text-lg">close</span>
        </button>
      </div>
    </div>
  );
};

export const Toast: React.FC<{ message: string; type?: SemanticType; onDismiss: () => void }> = ({ message, type = 'success', onDismiss }) => {
  const styles = getStyles(type);
  
  useEffect(() => {
    const timer = setTimeout(onDismiss, 3000);
    return () => clearTimeout(timer);
  }, [onDismiss]);

  return (
    <div className={`fixed bottom-12 left-1/2 -translate-x-1/2 z-[300] ${styles.bg} text-white px-8 py-4 shadow-2xl flex items-center gap-3 animate-in fade-in slide-in-from-bottom-4 duration-500`}>
      <span className="material-symbols-sharp text-lg">{styles.icon}</span>
      <span className="text-[10px] font-bold uppercase tracking-[0.2em]">{message}</span>
    </div>
  );
};