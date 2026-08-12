import { NextRequest, NextResponse } from 'next/server'
import { getTimerState, setTimerState } from '@/lib/timer-store'
import { computeRemaining, type TimerState } from '@/lib/timer-state'
import { db } from '@/lib/db'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

// Catch-all so candidate IDs that contain slashes (e.g. "BPA/26/01197") are
// captured as multiple segments and reconstructed into a single string.
type RouteParams = { sessionId: string; candidateSegments: string[] }

function resolveParams(params: RouteParams) {
  return {
    sessionId: params.sessionId,
    candidateId: params.candidateSegments.join('/'),
  }
}

// ---------------------------------------------------------------------------
// GET /api/timer/[sessionId]/[...candidateSegments]
// Returns this candidate's authoritative remaining seconds.
// Source priority: Redis anchor (exact) → DB (≤30 s stale after periodic sync)
// ---------------------------------------------------------------------------
export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<RouteParams> }
) {
  const { sessionId, candidateId } = resolveParams(await params)

  try {
    const state = await getTimerState(sessionId, candidateId)

    if (state) {
      return NextResponse.json({
        remainingSeconds: computeRemaining(state),
        status: state.status,
        source: 'redis',
      })
    }

    // Redis miss — fall back to this candidate's DB record
    const result = await db.query<{ time_left: number | null; duration: number }>(
      `SELECT p.time_left, e.duration
       FROM current_session_progress p
       JOIN exam_sessions e ON e.id = p.session_id
       WHERE p.session_id = $1 AND p.candidate_id = $2
       LIMIT 1`,
      [sessionId, candidateId]
    )

    if (result.rows.length === 0) {
      return NextResponse.json({ error: 'Progress not found' }, { status: 404 })
    }

    const row = result.rows[0]!
    const durationSeconds = (row.duration ?? 60) * 60

    if (row.time_left === null) {
      return NextResponse.json({ error: 'No saved timer state' }, { status: 404 })
    }

    return NextResponse.json({
      remainingSeconds: Math.min(row.time_left, durationSeconds),
      status: 'RUNNING',
      source: 'db',
    })
  } catch (err) {
    console.error('[examiner/api/timer candidate GET]', err)
    return NextResponse.json({ error: 'Failed to fetch timer' }, { status: 500 })
  }
}

// ---------------------------------------------------------------------------
// POST /api/timer/[sessionId]/[...candidateSegments]
// Body: { action: 'start', durationSeconds: number }
// IDEMPOTENT — no-op if Redis key already exists, returns current remaining.
// On Redis miss checks DB for saved time_left so re-logins get correct time.
// ---------------------------------------------------------------------------
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<RouteParams> }
) {
  const { sessionId, candidateId } = resolveParams(await params)

  let body: { action: string; durationSeconds?: number }
  try {
    body = await req.json() as { action: string; durationSeconds?: number }
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 })
  }

  if (body.action !== 'start') {
    return NextResponse.json({ error: 'Only action=start is supported' }, { status: 400 })
  }

  try {
    const existing = await getTimerState(sessionId, candidateId)
    if (existing) {
      // PAUSED → RUNNING: candidate was individually logged out (timer was
      // paused by the examiner) and is now re-logging in. Resume from the
      // frozen remaining time so they don't lose exam time spent offline.
      if (existing.status === 'PAUSED') {
        const now = Date.now()
        const resumed: TimerState = {
          ...existing,
          startEpochMs: now,
          status: 'RUNNING',
          updatedAt: now,
        }
        await setTimerState(sessionId, candidateId, resumed)
        return NextResponse.json({
          ok: true,
          remainingSeconds: computeRemaining(resumed),
          status: resumed.status,
          created: false,
        })
      }
      return NextResponse.json({
        ok: true,
        remainingSeconds: computeRemaining(existing),
        status: existing.status,
        created: false,
      })
    }

    if (!body.durationSeconds || body.durationSeconds <= 0) {
      return NextResponse.json(
        { error: 'durationSeconds required for first start' },
        { status: 400 }
      )
    }

    const fullDuration = body.durationSeconds
    let consumedSeconds = 0

    // Check if the candidate has prior exam progress saved in DB.
    // Happens when a candidate is force-logged out and re-logs in on a different
    // browser where localStorage has no timer checkpoint.
    try {
      const dbResult = await db.query<{ time_left: number | null }>(
        `SELECT time_left FROM current_session_progress
         WHERE session_id = $1 AND candidate_id = $2 LIMIT 1`,
        [sessionId, candidateId]
      )
      const savedTimeLeft = dbResult.rows[0]?.time_left ?? null
      if (savedTimeLeft !== null && savedTimeLeft > 0 && savedTimeLeft < fullDuration) {
        consumedSeconds = fullDuration - savedTimeLeft
      }
    } catch {
      // Non-fatal — start from scratch
    }

    const now = Date.now()
    const state: TimerState = {
      startEpochMs: now,
      durationSeconds: fullDuration,
      consumedSeconds,
      status: 'RUNNING',
      updatedAt: now,
    }

    await setTimerState(sessionId, candidateId, state)

    return NextResponse.json({
      ok: true,
      remainingSeconds: computeRemaining(state),
      status: state.status,
      created: true,
    })
  } catch (err) {
    console.error('[examiner/api/timer candidate POST]', err)
    return NextResponse.json({ error: 'Failed to start timer' }, { status: 500 })
  }
}

