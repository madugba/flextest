'use client';

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

  const handleMetricsUpdate = useCallback((data: MetricsUpdateData) => {
    console.log('[useMetricsSocket] Metrics update received:', data);
    setMetrics(data);
  }, []);

  const handleClientConnected = useCallback((data: { connectedClients: number; timestamp: string }) => {
    console.log('[useMetricsSocket] ✅ Client connected event received:', {
      count: data.connectedClients,
      timestamp: data.timestamp,
      previousCount: connectedClients,
    });
    setConnectedClients(data.connectedClients);
  }, [connectedClients]);

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
