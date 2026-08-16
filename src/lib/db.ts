import 'server-only'

import { Pool } from 'pg'

// ---------------------------------------------------------------------------
// Singleton pg.Pool — shared across all API route invocations in this process.
// max: 5 is intentionally small; the examiner only writes during the 5-min
// DB sync and the rare timer-start/stop, never under high read load.
// ---------------------------------------------------------------------------

declare global {
  var __pgPool: Pool | undefined
}

function createPool(): Pool {
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    max: 5,
    idleTimeoutMillis: 30_000,
    connectionTimeoutMillis: 5_000,
  })

  pool.on('error', (err) => {
    console.error('[examiner/db] pool error:', err.message)
  })

  return pool
}

// Reuse across Next.js hot-reloads in development
export const db: Pool = globalThis.__pgPool ?? createPool()

if (process.env.NODE_ENV !== 'production') {
  globalThis.__pgPool = db
}