// ---------------------------------------------------------------------------
// PATCH /api/timer/[sessionId]/[...candidateSegments]
// Body: { timeLeft?: number, action?: 'pause' }
//
// Without action: persist remaining seconds to DB (called every 30 s from
//   ExamView via the candidate proxy).
//
// action: 'pause': freeze the Redis timer so time stops being consumed while
//   the candidate is offline (force-logout). Also writes timeLeft to DB if
//   provided. The POST start handler transitions PAUSED → RUNNING on re-login.
// ---------------------------------------------------------------------------
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<RouteParams> }
) {
  const { sessionId, candidateId } = resolveParams(await params)

  let body: { timeLeft?: number; action?: string }
  try {
    body = await req.json() as { timeLeft?: number; action?: string }
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 })
  }

  // ── Pause action: freeze Redis timer ────────────────────────────────────
  if (body.action === 'pause') {
    try {
      const existing = await getTimerState(sessionId, candidateId)
      if (existing && existing.status === 'RUNNING') {
        const remaining = computeRemaining(existing)
        const now = Date.now()
        const paused: TimerState = {
          ...existing,
          consumedSeconds: existing.durationSeconds - remaining,
          startEpochMs: null,
          status: 'PAUSED',
          updatedAt: now,
        }
        await setTimerState(sessionId, candidateId, paused)
      }
      // Also persist to DB if timeLeft was provided
      if (typeof body.timeLeft === 'number' && body.timeLeft >= 0) {
        await db.query(
          `UPDATE current_session_progress
              SET time_left = $1
            WHERE session_id   = $2
              AND candidate_id = $3`,
          [Math.round(body.timeLeft), sessionId, candidateId]
        ).catch((err: Error) => {
          console.error('[examiner/api/timer candidate PATCH pause db]', err.message)
        })
      }
    } catch (err) {
      console.error('[examiner/api/timer candidate PATCH pause]', err)
      return NextResponse.json({ error: 'Failed to pause timer' }, { status: 500 })
    }
    return NextResponse.json({ ok: true })
  }

  // ── Default: DB-only sync ───────────────────────────────────────────────
  if (typeof body.timeLeft !== 'number' || body.timeLeft < 0) {
    return NextResponse.json({ error: 'timeLeft (non-negative number) is required' }, { status: 400 })
  }

  try {
    await db.query(
      `UPDATE current_session_progress
          SET time_left = $1
        WHERE session_id   = $2
          AND candidate_id = $3`,
      [Math.round(body.timeLeft), sessionId, candidateId]
    )
  } catch (err) {
    console.error('[examiner/api/timer candidate PATCH]', err)
    return NextResponse.json({ error: 'Failed to sync timer to DB' }, { status: 500 })
  }

  return NextResponse.json({ ok: true })
}
