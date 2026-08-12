// ---------------------------------------------------------------------------
// Key scheme (two namespaces, same TimerState shape):
//
//   flextest:exam:session:{sessionId}
//     → The session-level clock, set when examiner starts the session.
//       Used ONLY for examiner display (elapsed / remaining for the session).
//
//   flextest:exam:timer:{sessionId}:{candidateId}
//     → Per-candidate clock, anchored at the moment THAT candidate started
//       their exam. This is what feeds the DB sync and the candidate's display.
//
// The two clocks are independent. If a candidate joins 15 min late their
// timer still starts from durationSeconds; they don't lose 15 minutes.
// ---------------------------------------------------------------------------

export const SESSION_KEY = (sid: string) => `flextest:exam:session:${sid}`
export const CANDIDATE_KEY = (sid: string, cid: string) => `flextest:exam:timer:${sid}:${cid}`
export const CANDIDATE_SCAN_PATTERN = (sid: string) => `flextest:exam:timer:${sid}:*`
export const ALL_CANDIDATES_SCAN_PATTERN = 'flextest:exam:timer:*'

export interface CandidateTimerEntry {
  sessionId: string
  candidateId: string
}

export function parseCandidateKey(key: string): CandidateTimerEntry | null {
  // key = flextest:exam:timer:{sessionId}:{candidateId}
  const prefix = 'flextest:exam:timer:'
  if (!key.startsWith(prefix)) return null
  const rest = key.slice(prefix.length) // '{sessionId}:{candidateId}'
  const colonIdx = rest.indexOf(':')
  if (colonIdx === -1) return null // old session-level key — ignore
  return {
    sessionId: rest.slice(0, colonIdx),
    candidateId: rest.slice(colonIdx + 1),
  }
}
