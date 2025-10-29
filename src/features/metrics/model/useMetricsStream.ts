import { useEffect, useRef } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { getAuthToken } from '@/shared/api/authApi'
import type { DashboardMetrics, SystemMetrics, BusinessMetrics, ConnectionMetrics, PerformanceMetrics } from '@/entities/metrics/api/metricsApi'
import { config } from '@/shared/config'

/**
 * Hook for Server-Sent Events (SSE) metrics streaming
 * Updates React Query cache when events arrive from backend
 * Uses event batching to prevent excessive re-renders
 * Only components using changed data will re-render
 */
interface StreamConnection {
  close: () => void
}

export function useMetricsStream() {
  const queryClient = useQueryClient()
  const eventSourceRef = useRef<StreamConnection | null>(null)
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | undefined>(undefined)

  // Event batching - merge updates every 200ms to reduce re-renders
  const pendingUpdatesRef = useRef<{
    system?: SystemMetrics
    business?: BusinessMetrics
    connections?: ConnectionMetrics
    performance?: PerformanceMetrics
  }>({})
  const batchTimeoutRef = useRef<NodeJS.Timeout | undefined>(undefined)

  useEffect(() => {
    // Batch update function - merges pending updates every 200ms
    const flushBatch = () => {
      const updates = pendingUpdatesRef.current

      if (Object.keys(updates).length === 0) return

      // Merge all pending updates into dashboard cache at once
      queryClient.setQueryData<DashboardMetrics>(
        ['metrics', 'dashboard'],
        (old) => {
          if (!old) return old
          return {
            ...old,
            ...(updates.system && { system: updates.system }),
            ...(updates.business && { business: updates.business }),
            ...(updates.connections && { connections: updates.connections }),
            ...(updates.performance && { performance: updates.performance }),
          }
        }
      )

      // Update individual caches if they exist
      if (updates.system) {
        queryClient.setQueryData(['metrics', 'system'], updates.system)
      }
      if (updates.business) {
        queryClient.setQueryData(['metrics', 'business'], updates.business)
      }

      // Clear pending updates
      pendingUpdatesRef.current = {}
    }

    // Schedule batched update
    const scheduleBatch = () => {
      if (batchTimeoutRef.current) return // Already scheduled

      batchTimeoutRef.current = setTimeout(() => {
        flushBatch()
        batchTimeoutRef.current = undefined
      }, 200) // Batch window: 200ms
    }

    const connectSSE = async () => {
      // Clean up existing connection
      if (eventSourceRef.current) {
        eventSourceRef.current.close()
      }

      const token = getAuthToken()
      if (!token) {
        console.warn('No auth token available for metrics stream')
        return
      }

      const url = `${config.apiBaseUrl}/metrics/stream`

      try {
        // Use fetch instead of EventSource to send Authorization header
        const response = await fetch(url, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Accept': 'text/event-stream',
          },
        })

        if (!response.ok) {
          throw new Error(`SSE connection failed: ${response.status}`)
        }

        if (!response.body) {
          throw new Error('Response body is null')
        }

        // Create custom EventSource-like object
        const reader = response.body.getReader()
        const decoder = new TextDecoder()
        let buffer = ''

        const eventSource = {
          close: () => {
            reader.cancel()
          },
        }
        eventSourceRef.current = eventSource

        // Process SSE stream
        const processStream = async () => {
          try {
            while (true) {
              const { done, value } = await reader.read()

              if (done) {
                console.log('SSE stream closed')
                break
              }

              buffer += decoder.decode(value, { stream: true })
              const lines = buffer.split('\n\n')
              buffer = lines.pop() || ''

              for (const line of lines) {
                if (!line.trim()) continue

                const eventMatch = line.match(/^event: (.+)$/m)
                const dataMatch = line.match(/^data: (.+)$/m)

                if (eventMatch && dataMatch) {
                  const eventType = eventMatch[1]
                  const eventData = dataMatch[1]

                  handleSSEEvent(eventType, eventData)
                }
              }
            }
          } catch (error) {
            console.error('Error reading SSE stream:', error)
          }
        }

        // Event handler
        const handleSSEEvent = (eventType: string, data: string) => {
          try {
            switch (eventType) {
              case 'connected':
                console.log('📡 Metrics stream connected:', data)
                break

              case 'metrics': {
                const metrics: DashboardMetrics = JSON.parse(data)
                queryClient.setQueryData(['metrics', 'dashboard'], metrics)
                if (metrics.system) {
                  queryClient.setQueryData(['metrics', 'system'], metrics.system)
                }
                if (metrics.business) {
                  queryClient.setQueryData(['metrics', 'business'], metrics.business)
                }
                break
              }

              case 'system_update': {
                const systemMetrics = JSON.parse(data)
                pendingUpdatesRef.current.system = systemMetrics
                scheduleBatch()
                break
              }

              case 'business_update': {
                const businessMetrics = JSON.parse(data)
                pendingUpdatesRef.current.business = businessMetrics
                scheduleBatch()
                break
              }

              case 'connection_update': {
                const connectionMetrics = JSON.parse(data)
                pendingUpdatesRef.current.connections = connectionMetrics
                scheduleBatch()
                break
              }

              case 'performance_update': {
                const performanceMetrics = JSON.parse(data)
                pendingUpdatesRef.current.performance = performanceMetrics
                scheduleBatch()
                break
              }

              case 'heartbeat':
                console.log('💓 Heartbeat:', data)
                break

              default:
                console.warn('Unknown SSE event:', eventType)
            }
          } catch (error) {
            console.error(`Error handling ${eventType} event:`, error)
          }
        }

        processStream()
      } catch (error) {
        console.error('❌ SSE connection error:', error)

        // Reconnect after 5 seconds
        if (reconnectTimeoutRef.current) {
          clearTimeout(reconnectTimeoutRef.current)
        }
        reconnectTimeoutRef.current = setTimeout(() => {
          console.log('🔄 Reconnecting to metrics stream...')
          connectSSE()
        }, 5000)
      }
    }

    connectSSE()

    // Cleanup on unmount
    return () => {
      if (eventSourceRef.current) {
        eventSourceRef.current.close()
        eventSourceRef.current = null
      }
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current)
      }
      if (batchTimeoutRef.current) {
        clearTimeout(batchTimeoutRef.current)
        flushBatch() // Flush any pending updates on unmount
      }
    }
  }, [queryClient])

  return {
    connected: eventSourceRef.current !== null,
  }
}
