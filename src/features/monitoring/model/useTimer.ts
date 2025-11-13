import { useEffect, useMemo, useRef, useState } from 'react'
import { useSocket } from '@/shared/hooks/useSocket'
import { useSocketEvent } from '@/shared/hooks/useSocketEvent'
import type { TimerStateEvent, TimerUpdateEvent, TimerStatus } from '@/shared/lib/socket/socket-events'

function clampToNonNegative(value: number): number {
  return value < 0 ? 0 : value
}

function parseHmsString(hms: string): number {
  const parts = hms.split(':').map((p) => parseInt(p, 10))
  if (parts.some((n) => Number.isNaN(n))) return 0
  if (parts.length === 3) {
    return parts[0] * 3600 + parts[1] * 60 + parts[2]
  }
  if (parts.length === 2) {
    return parts[0] * 60 + parts[1]
  }
  return 0
}

function formatSeconds(totalSeconds: number): string {
  const seconds = clampToNonNegative(Math.floor(totalSeconds))
  const h = Math.floor(seconds / 3600)
  const m = Math.floor((seconds % 3600) / 60)
  const s = seconds % 60
  const hh = String(h).padStart(2, '0')
  const mm = String(m).padStart(2, '0')
  const ss = String(s).padStart(2, '0')
  return `${hh}:${mm}:${ss}`
}

export interface UseTimerOptions {
  sessionId: string | null
  initialRemainingHms?: string | null
  sessionStatus?: 'SCHEDULED' | 'ACTIVE' | 'COMPLETED' | 'CANCELLED'
  enableLocalTick?: boolean
}

export function useTimer({ sessionId, initialRemainingHms, enableLocalTick = true }: UseTimerOptions) {
  const { socket } = useSocket()
  const [status, setStatus] = useState<TimerStatus>('STOPPED')
  const [remainingSeconds, setRemainingSeconds] = useState<number>(() =>
    initialRemainingHms ? parseHmsString(initialRemainingHms) : 0
  )

  const storageKey = useMemo(() => {
    return sessionId ? `flextest_monitoring_${sessionId}_timer` : null
  }, [sessionId])

  const tickingIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const lastTickAtRef = useRef<number | null>(null)

  useEffect(() => {
    if (!initialRemainingHms) return
    const seed = parseHmsString(initialRemainingHms)
    if (seed > 0 && remainingSeconds === 0) {
      setRemainingSeconds(seed)
    }
  }, [initialRemainingHms, remainingSeconds])

  useEffect(() => {
    if (!sessionId || !storageKey) return
    try {
      const raw = localStorage.getItem(storageKey)
      if (raw) {
        const saved = JSON.parse(raw) as {
          remainingSeconds: number
          status: TimerStatus
          lastServerTs: number
          savedAt: number
        }
        let nextRemaining = saved.remainingSeconds
        if (saved.status === 'RUNNING') {
          const elapsed = Math.floor((Date.now() - saved.savedAt) / 1000)
          nextRemaining = clampToNonNegative(nextRemaining - elapsed)
        }
        setRemainingSeconds(nextRemaining)
        setStatus(saved.status)
      } else if (initialRemainingHms) {
        setRemainingSeconds(parseHmsString(initialRemainingHms))
      }
    } catch {
    }
    socket?.emit('timer:requestSnapshot', sessionId)
  }, [sessionId, storageKey, initialRemainingHms, socket])

  useEffect(() => {
    if (!storageKey) return
    const payload = {
      remainingSeconds,
      status,
      lastServerTs: Date.now(),
      savedAt: Date.now(),
    }
    try {
      localStorage.setItem(storageKey, JSON.stringify(payload))
    } catch {
    }
  }, [remainingSeconds, status, storageKey])

  useEffect(() => {
    if (!enableLocalTick || status !== 'RUNNING') {
      if (tickingIntervalRef.current) {
        clearInterval(tickingIntervalRef.current)
        tickingIntervalRef.current = null
      }
      lastTickAtRef.current = null
      return
    }
    if (tickingIntervalRef.current) return
    lastTickAtRef.current = Date.now()
    tickingIntervalRef.current = setInterval(() => {
      const now = Date.now()
      const last = lastTickAtRef.current ?? now
      const elapsed = Math.floor((now - last) / 1000)
      lastTickAtRef.current = now
      if (elapsed > 0) {
        setRemainingSeconds((prev) => clampToNonNegative(prev - elapsed))
      }
    }, 1000)
    return () => {
      if (tickingIntervalRef.current) {
        clearInterval(tickingIntervalRef.current)
        tickingIntervalRef.current = null
      }
    }
  }, [status, enableLocalTick])

  useSocketEvent('timer:update', (data: TimerUpdateEvent) => {
    if (!sessionId || data.sessionId !== sessionId) return
    const diff = Math.abs(remainingSeconds - data.remainingSeconds)
    if (diff > 3) {
      setRemainingSeconds(clampToNonNegative(data.remainingSeconds))
    }
    setStatus(data.status)
  })

  const onState = (data: TimerStateEvent) => {
    if (!sessionId || data.sessionId !== sessionId) return
    setStatus(data.status)
    if (typeof data.remainingSeconds === 'number') {
      setRemainingSeconds(clampToNonNegative(data.remainingSeconds))
    }
  }
  useSocketEvent('timer:started', onState)
  useSocketEvent('timer:paused', onState)
  useSocketEvent('timer:resumed', onState)
  useSocketEvent('timer:stopped', onState)

  const formatted = useMemo(() => formatSeconds(remainingSeconds), [remainingSeconds])

  return {
    status,
    remainingSeconds,
    remainingHms: formatted,
    elapsedHms: formatted,
  }
}


