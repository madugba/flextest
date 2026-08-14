'use client'

import { useEffect, useState } from 'react'
import { getSubjectsWithQuestionsBySession } from '@/entities/subject'

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
  const [subjectQuestionCounts, setSubjectQuestionCounts] = useState<Map<string, number>>(
    new Map()
  )

  useEffect(() => {
    if (!sessionId) return
    getSubjectsWithQuestionsBySession(sessionId)
      .then((subjects) => {
        setSubjectQuestionCounts(new Map(subjects.map((s) => [s.id, s.questionCount])))
      })
      .catch(() => {
        /* silent — counts will just be omitted */
      })
  }, [sessionId])

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
