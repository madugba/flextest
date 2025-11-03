'use client';

/**
 * Socket Provider
 * Provides Socket.IO connection context to the application
 */

import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { socketClient } from '@/shared/lib/socket';
import type { SocketState } from '@/shared/lib/socket';

interface SocketContextValue {
  socket: typeof socketClient;
  state: SocketState;
  isConnected: boolean;
}

const SocketContext = createContext<SocketContextValue | null>(null);

interface SocketProviderProps {
  children: ReactNode;
  autoConnect?: boolean;
}

export function SocketProvider({ children, autoConnect = true }: SocketProviderProps) {
  const [state, setState] = useState<SocketState>({
    status: 'disconnected',
    connected: false,
    reconnectAttempts: 0,
  });

  useEffect(() => {
    const unsubscribe = socketClient.onStatusChange((newState) => {
      setState(newState);
    });

    if (autoConnect) {
      console.log('[SocketProvider] Auto-connecting...');
      socketClient.connect();
    }

    return () => {
      unsubscribe();
      if (autoConnect) {
        console.log('[SocketProvider] Disconnecting...');
        socketClient.disconnect();
      }
    };
  }, [autoConnect]);

  const value: SocketContextValue = {
    socket: socketClient,
    state,
    isConnected: state.connected,
  };

  return <SocketContext.Provider value={value}>{children}</SocketContext.Provider>;
}

export function useSocketContext(): SocketContextValue {
  const context = useContext(SocketContext);

  if (!context) {
    throw new Error('useSocketContext must be used within a SocketProvider');
  }

  return context;
}
