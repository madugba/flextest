'use client';

/**
 * useSocket Hook
 * Provides access to socket instance and connection state
 */

import { useSocketContext } from '@/shared/providers/SocketProvider';
import type { SocketState } from '@/shared/lib/socket';

interface UseSocketReturn {
  socket: ReturnType<typeof useSocketContext>['socket'];
  state: SocketState;
  isConnected: boolean;
  reconnectAttempts: number;
}

export function useSocket(): UseSocketReturn {
  const { socket, state, isConnected } = useSocketContext();

  return {
    socket,
    state,
    isConnected,
    reconnectAttempts: state.reconnectAttempts,
  };
}
