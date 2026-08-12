'use client'

import { useEffect } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/shared/ui/dialog'
import { Button } from '@/shared/ui/Button'
import { Alert } from '@/shared/ui/Alert'
import { Skeleton } from '@/shared/ui/skeleton'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts'
import { useReportAnalysis } from '../model/useReportAnalysis'

interface AnalysisDialogProps {
  open: boolean
  onClose: () => void
  sessionId: string | null
}

const COLORS = ['#10b981', '#ef4444'] // green for pass, red for fail

export function AnalysisDialog({ open, onClose, sessionId }: AnalysisDialogProps) {
  const { analysis, loading, error, refetch } = useReportAnalysis(sessionId)

  useEffect(() => {
    if (open && sessionId) {
      refetch()
    }
  }, [open, sessionId, refetch])

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Session Analysis</DialogTitle>
          <DialogDescription>
            {analysis ? analysis.sessionName : 'Loading session analysis...'}
          </DialogDescription>
        </DialogHeader>

        {loading && (
          <div className="space-y-4">
            <Skeleton className="h-64 w-full" />
            <Skeleton className="h-48 w-full" />
            <Skeleton className="h-32 w-full" />
          </div>
        )}

        {error && (
          <div className="space-y-4">
            <Alert variant="destructive">{error}</Alert>
            <Button onClick={refetch} variant="outline">
              Retry
            </Button>
          </div>
        )}

        {!loading && !error && analysis && (
          <div className="space-y-6">
            {/* Summary Cards */}
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

            {/* Score Distribution Chart */}
            <div className="bg-white border rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Score Distribution</h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={analysis.scoreDistribution}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="range" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="count" fill="#3b82f6" name="Candidates" />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Pass/Fail Chart */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white border rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Pass/Fail Distribution</h3>
                <ResponsiveContainer width="100%" height={250}>
                  <PieChart>
                    <Pie
                      data={[
                        { name: 'Pass', value: analysis.passingTrend.pass },
                        { name: 'Fail', value: analysis.passingTrend.fail },
                      ]}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {[0, 1].map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
                <div className="mt-4 text-center">
                  <p className="text-sm text-gray-600">
                    Pass Rate: <span className="font-bold text-green-600">{analysis.passingTrend.passPercentage.toFixed(1)}%</span>
                  </p>
                </div>
              </div>

              {/* Top Scorers */}
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
            </div>

            {/* Subject Performance */}
            {analysis.subjectWisePerformance.length > 0 && (
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
            )}
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}

