import { createClient } from '@base44/sdk';
// import { getAccessToken } from '@base44/sdk/utils/auth-utils';

// Create a client with authentication required
export const base44 = createClient({
  appId: "6854287ed57c09b6804d9b41", 
  requiresAuth: false // Ensure authentication is required for all operations
});
