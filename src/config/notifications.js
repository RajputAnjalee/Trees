// Firebase Cloud Messaging Configuration
export const NOTIFICATION_CONFIG = {
  // Replace this with your actual VAPID key from Firebase Console
  // Firebase Console → Project Settings → Cloud Messaging → Web configuration → Generate key pair
  VAPID_KEY: 'BAmEl7BS5s0zpSp01Sdky4FM0IiML8K6b0_Of6pJ9Rb1ICmGmaheLoGuCqfCy-Fkt3CvGqrwI8jU1qHmLEFgy34',
  
  // Notification settings
  DEFAULT_ICON: '/icon-192x192.png',
  BADGE_ICON: '/badge-72x72.png',
  
  // Toast notification duration (milliseconds)
  TOAST_DURATION: 5000,
  
  // Notification types and their configurations
  NOTIFICATION_TYPES: {
    order: {
      icon: '📦',
      color: 'blue',
      bgColor: 'bg-blue-50 border-blue-200'
    },
    family: {
      icon: '👥',
      color: 'green',
      bgColor: 'bg-green-50 border-green-200'
    },
    system: {
      icon: '⚙️',
      color: 'gray',
      bgColor: 'bg-gray-50 border-gray-200'
    },
    default: {
      icon: '🔔',
      color: 'blue',
      bgColor: 'bg-blue-50 border-blue-200'
    }
  }
};

export default NOTIFICATION_CONFIG;
