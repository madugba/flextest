/**
 * Socket.IO Client Configuration
 * Connects to local backend server
 */

export const SOCKET_CONFIG = {
  // Backend runs on same server (localhost)
  url: process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:3000',

  options: {
    // Reconnection settings
    reconnection: true,
    reconnectionAttempts: 5,
    reconnectionDelay: 3000, // 3 seconds
    reconnectionDelayMax: 10000, // 10 seconds

    // Connection timeout
    timeout: 10000, // 10 seconds

    // Transport settings
    transports: ['websocket', 'polling'],

    // Auto-connect
    autoConnect: false, // We'll control connection manually
  },
};

export type SocketConfig = typeof SOCKET_CONFIG;
