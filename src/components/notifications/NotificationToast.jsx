import React, { useState, useEffect } from 'react';
import { X, Bell, Package, Users, Settings } from 'lucide-react';
import { NOTIFICATION_CONFIG } from '../../config/notifications';

const NotificationToast = ({ notification, onClose, duration = 5000 }) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      handleClose();
    }, duration);

    return () => clearTimeout(timer);
  }, [duration]);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(() => {
      onClose();
    }, 300); // Wait for animation to complete
  };

  const getIcon = (type) => {
    switch (type) {
      case 'order':
        return <Package className="w-5 h-5 text-blue-600" />;
      case 'family':
        return <Users className="w-5 h-5 text-green-600" />;
      case 'system':
        return <Settings className="w-5 h-5 text-gray-600" />;
      default:
        return <Bell className="w-5 h-5 text-blue-600" />;
    }
  };

  const getBgColor = (type) => {
    return NOTIFICATION_CONFIG.NOTIFICATION_TYPES[type]?.bgColor || 
           NOTIFICATION_CONFIG.NOTIFICATION_TYPES.default.bgColor;
  };

  if (!notification) return null;

  return (
    <div
      className={`fixed top-4 right-4 z-50 max-w-sm w-full transition-all duration-300 transform ${
        isVisible ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'
      }`}
    >
      <div className={`border rounded-lg shadow-lg p-4 ${getBgColor(notification.data?.type)}`}>
        <div className="flex items-start space-x-3">
          <div className="flex-shrink-0">
            {getIcon(notification.data?.type)}
          </div>
          
          <div className="flex-1 min-w-0">
            <h4 className="text-sm font-semibold text-gray-900">
              {notification.title}
            </h4>
            <p className="text-sm text-gray-700 mt-1">
              {notification.body}
            </p>
          </div>

          <button
            onClick={handleClose}
            className="flex-shrink-0 text-gray-400 hover:text-gray-600"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

// Toast container component to manage multiple toasts
export const NotificationToastContainer = () => {
  const [toasts, setToasts] = useState([]);

  // Function to add a new toast
  const addToast = (notification) => {
    const id = Date.now();
    setToasts(prev => [...prev, { ...notification, id }]);
  };

  // Function to remove a toast
  const removeToast = (id) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  };

  // Expose addToast function globally for use in notification service
  useEffect(() => {
    window.showNotificationToast = addToast;
    
    return () => {
      delete window.showNotificationToast;
    };
  }, []);

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2">
      {toasts.map((toast) => (
        <NotificationToast
          key={toast.id}
          notification={toast}
          onClose={() => removeToast(toast.id)}
        />
      ))}
    </div>
  );
};

export default NotificationToast;
