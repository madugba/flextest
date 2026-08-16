'use client'

import { useCallback, useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import type { ExamSession } from '@/entities/exam-session'
import { createLoadSessionAndStats } from './handlers/createLoadSessionAndStats'
import { createHandleUpload } from './handlers/createHandleUpload'
import { getTotalUploaded } from './selectors/getTotalUploaded'
import { getTotalRequired } from './selectors/getTotalRequired'
import { getOverallProgress } from './selectors/getOverallProgress'
import type { SubjectQuestionStats } from './types'

export function useSessionUploadQuestionsPage() {
  const router = useRouter()
  const params = useParams()
  const sessionId = params.sessionId as string

  const [session, setSession] = useState<ExamSession | null>(null)
  const [questionStats, setQuestionStats] = useState<SubjectQuestionStats[]>([])
  const [isLoading, setIsLoading] = useState(true)

  const loadSessionAndStats = useCallback(
    (bypassCache: boolean = false) =>
      createLoadSessionAndStats({ sessionId, setIsLoading, setSession, setQuestionStats })(
        bypassCache
      ),
    [sessionId, setIsLoading, setSession, setQuestionStats]
  )

  useEffect(() => {
    if (!sessionId) return

    const justUploaded = sessionStorage.getItem('questions-uploaded') === sessionId
    if (justUploaded) {
      sessionStorage.removeItem('questions-uploaded')
      router.refresh()
    }

    void loadSessionAndStats(justUploaded)
  }, [sessionId, router, loadSessionAndStats])

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible' && sessionId) {
        void loadSessionAndStats(true)
      }
    }

    document.addEventListener('visibilitychange', handleVisibilityChange)
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange)
  }, [sessionId, loadSessionAndStats])

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
    handleRefresh: () => loadSessionAndStats(true),
    handleUpload,
    totalUploaded,
    totalRequired,
    overallProgress,
    exceedsLimit,
  }
}
