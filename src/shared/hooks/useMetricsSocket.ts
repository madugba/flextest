'use client';

/**
 * useMetricsSocket Hook
 * Subscribe to real-time metrics updates and connected clients tracking via WebSocket
 */

import { useState, useEffect, useCallback } from 'react';
import { useSocket } from './useSocket';
import { useSocketEvent } from './useSocketEvent';
import type { MetricsUpdateData } from '@/shared/lib/socket';

interface UseMetricsSocketReturn {
  metrics: MetricsUpdateData | null;
  connectedClients: number;
  isSubscribed: boolean;
}


export function useMetricsSocket(): UseMetricsSocketReturn {
  const { socket, isConnected } = useSocket();
  const [metrics, setMetrics] = useState<MetricsUpdateData | null>(null);
  const [connectedClients, setConnectedClients] = useState(0);
  const [isSubscribed, setIsSubscribed] = useState(false);

  // Subscribe/unsubscribe based on connection state
  useEffect(() => {
    if (!isConnected) {
      setIsSubscribed(false);
      return;
    }

    console.log('[useMetricsSocket] ✅ Connected. Subscribing to metrics...');
    socket.emit('subscribe:metrics');
    setIsSubscribed(true);

    return () => {
      console.log('[useMetricsSocket] 🧹 Cleaning up metrics subscription...');
      socket.emit('unsubscribe:metrics');
      setIsSubscribed(false);
    };
  }, [isConnected, socket]);

  // Listen to metrics updates
  const handleMetricsUpdate = useCallback((data: MetricsUpdateData) => {
    console.log('[useMetricsSocket] Metrics update received:', data);
    setMetrics(data);
  }, []);

  // Listen to client connection events
  const handleClientConnected = useCallback((data: { connectedClients: number; timestamp: string }) => {
    console.log('[useMetricsSocket] ✅ Client connected event received:', {
      count: data.connectedClients,
      timestamp: data.timestamp,
      previousCount: connectedClients,
    });
    setConnectedClients(data.connectedClients);
  }, [connectedClients]);

  // Listen to client disconnection events
  const handleClientDisconnected = useCallback((data: { connectedClients: number; timestamp: string }) => {
    console.log('[useMetricsSocket] ❌ Client disconnected event received:', {
      count: data.connectedClients,
      timestamp: data.timestamp,
      previousCount: connectedClients,
    });
    setConnectedClients(data.connectedClients);
  }, [connectedClients]);

  useSocketEvent('metrics:update', handleMetricsUpdate);
  useSocketEvent('clients:connected', handleClientConnected);
  useSocketEvent('clients:disconnected', handleClientDisconnected);

  return {
    metrics,
    connectedClients,
    isSubscribed,
  };
}
