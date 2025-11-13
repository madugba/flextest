'use client';

import { useEffect, useRef } from 'react';
import { useSocket } from './useSocket';
import type { ServerToClientEvents } from '@/shared/lib/socket';

export function useSocketEvent<K extends keyof ServerToClientEvents>(
  event: K,
  handler: ServerToClientEvents[K]
): void {
  const { socket, isConnected } = useSocket();
  const handlerRef = useRef(handler);

  useEffect(() => {
    handlerRef.current = handler;
  }, [handler]);

  useEffect(() => {
    if (!isConnected) {
      return;
    }

    const wrappedHandler = ((...args: never[]) => {
      // @ts-expect-error - Event handler type compatibility
      handlerRef.current(...args);
    }) as ServerToClientEvents[K];

    const cleanup = socket.on(event, wrappedHandler);

    return cleanup;
  }, [socket, event, isConnected]);
}
