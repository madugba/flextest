import 'server-only'

// Next.js instrumentation — runs once per worker process at startup.
//
// IMPORTANT: this file is compiled for BOTH Node.js and Edge runtimes.
// Keep it free of any top-level Node.js-only APIs (process.pid, require, etc.).
// All Node.js-specific logic lives in ./lib/timer-sync, which is only imported
// when process.env.NEXT_RUNTIME === 'nodejs' — the exact equality form that
// lets Turbopack/webpack dead-code-eliminate the import from the Edge bundle.

export async function register(): Promise<void> {
  if (process.env.NEXT_RUNTIME === 'nodejs') {
    const { startTimerSync } = await import('./lib/timer-sync')
    startTimerSync()
  }
}
