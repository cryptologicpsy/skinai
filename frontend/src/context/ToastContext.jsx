import { createContext, useCallback, useContext, useRef, useState } from 'react';
import Icon from '../components/Icon.jsx';

const ToastContext = createContext(null);

export function ToastProvider({ children }) {
  const [toast, setToast] = useState(null);
  const timeoutRef = useRef(null);

  const showToast = useCallback((message) => {
    clearTimeout(timeoutRef.current);
    setToast(message);
    timeoutRef.current = setTimeout(() => setToast(null), 2600);
  }, []);

  return (
    <ToastContext.Provider value={showToast}>
      {children}
      <div
        className={`fixed top-20 left-1/2 -translate-x-1/2 z-[100] transition-all duration-300 flex items-center gap-space-sm bg-inverse-surface text-inverse-on-surface px-space-md py-space-xs rounded-full shadow-lg pt-safe ${
          toast ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2 pointer-events-none'
        }`}
        role="status"
        aria-live="polite"
      >
        <Icon name="check_circle" className="text-[18px] text-secondary-fixed" />
        <span className="font-label-md text-label-md">{toast}</span>
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used within ToastProvider');
  return ctx;
}
