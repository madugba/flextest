'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { DashboardHeader } from '@/widgets/dashboard/ui/DashboardHeader'
import { Button } from '@/shared/ui/Button'
import { Badge } from '@/shared/ui/Badge'
import { getExamSessionById, type ExamSession } from '@/entities/exam-session'
import { getSubjectsForSession, type Subject } from '@/entities/subject'
import { getQuestionCount } from '@/entities/question'
import { Upload, CheckCircle2, AlertCircle, TrendingUp, RefreshCw, ArrowLeft } from 'lucide-react'

interface SubjectQuestionStats {
  subject: Subject
  uploaded: number
  required: number
  isCompulsory: boolean
}

export default function SessionUploadQuestionsPage() {
  const router = useRouter()
  const params = useParams()
  const sessionId = params.sessionId as string

  const [session, setSession] = useState<ExamSession | null>(null)
  const [questionStats, setQuestionStats] = useState<SubjectQuestionStats[]>([])
  const [isLoading, setIsLoading] = useState(true)

  const loadSessionAndStats = useCallback(async (bypassCache: boolean = false) => {
    try {
      setIsLoading(true)

      console.log('[loadSessionAndStats] Loading...', { sessionId, bypassCache })

      if (bypassCache) {
        await new Promise(resolve => setTimeout(resolve, 500))
      }

      const sessionData = await getExamSessionById(sessionId)
      setSession(sessionData)

      const sessionSubjects = await getSubjectsForSession(sessionId)

      const statsPromises = sessionSubjects.map(async (subject) => {
        try {
          const { count } = await getQuestionCount(subject.id, sessionId, bypassCache)
          const isCompulsory = subject.id === sessionData.compulsorySubjectId
          const required = isCompulsory
            ? sessionData.totalCompulsoryQuestion
            : sessionData.totalOtherQuestions

          return {
            subject,
            uploaded: count,
            required,
            isCompulsory,
          }
        } catch (err) {
          console.error(`Failed to get count for subject ${subject.id}:`, err)
          return {
            subject,
            uploaded: 0,
            required: 0,
            isCompulsory: false,
          }
        }
      })

      const stats = await Promise.all(statsPromises)
      console.log('[loadSessionAndStats] Stats loaded:', stats)
      setQuestionStats(stats)
    } catch (err) {
      console.error('[loadSessionAndStats] Error:', err)
    } finally {
      setIsLoading(false)
    }
  }, [sessionId])

  useEffect(() => {
    if (sessionId) {
      loadSessionAndStats()
    }
  }, [sessionId, loadSessionAndStats])

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible' && sessionId) {
        console.log('[Session Upload] Page visible, refreshing stats...')
        loadSessionAndStats(true)
      }
    }

    document.addEventListener('visibilitychange', handleVisibilityChange)
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange)
  }, [sessionId, loadSessionAndStats])

  const handleUpload = (subjectId: string) => {
    router.push(`/questions/upload/${sessionId}/${subjectId}`)
  }

  const getProgressPercentage = (uploaded: number, required: number) => {
    if (required === 0) return 0
    return Math.min((uploaded / required) * 100, 100)
  }

  const getStatusBadge = (uploaded: number, required: number) => {
    const percentage = getProgressPercentage(uploaded, required)
    if (percentage === 100) {
      return (
        <Badge className="bg-green-100 text-green-700 hover:bg-green-100">
          <CheckCircle2 className="h-3 w-3 mr-1" />
          Complete
        </Badge>
      )
    }
    if (percentage > 0) {
      return (
        <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100">
          <TrendingUp className="h-3 w-3 mr-1" />
          {percentage.toFixed(0)}%
        </Badge>
      )
    }
    return (
      <Badge variant="outline" className="text-gray-500">
        <AlertCircle className="h-3 w-3 mr-1" />
        Not Started
      </Badge>
    )
  }

  const totalUploaded = questionStats.reduce((sum, stat) => sum + stat.uploaded, 0)

  const compulsoryCount = questionStats.filter(stat => stat.isCompulsory).length
  const otherSubjectsCount = questionStats.length - compulsoryCount
  const totalRequired = session
    ? session.totalCompulsoryQuestion + (session.totalOtherQuestions * otherSubjectsCount)
    : questionStats.reduce((sum, stat) => sum + stat.required, 0)

  const overallProgress = totalRequired > 0 ? (totalUploaded / totalRequired) * 100 : 0
  const exceedsLimit = session && totalUploaded > session.totalQuestion

  if (isLoading) {
    return (
      <div className="flex-1 overflow-auto">
        <DashboardHeader />
        <div className="p-6">
          <div className="flex items-center justify-center h-96">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-gray-500">Loading...</p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex-1 overflow-auto">
      <DashboardHeader />

      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Button
              onClick={() => router.back()}
              variant="outline"
              size="sm"
              className="shrink-0"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Go Back
            </Button>
            <Button
              onClick={() => loadSessionAndStats(true)}
              variant="outline"
              size="sm"
              disabled={isLoading}
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Upload Questions</h1>
            <p className="text-gray-500 mt-1">
              {session?.name} • {session && new Date(session.date).toLocaleDateString()}
            </p>
          </div>
        </div>

        {/* Overall Progress Card */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-lg font-semibold text-gray-900">Overall Progress</h2>
              <p className="text-sm text-gray-500 mt-1">
                {totalUploaded} of {totalRequired} questions uploaded
                {exceedsLimit && (
                  <span className="text-red-600 font-medium ml-2">
                    • Exceeds session limit ({session?.totalQuestion})
                  </span>
                )}
              </p>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold text-gray-900">{overallProgress.toFixed(0)}%</div>
              <div className="text-sm text-gray-500">Complete</div>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="relative w-full bg-gray-100 rounded-full h-3 overflow-hidden">
            <div
              className={`h-3 transition-all duration-500 ${
                overallProgress === 100
                  ? 'bg-green-500'
                  : exceedsLimit
                  ? 'bg-red-500'
                  : 'bg-blue-500'
              }`}
              style={{ width: `${Math.min(overallProgress, 100)}%` }}
            />
          </div>
        </div>

        {/* Subjects Table */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Subject
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Uploaded
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Required
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Remaining
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {questionStats.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                      No subjects found for this session
                    </td>
                  </tr>
                ) : (
                  questionStats.map((stat) => {
                    const remaining = Math.max(0, stat.required - stat.uploaded)
                    const progress = getProgressPercentage(stat.uploaded, stat.required)

                    return (
                      <tr key={stat.subject.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center gap-2">
                            <span className="font-medium text-gray-900">{stat.subject.name}</span>
                            {stat.isCompulsory && (
                              <Badge variant="outline" className="text-xs">
                                Compulsory
                              </Badge>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="text-sm font-semibold text-blue-600">{stat.uploaded}</span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="text-sm text-gray-900">{stat.required}</span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`text-sm font-semibold ${
                              remaining === 0 ? 'text-green-600' : 'text-orange-600'
                            }`}
                          >
                            {remaining}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {getStatusBadge(stat.uploaded, stat.required)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <Button
                            onClick={() => handleUpload(stat.subject.id)}
                            size="sm"
                            variant={progress === 100 ? 'outline' : 'default'}
                          >
                            <Upload className="h-4 w-4 mr-2" />
                            {progress === 100 ? 'Manage' : 'Upload'}
                          </Button>
                        </td>
                      </tr>
                    )
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}
