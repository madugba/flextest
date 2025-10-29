import { apiClient } from './client'
import { config } from '../config'

/**
 * Dashboard Metrics API
 * Handles fetching real-time and historical metrics
 */

// Metrics Types
export interface SystemMetrics {
  server: {
    status: 'healthy' | 'degraded' | 'down'
    uptime: number
    timestamp: string
  }
  cpu: {
    usage: number
    average: number
    peak: number
  }
  memory: {
    used: number
    free: number
    total: number
    percentage: number
  }
  eventLoop: {
    lag: number
    delay: number
  }
  requests: {
    active: number
    total: number
    perSecond: number
  }
}

export interface ConnectionMetrics {
  clients: {
    active: number
    peak: number
  }
  database: {
    active: number
    idle: number
    max: number
  }
  redis: {
    connected: boolean
    active: number
    idle: number
  }
}

export interface BusinessMetrics {
  centers: {
    total: number
    active: number
    inactive: number
  }
  admins: {
    total: number
    active: number
    inactive: number
  }
  sessions: {
    active: number
    total: number
  }
  security: {
    failedLogins: number
    accountLockouts: number
    rateLimitViolations: number
  }
}

export interface PerformanceMetrics {
  responseTime: {
    p50: number
    p95: number
    p99: number
    average: number
  }
  errorRate: {
    percentage: number
    count: number
  }
  slowestEndpoints: Array<{
    path: string
    method: string
    averageTime: number
    calls: number
  }>
}

export interface DashboardMetrics {
  system: SystemMetrics
  connections: ConnectionMetrics
  business: BusinessMetrics
  performance: PerformanceMetrics
  timestamp: string
}

export interface ActivityEvent {
  id: string
  type: 'login' | 'logout' | 'center_created' | 'admin_created' | 'error' | 'security'
  message: string
  timestamp: string
  severity: 'info' | 'warning' | 'error'
  metadata?: Record<string, unknown>
}

/**
 * Get complete dashboard metrics snapshot
 */
export async function getDashboardMetrics(): Promise<DashboardMetrics> {
  const response = await apiClient.get<DashboardMetrics>('/metrics/summary')
  if (!response.data) {
    throw new Error('No metrics data received')
  }
  return response.data
}

/**
 * Get system metrics only
 */
export async function getSystemMetrics(): Promise<SystemMetrics> {
  const response = await apiClient.get<SystemMetrics>('/metrics/system')
  if (!response.data) {
    throw new Error('No system metrics data received')
  }
  return response.data
}

/**
 * Get business metrics only
 */
export async function getBusinessMetrics(): Promise<BusinessMetrics> {
  const response = await apiClient.get<BusinessMetrics>('/metrics/business')
  if (!response.data) {
    throw new Error('No business metrics data received')
  }
  return response.data
}

/**
 * Get recent activity events
 */
export async function getActivityEvents(limit: number = 20): Promise<ActivityEvent[]> {
  const response = await apiClient.get<ActivityEvent[]>(`/metrics/activity?limit=${limit}`)
  if (!response.data) {
    return []
  }
  return response.data
}

/**
 * Create EventSource connection for real-time metrics
 */
export function createMetricsStream(): EventSource {
  const baseUrl = config.apiBaseUrl
  const streamUrl = `${baseUrl}/metrics/stream`

  // Note: EventSource doesn't support custom headers, so we pass token as query param
  // The backend will need to support this or we'll use a different approach
  const eventSource = new EventSource(streamUrl)

  return eventSource
}

/**
 * Format bytes to human-readable format
 */
export function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 B'

  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))

  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`
}

/**
 * Format uptime to human-readable format
 */
export function formatUptime(seconds: number): string {
  const days = Math.floor(seconds / 86400)
  const hours = Math.floor((seconds % 86400) / 3600)
  const minutes = Math.floor((seconds % 3600) / 60)

  const parts: string[] = []
  if (days > 0) parts.push(`${days}d`)
  if (hours > 0) parts.push(`${hours}h`)
  if (minutes > 0) parts.push(`${minutes}m`)

  return parts.length > 0 ? parts.join(' ') : '< 1m'
}

/**
 * Get status color class
 */
export function getStatusColor(status: 'healthy' | 'degraded' | 'down'): string {
  switch (status) {
    case 'healthy':
      return 'bg-green-50 text-green-700 border-green-200'
    case 'degraded':
      return 'bg-yellow-50 text-yellow-700 border-yellow-200'
    case 'down':
      return 'bg-red-50 text-red-700 border-red-200'
    default:
      return 'bg-gray-50 text-gray-700 border-gray-200'
  }
}

/**
 * Get metric color based on thresholds
 */
export function getMetricColor(value: number, warningThreshold: number, criticalThreshold: number): string {
  if (value >= criticalThreshold) {
    return 'text-red-600'
  } else if (value >= warningThreshold) {
    return 'text-yellow-600'
  }
  return 'text-green-600'
}
