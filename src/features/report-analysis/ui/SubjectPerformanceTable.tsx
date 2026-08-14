import type { SessionAnalysis } from '@/entities/exam-session'

interface SubjectPerformanceTableProps {
  analysis: SessionAnalysis
}

export function SubjectPerformanceTable({ analysis }: SubjectPerformanceTableProps) {
  return (
    <div className="bg-white border rounded-lg p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Subject-wise Performance</h3>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="px-4 py-3 text-left font-medium text-gray-700">Subject</th>
              <th className="px-4 py-3 text-right font-medium text-gray-700">Avg Score (%)</th>
              <th className="px-4 py-3 text-right font-medium text-gray-700">Avg Correct</th>
              <th className="px-4 py-3 text-right font-medium text-gray-700">Total Attempted</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {analysis.subjectWisePerformance.map((subject) => (
              <tr key={subject.subjectId} className="hover:bg-gray-50">
                <td className="px-4 py-3 text-gray-900">{subject.subjectName}</td>
                <td className="px-4 py-3 text-right">
                  <span className={`font-medium ${subject.avgScore >= 50 ? 'text-green-600' : 'text-red-600'}`}>
                    {subject.avgScore.toFixed(1)}%
                  </span>
                </td>
                <td className="px-4 py-3 text-right text-gray-700">
                  {subject.avgCorrectAnswers.toFixed(1)}
                </td>
                <td className="px-4 py-3 text-right text-gray-700">
                  {subject.totalAttempted}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
