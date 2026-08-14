import type { Dispatch, SetStateAction } from 'react'
import type { DisplayCandidate } from '../selectors/formatCandidateForDisplay'

interface CreateSelectionActionsArgs {
  selectedCandidates: Set<string>
  filteredCandidates: DisplayCandidate[]
  setSelectedCandidates: Dispatch<SetStateAction<Set<string>>>
}

export function createSelectionActions({
  selectedCandidates,
  filteredCandidates,
  setSelectedCandidates,
}: CreateSelectionActionsArgs) {
  const handleSelectAll = () => {
    if (selectedCandidates.size === filteredCandidates.length && filteredCandidates.length > 0) {
      setSelectedCandidates(new Set())
    } else {
      const allIds = new Set(filteredCandidates.map((c) => c.id))
      setSelectedCandidates(allIds)
    }
  }

  const handleSelectCandidate = (candidateId: string) => {
    setSelectedCandidates((prev) => {
      const newSelected = new Set(prev)
      if (newSelected.has(candidateId)) {
        newSelected.delete(candidateId)
      } else {
        newSelected.add(candidateId)
      }
      return newSelected
    })
  }

  return {
    handleSelectAll,
    handleSelectCandidate,
  }
}
