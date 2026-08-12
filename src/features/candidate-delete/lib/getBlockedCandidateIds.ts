import { getAllSessionsOverview, getSessionDetails } from '@/entities/monitoring'

/**
 * Cross-checks a set of candidate IDs against ALL sessions (not just their current one).
 * Returns the subset of IDs that have ACTIVE or SUBMITTED status in any historical session.
 *
 * A candidate re-assigned to a new session will still appear blocked here if they
 * completed/submitted a previous session — the current `candidate.status` field alone
 * won't catch that case.
 */
export async function getBlockedCandidateIds(candidateIds: string[]): Promise<Set<string>> {
  if (!candidateIds.length) return new Set()

  const targetSet = new Set(candidateIds)

  // Single overview call to find sessions that have any submitted/active candidates
  const overview = await getAllSessionsOverview()
  const relevantSessions = overview.sessions.filter(
    (s) => s.stats.submitted > 0 || s.stats.active > 0
  )

  if (!relevantSessions.length) return new Set()

  // Fetch candidate lists for all relevant sessions in parallel
  const detailResults = await Promise.allSettled(
    relevantSessions.map((s) => getSessionDetails(s.id))
  )

  const blocked = new Set<string>()

  for (const result of detailResults) {
    if (result.status !== 'fulfilled') continue
    for (const candidate of result.value.candidates) {
      if (
        targetSet.has(candidate.id) &&
        (candidate.status === 'SUBMITTED' || candidate.status === 'ACTIVE')
      ) {
        blocked.add(candidate.id)
      }
    }
  }

  return blocked
}
