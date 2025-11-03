'use client';

/**
 * Metrics Dashboard Example
 * Demonstrates how to use Socket.IO for real-time metrics updates
 *
 * Usage:
 * import { MetricsDashboardExample } from '@/shared/components/examples/MetricsDashboardExample';
 *
 * <MetricsDashboardExample />
 */

import { useState, useEffect } from 'react';
import { useSocket } from '@/shared/hooks/useSocket';
import { useSocketEvent } from '@/shared/hooks/useSocketEvent';

interface Metrics {
  totalCandidates: number;
  activeSessions: number;
  completedExams: number;
  timestamp: string;
}

export function MetricsDashboardExample() {
  const { socket, isConnected, state } = useSocket();
  const [metrics, setMetrics] = useState<Metrics>({
    totalCandidates: 0,
    activeSessions: 0,
    completedExams: 0,
    timestamp: new Date().toISOString(),
  });
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);

  // Auto-subscribe when connected
  useEffect(() => {
    if (isConnected) {
      console.log('[MetricsDashboard] Subscribing to metrics...');
      socket.emit('subscribe:metrics');
    }

    // Cleanup: unsubscribe when component unmounts
    return () => {
      if (isConnected) {
        console.log('[MetricsDashboard] Unsubscribing from metrics...');
        socket.emit('unsubscribe:metrics');
      }
    };
  }, [isConnected, socket]);

  // Listen for metrics updates
  useSocketEvent('metrics:update', (data) => {
    console.log('[MetricsDashboard] Metrics updated:', data);
    setMetrics(data);
    setLastUpdate(new Date());
  });

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Real-Time Metrics Dashboard</h1>

      {/* Connection Status */}
      <div className="mb-6 p-4 rounded-lg bg-gray-50">
        <div className="flex items-center gap-2">
          <div
            className={`w-3 h-3 rounded-full ${
              isConnected ? 'bg-green-500' : 'bg-red-500'
            }`}
          />
          <span className="font-medium">
            {isConnected ? 'Connected' : 'Disconnected'}
          </span>
          {state.status === 'reconnecting' && (
            <span className="text-sm text-gray-600">
              (Attempt {state.reconnectAttempts})
            </span>
          )}
        </div>
        {lastUpdate && (
          <p className="text-sm text-gray-600 mt-2">
            Last update: {lastUpdate.toLocaleTimeString()}
          </p>
        )}
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <MetricCard
          title="Total Candidates"
          value={metrics.totalCandidates}
          icon="👥"
          color="blue"
        />
        <MetricCard
          title="Active Sessions"
          value={metrics.activeSessions}
          icon="📝"
          color="green"
        />
        <MetricCard
          title="Completed Exams"
          value={metrics.completedExams}
          icon="✅"
          color="purple"
        />
      </div>

      {/* Debug Info */}
      <details className="mt-6 p-4 bg-gray-50 rounded-lg">
        <summary className="cursor-pointer font-medium">Debug Info</summary>
        <pre className="mt-2 text-sm overflow-auto">
          {JSON.stringify(
            {
              connectionState: state,
              metrics,
              lastUpdate: lastUpdate?.toISOString(),
            },
            null,
            2
          )}
        </pre>
      </details>
    </div>
  );
}

interface MetricCardProps {
  title: string;
  value: number;
  icon: string;
  color: 'blue' | 'green' | 'purple';
}

function MetricCard({ title, value, icon, color }: MetricCardProps) {
  const colorClasses = {
    blue: 'bg-blue-50 border-blue-200 text-blue-900',
    green: 'bg-green-50 border-green-200 text-green-900',
    purple: 'bg-purple-50 border-purple-200 text-purple-900',
  };

  return (
    <div
      className={`p-6 border-2 rounded-lg ${colorClasses[color]} transition-all hover:shadow-lg`}
    >
      <div className="flex items-center gap-3 mb-2">
        <span className="text-3xl">{icon}</span>
        <h3 className="text-sm font-medium text-gray-600">{title}</h3>
      </div>
      <p className="text-4xl font-bold">{value.toLocaleString()}</p>
    </div>
  );
}
