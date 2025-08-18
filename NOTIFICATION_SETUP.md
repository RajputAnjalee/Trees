# Firebase Push Notifications Setup Guide

This guide will help you complete the Firebase push notifications setup for your React application.

## 🔧 Required Configuration

### 1. Get VAPID Key from Firebase Console

You need to obtain the VAPID key from Firebase Console:

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project: **task-reader**
3. Navigate to **Project Settings** (gear icon)
4. Click on **Cloud Messaging** tab
5. Scroll down to **Web configuration**
6. Click **Generate key pair** (if not already generated)
7. Copy the **Key pair** value

### 2. Update VAPID Key

Replace the placeholder in `/src/services/notificationService.js`:

```javascript
// Line 5: Replace with your actual VAPID key
const VAPID_KEY = 'YOUR_ACTUAL_VAPID_KEY_FROM_FIREBASE_CONSOLE';
```

## 📱 Features Implemented

### ✅ Core Features
- **Firebase SDK Integration** - Client-side Firebase setup
- **Permission Management** - Request notification permissions
- **FCM Token Generation** - Generate and subscribe user tokens
- **Background Messages** - Service worker for background notifications
- **Foreground Messages** - In-app notification handling
- **Notification Center** - UI component for managing notifications
- **Toast Notifications** - In-app notification toasts

### ✅ API Integration
- **GET** `/api/notifications` - Fetch user notifications
- **PATCH** `/api/notifications/:id/read` - Mark as read
- **DELETE** `/api/notifications/:id` - Delete notification
- **GET** `/api/notifications/stats` - Get notification statistics
- **POST** `/api/notifications/subscribe` - Subscribe user for push notifications
- **GET** `/api/notifications/firebase-config` - Get Firebase configuration

### ✅ UI Components
- **NotificationCenter** - Bell icon with notification count and dropdown
- **NotificationToast** - Toast notifications for foreground messages
- **Service Worker** - Background message handling with click actions

## 🚀 How It Works

### 1. Authentication Flow
- User logs in → Notifications automatically initialize
- Firebase config fetched from backend
- FCM token generated and sent to backend
- User subscribed for push notifications

### 2. Message Handling
- **Background**: Service worker shows browser notifications
- **Foreground**: Toast notifications appear in app
- **Click Actions**: Navigate to relevant pages (orders, profile, etc.)

### 3. Notification Management
- View all notifications in dropdown
- Mark individual notifications as read
- Delete unwanted notifications
- See unread count badge

## 🎯 User Experience

### Notification Bell
- Located in the header next to the tree goal counter
- Shows red badge with unread count
- Click to open notification dropdown

### Toast Notifications
- Appear in top-right corner for foreground messages
- Auto-dismiss after 5 seconds
- Click X to dismiss manually
- Different colors based on notification type

### Background Notifications
- Standard browser notifications when app not in focus
- Click notification to open app and navigate to relevant page
- Action buttons: View and Dismiss

## 🔄 Automatic Triggers

Based on your backend setup, notifications are automatically sent when:
- **Orders**: User creates/updates/deletes orders
- **Family Members**: User adds/removes family members
- **System**: Important system notifications

## 🛠️ Troubleshooting

### Common Issues

1. **No notifications appearing**
   - Check browser notification permissions
   - Verify VAPID key is correctly set
   - Check browser console for errors

2. **Service worker not registering**
   - Ensure `/public/firebase-messaging-sw.js` exists
   - Check browser developer tools → Application → Service Workers

3. **Firebase config errors**
   - Verify backend `/api/notifications/firebase-config` endpoint
   - Check authentication token is being sent

### Debug Steps

1. Open browser developer tools
2. Check Console tab for error messages
3. Go to Application tab → Service Workers
4. Verify firebase-messaging-sw.js is registered
5. Test notification permission in browser settings

## 📋 Next Steps

1. **Update VAPID key** in `notificationService.js`
2. **Test notifications** by creating/deleting orders or family members
3. **Customize notification icons** by adding icon files to `/public/`
4. **Monitor analytics** through Firebase Console

## 🎨 Customization

### Notification Icons
Add these icon files to `/public/` directory:
- `icon-192x192.png` - Main notification icon
- `badge-72x72.png` - Badge icon
- `action-view.png` - View action icon
- `action-dismiss.png` - Dismiss action icon

### Styling
Notification components use Tailwind CSS and can be customized in:
- `/src/components/notifications/NotificationCenter.jsx`
- `/src/components/notifications/NotificationToast.jsx`

---

## 🚨 Important Security Note

Never commit your actual VAPID key to version control. Consider using environment variables for production deployments.
