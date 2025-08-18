importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-messaging-compat.js');

// Initialize Firebase in service worker
firebase.initializeApp({
  apiKey: "AIzaSyBtML9PfxRYtbk-NQFcaeS5ACBqiilXEmQ",
  authDomain: "task-reader.firebaseapp.com",
  projectId: "task-reader",
  storageBucket: "task-reader.firebasestorage.app",
  messagingSenderId: "423297636066",
  appId: "1:423297636066:web:ea4e278e1c5a4ff8acf0bb"
});

const messaging = firebase.messaging();

// Handle background messages
messaging.onBackgroundMessage((payload) => {
  console.log('Received background message:', payload);

  const notificationTitle = payload.notification?.title || 'New Notification';
  const notificationOptions = {
    body: payload.notification?.body || 'You have a new notification',
    icon: '/icon-192x192.png',
    badge: '/badge-72x72.png',
    data: payload.data,
    tag: payload.data?.type || 'general',
    requireInteraction: true,
    actions: [
      {
        action: 'view',
        title: 'View',
        icon: '/action-view.png'
      },
      {
        action: 'dismiss',
        title: 'Dismiss',
        icon: '/action-dismiss.png'
      }
    ]
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});

// Handle notification click events
self.addEventListener('notificationclick', (event) => {
  console.log('Notification click received:', event);

  event.notification.close();

  if (event.action === 'dismiss') {
    return;
  }

  // Handle notification click - open the app
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
      const data = event.notification.data;
      
      // Determine the URL to open based on notification data
      let urlToOpen = '/';
      if (data?.type === 'order') {
        urlToOpen = `/orders/${data.orderId}`;
      } else if (data?.type === 'family') {
        urlToOpen = '/profile';
      }

      // Check if there's already a window/tab open with our app
      for (const client of clientList) {
        if (client.url.includes(self.location.origin) && 'focus' in client) {
          client.postMessage({
            type: 'NOTIFICATION_CLICKED',
            data: data,
            url: urlToOpen
          });
          return client.focus();
        }
      }

      // If no existing window, open a new one
      if (clients.openWindow) {
        return clients.openWindow(urlToOpen);
      }
    })
  );
});

// Handle notification close events
self.addEventListener('notificationclose', (event) => {
  console.log('Notification closed:', event);
  
  // Optional: Track notification dismissal analytics
  const data = event.notification.data;
  if (data?.notificationId) {
    // You could send analytics data here
    console.log('Notification dismissed:', data.notificationId);
  }
});
