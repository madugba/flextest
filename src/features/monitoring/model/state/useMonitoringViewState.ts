'use client'

import { useMemo, useState } from 'react'
import { useSubjectsWithQuestionsQuery } from '@/entities/subject'

interface UseMonitoringViewStateArgs {
  sessionId: string | null
}

export function useMonitoringViewState({ sessionId }: UseMonitoringViewStateArgs) {
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

  const subjectsQuery = useSubjectsWithQuestionsQuery(sessionId ?? undefined)

  const subjectQuestionCounts = useMemo(
    () =>
      new Map((subjectsQuery.data ?? []).map((s) => [s.id, s.questionCount])),
    [subjectsQuery.data]
  )

  return {
    searchQuery,
    setSearchQuery,
    filterStatus,
    setFilterStatus,
    isAutoRefresh,
    setIsAutoRefresh,
    selectedCandidates,
    setSelectedCandidates,
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
    setSelectedCandidateForLogout,
    showBulkLogoutConfirm,
    setShowBulkLogoutConfirm,
    viewingCandidateId,
    setViewingCandidateId,
    subjectQuestionCounts,
  }
}
