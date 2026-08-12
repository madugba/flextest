import { NextRequest, NextResponse } from 'next/server'
import {
  getSessionState,
  setSessionState,
  fanOutToAllCandidates,
} from '@/lib/timer-store'
import { computeRemaining, type TimerState } from '@/lib/timer-state'
import { db } from '@/lib/db'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

// ---------------------------------------------------------------------------
// GET /api/timer/[sessionId]
// Returns the SESSION-level timer (examiner display only).
// Per-candidate timers live at /api/timer/[sessionId]/[candidateId].
// ---------------------------------------------------------------------------

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ sessionId: string }> }
) {
  const { sessionId } = await params

  try {
    const state = await getSessionState(sessionId)

    if (state) {
      return NextResponse.json({
        remainingSeconds: computeRemaining(state),
        durationSeconds: state.durationSeconds,
        status: state.status,
        source: 'redis',
      })
    }

    // Redis miss — fall back to DB for session metadata
    const result = await db.query<{ duration: number; status: string }>(
      `SELECT duration, status FROM exam_sessions WHERE id = $1`,
      [sessionId]
    )

    if (result.rows.length === 0) {
      return NextResponse.json({ error: 'Session not found' }, { status: 404 })
    }

    const row = result.rows[0]!
    const durationSeconds = (row.duration ?? 60) * 60
    const sessionStatus = row.status === 'ACTIVE' ? 'RUNNING' : 'STOPPED'

    return NextResponse.json({
      remainingSeconds: durationSeconds,
      durationSeconds,
      status: sessionStatus,
      source: 'db',
    })
  } catch (err) {
    console.error('[/api/timer GET]', err)
    return NextResponse.json({ error: 'Failed to fetch timer' }, { status: 500 })
  }
}

// ---------------------------------------------------------------------------
// POST /api/timer/[sessionId]
// Body: { action: 'start'|'pause'|'resume'|'stop', durationSeconds?: number }
//
// Controls the SESSION-level clock (examiner display) AND fans out the same
// action to every per-candidate timer for this session using ioredis pipelines.
// Fan-out is O(N candidates) but uses only 2 round-trips (pipelined read + write).
// ---------------------------------------------------------------------------

interface TimerAction {
  action: 'start' | 'pause' | 'resume' | 'stop'
  durationSeconds?: number
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ sessionId: string }> }
) {
  const { sessionId } = await params

  let body: TimerAction
  try {
    body = (await req.json()) as TimerAction
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 })
  }

  const now = Date.now()

  try {
    const existing = await getSessionState(sessionId)
    let next: TimerState

    switch (body.action) {
      case 'start': {
        if (!body.durationSeconds || body.durationSeconds <= 0) {
          return NextResponse.json(
            { error: 'durationSeconds required for start' },
            { status: 400 }
          )
        }
        if (existing?.status === 'RUNNING') {
          return NextResponse.json({
            ok: true,
            remainingSeconds: computeRemaining(existing),
            status: existing.status,
          })
        }
        next = {
          startEpochMs: now,
          durationSeconds: body.durationSeconds,
          consumedSeconds: existing?.consumedSeconds ?? 0,
          status: 'RUNNING',
          updatedAt: now,
        }
        break
      }

      case 'pause': {
        if (!existing || existing.status !== 'RUNNING') {
          const rem = existing ? computeRemaining(existing) : 0
          return NextResponse.json({
            ok: true,
            remainingSeconds: rem,
            status: existing?.status ?? 'STOPPED',
          })
        }
        const elapsed = existing.startEpochMs
          ? Math.floor((now - existing.startEpochMs) / 1000)
          : 0
        next = {
          ...existing,
          consumedSeconds: existing.consumedSeconds + elapsed,
          startEpochMs: null,
          status: 'PAUSED',
          updatedAt: now,
        }
        break
      }

      case 'resume': {
        if (!existing || existing.status === 'RUNNING') {
          const rem = existing ? computeRemaining(existing) : 0
          return NextResponse.json({
            ok: true,
            remainingSeconds: rem,
            status: existing?.status ?? 'STOPPED',
          })
        }
        next = {
          ...existing,
          startEpochMs: now,
          status: 'RUNNING',
          updatedAt: now,
        }
        break
      }

      case 'stop': {
        const remaining = existing ? computeRemaining(existing) : 0
        next = {
          ...(existing ?? { durationSeconds: 0, consumedSeconds: 0, startEpochMs: null }),
          consumedSeconds: existing ? existing.durationSeconds - remaining : 0,
          startEpochMs: null,
          status: 'STOPPED',
          updatedAt: now,
        }
        break
      }

      default:
        return NextResponse.json({ error: 'Unknown action' }, { status: 400 })
    }

    // Update the session-level key
    await setSessionState(sessionId, next)

    // Fan out the same action to every per-candidate timer.
    // Done after the session key is updated so examiner display is already
    // correct even if the fan-out is slow.
    const action = body.action
    void fanOutToAllCandidates(sessionId, (candidateState, fanOutNow) => {
      switch (action) {
        case 'pause': {
          if (candidateState.status !== 'RUNNING') return candidateState
          const elapsed = candidateState.startEpochMs
            ? Math.floor((fanOutNow - candidateState.startEpochMs) / 1000)
            : 0
          return {
            ...candidateState,
            consumedSeconds: candidateState.consumedSeconds + elapsed,
            startEpochMs: null,
            status: 'PAUSED' as const,
            updatedAt: fanOutNow,
          }
        }
        case 'resume': {
          if (candidateState.status !== 'PAUSED') return candidateState
          return {
            ...candidateState,
            startEpochMs: fanOutNow,
            status: 'RUNNING' as const,
            updatedAt: fanOutNow,
          }
        }
        case 'stop': {
          const rem = computeRemaining(candidateState)
          return {
            ...candidateState,
            consumedSeconds: candidateState.durationSeconds - rem,
            startEpochMs: null,
            status: 'STOPPED' as const,
            updatedAt: fanOutNow,
          }
        }
        default:
          return candidateState
      }
    }).catch((err: unknown) => {
      console.error('[timer fan-out]', err)
    })

    return NextResponse.json({
      ok: true,
      remainingSeconds: computeRemaining(next),
      status: next.status,
    })
  } catch (err) {
    console.error('[/api/timer POST]', err)
    return NextResponse.json({ error: 'Failed to update timer' }, { status: 500 })
  }
}
