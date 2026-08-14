'use client'

import { Upload } from 'lucide-react'
import { Badge } from '@/shared/ui/Badge'
import { Button } from '@/shared/ui/Button'
import { getProgressPercentage } from '../model/selectors/getProgressPercentage'
import type { SubjectQuestionStats } from '../model/types'
import { SubjectStatusBadge } from './SubjectStatusBadge'

interface SubjectsProgressRowProps {
  stat: SubjectQuestionStats
  onUpload: (subjectId: string) => void
}

export function SubjectsProgressRow({ stat, onUpload }: SubjectsProgressRowProps) {
  const remaining = Math.max(0, stat.required - stat.uploaded)
  const progress = getProgressPercentage(stat.uploaded, stat.required)

  return (
    <tr className="hover:bg-gray-50 transition-colors">
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex items-center gap-2">
          <span className="font-medium text-gray-900">{stat.subject.name}</span>
          {stat.isCompulsory && (
            <Badge variant="outline" className="text-xs">
              Compulsory
            </Badge>
          )}
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <span className="text-sm font-semibold text-blue-600">{stat.uploaded}</span>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <span className="text-sm text-gray-900">{stat.required}</span>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <span
          className={`text-sm font-semibold ${
            remaining === 0 ? 'text-green-600' : 'text-orange-600'
          }`}
        >
          {remaining}
        </span>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <SubjectStatusBadge uploaded={stat.uploaded} required={stat.required} />
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <Button
          onClick={() => onUpload(stat.subject.id)}
          size="sm"
          variant={progress === 100 ? 'outline' : 'default'}
        >
          <Upload className="h-4 w-4 mr-2" />
          {progress === 100 ? 'Manage' : 'Upload'}
        </Button>
      </td>
    </tr>
  )
}
