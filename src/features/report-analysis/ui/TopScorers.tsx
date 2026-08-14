import type { SessionAnalysis } from '@/entities/exam-session'

interface TopScorersProps {
  analysis: SessionAnalysis
}

export function TopScorers({ analysis }: TopScorersProps) {
  return (
    <div className="bg-white border rounded-lg p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Scorers</h3>
      <div className="space-y-3">
        {analysis.topScorers.length > 0 ? (
          analysis.topScorers.map((scorer, index) => (
            <div key={scorer.candidateId} className="flex items-center justify-between border-b pb-2">
              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-100 text-blue-700 font-bold text-sm">
                  {index + 1}
                </div>
                <div>
                  <div className="font-medium text-gray-900">{scorer.candidateName}</div>
                  <div className="text-xs text-gray-500">{scorer.candidateId}</div>
                </div>
              </div>
              <div className="text-lg font-bold text-blue-600">{scorer.score}</div>
            </div>
          ))
        ) : (
          <p className="text-sm text-gray-500 text-center py-4">No results available</p>
        )}
      </div>
    </div>
  )
}
