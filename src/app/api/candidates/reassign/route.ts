import { NextRequest, NextResponse } from 'next/server'
import { randomUUID } from 'crypto'
import { db } from '@/lib/db'
import type { PoolClient } from 'pg'

export const runtime = 'nodejs'

export async function POST(request: NextRequest) {
  let body: unknown
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 })
  }

  const { candidateIds, sessionId } = body as { candidateIds?: unknown; sessionId?: unknown }

  if (
    !Array.isArray(candidateIds) ||
    candidateIds.length === 0 ||
    typeof sessionId !== 'string' ||
    !sessionId
  ) {
    return NextResponse.json(
      { error: 'candidateIds (non-empty array) and sessionId (string) are required' },
      { status: 400 }
    )
  }

  const ids = candidateIds as string[]

  // Everything — including db.connect() — is inside one try/catch so any failure
  // returns a JSON error body (not Next.js's default HTML error page).
  let client: PoolClient | undefined
  try {
    client = await db.connect()
    await client.query('BEGIN')

    // 1. Update session, reset status to PENDING (same as newly created candidate)
    await client.query(
      `UPDATE candidates
         SET session_id = $1,
             status     = 'PENDING',
             is_active  = true,
             updated_at = NOW()
       WHERE id = ANY($2::text[])`,
      [sessionId, ids]
    )

    // 2. Copy each candidate's existing subjects into the new session.
    //    Uses randomUUID() (Node built-in) to avoid a dependency on
    //    gen_random_uuid() / uuid-ossp which may not be enabled.
    for (const candidateId of ids) {
      const { rows } = await client.query<{ subject_id: string }>(
        `SELECT DISTINCT subject_id
           FROM subject_combinations
          WHERE candidate_id = $1`,
        [candidateId]
      )

      for (const { subject_id } of rows) {
        await client.query(
          `INSERT INTO subject_combinations
                 (id, subject_id, candidate_id, session_id, created_at, updated_at)
           VALUES ($1, $2, $3, $4, NOW(), NOW())
           ON CONFLICT (candidate_id, subject_id, session_id) DO NOTHING`,
          [randomUUID(), subject_id, candidateId, sessionId]
        )
      }
    }

    await client.query('COMMIT')
    return NextResponse.json({ success: true, updated: ids.length })
  } catch (err) {
    if (client) {
      try { await client.query('ROLLBACK') } catch { /* ignore */ }
    }
    console.error('[reassign] error:', err)
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Database error during reassignment' },
      { status: 500 }
    )
  } finally {
    try { client?.release() } catch { /* ignore */ }
  }
}
