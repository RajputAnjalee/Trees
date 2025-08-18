import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export const useNotifications = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Register service worker
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/firebase-messaging-sw.js')
        .then((registration) => {
          console.log('Service Worker registered successfully:', registration);
        })
        .catch((error) => {
          console.error('Service Worker registration failed:', error);
        });
    }

    // Listen for messages from service worker (notification clicks)
    const handleMessage = (event) => {
      if (event.data && event.data.type === 'NOTIFICATION_CLICKED') {
        const { url, data } = event.data;
        
        // Navigate to the appropriate page
        if (url) {
          navigate(url);
        }
        
        // You can also handle specific notification data here
        console.log('Notification clicked:', data);
      }
    };

    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.addEventListener('message', handleMessage);
    }

    // Cleanup
    return () => {
      if ('serviceWorker' in navigator) {
        navigator.serviceWorker.removeEventListener('message', handleMessage);
      }
    };
  }, [navigate]);
};

export default useNotifications;
