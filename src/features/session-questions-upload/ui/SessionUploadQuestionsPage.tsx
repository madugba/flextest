'use client'

import { DashboardHeader } from '@/widgets/dashboard/ui/DashboardHeader'
import { useSessionUploadQuestionsPage } from '../model/useSessionUploadQuestionsPage'
import { UploadLoadingState } from './UploadLoadingState'
import { UploadQuestionsHeader } from './UploadQuestionsHeader'
import { OverallProgressCard } from './OverallProgressCard'
import { SubjectsProgressTable } from './SubjectsProgressTable'

export function SessionUploadQuestionsPage() {
  const {
    session,
    questionStats,
    isLoading,
    handleGoBack,
    handleRefresh,
    handleUpload,
    totalUploaded,
    totalRequired,
    overallProgress,
    exceedsLimit,
  } = useSessionUploadQuestionsPage()

  if (isLoading) {
    return <UploadLoadingState />
  }

  return (
    <div className="flex-1 overflow-auto">
      <DashboardHeader />

      <div className="p-6 space-y-6">
        <UploadQuestionsHeader
          sessionName={session?.name}
          sessionDate={session?.date}
          onGoBack={handleGoBack}
          onRefresh={handleRefresh}
          isRefreshing={isLoading}
        />

        <OverallProgressCard
          totalUploaded={totalUploaded}
          totalRequired={totalRequired}
          overallProgress={overallProgress}
          exceedsLimit={exceedsLimit}
          sessionTotalQuestion={session?.totalQuestion}
        />

        <SubjectsProgressTable stats={questionStats} onUpload={handleUpload} />
      </div>
    </div>
  )
}
