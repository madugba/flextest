import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import type { PoolClient } from 'pg'

export const runtime = 'nodejs'

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ sessionId: string }> }
) {
  const { sessionId } = await params
  if (!sessionId) {
    return NextResponse.json({ error: 'sessionId is required' }, { status: 400 })
  }

  let client: PoolClient | undefined
  try {
    client = await db.connect()

    // scheduled  → subject_combinations (permanent enrollment record per session)
    // submitted  → candidate_answers    (permanent per-session answer record;
    //              candidate_results is not populated by the backend)
    // active     → candidates.status    (live field, only meaningful during exam)
    const { rows } = await client.query<{
      scheduled: string
      submitted: string
      active: string
    }>(
      `SELECT
         (SELECT COUNT(DISTINCT candidate_id)
            FROM subject_combinations
           WHERE session_id = $1)                        AS scheduled,
         (SELECT COUNT(DISTINCT candidate_id)
            FROM candidate_answers
           WHERE session_id = $1)                        AS submitted,
         (SELECT COUNT(*)
            FROM candidates
           WHERE session_id = $1 AND status = 'ACTIVE')  AS active`,
      [sessionId]
    )

    const row       = rows[0]
    const scheduled = parseInt(row.scheduled, 10)
    const submitted = parseInt(row.submitted, 10)
    const active    = parseInt(row.active,    10)

    return NextResponse.json({
      scheduled,
      submitted,
      active,
      absent: scheduled - submitted,
    })
  } catch (err) {
    console.error('[session-stats] error:', err)
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Database error' },
      { status: 500 }
    )
  } finally {
    try { client?.release() } catch { /* ignore */ }
  }
}
