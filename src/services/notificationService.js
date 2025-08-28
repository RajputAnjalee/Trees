import { getToken, onMessage } from 'firebase/messaging';
import { getFirebaseMessaging } from './firebaseConfig';
import { NOTIFICATION_CONFIG } from '../config/notifications';

/**
 * Request notification permission from user
 */
export const requestNotificationPermission = async () => {
  try {
    const permission = await Notification.requestPermission();
    
    if (permission === 'granted') {
      console.log('Notification permission granted');
      return true;
    } else {
      console.log('Notification permission denied');
      return false;
    }
  } catch (error) {
    console.error('Error requesting notification permission:', error);
    return false;
  }
};

/**
 * Get FCM token for the user
 */
export const getFCMToken = async () => {
  try {
    const messaging = await getFirebaseMessaging();
    
    const token = await getToken(messaging, {
      vapidKey: NOTIFICATION_CONFIG.VAPID_KEY
    });
    
    if (token) {
      console.log('FCM token generated:', token);
      return token;
    } else {
      console.log('No registration token available');
      return null;
    }
  } catch (error) {
    console.error('Error getting FCM token:', error);
    throw error;
  }
};

/**
 * Subscribe user for push notifications
 */
export const subscribeUserForNotifications = async (fcmToken) => {
  try {
    const user = JSON.parse(localStorage.getItem('user'));
    const token = user?.token;
    
    // Store FCM token locally as backup
    localStorage.setItem('fcmToken', fcmToken);
    
  const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/notifications/subscribe`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ fcmToken })
    });

    if (!response.ok) {
      throw new Error('Failed to subscribe for notifications');
    }

    const result = await response.json();
    console.log('Successfully subscribed for notifications');
    return result;
  } catch (error) {
    console.error('Error subscribing for notifications:', error);
    throw error;
  }
};

/**
 * Initialize push notifications
 */
export const initializePushNotifications = async () => {
  try {
    // Request permission
    const hasPermission = await requestNotificationPermission();
    
    if (!hasPermission) {
      console.log('Notification permission not granted');
      return false;
    }

    // Get FCM token
    const fcmToken = await getFCMToken();
    
    if (!fcmToken) {
      console.log('Could not get FCM token');
      return false;
    }

    // Subscribe user
    await subscribeUserForNotifications(fcmToken);
    
    return true;
  } catch (error) {
    console.error('Error initializing push notifications:', error);
    return false;
  }
};

/**
 * Handle foreground messages
 */
export const setupForegroundMessageHandler = async (onMessageReceived) => {
  try {
    const messaging = await getFirebaseMessaging();
    
    onMessage(messaging, (payload) => {
      console.log('Message received in foreground:', payload);
      
      // Call the provided callback with notification data
      if (onMessageReceived) {
        onMessageReceived({
          title: payload.notification?.title,
          body: payload.notification?.body,
          data: payload.data
        });
      }
      
      // Show browser notification if app is not in focus
      if (document.hidden && payload.notification) {
        new Notification(payload.notification.title, {
          body: payload.notification.body,
          icon: NOTIFICATION_CONFIG.DEFAULT_ICON,
          data: payload.data
        });
      }
    });
  } catch (error) {
    console.error('Error setting up foreground message handler:', error);
  }
};

/**
 * Notification Management API calls
 */
export const notificationAPI = {
  // Get user notifications with pagination
  getNotifications: async (page = 1, limit = 10) => {
    try {
      const user = JSON.parse(localStorage.getItem('user'));
      const token = user?.token;
      
  const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/notifications?page=${page}&limit=${limit}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch notifications');
      }

      const data = await response.json();
      return {
        notifications: data.notifications || [],
        pagination: data.pagination || { currentPage: page, totalPages: 1, totalItems: data.notifications?.length || 0 }
      };
    } catch (error) {
      console.error('Error fetching notifications:', error);
      throw error;
    }
  },

  // Get notification stats
  getStats: async () => {
    try {
      const user = JSON.parse(localStorage.getItem('user'));
      const token = user?.token;
      
  const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/notifications/stats`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch notification stats');
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching notification stats:', error);
      throw error;
    }
  },

  // Mark notification as read
  markAsRead: async (notificationId) => {
    try {
      const user = JSON.parse(localStorage.getItem('user'));
      const token = user?.token;
      
  const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/notifications/${notificationId}/read`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Failed to mark notification as read');
      }

      return await response.json();
    } catch (error) {
      console.error('Error marking notification as read:', error);
      throw error;
    }
  },

  // Mark all notifications as read
  markAllAsRead: async () => {
    try {
      const user = JSON.parse(localStorage.getItem('user'));
      const token = user?.token;
      
  const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/notifications/read-all`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Failed to mark all notifications as read');
      }

      return await response.json();
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
      throw error;
    }
  },

  // Delete notification
  deleteNotification: async (notificationId) => {
    try {
      const user = JSON.parse(localStorage.getItem('user'));
      const token = user?.token;
      
  const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/notifications/${notificationId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Failed to delete notification');
      }

      return await response.json();
    } catch (error) {
      console.error('Error deleting notification:', error);
      throw error;
    }
  },

  // Delete all notifications
  deleteAllNotifications: async () => {
    try {
      const user = JSON.parse(localStorage.getItem('user'));
      const token = user?.token;
      
  const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/notifications`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Failed to delete all notifications');
      }

      return await response.json();
    } catch (error) {
      console.error('Error deleting all notifications:', error);
      throw error;
    }
  },

  // Unsubscribe from push notifications
  unsubscribe: async () => {
    try {
      const user = JSON.parse(localStorage.getItem('user'));
      const token = user?.token;
      
  const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/notifications/unsubscribe`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Failed to unsubscribe from notifications');
      }

      return await response.json();
    } catch (error) {
      console.error('Error unsubscribing from notifications:', error);
      throw error;
    }
  }
};
