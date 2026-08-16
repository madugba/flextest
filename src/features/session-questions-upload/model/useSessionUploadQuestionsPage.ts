'use client'

import { useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { createHandleUpload } from './handlers/createHandleUpload'
import { useSubjectQuestionStatsQuery } from './useSubjectQuestionStatsQuery'
import { getTotalUploaded } from './selectors/getTotalUploaded'
import { getTotalRequired } from './selectors/getTotalRequired'
import { getOverallProgress } from './selectors/getOverallProgress'

export function useSessionUploadQuestionsPage() {
  const router = useRouter()
  const params = useParams()
  const sessionId = params.sessionId as string

  const { session, questionStats, isLoading, refetch } = useSubjectQuestionStatsQuery(sessionId)

  useEffect(() => {
    if (!sessionId) return

    const justUploaded = sessionStorage.getItem('questions-uploaded') === sessionId
    if (justUploaded) {
      sessionStorage.removeItem('questions-uploaded')
      router.refresh()
    }
  }, [sessionId, router])

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible' && sessionId) {
        void refetch()
      }
    }

    document.addEventListener('visibilitychange', handleVisibilityChange)
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange)
  }, [sessionId, refetch])

  const handleUpload = createHandleUpload(router, sessionId)

  const totalUploaded = getTotalUploaded(questionStats)
  const totalRequired = getTotalRequired(session, questionStats)
  const overallProgress = getOverallProgress(totalUploaded, totalRequired)
  const exceedsLimit = session !== null && totalUploaded > session.totalQuestion

  return {
    session,
    questionStats,
    isLoading,
    handleGoBack: () => router.back(),
    handleRefresh: () => void refetch(),
    handleUpload,
    totalUploaded,
    totalRequired,
    overallProgress,
    exceedsLimit,
  }
}
