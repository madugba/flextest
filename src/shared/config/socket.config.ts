export const SOCKET_CONFIG = {
  url: process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:3000',

  options: {
    reconnection: true,
    reconnectionAttempts: 5,
    reconnectionDelay: 3_000,
    reconnectionDelayMax: 10_000,

    timeout: 10_000,

    transports: ['websocket', 'polling'],

    autoConnect: false,
  },
};

export type SocketConfig = typeof SOCKET_CONFIG;
