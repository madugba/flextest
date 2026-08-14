import { Card } from '@/shared/ui/Card'
import { Clock } from 'lucide-react'

interface ElapsedTimeCardProps {
  elapsedHms: string
}

export function ElapsedTimeCard({ elapsedHms }: ElapsedTimeCardProps) {
  return (
    <Card className="p-4 hover:shadow-md transition-shadow border-2 border-blue-100">
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <p className="text-xs font-medium text-gray-600">Elapsed Time</p>
          <p className="text-2xl font-bold text-gray-900">{elapsedHms}</p>
        </div>
        <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-between">
          <Clock className="h-5 w-5 text-blue-600" />
        </div>
      </div>
    </Card>
  )
}
