// ---------------------------------------------------------------------------
// TimerState — anchor-based, zero writes while clock is running.
//
// remaining = durationSeconds − consumedSeconds
//           − (RUNNING ? floor((now − startEpochMs) / 1000) : 0)
// ---------------------------------------------------------------------------

export type TimerStatus = 'RUNNING' | 'PAUSED' | 'STOPPED'

export interface TimerState {
  startEpochMs: number | null // epoch when current RUNNING period began
  durationSeconds: number // total time for this entity
  consumedSeconds: number // seconds used in prior RUNNING periods
  status: TimerStatus
  updatedAt: number
}

export function computeRemaining(state: TimerState): number {
  const runningElapsed =
    state.status === 'RUNNING' && state.startEpochMs !== null
      ? Math.floor((Date.now() - state.startEpochMs) / 1000)
      : 0
  return Math.max(0, state.durationSeconds - state.consumedSeconds - runningElapsed)
}
