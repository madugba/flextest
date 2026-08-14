'use client'

import { useQuery } from '@tanstack/react-query'
import { useEffect, useRef, useState, useMemo } from 'react'
import type { TimerApiResponse } from './types'
import { formatSeconds } from './selectors/formatSeconds'

export interface UseTimerOptions {
  sessionId: string | null
  // Kept for API compatibility — status is now derived from Redis, not passed in
  sessionStatus?: string
  enableLocalTick?: boolean
}

// ---------------------------------------------------------------------------
// useTimer — polls /api/timer/{sessionId} every 10 seconds (primary source:
// Redis). Between polls, ticks the display down by 1 second locally so the
// UI stays smooth.  No socket events needed.
//
// Scalability: 10s poll ÷ ~10 examiner windows = ~1 req/s per session, each
// hitting Redis (sub-ms read). Zero socket fanout.
// ---------------------------------------------------------------------------

export function useTimer({ sessionId, enableLocalTick = true }: UseTimerOptions) {
  const [displaySeconds, setDisplaySeconds] = useState(0)
  const tickIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  // Anchor: when the last server value was received and what it said.
  // The local tick interpolates between polls using this anchor.
  const anchorRef = useRef<{ remainingSeconds: number; fetchedAt: number } | null>(null)

  const {
    data,
    isSuccess,
  } = useQuery<TimerApiResponse>({
    queryKey: ['timer', sessionId],
    queryFn: async () => {
      const res = await fetch(`/api/timer/${sessionId}`, { cache: 'no-store' })
      if (!res.ok) throw new Error(`Timer fetch failed: ${res.status}`)
      return res.json() as Promise<TimerApiResponse>
    },
    enabled: Boolean(sessionId),
    // Poll every 10 seconds — keeps examiner display < 10s behind real state
    refetchInterval: 10_000,
    staleTime: 0,
    // On network error keep showing last known value — do NOT reset to 0
    retry: 2,
    retryDelay: 1_000,
  })

  // Sync display and anchor whenever a fresh poll arrives
  useEffect(() => {
    if (!isSuccess || !data) return
    const clamped = Math.max(0, data.remainingSeconds)
    setDisplaySeconds(clamped)
    anchorRef.current = { remainingSeconds: clamped, fetchedAt: Date.now() }
  }, [data, isSuccess])

  // Local 1-second tick — fires only when RUNNING; stopped/paused hold still
  useEffect(() => {
    const isRunning = data?.status === 'RUNNING'

    if (!enableLocalTick || !isRunning) {
      if (tickIntervalRef.current) {
        clearInterval(tickIntervalRef.current)
        tickIntervalRef.current = null
      }
      return
    }

    if (tickIntervalRef.current) return // already ticking

    tickIntervalRef.current = setInterval(() => {
      const anchor = anchorRef.current
      if (!anchor) return
      const elapsed = Math.floor((Date.now() - anchor.fetchedAt) / 1000)
      setDisplaySeconds(Math.max(0, anchor.remainingSeconds - elapsed))
    }, 1_000)

    return () => {
      if (tickIntervalRef.current) {
        clearInterval(tickIntervalRef.current)
        tickIntervalRef.current = null
      }
    }
  }, [data?.status, enableLocalTick])

  const elapsedHms = useMemo(() => formatSeconds(displaySeconds), [displaySeconds])

  return {
    status: data?.status ?? 'STOPPED',
    remainingSeconds: displaySeconds,
    remainingHms: elapsedHms,
    // Named elapsedHms for backwards compat — monitoring page uses this label
    elapsedHms,
  }
}
