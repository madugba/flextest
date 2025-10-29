import React from 'react'
import { Card } from '@/shared/ui/Card'

interface MetricCardProps {
  title: string
  value: string | number
  subtitle?: string
  icon?: React.ReactNode
  trend?: {
    value: number
    label: string
    direction: 'up' | 'down' | 'neutral'
  }
  status?: 'healthy' | 'warning' | 'critical' | 'neutral'
  className?: string
}

export const MetricCard = React.memo(function MetricCard({
  title,
  value,
  subtitle,
  icon,
  trend,
  status = 'neutral',
  className = '',
}: MetricCardProps) {
  const statusColors = {
    healthy: 'border-green-200 bg-green-50',
    warning: 'border-yellow-200 bg-yellow-50',
    critical: 'border-red-200 bg-red-50',
    neutral: 'border-gray-200 bg-white',
  }

  const valueColors = {
    healthy: 'text-green-700',
    warning: 'text-yellow-700',
    critical: 'text-red-700',
    neutral: 'text-gray-900',
  }

  const trendColors = {
    up: 'text-green-600',
    down: 'text-red-600',
    neutral: 'text-gray-600',
  }

  return (
    <Card className={`p-6 border-2 transition-all duration-200 hover:shadow-md ${statusColors[status]} ${className}`}>
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-gray-600 uppercase tracking-wide truncate">
            {title}
          </p>
          <div className="mt-2 flex items-baseline gap-2 flex-wrap">
            <p className={`text-3xl font-bold ${valueColors[status]} break-words`}>
              {value}
            </p>
            {subtitle && (
              <span className="ml-2 text-sm text-gray-500 truncate">{subtitle}</span>
            )}
          </div>
          {trend && (
            <div className="mt-2 flex items-center text-sm flex-wrap gap-1">
              <span className={`font-medium ${trendColors[trend.direction]}`}>
                {trend.direction === 'up' && '↑'}
                {trend.direction === 'down' && '↓'}
                {trend.value}%
              </span>
              <span className="text-gray-600 truncate">{trend.label}</span>
            </div>
          )}
        </div>
        {icon && (
          <div className={`p-3 rounded-lg flex-shrink-0 ${statusColors[status]}`}>
            {icon}
          </div>
        )}
      </div>
    </Card>
  )
})
