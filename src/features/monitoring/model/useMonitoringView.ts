'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { getSubjectsWithQuestionsBySession } from '@/entities/subject'
import { useMetricsSocket } from '@/shared/hooks/useMetricsSocket'
import { useMonitoringData } from './useMonitoringData'
import { useLogoutCandidate } from './useLogoutCandidate'
import { useBulkLogoutCandidates } from './useBulkLogoutCandidates'
import { useTimer } from './useTimer'
import { formatCandidateForDisplay } from './selectors/formatCandidateForDisplay'

export function useMonitoringView() {
  const searchParams = useSearchParams()
  const sessionId = searchParams.get('session')

  const [searchQuery, setSearchQuery] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')
  const [isAutoRefresh, setIsAutoRefresh] = useState(true)
  const [selectedCandidates, setSelectedCandidates] = useState<Set<string>>(new Set())

  const [showStartConfirm, setShowStartConfirm] = useState(false)
  const [showPauseConfirm, setShowPauseConfirm] = useState(false)
  const [showResumeConfirm, setShowResumeConfirm] = useState(false)
  const [showEndConfirm, setShowEndConfirm] = useState(false)
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false)
  const [selectedCandidateForLogout, setSelectedCandidateForLogout] = useState<{
    id: string
    name: string
  } | null>(null)
  const [showBulkLogoutConfirm, setShowBulkLogoutConfirm] = useState(false)
  const [viewingCandidateId, setViewingCandidateId] = useState<string | null>(null)
  const [subjectQuestionCounts, setSubjectQuestionCounts] = useState<Map<string, number>>(new Map())

  useEffect(() => {
    if (!sessionId) return
    getSubjectsWithQuestionsBySession(sessionId)
      .then(subjects => {
        setSubjectQuestionCounts(new Map(subjects.map(s => [s.id, s.questionCount])))
      })
      .catch(() => { /* silent — counts will just be omitted */ })
  }, [sessionId])

  const {
    selectedSession,
    stats,
    candidates,
    isLoading,
    error,
    controlSession,
    isControlling,
    controlError,
  } = useMonitoringData(sessionId || undefined, isAutoRefresh)

  const { elapsedHms } = useTimer({
    sessionId,
    sessionStatus: selectedSession?.status,
    enableLocalTick: true,
  })

  const { connectedClients, isSubscribed } = useMetricsSocket()

  const { mutate: logoutMutate, isPending: logoutPending } = useLogoutCandidate(sessionId || undefined)
  const { mutate: bulkLogoutMutate, isPending: bulkLogoutPending } = useBulkLogoutCandidates(sessionId || undefined)

  const displayCandidates = useMemo(
    () => candidates.map(formatCandidateForDisplay),
    [candidates]
  )

  const filteredCandidates = useMemo(() => {
    return displayCandidates.filter((candidate) => {
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
  }, [displayCandidates, filterStatus, searchQuery])

  const canStart = selectedSession?.status === 'SCHEDULED'
  const canPause = selectedSession?.status === 'ACTIVE'
  const canResume = selectedSession?.status === 'SCHEDULED' && stats.active > 0
  const canEnd = selectedSession?.status === 'ACTIVE'

  const isAllSelected = filteredCandidates.length > 0 &&
    filteredCandidates.every(c => selectedCandidates.has(c.id))

  const isIndeterminate = selectedCandidates.size > 0 && !isAllSelected

  const handleStartExam = useCallback(() => {
    if (!selectedSession) return
    setShowStartConfirm(true)
  }, [selectedSession])

  const handlePauseExam = useCallback(() => {
    if (!selectedSession) return
    setShowPauseConfirm(true)
  }, [selectedSession])

  const handleResumeExam = useCallback(() => {
    if (!selectedSession) return
    setShowResumeConfirm(true)
  }, [selectedSession])

  const handleEndExam = useCallback(() => {
    if (!selectedSession) return
    setShowEndConfirm(true)
  }, [selectedSession])

  const confirmStartExam = useCallback(() => {
    controlSession({ action: 'start' })
    setShowStartConfirm(false)
  }, [controlSession])

  const confirmPauseExam = useCallback(() => {
    controlSession({ action: 'pause' })
    setShowPauseConfirm(false)
  }, [controlSession])

  const confirmResumeExam = useCallback(() => {
    controlSession({ action: 'resume' })
    setShowResumeConfirm(false)
  }, [controlSession])

  const confirmEndExam = useCallback(() => {
    controlSession({ action: 'end' })
    setShowEndConfirm(false)
  }, [controlSession])

  const handleLogoutCandidate = useCallback((candidateId: string, candidateName: string) => {
    setSelectedCandidateForLogout({ id: candidateId, name: candidateName })
    setShowLogoutConfirm(true)
  }, [])

  const confirmLogoutCandidate = useCallback(() => {
    if (!selectedCandidateForLogout) return

    logoutMutate(
      {
        candidateId: selectedCandidateForLogout.id,
        reason: 'Forced logout by administrator',
      },
      {
        onSuccess: () => {
          setShowLogoutConfirm(false)
          setSelectedCandidateForLogout(null)
        },
      }
    )
  }, [selectedCandidateForLogout, logoutMutate])

  const confirmBulkLogout = useCallback(() => {
    const candidateIds = Array.from(selectedCandidates)

    bulkLogoutMutate(
      {
        candidateIds,
        reason: 'Bulk logout by administrator',
      },
      {
        onSuccess: () => {
          setShowBulkLogoutConfirm(false)
          setSelectedCandidates(new Set())
        },
      }
    )
  }, [selectedCandidates, bulkLogoutMutate])

  const handleSelectAll = useCallback(() => {
    if (selectedCandidates.size === filteredCandidates.length && filteredCandidates.length > 0) {
      setSelectedCandidates(new Set())
    } else {
      const allIds = new Set(filteredCandidates.map(c => c.id))
      setSelectedCandidates(allIds)
    }
  }, [selectedCandidates, filteredCandidates])

  const handleSelectCandidate = useCallback((candidateId: string) => {
    setSelectedCandidates(prev => {
      const newSelected = new Set(prev)
      if (newSelected.has(candidateId)) {
        newSelected.delete(candidateId)
      } else {
        newSelected.add(candidateId)
      }
      return newSelected
    })
  }, [])

  return {
    sessionId,
    selectedSession,
    stats,
    candidates,
    displayCandidates,
    filteredCandidates,
    isLoading,
    error,
    controlError,
    isControlling,
    elapsedHms,
    connectedClients,
    isSubscribed,
    subjectQuestionCounts,
    searchQuery,
    setSearchQuery,
    filterStatus,
    setFilterStatus,
    isAutoRefresh,
    setIsAutoRefresh,
    selectedCandidates,
    isAllSelected,
    isIndeterminate,
    handleSelectAll,
    handleSelectCandidate,
    viewingCandidateId,
    setViewingCandidateId,
    showStartConfirm,
    setShowStartConfirm,
    showPauseConfirm,
    setShowPauseConfirm,
    showResumeConfirm,
    setShowResumeConfirm,
    showEndConfirm,
    setShowEndConfirm,
    showLogoutConfirm,
    setShowLogoutConfirm,
    selectedCandidateForLogout,
    showBulkLogoutConfirm,
    setShowBulkLogoutConfirm,
    handleStartExam,
    handlePauseExam,
    handleResumeExam,
    handleEndExam,
    confirmStartExam,
    confirmPauseExam,
    confirmResumeExam,
    confirmEndExam,
    handleLogoutCandidate,
    confirmLogoutCandidate,
    confirmBulkLogout,
    canStart,
    canPause,
    canResume,
    canEnd,
    logoutPending,
    bulkLogoutPending,
  }
}
