import 'server-only'

import { getRedis } from './redis'
import {
  SESSION_KEY,
  CANDIDATE_KEY,
  CANDIDATE_SCAN_PATTERN,
  ALL_CANDIDATES_SCAN_PATTERN,
  parseCandidateKey,
  type CandidateTimerEntry,
} from './timer-keys'
import type { TimerState } from './timer-state'

// ---------------------------------------------------------------------------
// Session-level helpers (examiner display)
// ---------------------------------------------------------------------------

export async function getSessionState(sessionId: string): Promise<TimerState | null> {
  try {
    const raw = await getRedis().get(SESSION_KEY(sessionId))
    if (!raw) return null
    return JSON.parse(raw) as TimerState
  } catch {
    return null
  }
}

export async function setSessionState(sessionId: string, state: TimerState): Promise<void> {
  const ttl = state.durationSeconds + 7_200
  await getRedis().set(
    SESSION_KEY(sessionId),
    JSON.stringify(state),
    'EX',
    Math.max(ttl, 7_200)
  )
}

// ---------------------------------------------------------------------------
// Per-candidate timer helpers
// ---------------------------------------------------------------------------

export async function getTimerState(
  sessionId: string,
  candidateId: string
): Promise<TimerState | null> {
  try {
    const raw = await getRedis().get(CANDIDATE_KEY(sessionId, candidateId))
    if (!raw) return null
    return JSON.parse(raw) as TimerState
  } catch {
    return null
  }
}

export async function setTimerState(
  sessionId: string,
  candidateId: string,
  state: TimerState
): Promise<void> {
  const ttl = state.durationSeconds + 7_200
  await getRedis().set(
    CANDIDATE_KEY(sessionId, candidateId),
    JSON.stringify(state),
    'EX',
    Math.max(ttl, 7_200)
  )
}

// ---------------------------------------------------------------------------
// Fan-out: apply a state mutation to ALL per-candidate timers for a session.
// Uses ioredis pipeline to batch reads and writes — keeps the round-trips
// to 2 regardless of how many candidates are in the session.
// ---------------------------------------------------------------------------

export async function fanOutToAllCandidates(
  sessionId: string,
  mutate: (state: TimerState, now: number) => TimerState
): Promise<void> {
  const redis = getRedis()

  // 1. Collect all candidate keys for this session
  const keys: string[] = []
  let cursor = '0'
  do {
    const [next, batch] = await redis.scan(
      cursor,
      'MATCH',
      CANDIDATE_SCAN_PATTERN(sessionId),
      'COUNT',
      2000
    )
    cursor = next
    keys.push(...batch)
  } while (cursor !== '0')

  if (keys.length === 0) return

  const now = Date.now()

  // 2. Pipeline-read all current states
  const readPipeline = redis.pipeline()
  for (const key of keys) readPipeline.get(key)
  const readResults = await readPipeline.exec()

  // 3. Mutate and pipeline-write
  const writePipeline = redis.pipeline()
  readResults?.forEach(([err, raw], i) => {
    if (err || typeof raw !== 'string') return
    try {
      const current = JSON.parse(raw) as TimerState
      const next = mutate(current, now)
      const ttl = Math.max(next.durationSeconds + 7_200, 7_200)
      writePipeline.set(keys[i]!, JSON.stringify(next), 'EX', ttl)
    } catch {
      // Corrupt key — skip
    }
  })
  await writePipeline.exec()
}

// ---------------------------------------------------------------------------
// Scan all per-candidate timers (for DB sync)
// ---------------------------------------------------------------------------

export async function scanAllCandidateTimers(): Promise<CandidateTimerEntry[]> {
  const redis = getRedis()
  const entries: CandidateTimerEntry[] = []
  let cursor = '0'
  do {
    const [next, keys] = await redis.scan(
      cursor,
      'MATCH',
      ALL_CANDIDATES_SCAN_PATTERN,
      'COUNT',
      2000
    )
    cursor = next
    for (const k of keys) {
      const parsed = parseCandidateKey(k)
      if (parsed) entries.push(parsed)
    }
  } while (cursor !== '0')
  return entries
}
