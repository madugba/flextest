interface ReviewBannerProps {
  sessionName?: string
  cohortName?: string
  candidateCount: number
  subjectCount: number
  scoreItemCount: number
}

export function ReviewBanner({
  sessionName,
  cohortName,
  candidateCount,
  subjectCount,
  scoreItemCount,
}: ReviewBannerProps) {
  return (
    <div className="rounded-lg border border-gray-200 bg-gray-50 p-3 text-sm text-gray-700">
      <span className="font-medium">{sessionName}</span> · {cohortName} ·{' '}
      {candidateCount} candidate{candidateCount !== 1 ? 's' : ''} × {subjectCount} subject{subjectCount !== 1 ? 's' : ''} ={' '}
      <span className="font-semibold text-primary">{scoreItemCount}</span> score{scoreItemCount !== 1 ? 's' : ''} to push
    </div>
  )
}
