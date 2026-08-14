import { memo, type ReactNode } from 'react'
import { Card } from '@/shared/ui/Card'

interface StatCardProps {
  title: string
  value: string | number
  icon: ReactNode
  borderColor?: string
  iconBgColor?: string
  iconColor?: string
}

export const StatCard = memo<StatCardProps>(({ title, value, icon, borderColor, iconBgColor, iconColor }) => {
  return (
    <Card className={`p-4 hover:shadow-md transition-shadow ${borderColor || ''}`}>
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <p className="text-xs font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
        </div>
        <div className={`w-10 h-10 ${iconBgColor || 'bg-gray-100'} rounded-lg flex items-center justify-center`}>
          <div className={iconColor || 'text-gray-600'}>
            {icon}
          </div>
        </div>
      </div>
    </Card>
  )
})

StatCard.displayName = 'StatCard'
