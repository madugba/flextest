'use client'

import { ArrowLeft, RefreshCw } from 'lucide-react'
import { Button } from '@/shared/ui/Button'

interface UploadQuestionsHeaderProps {
  sessionName?: string
  sessionDate?: string
  onGoBack: () => void
  onRefresh: () => void
  isRefreshing: boolean
}

export function UploadQuestionsHeader({
  sessionName,
  sessionDate,
  onGoBack,
  onRefresh,
  isRefreshing,
}: UploadQuestionsHeaderProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Button onClick={onGoBack} variant="outline" size="sm" className="shrink-0">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Go Back
        </Button>
        <Button onClick={onRefresh} variant="outline" size="sm" disabled={isRefreshing}>
          <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Upload Questions</h1>
        <p className="text-gray-500 mt-1">
          {sessionName && sessionDate
            ? `${sessionName} • ${new Date(sessionDate).toLocaleDateString()}`
            : ''}
        </p>
      </div>
    </div>
  )
}
