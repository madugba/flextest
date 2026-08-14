import type { ReactNode } from 'react'
import { Card } from '@/shared/ui/Card'

interface PlaceholderStatCardProps {
  label: string
  value: string
  valueClassName: string
  borderColor: string
  iconBgColor: string
  iconColor: string
  icon: ReactNode
}

export function PlaceholderStatCard({
  label,
  value,
  valueClassName,
  borderColor,
  iconBgColor,
  iconColor,
  icon,
}: PlaceholderStatCardProps) {
  return (
    <Card className={`p-4 hover:shadow-md transition-shadow border-2 ${borderColor}`}>
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <p className="text-xs font-medium text-gray-600">{label}</p>
          <p className={`text-2xl font-bold ${valueClassName}`}>{value}</p>
        </div>
        <div className={`w-10 h-10 ${iconBgColor} rounded-lg flex items-center justify-center`}>
          <span className={iconColor}>{icon}</span>
        </div>
      </div>
    </Card>
  )
}
