"use client";
import { createContext, useContext, useState, useCallback } from "react";
import {
  HiOutlineCheck,
  HiOutlineX,
  HiOutlineExclamation,
  HiOutlineInformationCircle,
} from "react-icons/hi";

const ToastContext = createContext();

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast debe usarse dentro de ToastProvider");
  }
  return context;
};

const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback(
    ({ message, type = "info", duration = 5000, id = Date.now() }) => {
      const newToast = { id, message, type, duration };
      setToasts((prev) => [...prev, newToast]);

      // Auto-remove toast after duration
      if (duration > 0) {
        setTimeout(() => {
          removeToast(id);
        }, duration);
      }
    },
    []
  );

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  const success = useCallback(
    (message, options = {}) => {
      addToast({ message, type: "success", ...options });
    },
    [addToast]
  );

  const error = useCallback(
    (message, options = {}) => {
      addToast({ message, type: "error", ...options });
    },
    [addToast]
  );

  const warning = useCallback(
    (message, options = {}) => {
      addToast({ message, type: "warning", ...options });
    },
    [addToast]
  );

  const info = useCallback(
    (message, options = {}) => {
      addToast({ message, type: "info", ...options });
    },
    [addToast]
  );

  return (
    <ToastContext.Provider
      value={{ addToast, removeToast, success, error, warning, info }}
    >
      {children}
      <ToastContainer toasts={toasts} removeToast={removeToast} />
    </ToastContext.Provider>
  );
};

const ToastContainer = ({ toasts, removeToast }) => {
  const getIcon = (type) => {
    switch (type) {
      case "success":
        return <HiOutlineCheck className="w-5 h-5" />;
      case "error":
        return <HiOutlineX className="w-5 h-5" />;
      case "warning":
        return <HiOutlineExclamation className="w-5 h-5" />;
      case "info":
        return <HiOutlineInformationCircle className="w-5 h-5" />;
      default:
        return <HiOutlineInformationCircle className="w-5 h-5" />;
    }
  };

  const getStyles = (type) => {
    switch (type) {
      case "success":
        return "bg-green-50 border-green-200 text-green-800";
      case "error":
        return "bg-red-50 border-red-200 text-red-800";
      case "warning":
        return "bg-yellow-50 border-yellow-200 text-yellow-800";
      case "info":
        return "bg-blue-50 border-blue-200 text-blue-800";
      default:
        return "bg-gray-50 border-gray-200 text-gray-800";
    }
  };

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`flex items-center p-4 rounded-lg border shadow-lg max-w-sm animate-slide-in ${getStyles(
            toast.type
          )}`}
        >
          <div className="flex-shrink-0 mr-3">{getIcon(toast.type)}</div>
          <div className="flex-1 text-sm font-medium">{toast.message}</div>
          <button
            onClick={() => removeToast(toast.id)}
            className="flex-shrink-0 ml-3 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <HiOutlineX className="w-4 h-4" />
          </button>
        </div>
      ))}
    </div>
  );
};

export default ToastProvider;
