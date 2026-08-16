import 'server-only'

// Node.js-only module — never imported by the Edge runtime.
// All pg / ioredis usage lives here so instrumentation.ts stays Edge-safe.

import { acquireSyncLock, releaseSyncLock } from './sync-lock'
import { getTimerState, scanAllCandidateTimers } from './timer-store'
import { computeRemaining } from './timer-state'
import { db } from './db'

const INSTANCE_ID = `${process.pid}-${Date.now()}`
const SYNC_INTERVAL_MS = 5 * 60 * 1_000 // 5 minutes
const BATCH_SIZE = 50                     // entries read from Redis per batch
const DB_CONCURRENCY = 10                 // parallel DB writes per chunk

async function syncTimersToDb(): Promise<void> {
  const acquired = await acquireSyncLock(INSTANCE_ID)
  if (!acquired) return

  try {
    // Each entry has { sessionId, candidateId } — per-candidate keys only.
    // The SCAN ignores the session-level keys (flextest:exam:session:*)
    // and old single-segment keys; parseCandidateKey filters them out.
    const entries = await scanAllCandidateTimers()
    if (entries.length === 0) return

    for (let i = 0; i < entries.length; i += BATCH_SIZE) {
      const batch = entries.slice(i, i + BATCH_SIZE)

      const states = await Promise.all(
        batch.map(async ({ sessionId, candidateId }) => {
          const state = await getTimerState(sessionId, candidateId)
          return { sessionId, candidateId, state }
        })
      )

      const updates = states
        .filter(({ state }) => state !== null && state.status !== 'STOPPED')
        .map(({ sessionId, candidateId, state }) => ({
          sessionId,
          candidateId,
          remainingSeconds: computeRemaining(state!),
        }))

      // Write DB_CONCURRENCY candidates at a time to stay within pool limits
      for (let j = 0; j < updates.length; j += DB_CONCURRENCY) {
        const chunk = updates.slice(j, j + DB_CONCURRENCY)
        await Promise.all(
          chunk.map(({ sessionId, candidateId, remainingSeconds }) =>
            db
              .query(
                `UPDATE current_session_progress
                 SET time_left = $1
                 WHERE session_id = $2 AND candidate_id = $3`,
                [remainingSeconds, sessionId, candidateId]
              )
              .catch((err: Error) => {
                console.error(
                  `[timer sync] candidate ${candidateId} in session ${sessionId}:`,
                  err.message
                )
              })
          )
        )
      }
    }
  } finally {
    await releaseSyncLock(INSTANCE_ID)
  }
}

export function startTimerSync(): void {
  setInterval(() => {
    void syncTimersToDb()
  }, SYNC_INTERVAL_MS)
}
