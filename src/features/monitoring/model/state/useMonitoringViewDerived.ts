'use client'

import { useMemo } from 'react'
import type { MonitoringCandidate } from '@/entities/monitoring'
import { formatCandidateForDisplay } from '../selectors/formatCandidateForDisplay'
import { filterMonitoringCandidates } from '../selectors/filterMonitoringCandidates'

interface UseMonitoringViewDerivedArgs {
  candidates: MonitoringCandidate[]
  selectedSession: { status?: string } | null
  stats: { active: number }
  filterStatus: string
  searchQuery: string
  selectedCandidates: Set<string>
}

export function useMonitoringViewDerived({
  candidates,
  selectedSession,
  stats,
  filterStatus,
  searchQuery,
  selectedCandidates,
}: UseMonitoringViewDerivedArgs) {
  const displayCandidates = useMemo(
    () => candidates.map(formatCandidateForDisplay),
    [candidates]
  )

  const filteredCandidates = useMemo(
    () => filterMonitoringCandidates(displayCandidates, filterStatus, searchQuery),
    [displayCandidates, filterStatus, searchQuery]
  )

  const canStart = selectedSession?.status === 'SCHEDULED'
  const canPause = selectedSession?.status === 'ACTIVE'
  const canResume = selectedSession?.status === 'SCHEDULED' && stats.active > 0
  const canEnd = selectedSession?.status === 'ACTIVE'

  const isAllSelected =
    filteredCandidates.length > 0 &&
    filteredCandidates.every((c) => selectedCandidates.has(c.id))

  const isIndeterminate = selectedCandidates.size > 0 && !isAllSelected

  return {
    displayCandidates,
    filteredCandidates,
    canStart,
    canPause,
    canResume,
    canEnd,
    isAllSelected,
    isIndeterminate,
  }
}
