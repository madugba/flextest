'use client'

import { useEffect, useRef } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { getAuthToken } from '@/shared/api/authApi'
import type { DashboardMetrics, SystemMetrics, BusinessMetrics, ConnectionMetrics, PerformanceMetrics } from '@/entities/metrics'
import { queryKeys } from '@/shared/api/queryKeys'
import { config } from '@/shared/config'

interface StreamConnection {
  close: () => void
}

export function useMetricsStream() {
  const queryClient = useQueryClient()
  const eventSourceRef = useRef<StreamConnection | null>(null)
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | undefined>(undefined)
  const reconnectDelayRef = useRef(5_000)

  const pendingUpdatesRef = useRef<{
    system?: SystemMetrics
    business?: BusinessMetrics
    connections?: ConnectionMetrics
    performance?: PerformanceMetrics
  }>({})
  const batchTimeoutRef = useRef<NodeJS.Timeout | undefined>(undefined)

  useEffect(() => {
    const flushBatch = () => {
      const updates = pendingUpdatesRef.current

      if (Object.keys(updates).length === 0) return

      queryClient.setQueryData<DashboardMetrics>(
        queryKeys.metricsSummary,
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

      pendingUpdatesRef.current = {}
    }

    const scheduleBatch = () => {
      if (batchTimeoutRef.current) return

      const batchDelayMs = 200
      batchTimeoutRef.current = setTimeout(() => {
        flushBatch()
        batchTimeoutRef.current = undefined
      }, batchDelayMs)
    }

    const baseDelayMs = 5_000
    const maxDelayMs = 60_000

    const getRetryAfterMs = (response: Response) => {
      const retryAfter = response.headers.get('retry-after')
      if (!retryAfter) return undefined
      const asNumber = Number(retryAfter)
      if (!Number.isNaN(asNumber)) {
        return asNumber * 1000
      }
      const retryDate = Date.parse(retryAfter)
      if (!Number.isNaN(retryDate)) {
        return Math.max(retryDate - Date.now(), baseDelayMs)
      }
      return undefined
    }

    const resetReconnectDelay = () => {
      reconnectDelayRef.current = baseDelayMs
    }

    const nextReconnectDelay = (minimumDelay?: number) => {
      const current = reconnectDelayRef.current
      const baseline = minimumDelay ? Math.max(current, minimumDelay) : current
      const next = Math.min(Math.max(baseline * 1.5, baseDelayMs), maxDelayMs)
      reconnectDelayRef.current = next
      return next
    }

    const scheduleReconnect = (delay: number) => {
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current)
      }
      reconnectTimeoutRef.current = setTimeout(() => {
        reconnectTimeoutRef.current = undefined
        connectSSE()
      }, delay)
    }

    const connectSSE = async () => {
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
        const response = await fetch(url, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Accept': 'text/event-stream',
          },
        })

        if (!response.ok) {
          const retryDelay = getRetryAfterMs(response) ?? nextReconnectDelay()
          console.warn(`SSE connection failed (${response.status}). Retrying in ${retryDelay / 1000}s`)
          scheduleReconnect(retryDelay)
          return
        }

        if (!response.body) {
          const retryDelay = nextReconnectDelay()
          console.warn(`SSE response body empty. Retrying in ${retryDelay / 1000}s`)
          scheduleReconnect(retryDelay)
          return
        }

        resetReconnectDelay()
        const reader = response.body.getReader()
        const decoder = new TextDecoder()
        let buffer = ''

        const eventSource = {
          close: () => {
            reader.cancel()
          },
        }
        eventSourceRef.current = eventSource

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

        const handleSSEEvent = (eventType: string, data: string) => {
          try {
            switch (eventType) {
              case 'connected':
                console.log('📡 Metrics stream connected:', data)
                break

              case 'metrics': {
                const metrics: DashboardMetrics = JSON.parse(data)
                queryClient.setQueryData(queryKeys.metricsSummary, metrics)
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
        const retryDelay = nextReconnectDelay()
        console.log(`🔄 Reconnecting to metrics stream in ${retryDelay / 1000}s...`)
        scheduleReconnect(retryDelay)
      }
    }

    connectSSE()

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
        flushBatch()
      }
    }
  }, [queryClient])

  return {
    connected: eventSourceRef.current !== null,
  }
}
