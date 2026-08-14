'use client'

import { AlertCircle, CheckCircle2, TrendingUp } from 'lucide-react'
import { Badge } from '@/shared/ui/Badge'
import { getProgressPercentage } from '../model/selectors/getProgressPercentage'

interface SubjectStatusBadgeProps {
  uploaded: number
  required: number
}

export function SubjectStatusBadge({ uploaded, required }: SubjectStatusBadgeProps) {
  const percentage = getProgressPercentage(uploaded, required)

  if (percentage === 100) {
    return (
      <Badge className="bg-green-100 text-green-700 hover:bg-green-100">
        <CheckCircle2 className="h-3 w-3 mr-1" />
        Complete
      </Badge>
    )
  }

  if (percentage > 0) {
    return (
      <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100">
        <TrendingUp className="h-3 w-3 mr-1" />
        {percentage.toFixed(0)}%
      </Badge>
    )
  }

  return (
    <Badge variant="outline" className="text-gray-500">
      <AlertCircle className="h-3 w-3 mr-1" />
      Not Started
    </Badge>
  )
}
