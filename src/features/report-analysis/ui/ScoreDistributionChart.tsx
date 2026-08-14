import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts'
import type { SessionAnalysis } from '@/entities/exam-session'

interface ScoreDistributionChartProps {
  analysis: SessionAnalysis
}

export function ScoreDistributionChart({ analysis }: ScoreDistributionChartProps) {
  return (
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
  )
}
