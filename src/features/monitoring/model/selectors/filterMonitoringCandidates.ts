import type { DisplayCandidate } from './formatCandidateForDisplay'

export function filterMonitoringCandidates(
  candidates: DisplayCandidate[],
  filterStatus: string,
  searchQuery: string
): DisplayCandidate[] {
  return candidates.filter((candidate) => {
    if (filterStatus !== 'all' && candidate.status !== filterStatus) {
      return false
    }

    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      const nameMatch = candidate.name.toLowerCase().includes(query)
      const regMatch = candidate.registrationNumber.toLowerCase().includes(query)
      if (!nameMatch && !regMatch) {
        return false
      }
    }

    return true
  })
}
