import type { SessionAnalysis } from '@/entities/exam-session'

interface AnalysisSummaryCardsProps {
  analysis: SessionAnalysis
}

export function AnalysisSummaryCards({ analysis }: AnalysisSummaryCardsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="text-sm font-medium text-blue-600">Total Candidates</div>
        <div className="text-2xl font-bold text-blue-900">{analysis.totalCandidates}</div>
      </div>
      <div className="bg-green-50 border border-green-200 rounded-lg p-4">
        <div className="text-sm font-medium text-green-600">Submitted</div>
        <div className="text-2xl font-bold text-green-900">{analysis.submittedCount}</div>
      </div>
      <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4">
        <div className="text-sm font-medium text-emerald-600">Passed</div>
        <div className="text-2xl font-bold text-emerald-900">{analysis.passingTrend.pass}</div>
      </div>
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <div className="text-sm font-medium text-red-600">Failed</div>
        <div className="text-2xl font-bold text-red-900">{analysis.passingTrend.fail}</div>
      </div>
    </div>
  )
}
