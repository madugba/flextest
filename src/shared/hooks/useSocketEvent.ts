'use client';

/**
 * useSocketEvent Hook
 * Subscribe to specific socket events with automatic cleanup
 */

import { useEffect, useRef } from 'react';
import { useSocket } from './useSocket';
import type { ServerToClientEvents } from '@/shared/lib/socket';

export function useSocketEvent<K extends keyof ServerToClientEvents>(
  event: K,
  handler: ServerToClientEvents[K]
): void {
  const { socket, isConnected } = useSocket();
  const handlerRef = useRef(handler);

  // Keep handler ref up to date
  useEffect(() => {
    handlerRef.current = handler;
  }, [handler]);

  useEffect(() => {
    if (!isConnected) {
      return;
    }

    
    // Wrap handler to use latest ref
    const wrappedHandler = ((...args: never[]) => {
      // @ts-expect-error - Event handler type compatibility
      handlerRef.current(...args);
    }) as ServerToClientEvents[K];

    // Subscribe to event
    const cleanup = socket.on(event, wrappedHandler);

    // Cleanup on unmount or when dependencies change
    return cleanup;
  }, [socket, event, isConnected]);
}
