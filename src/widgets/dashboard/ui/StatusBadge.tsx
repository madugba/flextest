import React from 'react'
import { Badge } from '@/shared/ui/Badge'

interface StatusBadgeProps {
  status: 'healthy' | 'degraded' | 'down' | 'unknown'
  showDot?: boolean
  className?: string
}

export const StatusBadge = React.memo(function StatusBadge({ status, showDot = true, className = '' }: StatusBadgeProps) {
  const statusConfig = {
    healthy: {
      label: 'Healthy',
      variant: 'secondary' as const,
      dotColor: 'bg-green-500',
    },
    degraded: {
      label: 'Degraded',
      variant: 'outline' as const,
      dotColor: 'bg-yellow-500',
    },
    down: {
      label: 'Down',
      variant: 'destructive' as const,
      dotColor: 'bg-red-500',
    },
    unknown: {
      label: 'Unknown',
      variant: 'secondary' as const,
      dotColor: 'bg-gray-500',
    },
  }

  const config = statusConfig[status]

  return (
    <div className={`inline-flex items-center ${className}`}>
      {showDot && (
        <span className="relative flex h-3 w-3 mr-2">
          <span className={`animate-ping absolute inline-flex h-full w-full rounded-full ${config.dotColor} opacity-75`}></span>
          <span className={`relative inline-flex rounded-full h-3 w-3 ${config.dotColor}`}></span>
        </span>
      )}
      <Badge variant={config.variant}>
        {config.label}
      </Badge>
    </div>
  )
})
