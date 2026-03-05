import { createContext, useContext, useState, useCallback, useEffect } from "react";
import "./../../Styles/Lasiru/Toast.css";

const ToastContext = createContext(null);

export function ToastProvider({ children }) {
  const [toast, setToast] = useState(null);

  const showToast = useCallback((type, message) => {
    setToast({ id: Date.now(), type, message });
  }, []);

  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => setToast(null), 4000);
    return () => clearTimeout(timer);
  }, [toast]);

  const handleClose = () => setToast(null);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      {toast && (
        <div className="lasiru-toast-layer">
          <div className={`lasiru-toast lasiru-toast-${toast.type}`}>
            <div className="lasiru-toast-indicator" />
            <div className="lasiru-toast-content">
              <p>{toast.message}</p>
            </div>
            <button
              type="button"
              className="lasiru-toast-close"
              onClick={handleClose}
              aria-label="Close notification"
            >
              ×
            </button>
          </div>
        </div>
      )}
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return ctx;
}

