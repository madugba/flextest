import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts'
import type { SessionAnalysis } from '@/entities/exam-session'

const COLORS = ['#10b981', '#ef4444'] // green for pass, red for fail

interface PassFailChartProps {
  analysis: SessionAnalysis
}

export function PassFailChart({ analysis }: PassFailChartProps) {
  return (
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
  )
}
